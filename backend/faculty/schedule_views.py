"""
Faculty Schedule Management Views
Handles schedule retrieval and management for faculty
"""

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from courses.models import Course
from .decorators import faculty_required
import json
from datetime import datetime, time


@csrf_exempt
@require_http_methods(["GET"])
@faculty_required
def get_schedule(request):
    """Get faculty member's class schedule"""
    try:
        faculty_id = request.faculty.employee_id
        
        # Get all courses taught by this faculty member
        courses = Course.objects.filter(instructor_id=faculty_id)
        
        # Convert to schedule sessions format
        sessions = []
        for course in courses:
            if course.schedule and isinstance(course.schedule, list):
                for idx, schedule_item in enumerate(course.schedule):
                    # Parse schedule item
                    session = {
                        'id': f"{course.id}_{idx}",
                        'course': course.name,
                        'courseCode': course.code,
                        'courseId': course.id,
                        'time': schedule_item.get('time', 'TBA'),
                        'day': schedule_item.get('day', 'TBA'),
                        'duration': schedule_item.get('duration', '1.5 hours'),
                        'location': schedule_item.get('location', 'TBA'),
                        'type': schedule_item.get('type', 'lecture'),
                        'recordingStatus': 'not-started'  # Default status
                    }
                    sessions.append(session)
        
        # Sort sessions by day and time
        day_order = {'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 7}
        sessions.sort(key=lambda x: (day_order.get(x.get('day', 'Monday'), 99), x.get('time', '')))
        
        return JsonResponse({
            'success': True,
            'sessions': sessions,
            'total_sessions': len(sessions)
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to fetch schedule: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["GET"])
@faculty_required
def get_weekly_overview(request):
    """Get faculty member's weekly class overview"""
    try:
        faculty_id = request.faculty.employee_id
        
        # Get all courses taught by this faculty member
        courses = Course.objects.filter(instructor_id=faculty_id)
        
        # Count sessions by day
        day_counts = {
            'Monday': 0,
            'Tuesday': 0,
            'Wednesday': 0,
            'Thursday': 0,
            'Friday': 0,
            'Saturday': 0,
            'Sunday': 0
        }
        
        for course in courses:
            if course.schedule and isinstance(course.schedule, list):
                for schedule_item in enumerate(course.schedule):
                    day = schedule_item[1].get('day', '')
                    if day in day_counts:
                        day_counts[day] += 1
        
        return JsonResponse({
            'success': True,
            'weekly_overview': day_counts
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to fetch weekly overview: {str(e)}'
        }, status=500)
