import jwt
from django.http import JsonResponse
from django.conf import settings
from .token_blacklist import is_token_blacklisted


class JWTAuthenticationMiddleware:
    """
    Middleware to validate JWT tokens and check if they're blacklisted.
    This ensures that logged-out users cannot access protected resources.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        
        # Paths that don't require authentication
        self.exempt_paths = [
            '/api/users/login/',
            '/api/users/register/',
            '/api/users/sso/login/',
            '/api/users/sso/callback/',
            '/api/users/password-reset/',
            '/api/users/password-reset-confirm/',
            '/admin/',  # Django admin
            '/static/',
            '/media/',
        ]
    
    def __call__(self, request):
        # Skip authentication check for exempt paths
        if self._is_exempt_path(request.path):
            return self.get_response(request)
        
        # Get authorization header
        auth_header = request.headers.get('Authorization', '')
        
        # If no auth header, pass through (other middleware/views will handle)
        if not auth_header:
            return self.get_response(request)
        
        # Check if it's a Bearer token
        if not auth_header.startswith('Bearer '):
            return self.get_response(request)
        
        # Extract token
        token = auth_header.split(' ')[1]
        
        try:
            # First check if token is blacklisted
            if is_token_blacklisted(token):
                return JsonResponse({
                    'success': False,
                    'message': 'Token has been invalidated. Please login again.'
                }, status=401)
            
            # Decode and validate token
            decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            
            # Attach user info to request for use in views
            request.jwt_user = decoded
            
        except jwt.ExpiredSignatureError:
            return JsonResponse({
                'success': False,
                'message': 'Token has expired. Please login again.'
            }, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid token. Please login again.'
            }, status=401)
        except Exception as e:
            # Log the error but don't expose details
            print(f"JWT Auth Middleware Error: {e}")
        
        # Continue with the request
        return self.get_response(request)
    
    def _is_exempt_path(self, path):
        """Check if the path is exempt from authentication."""
        for exempt_path in self.exempt_paths:
            if path.startswith(exempt_path):
                return True
        return False
