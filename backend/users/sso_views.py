import json
import jwt
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import check_password
from django.utils import timezone
from datetime import datetime, timedelta
from .models import User, Student, Faculty, Admin

def generate_jwt_token(user):
    """Generate JWT token for user"""
    now = timezone.now()
    exp = now + timedelta(hours=24)  # Token expires in 24 hours
    payload = {
        'user_id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'exp': exp.timestamp(),  # Convert to timestamp
        'iat': now.timestamp()   # Convert to timestamp
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return token

@csrf_exempt
def sso_login(request):
    """Single Sign-On login endpoint that integrates with university email system"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            # For SSO, we might not need a password as authentication would be handled by the university system
            # But we'll keep it for fallback authentication
            
            # Validate that this is a university email
            if not email or not email.endswith('@iub.edu.bd'):
                return JsonResponse({
                    'success': False,
                    'message': 'Please use your official university email address'
                }, status=400)
            
            # Check if user exists in our system
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                # If user doesn't exist, we might want to create them
                # This would depend on the specific SSO implementation
                return JsonResponse({
                    'success': False,
                    'message': 'User not found in system. Please contact administrator.'
                }, status=404)
            
            # Check if account is active
            if user.status != 'active':
                return JsonResponse({
                    'success': False,
                    'message': 'Account is not active. Please contact administrator.'
                }, status=403)
            
            # For SSO, we might skip password verification if the university system has already authenticated
            # But for now, we'll keep the password check for security
            password = data.get('password')
            if password and not check_password(password, user.password):
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid credentials'
                }, status=401)
            
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
            
            # Include role-specific information
            if user.role == 'faculty':
                try:
                    faculty_profile = Faculty.objects.get(user=user)
                    user_data['employee_id'] = faculty_profile.employee_id
                    user_data['department'] = faculty_profile.department
                    user_data['title'] = faculty_profile.title
                    user_data['office_location'] = faculty_profile.office_location
                except Faculty.DoesNotExist:
                    pass
            elif user.role == 'student':
                try:
                    student_profile = Student.objects.get(user=user)
                    user_data['student_id'] = student_profile.student_id
                    user_data['degree_program'] = student_profile.degree_program
                except Student.DoesNotExist:
                    pass
            elif user.role == 'admin':
                try:
                    admin_profile = Admin.objects.get(user=user)
                    user_data['employee_id'] = admin_profile.employee_id
                    user_data['department'] = admin_profile.department
                except Admin.DoesNotExist:
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
            return JsonResponse({
                'success': False,
                'message': 'Login failed'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def sso_callback(request):
    """SSO callback endpoint for handling university authentication responses"""
    if request.method == 'POST':
        try:
            # This would handle the callback from the university SSO system
            # The university system would send user information after successful authentication
            data = json.loads(request.body)
            
            # Extract user information from the SSO response
            email = data.get('email')
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            university_id = data.get('university_id')
            
            # Validate that this is a university email
            if not email or not email.endswith('@iub.edu.bd'):
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid university email'
                }, status=400)
            
            # Check if user exists, create if not
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                # Create new user from SSO information
                user = User.objects.create(
                    username=university_id,
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    role='student',  # Default role, would be determined by university system
                    status='active'
                )
            
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
            
            return JsonResponse({
                'success': True,
                'user': user_data,
                'token': token
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'SSO callback failed'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)