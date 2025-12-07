"""
Views for faculty/advisor approval of special enrollment requests.
"""

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.db import models
import json
import uuid
from courses.models import Course, Enrollment
from users.models import Student, Faculty
from .models import FacultyApprovalRequest


def get_authenticated_faculty(request):
    """Extract faculty user from request"""
    # This should be handled by middleware in a real implementation
    # For now, we'll simulate it
    if hasattr(request, 'faculty'):
        return request.faculty, None
    else:
        return None, 'Faculty authentication required'


@csrf_exempt
def get_pending_approval_requests(request):
    """Get all pending approval requests for the authenticated faculty member"""
    if request.method == 'GET':
        try:
            # Get faculty from request
            faculty, error = get_authenticated_faculty(request)
            if not faculty:
                return JsonResponse({'success': False, 'message': error}, status=401)
            
            # Get all pending approval requests for this faculty member
            approval_requests = FacultyApprovalRequest.objects.filter(
                faculty=faculty,
                status='pending'
            )
            
            requests_data = [req.to_json() for req in approval_requests]
            
            return JsonResponse({
                'success': True,
                'data': requests_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to retrieve approval requests: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)


@csrf_exempt
def get_all_approval_requests(request):
    """Get all approval requests (pending and processed) for the authenticated faculty member"""
    if request.method == 'GET':
        try:
            # Get faculty from request
            faculty, error = get_authenticated_faculty(request)
            if not faculty:
                return JsonResponse({'success': False, 'message': error}, status=401)
            
            # Get all approval requests for this faculty member
            approval_requests = FacultyApprovalRequest.objects.filter(faculty=faculty)
            
            requests_data = [req.to_json() for req in approval_requests]
            
            return JsonResponse({
                'success': True,
                'data': requests_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to retrieve approval requests: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)


@csrf_exempt
def submit_approval_request(request):
    """Submit a new approval request (by student or admin)"""
    if request.method == 'POST':
        try:
            # Parse JSON data from request body
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid JSON data'
                }, status=400)
            
            # Extract required fields
            student_id = data.get('student_id')
            course_id = data.get('course_id')
            faculty_id = data.get('faculty_id')
            approval_type = data.get('approval_type')
            reason = data.get('reason', '')
            
            # Validate required fields
            if not all([student_id, course_id, faculty_id, approval_type]):
                return JsonResponse({
                    'success': False,
                    'message': 'Missing required fields: student_id, course_id, faculty_id, approval_type'
                }, status=400)
            
            # Validate approval type
            valid_types = [choice[0] for choice in FacultyApprovalRequest.APPROVAL_TYPES]
            if approval_type not in valid_types:
                return JsonResponse({
                    'success': False,
                    'message': f'Invalid approval type. Must be one of: {", ".join(valid_types)}'
                }, status=400)
            
            # Get related objects
            try:
                student = Student.objects.get(student_id=student_id)
            except Student.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Student not found'
                }, status=404)
            
            try:
                course = Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Course not found'
                }, status=404)
            
            try:
                faculty = Faculty.objects.get(employee_id=faculty_id)
            except Faculty.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Faculty member not found'
                }, status=404)
            
            # Create the approval request
            approval_request = FacultyApprovalRequest(
                id=str(uuid.uuid4()),
                student=student,
                course=course,
                faculty=faculty,
                approval_type=approval_type,
                reason=reason
            )
            approval_request.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Approval request submitted successfully',
                'data': approval_request.to_json()
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to submit approval request: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)


@csrf_exempt
def process_approval_request(request, request_id):
    """Process an approval request (approve/reject/request revision)"""
    if request.method == 'POST':
        try:
            # Get faculty from request
            faculty, error = get_authenticated_faculty(request)
            if not faculty:
                return JsonResponse({'success': False, 'message': error}, status=401)
            
            # Parse JSON data from request body
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid JSON data'
                }, status=400)
            
            # Extract action and optional fields
            action = data.get('action')  # 'approve', 'reject', or 'request_revision'
            notes = data.get('notes', '')
            conditions = data.get('conditions', '')
            
            # Validate action
            if action not in ['approve', 'reject', 'request_revision']:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid action. Must be "approve", "reject", or "request_revision"'
                }, status=400)
            
            # Get the approval request
            try:
                approval_request = FacultyApprovalRequest.objects.get(id=request_id)
            except FacultyApprovalRequest.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Approval request not found'
                }, status=404)
            
            # Check if faculty is authorized to process this request
            if approval_request.faculty != faculty:
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied - you are not authorized to process this request'
                }, status=403)
            
            # Process the request based on action
            if action == 'approve':
                approval_request.approve(request.user if hasattr(request, 'user') else faculty.user, conditions)
                message = f'Approval request approved for {approval_request.student.user.first_name} {approval_request.student.user.last_name} in {approval_request.course.code}'
            elif action == 'reject':
                approval_request.reject(request.user if hasattr(request, 'user') else faculty.user, notes)
                message = f'Approval request rejected for {approval_request.student.user.first_name} {approval_request.student.user.last_name} in {approval_request.course.code}'
            else:  # request_revision
                approval_request.request_revision(request.user if hasattr(request, 'user') else faculty.user, notes)
                message = f'Revision requested for approval request for {approval_request.student.user.first_name} {approval_request.student.user.last_name} in {approval_request.course.code}'
            
            return JsonResponse({
                'success': True,
                'message': message,
                'data': approval_request.to_json()
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to process approval request: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)


@csrf_exempt
def get_approval_request_detail(request, request_id):
    """Get detailed information for a specific approval request"""
    if request.method == 'GET':
        try:
            # Get faculty from request
            faculty, error = get_authenticated_faculty(request)
            if not faculty:
                return JsonResponse({'success': False, 'message': error}, status=401)
            
            # Get the approval request
            try:
                approval_request = FacultyApprovalRequest.objects.get(id=request_id)
            except FacultyApprovalRequest.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Approval request not found'
                }, status=404)
            
            # Check if faculty is authorized to view this request
            if approval_request.faculty != faculty:
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied - you are not authorized to view this request'
                }, status=403)
            
            return JsonResponse({
                'success': True,
                'data': approval_request.to_json()
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Failed to retrieve approval request details: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)