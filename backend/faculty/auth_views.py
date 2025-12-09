import jwt
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import check_password
from django.utils import timezone
from datetime import datetime, timedelta
import json
from users.models import User, Faculty

def generate_jwt_token(user):
    """Generate JWT token for user"""
    # Print the SECRET_KEY for debugging
    print(f"SECRET_KEY in auth_views: {settings.SECRET_KEY[:20]}...")
    
    # Use timezone.now() for timezone-aware datetime
    now = timezone.now()
    exp = now + timedelta(hours=24)  # Token expires in 24 hours
    print(f"Generating token - now: {now}, exp: {exp}")
    payload = {
        'user_id': user.id,
        'username': user.username,
        'role': user.role,
        'exp': exp.timestamp(),  # Convert to timestamp
        'iat': now.timestamp()   # Convert to timestamp
    }
    print(f"Token payload: {payload}")
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    print(f"Generated token: {token}")
    return token

@csrf_exempt
def faculty_login(request):
    """Simplified faculty login endpoint with JWT token generation"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            identifier = data.get('identifier')  # email or username
            password = data.get('password')
            
            # Try to authenticate with email or username (ID)
            user = None
            
            # First try with email
            if '@' in identifier:
                try:
                    user = User.objects.get(email=identifier, role='faculty')  # type: ignore
                except User.DoesNotExist:  # type: ignore
                    pass
            
            # If not found by email, try with username (ID)
            if not user:
                try:
                    user = User.objects.get(username=identifier, role='faculty')  # type: ignore
                except User.DoesNotExist:  # type: ignore
                    pass
            
            # If user not found
            if not user:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid credentials'
                }, status=401)
            
            # Check password
            if not check_password(password, user.password):
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid credentials'
                }, status=401)
            
            # Check if account is active
            if not user.status:
                return JsonResponse({
                    'success': False,
                    'message': 'Account is not active. Please contact administrator.'
                }, status=403)
            
            # Update last login
            user.last_login = timezone.now()
            user.save()
            
            # Generate JWT token
            token = generate_jwt_token(user)
            
            # Return user data and token
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'status': user.status
            }
            
            # Include faculty-specific information
            try:
                faculty_profile = Faculty.objects.get(user=user)  # type: ignore
                user_data['employee_id'] = faculty_profile.employee_id
                user_data['department'] = faculty_profile.department
                user_data['title'] = faculty_profile.title
                user_data['office_location'] = faculty_profile.office_location
            except Faculty.DoesNotExist:  # type: ignore
                pass
            
            return JsonResponse({
                'success': True,
                'user': user_data,
                'token': token
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            # Log the actual error for debugging
            import traceback
            print(f"Faculty login error: {str(e)}")
            print(traceback.format_exc())
            return JsonResponse({
                'success': False,
                'message': 'Login failed'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

# Keep other functions but make them simpler
@csrf_exempt
def faculty_logout(request):
    """Faculty logout endpoint with JWT token invalidation"""
    if request.method == 'POST':
        try:
            # Get the token from the Authorization header
            auth_header = request.META.get('HTTP_AUTHORIZATION')
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
                
                # Try to get Redis client from middleware
                from .middleware import FacultyRoleMiddleware
                middleware = FacultyRoleMiddleware(None)
                redis_client = middleware.redis_client
                
                # If Redis is available, blacklist the token
                if redis_client:
                    try:
                        # Add token to blacklist with 24-hour expiration
                        redis_client.setex(f"blacklisted_token_{token}", 24 * 60 * 60, "true")
                        
                        # Remove session from active sessions
                        redis_client.srem(f"user_sessions_{request.user.id}", token)
                        redis_client.delete(f"session_{token}")
                    except Exception as e:
                        # Log error but don't fail logout
                        print(f"Error blacklisting token: {e}")
            
            return JsonResponse({
                'success': True,
                'message': 'Logged out successfully'
            })
        except Exception as e:
            return JsonResponse({
                'success': True,  # Still return success to avoid blocking logout
                'message': 'Logged out successfully'
            })
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)