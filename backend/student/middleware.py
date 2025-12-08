import json
import jwt
import jwt
try:
    import redis
except ImportError:
    redis = None
from django.conf import settings
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from django.utils import timezone
from datetime import datetime, timedelta
from users.models import User, Student

class StudentRoleMiddleware(MiddlewareMixin):
    # Add the async_mode attribute required by Django 5.2
    async_mode = False
    
    def __init__(self, get_response):
        self.get_response = get_response
        # Initialize Redis connection
        try:
            import os
            # Use environment variables or default configuration
            redis_config = {
                'HOST': os.getenv('REDIS_NODE_1_HOST', 'localhost'),
                'PORT': int(os.getenv('REDIS_NODE_1_PORT', 6379)),
                'DB': 0,
                'SOCKET_CONNECT_TIMEOUT': 2,
                'SOCKET_TIMEOUT': 2,
                'RETRY_ON_TIMEOUT': False,
            }
            
            # Set a shorter timeout for Redis connection
            # Set a shorter timeout for Redis connection
            if redis:
                self.redis_client = redis.Redis(
                    host=redis_config['HOST'],
                    port=redis_config['PORT'],
                    db=redis_config['DB'],
                    socket_connect_timeout=redis_config['SOCKET_CONNECT_TIMEOUT'],
                    socket_timeout=redis_config['SOCKET_TIMEOUT'],
                    retry_on_timeout=redis_config['RETRY_ON_TIMEOUT'],
                )
                
                # Test the connection with a short timeout
                self.redis_client.ping()
            else:
                self.redis_client = None
        except Exception as e:
            # If Redis is not available, set client to None
            self.redis_client = None
            # Show a more informative message
            if getattr(settings, 'DEBUG', False):
                print(f"Info: Redis not available in student middleware ({type(e).__name__}). Session management features will be limited.")
            else:
                print("Info: Redis not available. Session management features will be limited.")

    def process_request(self, request):
        # Only apply to student routes
        if request.path.startswith('/api/v1/student/'):
            # Allow admin users to access admin endpoints
            if '/admin/' in request.path:
                return None
                
            # Skip authentication for login endpoint (if we had one)
            # For now, we'll assume authentication is handled by the auth system
            if request.path == '/api/v1/auth/login/':
                return None
                
            # Check for authentication header
            auth_header = request.META.get('HTTP_AUTHORIZATION')
            if not auth_header or not auth_header.startswith('Bearer '):
                return JsonResponse({
                    'success': False,
                    'message': 'Authentication required'
                }, status=401)
            
            # Extract token
            token = auth_header.split(' ')[1]
            
            try:
                # Decode JWT token
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                
                # Check expiration
                exp = payload.get('exp')
                if exp:
                    # Convert timestamp to timezone-aware datetime
                    from django.utils import timezone
                    import pytz
                    exp_datetime = datetime.fromtimestamp(exp, tz=pytz.UTC)
                    now = timezone.now()
                    if exp_datetime < now:
                        return JsonResponse({
                            'success': False,
                            'message': 'Token has expired. Please log in again.'
                        }, status=401)
                
                # Check if user exists and has student role
                user_id = payload.get('user_id')
                try:
                    user = User.objects.get(id=user_id)  # type: ignore
                    # Allow admin users to access student endpoints
                    if user.role not in ['student', 'admin']:
                        return JsonResponse({
                            'success': False,
                            'message': 'Access denied. Student or admin role required.'
                        }, status=403)
                    
                    # If user is admin, attach admin info to request
                    if user.role == 'admin':
                        from admin_dashboard.models import Admin
                        try:
                            admin_profile = Admin.objects.get(user=user)  # type: ignore
                            request.user = user
                            request.admin = admin_profile
                        except Admin.DoesNotExist:  # type: ignore
                            return JsonResponse({
                                'success': False,
                                'message': 'Admin profile not found.'
                            }, status=403)
                    else:
                        # Check if student profile exists
                        try:
                            student_profile = Student.objects.get(user=user)  # type: ignore
                            
                            # Attach user and student info to request
                            request.user = user
                            request.student = student_profile
                            
                        except Student.DoesNotExist:  # type: ignore
                            return JsonResponse({
                                'success': False,
                                'message': 'Student profile not found.'
                            }, status=403)
                        
                except User.DoesNotExist:  # type: ignore
                    return JsonResponse({
                        'success': False,
                        'message': 'User not found.'
                    }, status=401)
                    
            except jwt.ExpiredSignatureError:
                return JsonResponse({
                    'success': False,
                    'message': 'Token has expired. Please log in again.'
                }, status=401)
            except jwt.InvalidTokenError as e:
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
                import traceback
                traceback.print_exc()
                return JsonResponse({
                    'success': False,
                    'message': 'Authentication error.'
                }, status=500)
        
        # If we get here, either it's not a student route or the user has access
        return None
