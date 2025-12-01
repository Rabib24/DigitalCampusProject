import json
import jwt
from django.conf import settings
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from django.utils import timezone
from datetime import datetime, timedelta
from users.models import User, Faculty

class FacultyRoleMiddleware(MiddlewareMixin):
    # Add the async_mode attribute required by Django 5.2
    async_mode = False
    
    def __init__(self, get_response):
        self.get_response = get_response
        # No Redis connection needed
            
    def process_request(self, request):
        print(f"Middleware processing request: {request.path}")
        # Only apply to faculty routes
        if request.path.startswith('/api/v1/faculty/'):
            print("Request is for faculty route")
            # Skip authentication for login endpoint
            if request.path == '/api/v1/faculty/auth/login/' or request.path == '/api/v1/faculty/auth/register/':
                print("Skipping authentication for login/register")
                return None
                
            # Check for authentication header
            auth_header = request.META.get('HTTP_AUTHORIZATION')
            print(f"Auth header: {auth_header}")
            if not auth_header or not auth_header.startswith('Bearer '):
                print("No valid auth header found")
                return JsonResponse({
                    'success': False,
                    'message': 'Authentication required'
                }, status=401)
            
            # Extract token
            token = auth_header.split(' ')[1]
            print(f"Token: {token}")
            
            try:
                # Print the SECRET_KEY for debugging
                print(f"SECRET_KEY in middleware: {settings.SECRET_KEY[:20]}...")
                print("Attempting to decode JWT token")
                # Decode JWT token
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                print(f"Decoded payload: {payload}")
                
                # Check expiration
                exp = payload.get('exp')
                print(f"Token exp: {exp}")
                if exp:
                    # Convert timestamp to timezone-aware datetime
                    from django.utils import timezone
                    import pytz
                    exp_datetime = datetime.fromtimestamp(exp, tz=pytz.UTC)
                    now = timezone.now()
                    print(f"Token exp_datetime: {exp_datetime}, now: {now}")
                    if exp_datetime < now:
                        print("Token is expired")
                        return JsonResponse({
                            'success': False,
                            'message': 'Token has expired. Please log in again.'
                        }, status=401)
                
                # Check if user exists and has faculty role
                user_id = payload.get('user_id')
                print(f"User ID from token: {user_id}")
                try:
                    user = User.objects.get(id=user_id)  # type: ignore
                    print(f"User found: {user.username}, role: {user.role}")
                    if user.role != 'faculty':
                        print("User is not faculty")
                        return JsonResponse({
                            'success': False,
                            'message': 'Access denied. Faculty role required.'
                        }, status=403)
                    
                    # Check if faculty profile exists
                    try:
                        faculty_profile = Faculty.objects.get(user=user)  # type: ignore
                        print(f"Faculty profile found: {faculty_profile.employee_id}")
                        
                        # Attach user and faculty info to request
                        request.user = user
                        request.faculty = faculty_profile
                        print("Attached user and faculty to request")
                        
                    except Faculty.DoesNotExist:  # type: ignore
                        print("Faculty profile not found")
                        return JsonResponse({
                            'success': False,
                            'message': 'Faculty profile not found.'
                        }, status=403)
                        
                except User.DoesNotExist:  # type: ignore
                    print("User not found")
                    return JsonResponse({
                        'success': False,
                        'message': 'User not found.'
                    }, status=401)
                    
            except jwt.ExpiredSignatureError:
                print("Token expired signature error")
                return JsonResponse({
                    'success': False,
                    'message': 'Token has expired. Please log in again.'
                }, status=401)
            except jwt.InvalidTokenError as e:
                print(f"Token invalid token error: {e}")
                # Check if this is actually an expiration error (extra safety)
                if 'expired' in str(e).lower():
                    return JsonResponse({
                        'success': False,
                        'message': 'Token has expired. Please log in again.'
                    }, status=401)
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid token. Please log in again.'
                }, status=401)
            except Exception as e:
                print(f"Token general exception: {e}")
                import traceback
                traceback.print_exc()
                return JsonResponse({
                    'success': False,
                    'message': 'Authentication error.'
                }, status=500)
        
        # If we get here, either it's not a faculty route or the user has access
        return None

def generate_refresh_token(user):
    """Generate a refresh token for automatic token refresh"""
    # Use timezone.now() for timezone-aware datetime
    now = timezone.now()
    payload = {
        'user_id': user.id,
        'username': user.username,
        'role': user.role,
        'type': 'refresh',
        'exp': now + timedelta(days=7),  # Refresh token expires in 7 days
        'iat': now
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return token

def validate_refresh_token(token):
    """Validate a refresh token and return user if valid"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        if payload.get('type') != 'refresh':
            return None
        
        user_id = payload.get('user_id')
        user = User.objects.get(id=user_id)  # type: ignore
        return user
    except:
        return None