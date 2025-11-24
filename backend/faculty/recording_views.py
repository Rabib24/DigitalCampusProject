from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json
from .models import Recording
from .decorators import faculty_required
from courses.models import Course

@csrf_exempt
@faculty_required
def get_recordings(request):
    """Get all recordings for the authenticated faculty member"""
    try:
        recordings = Recording.objects.filter(faculty=request.faculty).order_by('-created_at')
        recordings_data = [recording.to_json() for recording in recordings]
        
        return JsonResponse({
            'success': True,
            'recordings': recordings_data
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'Failed to fetch recordings'
        }, status=500)

@csrf_exempt
@faculty_required
def get_recording_detail(request, recording_id):
    """Get detailed information for a specific recording"""
    try:
        recording = Recording.objects.get(id=recording_id, faculty=request.faculty)
        return JsonResponse({
            'success': True,
            'recording': recording.to_json()
        })
    except Recording.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Recording not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'Failed to fetch recording details'
        }, status=500)

@csrf_exempt
@faculty_required
def create_recording(request):
    """Create a new recording"""
    if request.method != 'POST':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        data = json.loads(request.body)
        
        # Create recording
        recording = Recording.objects.create(
            faculty=request.faculty,
            course_id=data.get('course_id', ''),
            title=data.get('title', ''),
            description=data.get('description', ''),
            file_url=data.get('file_url', ''),
            duration=data.get('duration', ''),
            file_size=data.get('file_size', ''),
            status=data.get('status', 'processing'),
            visibility=data.get('visibility', 'private'),
            recording_date=data.get('recording_date', timezone.now())
        )
        
        return JsonResponse({
            'success': True,
            'message': 'Recording created successfully',
            'recording': recording.to_json()
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'Failed to create recording'
        }, status=500)

@csrf_exempt
@faculty_required
def update_recording(request, recording_id):
    """Update an existing recording"""
    if request.method != 'PUT':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        recording = Recording.objects.get(id=recording_id, faculty=request.faculty)
        data = json.loads(request.body)
        
        # Updateable fields
        updatable_fields = [
            'title', 'description', 'file_url', 'duration', 'file_size',
            'status', 'visibility', 'recording_date'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(recording, field, data[field])
        
        recording.updated_at = timezone.now()
        recording.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Recording updated successfully',
            'recording': recording.to_json()
        })
    except Recording.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Recording not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'Failed to update recording'
        }, status=500)

@csrf_exempt
@faculty_required
def delete_recording(request, recording_id):
    """Delete a recording"""
    if request.method != 'DELETE':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        recording = Recording.objects.get(id=recording_id, faculty=request.faculty)
        recording_data = recording.to_json()
        recording.delete()
        
        return JsonResponse({
            'success': True,
            'message': 'Recording deleted successfully',
            'recording': recording_data
        })
    except Recording.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Recording not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'Failed to delete recording'
        }, status=500)

@csrf_exempt
@faculty_required
def increment_view_count(request, recording_id):
    """Increment the view count for a recording"""
    if request.method != 'POST':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        recording = Recording.objects.get(id=recording_id, faculty=request.faculty)
        recording.view_count += 1
        recording.save()
        
        return JsonResponse({
            'success': True,
            'message': 'View count updated successfully',
            'view_count': recording.view_count
        })
    except Recording.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Recording not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'Failed to update view count'
        }, status=500)

@csrf_exempt
@faculty_required
def increment_download_count(request, recording_id):
    """Increment the download count for a recording"""
    if request.method != 'POST':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        recording = Recording.objects.get(id=recording_id, faculty=request.faculty)
        recording.download_count += 1
        recording.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Download count updated successfully',
            'download_count': recording.download_count
        })
    except Recording.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Recording not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'Failed to update download count'
        }, status=500)