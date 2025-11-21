import json
import jwt
import redis
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
        # Initialize Redis connection
        try:
            # Use environment variables from .env file
            redis_host = getattr(settings, 'REDIS_NODE_1_HOST', 'localhost')
            redis_port = getattr(settings, 'REDIS_NODE_1_PORT', 7001)
            
            # Set a shorter timeout for Redis connection
            self.redis_client = redis.Redis(
                host=redis_host,
                port=redis_port,
                db=0,
                socket_connect_timeout=2,  # 2 second timeout for connection
                socket_timeout=2,  # 2 second timeout for operations
                retry_on_timeout=False  # Don't retry on timeout
            )
            
            # Test the connection with a short timeout
            self.redis_client.ping()
        except Exception as e:
            # If Redis is not available, set client to None
            self.redis_client = None
            print(f"Warning: Redis connection failed in middleware: {e}")
            print("Redis-dependent features will be disabled.")
            
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
            
            try:
                # Print the SECRET_KEY for debugging
                print(f"SECRET_KEY in middleware: {settings.SECRET_KEY[:20]}...")
                print("Attempting to decode JWT token")
                # Decode JWT token
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                print(f"Decoded payload: {payload}")
                
                # Check if token is blacklisted (logout)
                if self.redis_client:
                    try:
                        if self.redis_client.exists(f"blacklisted_token_{token}"):
                            print("Token is blacklisted")
                            return JsonResponse({
                                'success': False,
                                'message': 'Token has been invalidated. Please log in again.'
                            }, status=401)
                    except Exception as e:
                        # If Redis check fails, continue without it
                        print(f"Warning: Redis check failed: {e}")
                
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
                try:
                    user = User.objects.get(id=user_id)  # type: ignore
                    if user.role != 'faculty':
                        return JsonResponse({
                            'success': False,
                            'message': 'Access denied. Faculty role required.'
                        }, status=403)
                    
                    # Check if faculty profile exists
                    try:
                        faculty_profile = Faculty.objects.get(user=user)  # type: ignore
                        
                        # Check session concurrency limits (max 3 concurrent sessions)
                        if self.redis_client:
                            try:
                                session_key = f"user_sessions_{user_id}"
                                active_sessions = self.redis_client.smembers(session_key)
                                
                                # Get session count by iterating through the set
                                session_count = 0
                                for _ in active_sessions:
                                    session_count += 1
                                
                                # If this is a new session, check limit
                                if not self.redis_client.exists(f"session_{token}"):
                                    if session_count >= 3:
                                        return JsonResponse({
                                            'success': False,
                                            'message': 'Maximum concurrent sessions limit reached. Please log out from other devices.'
                                        }, status=403)
                                    # Add this session to active sessions
                                    self.redis_client.sadd(session_key, token)
                                
                                # Set session expiration (24 hours)
                                self.redis_client.setex(f"session_{token}", 24 * 60 * 60, "active")
                                
                                # Check idle timeout (30 minutes)
                                last_activity_key = f"last_activity_{user_id}"
                                last_activity = self.redis_client.get(last_activity_key)
                                
                                if last_activity:
                                    # Decode bytes to string if needed
                                    if isinstance(last_activity, bytes):
                                        last_activity_str = last_activity.decode('utf-8')
                                    else:
                                        last_activity_str = str(last_activity)
                                    last_activity_time = datetime.fromisoformat(last_activity_str)
                                    if timezone.now() - last_activity_time > timedelta(minutes=30):
                                        # Session timed out due to inactivity
                                        return JsonResponse({
                                            'success': False,
                                            'message': 'Session timed out due to inactivity. Please log in again.'
                                        }, status=401)
                                
                                # Update last activity
                                self.redis_client.setex(last_activity_key, 24 * 60 * 60, timezone.now().isoformat())
                            except Exception as e:
                                # If Redis operations fail, continue without them
                                print(f"Warning: Redis session management failed: {e}")
                        
                        # Attach user and faculty info to request
                        request.user = user
                        request.faculty = faculty_profile
                        
                    except Faculty.DoesNotExist:  # type: ignore
                        return JsonResponse({
                            'success': False,
                            'message': 'Faculty profile not found.'
                        }, status=403)
                        
                except User.DoesNotExist:  # type: ignore
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
            except jwt.InvalidTokenError:
                print("Token invalid token error")
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid token. Please log in again.'
                }, status=401)
            except Exception as e:
                print(f"Token general exception: {e}")
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