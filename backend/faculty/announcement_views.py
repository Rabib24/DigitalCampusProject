"""
Faculty Announcement/Alert Management Views
Handles announcement creation and management for faculty
"""

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from communications.models import Alert
from .decorators import faculty_required
import json
import uuid


@csrf_exempt
@require_http_methods(["GET"])
@faculty_required
def get_announcements(request):
    """Get all announcements created by the faculty member"""
    try:
        faculty_id = request.faculty.user_id
        
        # Get all announcements created by this faculty member
        announcements = Alert.objects.filter(created_by=faculty_id).order_by('-created_at')
        
        # Convert to JSON format
        announcements_data = []
        for announcement in announcements:
            announcements_data.append({
                'id': announcement.id,
                'title': announcement.title,
                'message': announcement.message,
                'createdAt': announcement.created_at.isoformat(),
                'updatedAt': announcement.updated_at.isoformat(),
                'createdBy': announcement.created_by,
                'targetAudience': announcement.audience,
                'courseId': announcement.audience_ids[0] if announcement.audience_ids and announcement.audience == 'course' else None,
                'department': announcement.audience_ids[0] if announcement.audience_ids and announcement.audience == 'department' else None,
                'status': announcement.status,
                'scheduledFor': announcement.scheduled_at.isoformat() if announcement.scheduled_at else None,
                'views': 0,  # This would need a separate view tracking system
                'likes': 0   # This would need a separate like tracking system
            })
        
        return JsonResponse({
            'success': True,
            'announcements': announcements_data
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to fetch announcements: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
@faculty_required
def create_announcement(request):
    """Create a new announcement"""
    try:
        data = json.loads(request.body)
        faculty_id = request.faculty.user_id
        
        # Validate required fields
        required_fields = ['title', 'message', 'targetAudience']
        for field in required_fields:
            if field not in data:
                return JsonResponse({
                    'success': False,
                    'message': f'Missing required field: {field}'
                }, status=400)
        
        # Map targetAudience to database audience field
        audience_mapping = {
            'all': 'campus',
            'specific-course': 'course',
            'department': 'department',
            'year': 'individual'
        }
        
        audience = audience_mapping.get(data['targetAudience'], 'campus')
        
        # Build audience_ids based on target
        audience_ids = []
        if data['targetAudience'] == 'specific-course' and data.get('courseId'):
            audience_ids = [data['courseId']]
        elif data['targetAudience'] == 'department' and data.get('department'):
            audience_ids = [data['department']]
        elif data['targetAudience'] == 'year' and data.get('year'):
            audience_ids = [str(data['year'])]
        
        # Create announcement
        announcement = Alert(
            id=str(uuid.uuid4()),
            title=data['title'],
            message=data['message'],
            type='announcement',
            priority='medium',
            audience=audience,
            audience_ids=audience_ids if audience_ids else None,
            channels=['display', 'email'],
            status='draft' if data.get('status') == 'draft' else 'sent',
            created_by=faculty_id
        )
        
        # If scheduled, set scheduled_at
        if data.get('scheduledFor'):
            announcement.scheduled_at = data['scheduledFor']
            announcement.status = 'scheduled'
        
        announcement.save()
        
        # If status is published, mark as sent
        if announcement.status == 'sent':
            announcement.sent_at = timezone.now()
            announcement.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Announcement created successfully',
            'announcement': announcement.to_json()
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to create announcement: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["PUT"])
@faculty_required
def update_announcement(request, announcement_id):
    """Update an existing announcement"""
    try:
        data = json.loads(request.body)
        faculty_id = request.faculty.user_id
        
        # Get announcement
        try:
            announcement = Alert.objects.get(id=announcement_id, created_by=faculty_id)
        except Alert.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Announcement not found'
            }, status=404)
        
        # Update fields
        if 'title' in data:
            announcement.title = data['title']
        if 'message' in data:
            announcement.message = data['message']
        if 'status' in data:
            announcement.status = data['status']
            if data['status'] == 'sent' and not announcement.sent_at:
                announcement.sent_at = timezone.now()
        
        announcement.updated_at = timezone.now()
        announcement.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Announcement updated successfully',
            'announcement': announcement.to_json()
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to update announcement: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["DELETE"])
@faculty_required
def delete_announcement(request, announcement_id):
    """Delete an announcement"""
    try:
        faculty_id = request.faculty.user_id
        
        # Get and delete announcement
        try:
            announcement = Alert.objects.get(id=announcement_id, created_by=faculty_id)
            announcement.delete()
            
            return JsonResponse({
                'success': True,
                'message': 'Announcement deleted successfully'
            })
        except Alert.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Announcement not found'
            }, status=404)
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to delete announcement: {str(e)}'
        }, status=500)
