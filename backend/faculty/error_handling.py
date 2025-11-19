import json
import logging
import traceback
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from django.utils import timezone

# Configure logger
logger = logging.getLogger('faculty_api')

class FacultyAPIErrorMiddleware(MiddlewareMixin):
    """Middleware to handle API errors and provide standardized responses"""
    
    def process_exception(self, request, exception):
        """Handle exceptions and return standardized error responses"""
        # Only apply to faculty API routes
        if request.path.startswith('/api/v1/faculty/'):
            # Log the error with context
            logger.error(
                f"Faculty API Error: {str(exception)}",
                extra={
                    'request_path': request.path,
                    'request_method': request.method,
                    'user_id': getattr(request, 'user', None) and getattr(request.user, 'id', None),
                    'timestamp': timezone.now().isoformat(),
                    'traceback': traceback.format_exc()
                }
            )
            
            # Return standardized error response
            return JsonResponse({
                'success': False,
                'error': {
                    'type': 'internal_error',
                    'message': 'An unexpected error occurred. Please try again later.',
                    'timestamp': timezone.now().isoformat()
                }
            }, status=500)
        
        # For non-faculty routes, let Django handle the exception normally
        return None

def standardized_api_response(data=None, success=True, message=None, error=None, status=200):
    """Create a standardized API response"""
    response_data = {
        'success': success
    }
    
    if data is not None:
        response_data['data'] = data
    
    if message:
        response_data['message'] = message
    
    if error:
        response_data['error'] = error
    
    return JsonResponse(response_data, status=status)

def api_error(message, error_type='general_error', status=400, details=None):
    """Create a standardized error response"""
    error_data = {
        'type': error_type,
        'message': message,
        'timestamp': timezone.now().isoformat()
    }
    
    if details:
        error_data['details'] = details
    
    logger.error(
        f"API Error: {message}",
        extra={
            'error_type': error_type,
            'status': status,
            'details': details
        }
    )
    
    return standardized_api_response(
        success=False,
        error=error_data,
        status=status
    )

def validation_error(field_errors):
    """Create a validation error response"""
    error_data = {
        'type': 'validation_error',
        'message': 'Validation failed',
        'timestamp': timezone.now().isoformat(),
        'field_errors': field_errors
    }
    
    logger.warning(
        "Validation Error",
        extra={
            'field_errors': field_errors
        }
    )
    
    return standardized_api_response(
        success=False,
        error=error_data,
        status=400
    )

def not_found_error(message="Resource not found"):
    """Create a not found error response"""
    error_data = {
        'type': 'not_found',
        'message': message,
        'timestamp': timezone.now().isoformat()
    }
    
    logger.warning(
        f"Not Found Error: {message}"
    )
    
    return standardized_api_response(
        success=False,
        error=error_data,
        status=404
    )

def unauthorized_error(message="Unauthorized access"):
    """Create an unauthorized error response"""
    error_data = {
        'type': 'unauthorized',
        'message': message,
        'timestamp': timezone.now().isoformat()
    }
    
    logger.warning(
        f"Unauthorized Error: {message}"
    )
    
    return standardized_api_response(
        success=False,
        error=error_data,
        status=401
    )

def forbidden_error(message="Access forbidden"):
    """Create a forbidden error response"""
    error_data = {
        'type': 'forbidden',
        'message': message,
        'timestamp': timezone.now().isoformat()
    }
    
    logger.warning(
        f"Forbidden Error: {message}"
    )
    
    return standardized_api_response(
        success=False,
        error=error_data,
        status=403
    )