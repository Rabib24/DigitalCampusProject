from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import json
import cloudinary
import cloudinary.uploader
from users.models import Faculty
from .models import FacultySettings

@csrf_exempt
def get_faculty_profile(request):
    """Get faculty profile information"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            user = request.user
            
            # Prepare profile data
            profile_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'status': user.status,
                'phone_number': user.phone_number,
                'date_of_birth': str(user.date_of_birth) if user.date_of_birth else None,
                'employee_id': faculty_profile.employee_id,
                'department': faculty_profile.department,
                'office_location': faculty_profile.office_location,
                'title': faculty_profile.title,
                'hire_date': str(faculty_profile.hire_date) if faculty_profile.hire_date else None,
                'office_hours': faculty_profile.office_hours,
                'courses': faculty_profile.courses,
                'research_projects': faculty_profile.research_projects,
                'publications': faculty_profile.publications,
            }
            
            # Get settings if they exist
            try:
                settings = faculty_profile.settings
                profile_data['settings'] = settings.to_json()
            except FacultySettings.DoesNotExist:
                profile_data['settings'] = {}
            
            return JsonResponse({
                'success': True,
                'profile': profile_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve profile'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def update_faculty_profile(request):
    """Update faculty profile information"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            user = request.user
            
            # Update user fields
            if 'first_name' in data:
                user.first_name = data['first_name']
            
            if 'last_name' in data:
                user.last_name = data['last_name']
            
            if 'phone_number' in data:
                user.phone_number = data['phone_number']
            
            if 'date_of_birth' in data:
                user.date_of_birth = data['date_of_birth']
            
            # Update faculty fields
            if 'department' in data:
                faculty_profile.department = data['department']
            
            if 'office_location' in data:
                faculty_profile.office_location = data['office_location']
            
            if 'title' in data:
                faculty_profile.title = data['title']
            
            if 'hire_date' in data:
                faculty_profile.hire_date = data['hire_date']
            
            if 'office_hours' in data:
                faculty_profile.office_hours = data['office_hours']
            
            # Save both models
            user.save()
            faculty_profile.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Profile updated successfully'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to update profile'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def upload_profile_picture(request):
    """Upload faculty profile picture"""
    if request.method == 'POST':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            user = request.user
            
            # Check if file is in request
            if 'profile_picture' not in request.FILES:
                return JsonResponse({
                    'success': False,
                    'message': 'No file provided'
                }, status=400)
            
            # Get the uploaded file
            uploaded_file = request.FILES['profile_picture']
            
            # Upload to Cloudinary
            try:
                upload_result = cloudinary.uploader.upload(
                    uploaded_file,
                    folder=f"faculty_profiles/{faculty_profile.employee_id}",
                    public_id=f"profile_{faculty_profile.employee_id}",
                    overwrite=True,
                    resource_type="image"
                )
                
                # Update profile picture URL in user profile
                # For now, we'll store it in the profile JSON field
                if not user.profile:
                    user.profile = {}
                
                user.profile['profile_picture_url'] = upload_result['secure_url']
                user.profile['profile_picture_public_id'] = upload_result['public_id']
                user.save()
                
                return JsonResponse({
                    'success': True,
                    'message': 'Profile picture uploaded successfully',
                    'profile_picture_url': upload_result['secure_url']
                })
                
            except Exception as e:
                return JsonResponse({
                    'success': False,
                    'message': 'Failed to upload profile picture'
                }, status=500)
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to process request'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def update_privacy_settings(request):
    """Update faculty privacy settings"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get or create settings
            settings, created = FacultySettings.objects.get_or_create(faculty=faculty_profile)
            
            # Update privacy settings
            if 'profile_visibility' in data:
                settings.profile_visibility = data['profile_visibility']
            
            if 'show_email' in data:
                settings.show_email = data['show_email']
            
            if 'show_office_hours' in data:
                settings.show_office_hours = data['show_office_hours']
            
            # Update timestamp
            settings.updated_at = timezone.now()
            settings.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Privacy settings updated successfully',
                'settings': settings.to_json()
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to update privacy settings'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)