from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, logout as django_logout
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
import json
from .models import User, Student, Faculty, Admin

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            identifier = data.get('identifier')
            password = data.get('password')
            
            # Try to authenticate with email or username (ID)
            user = None
            
            # First try with email
            if '@' in identifier:
                try:
                    user = User.objects.get(email=identifier)
                except User.DoesNotExist:
                    pass
            
            # If not found by email, try with username (ID)
            if not user:
                try:
                    user = User.objects.get(username=identifier)
                except User.DoesNotExist:
                    pass
            
            # If user found, check password and ensure user is active
            if user and check_password(password, user.password) and user.status == 'active':
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
                
                # Include additional role-specific information
                if user.role == 'faculty':
                    try:
                        faculty_profile = Faculty.objects.get(user=user)
                        user_data['department'] = faculty_profile.department
                        user_data['employee_id'] = faculty_profile.employee_id
                        user_data['title'] = faculty_profile.title
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
                
                # Update last login
                user.last_login = timezone.now()
                user.save()
                
                return JsonResponse({
                    'success': True,
                    'user': user_data,
                    'token': f"jwt-token-for-{user.username}-role-{user.role}"
                })
            elif user and user.status != 'active':
                return JsonResponse({
                    'success': False,
                    'message': 'Account is not active. Please contact administrator.'
                }, status=403)
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid credentials'
                }, status=401)
                
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
def register_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            first_name = data.get('firstName')
            last_name = data.get('lastName')
            email = data.get('email')
            password = data.get('password')
            student_id = data.get('studentId')
            department = data.get('department')
            
            # Check if user already exists
            if User.objects.filter(email=email).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'User with this email already exists'
                }, status=400)
            
            if User.objects.filter(username=student_id).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'User with this student ID already exists'
                }, status=400)
            
            # Create user
            user = User.objects.create(
                username=student_id,
                email=email,
                first_name=first_name,
                last_name=last_name,
                role='student',
                status='active',
                password=make_password(password)
            )
            
            # Create student profile
            Student.objects.create(
                user=user,
                student_id=student_id
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Registration successful. Please check your email for verification.'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Registration failed'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def logout_view(request):
    if request.method == 'POST':
        # In a real app, you would invalidate the JWT token here
        # For now, we'll just return a success response
        return JsonResponse({
            'success': True,
            'message': 'Logged out successfully'
        })
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)