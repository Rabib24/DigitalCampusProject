from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json
import uuid
from communications.models import Notification
from users.models import Faculty
from .pagination import paginate_notifications
from .filtering import apply_filtering_and_sorting

@csrf_exempt
def get_faculty_notifications(request):
    """Get all notifications for the authenticated faculty member"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            user = request.user
            
            # Get notifications for this user
            notifications = Notification.objects.filter(user_id=user.id)  # type: ignore
            
            # Apply filtering and sorting
            notifications = apply_filtering_and_sorting(notifications, request, 'notifications')
            
            # Return paginated response with cursor-based pagination
            return paginate_notifications(notifications, request)
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve notifications'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_unread_notifications(request):
    """Get unread notifications for the authenticated faculty member"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            user = request.user
            
            # Get unread notifications for this user
            notifications = Notification.objects.filter(user_id=user.id, is_read=False)  # type: ignore
            
            # Apply filtering and sorting
            notifications = apply_filtering_and_sorting(notifications, request, 'notifications')
            
            # Return paginated response with cursor-based pagination
            return paginate_notifications(notifications, request)
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve unread notifications'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def mark_notification_as_read(request, notification_id):
    """Mark a specific notification as read"""
    if request.method == 'PUT':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            user = request.user
            
            # Get notification
            try:
                notification = Notification.objects.get(id=notification_id, user_id=user.id)  # type: ignore
            except Notification.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Notification not found or access denied'
                }, status=404)
            
            # Mark as read
            notification.mark_as_read()
            
            return JsonResponse({
                'success': True,
                'message': 'Notification marked as read',
                'data': notification.to_json()
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to mark notification as read'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def mark_all_notifications_as_read(request):
    """Mark all notifications as read for the authenticated faculty member"""
    if request.method == 'PUT':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            user = request.user
            
            # Get all unread notifications for this user
            notifications = Notification.objects.filter(user_id=user.id, is_read=False)  # type: ignore
            
            # Mark all as read
            for notification in notifications:
                notification.mark_as_read()
            
            return JsonResponse({
                'success': True,
                'message': f'Marked {notifications.count()} notifications as read'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to mark all notifications as read'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def delete_notification(request, notification_id):
    """Delete a specific notification"""
    if request.method == 'DELETE':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            user = request.user
            
            # Get notification
            try:
                notification = Notification.objects.get(id=notification_id, user_id=user.id)  # type: ignore
            except Notification.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Notification not found or access denied'
                }, status=404)
            
            # Delete notification
            notification.delete()
            
            return JsonResponse({
                'success': True,
                'message': 'Notification deleted successfully'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to delete notification'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def create_notification(request):
    """Create a new notification (for testing purposes)"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            user = request.user
            
            # Validate required fields
            required_fields = ['title', 'message', 'type']
            for field in required_fields:
                if field not in data:
                    return JsonResponse({
                        'success': False,
                        'message': f'Missing required field: {field}'
                    }, status=400)
            
            # Generate notification ID
            notification_id = str(uuid.uuid4())
            
            # Create notification
            notification = Notification(
                id=notification_id,
                user_id=user.id,
                title=data['title'],
                message=data['message'],
                type=data['type'],
                is_read=False
            )
            notification.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Notification created successfully',
                'data': notification.to_json()
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to create notification'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_notification_count(request):
    """Get notification counts for the authenticated faculty member"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            user = request.user
            
            # Get notification counts
            total_notifications = Notification.objects.filter(user_id=user.id).count()  # type: ignore
            unread_notifications = Notification.objects.filter(user_id=user.id, is_read=False).count()  # type: ignore
            
            return JsonResponse({
                'success': True,
                'data': {
                    'total': total_notifications,
                    'unread': unread_notifications
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve notification counts'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)