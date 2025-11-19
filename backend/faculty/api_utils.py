import time
import logging
from functools import wraps
from django.core.cache import cache
from django.utils import timezone
from .error_handling import api_error

logger = logging.getLogger('faculty_api')

def retry_api_call(max_retries=3, delay=1, backoff=2, exceptions=(Exception,)):
    """Decorator to retry API calls with exponential backoff"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            retries = 0
            current_delay = delay
            
            while retries < max_retries:
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    retries += 1
                    if retries >= max_retries:
                        logger.error(
                            f"API call failed after {max_retries} retries: {str(e)}",
                            extra={
                                'function': func.__name__,
                                'args': args,
                                'kwargs': kwargs
                            }
                        )
                        raise e
                    
                    logger.warning(
                        f"API call failed, retrying in {current_delay} seconds: {str(e)}",
                        extra={
                            'function': func.__name__,
                            'retry': retries,
                            'max_retries': max_retries
                        }
                    )
                    
                    time.sleep(current_delay)
                    current_delay *= backoff
            
            # This should never be reached due to the raise above
            return None
        return wrapper
    return decorator

def circuit_breaker(failure_threshold=5, recovery_timeout=60):
    """Decorator to implement circuit breaker pattern"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Create circuit breaker key based on function name
            cb_key = f"circuit_breaker_{func.__name__}"
            
            # Check circuit breaker state
            try:
                cb_state = cache.get(cb_key, {
                    'status': 'closed',  # closed, open, half_open
                    'failure_count': 0,
                    'last_failure_time': None
                })
            except:
                # If cache is not available, proceed normally
                return func(*args, **kwargs)
            
            # If circuit is open, check if recovery timeout has passed
            if cb_state['status'] == 'open':
                if cb_state['last_failure_time']:
                    time_since_failure = (timezone.now() - cb_state['last_failure_time']).total_seconds()
                    if time_since_failure >= recovery_timeout:
                        # Switch to half-open state
                        cb_state['status'] = 'half_open'
                        try:
                            cache.set(cb_key, cb_state, timeout=3600)
                        except:
                            pass
                    else:
                        # Circuit still open, reject request
                        logger.warning(
                            f"Circuit breaker open for {func.__name__}, rejecting request",
                            extra={
                                'failure_count': cb_state['failure_count'],
                                'time_since_failure': time_since_failure
                            }
                        )
                        return api_error(
                            "Service temporarily unavailable due to repeated failures",
                            "service_unavailable",
                            503
                        )
            
            # Attempt the function call
            try:
                result = func(*args, **kwargs)
                
                # If successful and circuit was half-open, close it
                if cb_state['status'] == 'half_open':
                    cb_state['status'] = 'closed'
                    cb_state['failure_count'] = 0
                    cb_state['last_failure_time'] = None
                    try:
                        cache.set(cb_key, cb_state, timeout=3600)
                    except:
                        pass
                    logger.info(f"Circuit breaker closed for {func.__name__}")
                
                return result
                
            except Exception as e:
                # Record failure
                cb_state['failure_count'] += 1
                cb_state['last_failure_time'] = timezone.now()
                
                # If failure threshold reached, open circuit
                if cb_state['failure_count'] >= failure_threshold:
                    cb_state['status'] = 'open'
                    logger.error(
                        f"Circuit breaker opened for {func.__name__} after {failure_threshold} failures",
                        extra={
                            'failure_count': cb_state['failure_count'],
                            'last_failure': str(e)
                        }
                    )
                
                try:
                    cache.set(cb_key, cb_state, timeout=3600)
                except:
                    pass
                
                raise e
                
        return wrapper
    return decorator

def rate_limit_api_call(calls_per_minute=60):
    """Decorator to implement rate limiting for API calls"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Create rate limit key based on function name and user (if available)
            request = kwargs.get('request') or (args[0] if args else None)
            user_id = None
            
            if request and hasattr(request, 'user') and hasattr(request.user, 'id'):
                user_id = request.user.id
            
            rate_limit_key = f"rate_limit_{func.__name__}_{user_id or 'anonymous'}"
            
            try:
                # Get current call count
                call_data = cache.get(rate_limit_key, {
                    'count': 0,
                    'window_start': timezone.now()
                })
                
                # Check if we're still in the same minute window
                time_since_window_start = (timezone.now() - call_data['window_start']).total_seconds()
                
                if time_since_window_start >= 60:
                    # Reset window
                    call_data = {
                        'count': 0,
                        'window_start': timezone.now()
                    }
                
                # Check if limit exceeded
                if call_data['count'] >= calls_per_minute:
                    logger.warning(
                        f"Rate limit exceeded for {func.__name__}",
                        extra={
                            'user_id': user_id,
                            'call_count': call_data['count'],
                            'calls_per_minute': calls_per_minute
                        }
                    )
                    return api_error(
                        "Rate limit exceeded. Please try again later.",
                        "rate_limit_exceeded",
                        429
                    )
                
                # Increment call count
                call_data['count'] += 1
                cache.set(rate_limit_key, call_data, timeout=120)  # 2 minutes
                
            except Exception as e:
                # If cache is not available, proceed without rate limiting
                logger.warning(f"Cache not available for rate limiting: {str(e)}")
            
            # Execute function
            return func(*args, **kwargs)
            
        return wrapper
    return decorator

# Example of how to use these decorators
@retry_api_call(max_retries=3, delay=1, backoff=2)
@circuit_breaker(failure_threshold=5, recovery_timeout=60)
@rate_limit_api_call(calls_per_minute=100)
def example_api_call(request):
    """Example API call with all decorators applied"""
    # This is just an example - actual implementation would depend on the specific API
    pass