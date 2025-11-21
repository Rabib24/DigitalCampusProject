import json
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin

class JWTAuthenticationMiddleware(MiddlewareMixin):
    def process_request(self, request):
        # List of paths that don't require authentication
        exempt_paths = [
            '/api/v1/auth/login/',
            '/api/v1/auth/register/',
            '/api/v1/auth/logout/',
            '/api/v1/faculty/auth/login/',
            '/api/v1/faculty/auth/register/',
            '/api/v1/faculty/auth/logout/',
            '/admin/',
        ]
        
        # Check if the path is exempt from authentication
        if any(request.path == path or request.path.startswith(path) for path in exempt_paths):
            return None
            
        # For all other paths, check for authentication token
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return JsonResponse({
                'success': False,
                'message': 'Authentication required'
            }, status=401)
            
        # In a real app, you would validate the JWT token here
        # For now, we'll just check if it starts with "Bearer "
        if not auth_header.startswith('Bearer '):
            return JsonResponse({
                'success': False,
                'message': 'Invalid authentication token'
            }, status=401)
            
        # If we get here, the request is authenticated
        # In a real app, you would decode the JWT and attach user info to the request
        return None