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
    def __init__(self, get_response):
        self.get_response = get_response
        # Initialize Redis connection
        try:
            self.redis_client = redis.Redis(
                host=settings.REDIS_HOST if hasattr(settings, 'REDIS_HOST') else 'localhost',
                port=settings.REDIS_PORT if hasattr(settings, 'REDIS_PORT') else 6379,
                db=0
            )
        except:
            self.redis_client = None
            
    def process_request(self, request):
        # Only apply to faculty routes
        if request.path.startswith('/api/v1/faculty/'):
            # Skip authentication for login endpoint
            if request.path == '/api/v1/faculty/auth/login/' or request.path == '/api/v1/faculty/auth/register/':
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
                
                # Check if token is blacklisted (logout)
                if self.redis_client:
                    if self.redis_client.exists(f"blacklisted_token_{token}"):
                        return JsonResponse({
                            'success': False,
                            'message': 'Token has been invalidated. Please log in again.'
                        }, status=401)
                
                # Check expiration
                exp = payload.get('exp')
                if exp and datetime.fromtimestamp(exp) < timezone.now():
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
                return JsonResponse({
                    'success': False,
                    'message': 'Token has expired. Please log in again.'
                }, status=401)
            except jwt.InvalidTokenError:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid token. Please log in again.'
                }, status=401)
            except Exception as e:
                return JsonResponse({
                    'success': False,
                    'message': 'Authentication error.'
                }, status=500)
        
        # If we get here, either it's not a faculty route or the user has access
        return None

def generate_refresh_token(user):
    """Generate a refresh token for automatic token refresh"""
    payload = {
        'user_id': user.id,
        'username': user.username,
        'role': user.role,
        'type': 'refresh',
        'exp': datetime.utcnow() + timedelta(days=7),  # Refresh token expires in 7 days
        'iat': datetime.utcnow()
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