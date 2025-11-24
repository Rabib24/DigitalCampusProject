from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from courses.models import Course, Enrollment
from users.models import Faculty, Student
from django.db.models import Count, Q
from django.utils import timezone
import json
import uuid


def check_admin_role(request):
    """Check if the authenticated user has admin role"""
    return hasattr(request, 'admin') and request.admin is not None


@csrf_exempt
def assign_faculty_to_course(request):
    """Assign a faculty member to a course"""
    if request.method == 'POST':
        try:
            # Check if user has admin role
            if not check_admin_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Parse JSON data from request body
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'success': False, 'message': 'Invalid JSON data'}, status=400)
            
            # Extract required fields
            course_id = data.get('course_id')
            faculty_id = data.get('faculty_id')
            
            # Validate required fields
            if not course_id or not faculty_id:
                return JsonResponse({
                    'success': False, 
                    'message': 'Course ID and Faculty ID are required'
                }, status=400)
            
            # Get course
            try:
                course = Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Course not found'}, status=404)
            
            # Get faculty
            try:
                faculty = Faculty.objects.get(employee_id=faculty_id)
            except Faculty.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Faculty not found'}, status=404)
            
            # Assign faculty to course
            course.instructor_id = faculty_id
            course.save()
            
            return JsonResponse({
                'success': True,
                'message': f'Faculty {faculty.user.first_name} {faculty.user.last_name} assigned to course {course.code}',
                'data': {
                    'course_id': course.id,
                    'course_code': course.code,
                    'faculty_id': faculty.employee_id,
                    'faculty_name': f'{faculty.user.first_name} {faculty.user.last_name}'
                }
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to assign faculty to course'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def get_enrollment_reports(request):
    """Get enrollment reports and statistics"""
    if request.method == 'GET':
        try:
            # Check if user has admin role
            if not check_admin_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Get report type from query parameters
            report_type = request.GET.get('type', 'summary')
            
            if report_type == 'by_department':
                # Enrollment by department report
                departments = Course.objects.values('department').annotate(
                    course_count=Count('id'),
                    total_enrollments=Count('students')
                ).order_by('-total_enrollments')
                
                data = {
                    'report_type': 'by_department',
                    'departments': list(departments)
                }
            
            elif report_type == 'by_semester':
                # Enrollment by semester report
                # This would require semester information in the course model
                # For now, we'll use a placeholder
                semesters = [
                    {'semester': 'Fall 2023', 'enrollment_count': 1250},
                    {'semester': 'Spring 2023', 'enrollment_count': 1180},
                    {'semester': 'Fall 2022', 'enrollment_count': 1120},
                ]
                
                data = {
                    'report_type': 'by_semester',
                    'semesters': semesters
                }
            
            elif report_type == 'waitlist':
                # Waitlist report
                waitlisted_enrollments = Enrollment.objects.filter(status='waitlisted')
                
                # Group by course
                waitlist_by_course = waitlisted_enrollments.values(
                    'course_id'
                ).annotate(
                    waitlist_count=Count('id')
                ).order_by('-waitlist_count')
                
                # Get course details
                waitlist_data = []
                for item in waitlist_by_course:
                    try:
                        course = Course.objects.get(id=item['course_id'])
                        waitlist_data.append({
                            'course_id': course.id,
                            'course_code': course.code,
                            'course_name': course.name,
                            'waitlist_count': item['waitlist_count']
                        })
                    except Course.DoesNotExist:
                        continue
                
                data = {
                    'report_type': 'waitlist',
                    'waitlist_data': waitlist_data
                }
            
            else:
                # Default summary report
                total_courses = Course.objects.count()
                total_enrollments = Enrollment.objects.filter(status='active').count()
                total_waitlisted = Enrollment.objects.filter(status='waitlisted').count()
                total_dropped = Enrollment.objects.filter(status='dropped').count()
                total_completed = Enrollment.objects.filter(status='completed').count()
                
                # Enrollment by status
                enrollment_by_status = Enrollment.objects.values('status').annotate(count=Count('status'))
                
                data = {
                    'report_type': 'summary',
                    'generated_at': timezone.now().isoformat(),
                    'summary': {
                        'total_courses': total_courses,
                        'total_active_enrollments': total_enrollments,
                        'total_waitlisted': total_waitlisted,
                        'total_dropped': total_dropped,
                        'total_completed': total_completed,
                        'enrollment_by_status': list(enrollment_by_status)
                    }
                }
            
            return JsonResponse(data)
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to generate enrollment report'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def get_enrollment_overrides(request):
    """Get special enrollment cases that need admin approval"""
    if request.method == 'GET':
        try:
            # Check if user has admin role
            if not check_admin_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # In a real implementation, this would query for special enrollment requests
            # that need admin approval, such as:
            # - Students requesting to enroll in courses without prerequisites
            # - Students requesting to enroll in full courses
            # - Students requesting to enroll outside of normal enrollment periods
            # - Students requesting to enroll in restricted courses
            
            # For now, we'll return a placeholder
            special_requests = [
                {
                    'id': 'req_001',
                    'student_id': 'stud_123',
                    'student_name': 'John Doe',
                    'course_id': 'course_456',
                    'course_code': 'CS400',
                    'request_type': 'prerequisite_override',
                    'reason': 'Student has equivalent experience',
                    'requested_at': '2023-10-15T10:30:00Z',
                    'status': 'pending'
                },
                {
                    'id': 'req_002',
                    'student_id': 'stud_789',
                    'student_name': 'Jane Smith',
                    'course_id': 'course_789',
                    'course_code': 'MATH300',
                    'request_type': 'capacity_override',
                    'reason': 'Student needs this course to graduate on time',
                    'requested_at': '2023-10-16T14:45:00Z',
                    'status': 'pending'
                }
            ]
            
            return JsonResponse({
                'special_requests': special_requests
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to fetch enrollment overrides'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def process_enrollment_override(request, request_id):
    """Process a special enrollment override request"""
    if request.method == 'POST':
        try:
            # Check if user has admin role
            if not check_admin_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Parse JSON data from request body
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'success': False, 'message': 'Invalid JSON data'}, status=400)
            
            # Extract action
            action = data.get('action')  # 'approve' or 'reject'
            reason = data.get('reason', '')
            
            # Validate action
            if action not in ['approve', 'reject']:
                return JsonResponse({
                    'success': False, 
                    'message': 'Invalid action. Must be "approve" or "reject"'
                }, status=400)
            
            # In a real implementation, this would process the actual request
            # For now, we'll just return a success response
            return JsonResponse({
                'success': True,
                'message': f'Enrollment override {action}d successfully',
                'data': {
                    'request_id': request_id,
                    'action': action,
                    'processed_at': timezone.now().isoformat(),
                    'processed_by': request.user.username if hasattr(request, 'user') else 'admin'
                }
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to process enrollment override'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)