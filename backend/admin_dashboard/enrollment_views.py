from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from courses.models import Course, Enrollment
from users.models import Faculty, Student
from .models import EnrollmentOverrideRequest
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
def get_course_faculty(request, course_id):
    """Get the faculty member assigned to a course"""
    if request.method == 'GET':
        try:
            # Check if user has admin role
            if not check_admin_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Get course
            try:
                course = Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Course not found'}, status=404)
            
            # Get faculty if assigned
            faculty = None
            if course.instructor_id:
                try:
                    faculty = Faculty.objects.get(employee_id=course.instructor_id)
                except Faculty.DoesNotExist:
                    pass
            
            if faculty:
                faculty_data = {
                    'faculty_id': faculty.employee_id,
                    'faculty_name': f'{faculty.user.first_name} {faculty.user.last_name}',
                    'department': faculty.department,
                    'title': faculty.title
                }
            else:
                faculty_data = None
            
            return JsonResponse({
                'success': True,
                'data': {
                    'course_id': course.id,
                    'course_code': course.code,
                    'course_name': course.name,
                    'assigned_faculty': faculty_data
                }
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to fetch course faculty'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def remove_faculty_from_course(request, course_id):
    """Remove faculty assignment from a course"""
    if request.method == 'DELETE':
        try:
            # Check if user has admin role
            if not check_admin_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Get course
            try:
                course = Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Course not found'}, status=404)
            
            # Store previous faculty info for response
            previous_faculty_id = course.instructor_id
            
            # Remove faculty assignment
            course.instructor_id = ''
            course.save()
            
            return JsonResponse({
                'success': True,
                'message': f'Faculty assignment removed from course {course.code}',
                'data': {
                    'course_id': course.id,
                    'course_code': course.code,
                    'previous_faculty_id': previous_faculty_id
                }
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to remove faculty from course'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def update_course_faculty(request, course_id):
    """Update the faculty member assigned to a course"""
    if request.method == 'PUT':
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
            faculty_id = data.get('faculty_id')
            
            # Validate required fields
            if not faculty_id:
                return JsonResponse({
                    'success': False, 
                    'message': 'Faculty ID is required'
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
            
            # Store previous faculty info
            previous_faculty_id = course.instructor_id
            
            # Update faculty assignment
            course.instructor_id = faculty_id
            course.save()
            
            return JsonResponse({
                'success': True,
                'message': f'Faculty assignment updated for course {course.code}',
                'data': {
                    'course_id': course.id,
                    'course_code': course.code,
                    'previous_faculty_id': previous_faculty_id,
                    'new_faculty_id': faculty.employee_id,
                    'new_faculty_name': f'{faculty.user.first_name} {faculty.user.last_name}'
                }
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to update course faculty'}, status=500)
    
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
            course_id = request.GET.get('course_id', None)
            department = request.GET.get('department', None)
            
            if report_type == 'by_department':
                # Enrollment by department report
                department_filter = Course.objects.all()
                if department:
                    department_filter = department_filter.filter(department=department)
                    
                departments = department_filter.values('department').annotate(
                    course_count=Count('id'),
                    total_enrollments=Count('students')
                ).order_by('-total_enrollments')
                
                data = {
                    'report_type': 'by_department',
                    'filter_department': department,
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
            
            elif report_type == 'course_detail' and course_id:
                # Detailed report for a specific course
                try:
                    course = Course.objects.get(id=course_id)
                    
                    # Get all enrollments for this course
                    enrollments = Enrollment.objects.filter(course_id=course_id)
                    
                    # Count by status
                    active_count = enrollments.filter(status='active').count()
                    waitlisted_count = enrollments.filter(status='waitlisted').count()
                    dropped_count = enrollments.filter(status='dropped').count()
                    completed_count = enrollments.filter(status='completed').count()
                    
                    # Get student details for active enrollments
                    active_enrollments = enrollments.filter(status='active')
                    student_details = []
                    for enrollment in active_enrollments:
                        try:
                            student = Student.objects.get(student_id=enrollment.student_id)
                            student_details.append({
                                'student_id': student.student_id,
                                'student_name': f'{student.user.first_name} {student.user.last_name}',
                                'enrollment_date': enrollment.enrollment_date.isoformat() if enrollment.enrollment_date else None,
                                'grade': enrollment.grade
                            })
                        except Student.DoesNotExist:
                            continue
                    
                    data = {
                        'report_type': 'course_detail',
                        'course': {
                            'id': course.id,
                            'code': course.code,
                            'name': course.name,
                            'department': course.department,
                            'instructor_id': course.instructor_id,
                            'enrollment_limit': course.enrollment_limit,
                            'current_enrollment': active_count,
                            'available_seats': course.enrollment_limit - active_count,
                            'waitlisted_count': waitlisted_count
                        },
                        'enrollment_stats': {
                            'active': active_count,
                            'waitlisted': waitlisted_count,
                            'dropped': dropped_count,
                            'completed': completed_count
                        },
                        'students': student_details
                    }
                    
                except Course.DoesNotExist:
                    return JsonResponse({'success': False, 'message': 'Course not found'}, status=404)
            
            else:
                # Default summary report
                course_filter = Course.objects.all()
                enrollment_filter = Enrollment.objects.all()
                
                # Apply filters if provided
                if department:
                    course_filter = course_filter.filter(department=department)
                    enrollment_filter = enrollment_filter.filter(
                        course_id__in=course_filter.values_list('id', flat=True)
                    )
                
                total_courses = course_filter.count()
                total_enrollments = enrollment_filter.filter(status='active').count()
                total_waitlisted = enrollment_filter.filter(status='waitlisted').count()
                total_dropped = enrollment_filter.filter(status='dropped').count()
                total_completed = enrollment_filter.filter(status='completed').count()
                
                # Enrollment by status
                enrollment_by_status = enrollment_filter.values('status').annotate(count=Count('status'))
                
                # Top courses by enrollment
                top_courses = course_filter.annotate(
                    enrollment_count=Count('students')
                ).order_by('-enrollment_count')[:10]
                
                top_courses_data = []
                for course in top_courses:
                    top_courses_data.append({
                        'course_id': course.id,
                        'course_code': course.code,
                        'course_name': course.name,
                        'department': course.department,
                        'enrollment_count': course.get_student_count()
                    })
                
                data = {
                    'report_type': 'summary',
                    'generated_at': timezone.now().isoformat(),
                    'filters_applied': {
                        'department': department
                    },
                    'summary': {
                        'total_courses': total_courses,
                        'total_active_enrollments': total_enrollments,
                        'total_waitlisted': total_waitlisted,
                        'total_dropped': total_dropped,
                        'total_completed': total_completed,
                        'enrollment_by_status': list(enrollment_by_status)
                    },
                    'top_courses': top_courses_data
                }
            
            return JsonResponse(data)
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to generate enrollment report: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def get_enrollment_overrides(request):
    """Get special enrollment cases that need admin approval"""
    if request.method == 'GET':
        try:
            # Check if user has admin role
            if not check_admin_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Get all pending enrollment override requests
            pending_requests = EnrollmentOverrideRequest.objects.filter(status='pending')
            
            # Convert to JSON format
            special_requests = []
            for request in pending_requests:
                special_requests.append(request.to_json())
            
            return JsonResponse({
                'special_requests': special_requests
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to fetch enrollment overrides'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def create_enrollment_override_request(request):
    """Create a new enrollment override request"""
    if request.method == 'POST':
        try:
            # Parse JSON data from request body
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'success': False, 'message': 'Invalid JSON data'}, status=400)
            
            # Extract required fields
            student_id = data.get('student_id')
            course_id = data.get('course_id')
            request_type = data.get('request_type')
            reason = data.get('reason')
            
            # Validate required fields
            if not student_id or not course_id or not request_type or not reason:
                return JsonResponse({
                    'success': False, 
                    'message': 'Student ID, Course ID, Request Type, and Reason are required'
                }, status=400)
            
            # Validate request type
            valid_types = ['prerequisite_override', 'capacity_override', 'time_period_override', 'restricted_course', 'other']
            if request_type not in valid_types:
                return JsonResponse({
                    'success': False, 
                    'message': f'Invalid request type. Must be one of: {", ".join(valid_types)}'
                }, status=400)
            
            # Get student
            try:
                student = Student.objects.get(student_id=student_id)
            except Student.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Student not found'}, status=404)
            
            # Get course
            try:
                course = Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Course not found'}, status=404)
            
            # Create enrollment override request
            override_request = EnrollmentOverrideRequest(
                id=str(uuid.uuid4()),
                student=student,
                course=course,
                request_type=request_type,
                reason=reason
            )
            override_request.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Enrollment override request created successfully',
                'data': override_request.to_json()
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to create enrollment override request: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def get_special_enrollment_requests(request):
    """Get all pending special enrollment requests"""
    if request.method == 'GET':
        try:
            # Check if user has admin role
            if not check_admin_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Get all pending enrollment override requests
            pending_requests = EnrollmentOverrideRequest.objects.filter(status='pending')
            
            # Convert to JSON format
            special_requests = []
            for req in pending_requests:
                special_requests.append(req.to_json())
            
            return JsonResponse({
                'success': True,
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
            
            # Get the enrollment override request
            try:
                override_request = EnrollmentOverrideRequest.objects.get(id=request_id)
            except EnrollmentOverrideRequest.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Enrollment override request not found'}, status=404)
            
            # Process the request based on action
            admin_user = request.user.username if hasattr(request, 'user') else 'admin'
            
            if action == 'approve':
                override_request.approve(admin_user)
                # In a real implementation, you would also create the actual enrollment here
                message = f'Enrollment override approved successfully for {override_request.student.user.first_name} {override_request.student.user.last_name} in {override_request.course.code}'
            else:  # reject
                override_request.reject(admin_user, reason)
                message = f'Enrollment override rejected for {override_request.student.user.first_name} {override_request.student.user.last_name} in {override_request.course.code}'
            
            return JsonResponse({
                'success': True,
                'message': message,
                'data': override_request.to_json()
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to process enrollment override: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


# Enrollment Override Requests

# Enrollment Period Management

@csrf_exempt
def get_enrollment_periods(request):
    """Get all enrollment periods"""
    if request.method == 'GET':
        try:
            # Check if user has admin role
            if not check_admin_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            from student.models import EnrollmentPeriod
            
            periods = EnrollmentPeriod.objects.all().order_by('-start_date')
            
            data = [period.to_json() for period in periods]
            
            return JsonResponse({
                'success': True,
                'data': data
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to fetch enrollment periods: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def create_enrollment_period(request):
    """Create a new enrollment period"""
    if request.method == 'POST':
        try:
            # Check if user has admin role
            if not check_admin_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'success': False, 'message': 'Invalid JSON data'}, status=400)
            
            # Extract fields
            name = data.get('name')
            start_date = data.get('start_date')
            end_date = data.get('end_date')
            description = data.get('description', '')
            student_group = data.get('student_group', '')
            is_active = data.get('is_active', True)
            
            if not name or not start_date or not end_date:
                return JsonResponse({'success': False, 'message': 'Name, start date, and end date are required'}, status=400)
            
            from student.models import EnrollmentPeriod
            
            period = EnrollmentPeriod(
                id=str(uuid.uuid4()),
                name=name,
                description=description,
                start_date=start_date,
                end_date=end_date,
                student_group=student_group,
                is_active=is_active
            )
            period.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Enrollment period created successfully',
                'data': period.to_json()
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to create enrollment period: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def update_enrollment_period(request, period_id):
    """Update an existing enrollment period"""
    if request.method == 'PUT':
        try:
            # Check if user has admin role
            if not check_admin_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'success': False, 'message': 'Invalid JSON data'}, status=400)
            
            from student.models import EnrollmentPeriod
            
            try:
                period = EnrollmentPeriod.objects.get(id=period_id)
            except EnrollmentPeriod.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Enrollment period not found'}, status=404)
            
            # Update fields
            if 'name' in data:
                period.name = data['name']
            if 'description' in data:
                period.description = data['description']
            if 'start_date' in data:
                period.start_date = data['start_date']
            if 'end_date' in data:
                period.end_date = data['end_date']
            if 'student_group' in data:
                period.student_group = data['student_group']
            if 'is_active' in data:
                period.is_active = data['is_active']
            
            period.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Enrollment period updated successfully',
                'data': period.to_json()
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to update enrollment period: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def delete_enrollment_period(request, period_id):
    """Delete an enrollment period"""
    if request.method == 'DELETE':
        try:
            # Check if user has admin role
            if not check_admin_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            from student.models import EnrollmentPeriod
            
            try:
                period = EnrollmentPeriod.objects.get(id=period_id)
            except EnrollmentPeriod.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Enrollment period not found'}, status=404)
            
            period.delete()
            
            return JsonResponse({
                'success': True,
                'message': 'Enrollment period deleted successfully'
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to delete enrollment period: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)