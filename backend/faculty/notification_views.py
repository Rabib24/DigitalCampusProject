"""
Faculty Notification Management Views
Handles notification retrieval and management for faculty
"""

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from communications.models import Notification
from .decorators import faculty_required
import json


@csrf_exempt
@require_http_methods(["GET"])
@faculty_required
def get_notifications(request):
    """Get all notifications for the faculty member"""
    try:
        faculty_id = request.faculty.user_id
        
        # Get all notifications for this faculty member
        notifications = Notification.objects.filter(user_id=faculty_id).order_by('-created_at')
        
        # Convert to JSON format
        notifications_data = []
        for notification in notifications:
            # Determine type based on notification attributes
            notification_type = "announcement"
            if 'assignment' in notification.message.lower():
                notification_type = "assignment"
            elif 'grade' in notification.message.lower() or 'grading' in notification.message.lower():
                notification_type = "grading"
            elif 'advis' in notification.message.lower():
                notification_type = "advising"
            elif 'research' in notification.message.lower():
                notification_type = "research"
            elif 'system' in notification.message.lower():
                notification_type = "system"
            
            # Determine priority based on notification type
            priority = "low"
            if notification.type in ['warning', 'error']:
                priority = "high"
            elif notification.type == 'info':
                priority = "medium"
            
            notifications_data.append({
                'id': notification.id,
                'title': notification.title,
                'message': notification.message,
                'timestamp': notification.created_at.isoformat(),
                'read': notification.is_read,
                'type': notification_type,
                'priority': priority
            })
        
        return JsonResponse({
            'success': True,
            'notifications': notifications_data
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to fetch notifications: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["PUT"])
@faculty_required
def mark_notification_read(request, notification_id):
    """Mark a notification as read"""
    try:
        faculty_id = request.faculty.user_id
        
        # Get and mark notification as read
        try:
            notification = Notification.objects.get(id=notification_id, user_id=faculty_id)
            notification.mark_as_read()
            
            return JsonResponse({
                'success': True,
                'message': 'Notification marked as read',
                'notification': notification.to_json()
            })
        except Notification.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Notification not found'
            }, status=404)
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to mark notification as read: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["PUT"])
@faculty_required
def mark_all_notifications_read(request):
    """Mark all notifications as read"""
    try:
        faculty_id = request.faculty.user_id
        
        # Mark all notifications as read
        notifications = Notification.objects.filter(user_id=faculty_id, is_read=False)
        count = notifications.count()
        notifications.update(is_read=True)
        
        return JsonResponse({
            'success': True,
            'message': f'{count} notifications marked as read',
            'count': count
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to mark all notifications as read: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["DELETE"])
@faculty_required
def delete_notification(request, notification_id):
    """Delete a notification"""
    try:
        faculty_id = request.faculty.user_id
        
        # Get and delete notification
        try:
            notification = Notification.objects.get(id=notification_id, user_id=faculty_id)
            notification.delete()
            
            return JsonResponse({
                'success': True,
                'message': 'Notification deleted successfully'
            })
        except Notification.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Notification not found'
            }, status=404)
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to delete notification: {str(e)}'
        }, status=500)
