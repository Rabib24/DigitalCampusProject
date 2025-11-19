from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json
from .models import FacultySettings
from users.models import Faculty

@csrf_exempt
def get_faculty_settings(request):
    """Get faculty settings for the authenticated user"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get or create settings
            settings, created = FacultySettings.objects.get_or_create(faculty=faculty_profile)
            
            return JsonResponse({
                'success': True,
                'settings': settings.to_json()
            })
            
        except Faculty.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Faculty profile not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve settings'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def update_faculty_settings(request):
    """Update faculty settings for the authenticated user"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get or create settings
            settings, created = FacultySettings.objects.get_or_create(faculty=faculty_profile)
            
            # Update settings based on provided data
            if 'email_notifications' in data:
                settings.email_notifications = data['email_notifications']
            
            if 'push_notifications' in data:
                settings.push_notifications = data['push_notifications']
            
            if 'sms_notifications' in data:
                settings.sms_notifications = data['sms_notifications']
            
            if 'dashboard_widgets' in data:
                settings.dashboard_widgets = data['dashboard_widgets']
            
            if 'theme' in data:
                settings.theme = data['theme']
            
            if 'language' in data:
                settings.language = data['language']
            
            if 'profile_visibility' in data:
                settings.profile_visibility = data['profile_visibility']
            
            if 'show_email' in data:
                settings.show_email = data['show_email']
            
            if 'show_office_hours' in data:
                settings.show_office_hours = data['show_office_hours']
            
            if 'preferred_contact_method' in data:
                settings.preferred_contact_method = data['preferred_contact_method']
            
            if 'calendar_view' in data:
                settings.calendar_view = data['calendar_view']
            
            if 'working_hours_start' in data:
                settings.working_hours_start = data['working_hours_start']
            
            if 'working_hours_end' in data:
                settings.working_hours_end = data['working_hours_end']
            
            # Update timestamp
            settings.updated_at = timezone.now()
            settings.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Settings updated successfully',
                'settings': settings.to_json()
            })
            
        except Faculty.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Faculty profile not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to update settings'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def reset_faculty_settings(request):
    """Reset faculty settings to default values"""
    if request.method == 'POST':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get settings or create with defaults
            settings, created = FacultySettings.objects.get_or_create(faculty=faculty_profile)
            
            # Reset to default values
            settings.email_notifications = True
            settings.push_notifications = True
            settings.sms_notifications = False
            settings.dashboard_widgets = {}
            settings.theme = 'light'
            settings.language = 'en'
            settings.profile_visibility = 'internal'
            settings.show_email = True
            settings.show_office_hours = True
            settings.preferred_contact_method = 'email'
            settings.calendar_view = 'week'
            settings.working_hours_start = '09:00:00'
            settings.working_hours_end = '17:00:00'
            
            # Update timestamp
            settings.updated_at = timezone.now()
            settings.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Settings reset to default values',
                'settings': settings.to_json()
            })
            
        except Faculty.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Faculty profile not found'
            }, status=404)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to reset settings'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)