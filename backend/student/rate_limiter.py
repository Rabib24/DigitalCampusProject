"""
Rate limiter for student enrollment requests.
This module provides decorators and utilities for rate limiting enrollment requests.
"""

import time
from functools import wraps
from django.http import JsonResponse
from django.core.cache import cache
from django.conf import settings

class RateLimiter:
    """
    A simple rate limiter that uses Django's cache framework.
    """
    
    @staticmethod
    def is_rate_limited(client_ip, key_prefix, limit, window):
        """
        Check if a client has exceeded the rate limit.
        
        Args:
            client_ip: Client IP address
            key_prefix: Prefix for cache key
            limit: Maximum requests allowed
            window: Time window in seconds
            
        Returns:
            bool: True if rate limited, False otherwise
        """
        cache_key = f"{key_prefix}:{client_ip}"
        
        try:
            # Get current count and timestamp from cache
            cached_data = cache.get(cache_key)
            
            if cached_data is None:
                # First request in window
                cache.set(cache_key, {'count': 1, 'timestamp': time.time()}, window)
                return False
            
            # Check if window has expired
            if time.time() - cached_data['timestamp'] > window:
                # Window expired, reset counter
                cache.set(cache_key, {'count': 1, 'timestamp': time.time()}, window)
                return False
            
            # Increment counter
            cached_data['count'] += 1
            cache.set(cache_key, cached_data, window)
            
            # Check if limit exceeded
            return cached_data['count'] > limit
        except Exception as e:
            # If cache is not available, allow the request (no rate limiting)
            print(f"Cache error in rate limiter: {e}")
            return False
    
    @staticmethod
    def get_client_ip(request):
        """
        Get the client IP address from the request.
        """
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


def enrollment_rate_limit(limit=10, window=60, key_prefix='enrollment'):
    """
    Decorator to rate limit enrollment requests.
    
    Args:
        limit: Maximum requests allowed per window
        window: Time window in seconds
        key_prefix: Prefix for cache key
        
    Returns:
        function: Decorated function
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # Get client IP
            client_ip = RateLimiter.get_client_ip(request)
            
            try:
                # Check rate limit
                if RateLimiter.is_rate_limited(client_ip, key_prefix, limit, window):
                    return JsonResponse({
                        'success': False,
                        'message': 'Rate limit exceeded. Please try again later.'
                    }, status=429)
            except Exception as e:
                # If rate limiter fails, allow the request
                print(f"Rate limiter error: {e}")
            
            # Proceed with the view function
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator


# Predefined rate limiters for different enrollment operations
def course_enrollment_rate_limit(view_func):
    """
    Rate limiter for course enrollment operations (10 requests per minute).
    """
    return enrollment_rate_limit(limit=10, window=60, key_prefix='course_enrollment')(view_func)


def course_search_rate_limit(view_func):
    """
    Rate limiter for course search operations (30 requests per minute).
    """
    return enrollment_rate_limit(limit=30, window=60, key_prefix='course_search')(view_func)


def cart_operation_rate_limit(view_func):
    """
    Rate limiter for cart operations (20 requests per minute).
    """
    return enrollment_rate_limit(limit=20, window=60, key_prefix='cart_operations')(view_func)