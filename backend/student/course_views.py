from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from courses.models import Course, Enrollment
from users.models import Student
from django.utils import timezone
from django.db.models import Q
import json
import uuid

# Import the EnrollmentPeriod model
from .models import EnrollmentPeriod


def check_student_role(request):
    """Check if the authenticated user has student role"""
    return hasattr(request, 'student') and request.student is not None


def check_student_permission(request, permission_codename):
    """Check if the student user has a specific permission"""
    if not check_student_role(request):
        return False
    
    # Check if user has the required permission
    return request.user.has_permission(permission_codename)


def check_prerequisites(student_id, course):
    """Check if student meets all prerequisites for a course"""
    # If no prerequisites, return True
    if not course.prerequisites or not isinstance(course.prerequisites, list):
        return True, []
    
    # Get student's completed courses
    completed_courses = get_student_completed_courses(student_id)
    
    # Check each prerequisite
    missing_prerequisites = []
    for prereq_code in course.prerequisites:
        # Check if student has completed this prerequisite
        if not any(comp_course.get('code') == prereq_code for comp_course in completed_courses):
            missing_prerequisites.append(prereq_code)
    
    # Return True if no missing prerequisites
    return len(missing_prerequisites) == 0, missing_prerequisites


def get_student_completed_courses(student_id):
    """Get list of courses the student has completed"""
    # Get all completed enrollments for this student
    completed_enrollments = Enrollment.objects.filter(
        student_id=student_id, 
        status='completed'
    ).select_related('course')
    
    # Convert to course data
    completed_courses = []
    for enrollment in completed_enrollments:
        if hasattr(enrollment, 'course'):
            completed_courses.append(enrollment.course.to_json())
    
    return completed_courses


def check_schedule_conflicts(student_id, new_course):
    """Check for schedule conflicts with currently enrolled courses"""
    # Get student's active enrollments
    active_enrollments = Enrollment.objects.filter(
        student_id=student_id, 
        status='active'
    ).select_related('course')
    
    # If no active enrollments, no conflicts
    if not active_enrollments:
        return False, []
    
    # Get schedule for new course
    new_schedule = new_course.schedule
    if not new_schedule or not isinstance(new_schedule, list):
        return False, []
    
    # Check each active enrollment for schedule conflicts
    conflicting_courses = []
    for enrollment in active_enrollments:
        if hasattr(enrollment, 'course'):
            existing_course = enrollment.course
            existing_schedule = existing_course.schedule
            
            # Check if schedules conflict
            if existing_schedule and isinstance(existing_schedule, list):
                for new_slot in new_schedule:
                    for existing_slot in existing_schedule:
                        if schedules_overlap(new_slot, existing_slot):
                            conflicting_courses.append({
                                'course': existing_course.to_json(),
                                'conflicting_slot': new_slot
                            })
    
    return len(conflicting_courses) > 0, conflicting_courses


def schedules_overlap(schedule1, schedule2):
    """Check if two schedule slots overlap"""
    # This is a simplified implementation
    # In a real system, you would need to properly parse and compare time slots
    # For now, we'll just check if they have the same day and overlapping times
    try:
        # Check if both schedules have required fields
        if not all(key in schedule1 for key in ['day', 'start_time', 'end_time']):
            return False
        if not all(key in schedule2 for key in ['day', 'start_time', 'end_time']):
            return False
        
        # Check if same day
        if schedule1['day'] != schedule2['day']:
            return False
        
        # Check if times overlap (simplified)
        # Convert times to comparable format if possible
        start1 = schedule1['start_time']
        end1 = schedule1['end_time']
        start2 = schedule2['start_time']
        end2 = schedule2['end_time']
        
        # Simple string comparison for overlap
        # This assumes time format like "09:00" < "10:00"
        return not (end1 <= start2 or end2 <= start1)
    except:
        # If any error in comparison, assume no conflict
        return False


def check_academic_standing(student_profile, course):
    """Check if student meets academic standing requirements for a course"""
    # If no academic standing requirements, return True
    # In a real implementation, courses might have minimum GPA requirements
    # For now, we'll implement a simple check
    
    # Get course restrictions (this would be stored in the course model in a real implementation)
    # For demonstration, let's assume some courses have GPA requirements
    gpa_requirements = {
        'CS400': 3.0,  # Advanced Computer Science requires 3.0 GPA
        'MATH300': 2.5,  # Advanced Math requires 2.5 GPA
        'PHYS400': 2.8,  # Advanced Physics requires 2.8 GPA
    }
    
    # Check if this course has GPA requirements
    required_gpa = gpa_requirements.get(course.code)
    if not required_gpa:
        return True, None
    
    # Check student's GPA
    student_gpa = student_profile.cumulative_gpa
    if student_gpa is None:
        return False, f"No GPA record available. Course requires minimum GPA of {required_gpa}"
    
    # Convert to float for comparison
    try:
        student_gpa_float = float(str(student_gpa))
        if student_gpa_float >= required_gpa:
            return True, None
        else:
            return False, f"GPA {student_gpa_float} below required minimum of {required_gpa}"
    except:
        return False, f"Unable to verify GPA requirement. Course requires minimum GPA of {required_gpa}"


def check_enrollment_period(student_profile=None):
    """Check if current date is within an active enrollment period"""
    # Check for active enrollment periods
    current_date = timezone.now().date()
    active_periods = EnrollmentPeriod.objects.filter(
        start_date__lte=current_date,
        end_date__gte=current_date,
        is_active=True
    )
    
    # If no active periods, enrollment is not allowed
    if not active_periods.exists():
        return False, "No active enrollment period"
    
    # If student profile is provided, check for student group restrictions
    if student_profile:
        student_group = getattr(student_profile, 'student_group', None)
        if student_group:
            # Check if there's a period for this student group
            group_periods = active_periods.filter(student_group=student_group)
            if group_periods.exists():
                return True, None
            # Check if there's a general period (no student group specified)
            general_periods = active_periods.filter(student_group='')
            if general_periods.exists():
                return True, None
            return False, f"No active enrollment period for {student_group}"
    
    # If no student group restrictions, any active period is sufficient
    return True, None


def get_recommended_courses(student_profile):
    """Get course recommendations based on student's degree program"""
    # Get student's degree program
    degree_program = student_profile.degree_program
    
    # Simple recommendation logic based on department matching
    # In a real implementation, this could be much more sophisticated
    department_mapping = {
        'Computer Science': ['CS', 'CSCI', 'COMP'],
        'Electrical Engineering': ['EE', 'ECE', 'ELEC'],
        'Mechanical Engineering': ['ME', 'MECH'],
        'Business Administration': ['BA', 'BUS', 'MBA'],
        'Mathematics': ['MATH', 'MAT'],
        'Physics': ['PHYS', 'PHY'],
        'Chemistry': ['CHEM', 'CHM'],
        'Biology': ['BIO', 'BIOL'],
    }
    
    # Get relevant department codes
    relevant_departments = department_mapping.get(degree_program, [])
    
    # If no mapping found, return all courses
    if not relevant_departments:
        return Course.objects.all()
    
    # Build query for courses in relevant departments
    query = Q()
    for dept in relevant_departments:
        query |= Q(code__startswith=dept) | Q(department__icontains=dept)
    
    return Course.objects.filter(query)


@csrf_exempt
def search_courses(request):
    """Search courses by keyword, department, or other criteria"""
    if request.method == 'GET':
        try:
            # Check if user has student role
            if not check_student_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Get student from request (attached by middleware)
            student_profile = request.student
            student_id = student_profile.student_id
            
            # Check enrollment period
            period_valid, period_message = check_enrollment_period(student_profile)
            if not period_valid:
                return JsonResponse({
                    'success': False, 
                    'message': 'Outside of enrollment period',
                    'data': {'enrollment_period_message': period_message}
                }, status=400)
            
            # Get search parameters
            query = request.GET.get('q', '')
            department = request.GET.get('department', '')
            semester = request.GET.get('semester', '')
            
            # Build query
            course_query = Course.objects.all()
            
            # Apply search filters
            if query:
                course_query = course_query.filter(
                    Q(code__icontains=query) | 
                    Q(name__icontains=query) | 
                    Q(description__icontains=query)
                )
            
            if department:
                course_query = course_query.filter(department__icontains=department)
            
            # Execute query
            courses = course_query.all()
            
            # Convert to JSON format with additional info
            courses_data = []
            for course in courses:
                # Get enrollment count for this course
                enrollment_count = Enrollment.objects.filter(course_id=course.id, status='active').count()
                
                course_data = course.to_json()
                course_data['current_enrollment'] = enrollment_count
                course_data['available_spots'] = course.enrollment_limit - enrollment_count
                course_data['is_full'] = enrollment_count >= course.enrollment_limit
                
                # Check prerequisites for this student
                prereq_met, missing_prereqs = check_prerequisites(student_id, course)
                course_data['prerequisites_met'] = prereq_met
                course_data['missing_prerequisites'] = missing_prereqs
                
                # Check for schedule conflicts
                has_conflicts, conflicts = check_schedule_conflicts(student_id, course)
                course_data['has_schedule_conflicts'] = has_conflicts
                course_data['schedule_conflicts'] = conflicts
                
                # Check academic standing
                standing_met, standing_message = check_academic_standing(student_profile, course)
                course_data['academic_standing_met'] = standing_met
                course_data['academic_standing_message'] = standing_message
                
                courses_data.append(course_data)
            
            return JsonResponse({'courses': courses_data})
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to search courses'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def get_recommended_courses_view(request):
    """Get course recommendations for the student"""
    if request.method == 'GET':
        try:
            # Check if user has student role
            if not check_student_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Get student from request (attached by middleware)
            student_profile = request.student
            student_id = student_profile.student_id
            
            # Check enrollment period
            period_valid, period_message = check_enrollment_period(student_profile)
            if not period_valid:
                return JsonResponse({
                    'success': False, 
                    'message': 'Outside of enrollment period',
                    'data': {'enrollment_period_message': period_message}
                }, status=400)
            
            # Get recommended courses
            recommended_courses = get_recommended_courses(student_profile)
            
            # Convert to JSON format with additional info
            courses_data = []
            for course in recommended_courses:
                # Get enrollment count for this course
                enrollment_count = Enrollment.objects.filter(course_id=course.id, status='active').count()
                
                course_data = course.to_json()
                course_data['current_enrollment'] = enrollment_count
                course_data['available_spots'] = course.enrollment_limit - enrollment_count
                course_data['is_full'] = enrollment_count >= course.enrollment_limit
                
                # Check prerequisites for this student
                prereq_met, missing_prereqs = check_prerequisites(student_id, course)
                course_data['prerequisites_met'] = prereq_met
                course_data['missing_prerequisites'] = missing_prereqs
                
                # Check for schedule conflicts
                has_conflicts, conflicts = check_schedule_conflicts(student_id, course)
                course_data['has_schedule_conflicts'] = has_conflicts
                course_data['schedule_conflicts'] = conflicts
                
                # Check academic standing
                standing_met, standing_message = check_academic_standing(student_profile, course)
                course_data['academic_standing_met'] = standing_met
                course_data['academic_standing_message'] = standing_message
                
                courses_data.append(course_data)
            
            return JsonResponse({'courses': courses_data})
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to get recommended courses'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def get_available_courses(request):
    """Get all available courses for student enrollment"""
    if request.method == 'GET':
        try:
            # Check if user has student role
            if not check_student_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Get student from request (attached by middleware)
            student_profile = request.student
            student_id = student_profile.student_id
            
            # Check enrollment period
            period_valid, period_message = check_enrollment_period(student_profile)
            if not period_valid:
                return JsonResponse({
                    'success': False, 
                    'message': 'Outside of enrollment period',
                    'data': {'enrollment_period_message': period_message}
                }, status=400)
            
            # Get all courses (in a real implementation, we might want to filter by semester, etc.)
            courses = Course.objects.all()
            
            # Convert to JSON format
            courses_data = []
            for course in courses:
                # Get enrollment count for this course
                enrollment_count = Enrollment.objects.filter(course_id=course.id, status='active').count()
                
                course_data = course.to_json()
                course_data['current_enrollment'] = enrollment_count
                course_data['available_spots'] = course.enrollment_limit - enrollment_count
                course_data['is_full'] = enrollment_count >= course.enrollment_limit
                
                # Check prerequisites for this student
                prereq_met, missing_prereqs = check_prerequisites(student_id, course)
                course_data['prerequisites_met'] = prereq_met
                course_data['missing_prerequisites'] = missing_prereqs
                
                # Check for schedule conflicts
                has_conflicts, conflicts = check_schedule_conflicts(student_id, course)
                course_data['has_schedule_conflicts'] = has_conflicts
                course_data['schedule_conflicts'] = conflicts
                
                # Check academic standing
                standing_met, standing_message = check_academic_standing(student_profile, course)
                course_data['academic_standing_met'] = standing_met
                course_data['academic_standing_message'] = standing_message
                
                courses_data.append(course_data)
            
            return JsonResponse({'courses': courses_data})
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to fetch available courses'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def enroll_in_course(request, course_id):
    """Enroll student in a course"""
    if request.method == 'POST':
        try:
            # Check if user has student role
            if not check_student_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Get student from request (attached by middleware)
            student_profile = request.student
            student_id = student_profile.student_id
            
            # Check enrollment period
            period_valid, period_message = check_enrollment_period(student_profile)
            if not period_valid:
                return JsonResponse({
                    'success': False, 
                    'message': 'Outside of enrollment period',
                    'data': {'enrollment_period_message': period_message}
                }, status=400)
            
            # Get course
            try:
                course = Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Course not found'}, status=404)
            
            # Check prerequisites
            prereq_met, missing_prereqs = check_prerequisites(student_id, course)
            if not prereq_met:
                return JsonResponse({
                    'success': False, 
                    'message': 'Prerequisites not met',
                    'data': {'missing_prerequisites': missing_prereqs}
                }, status=400)
            
            # Check academic standing
            standing_met, standing_message = check_academic_standing(student_profile, course)
            if not standing_met:
                return JsonResponse({
                    'success': False, 
                    'message': 'Academic standing requirements not met',
                    'data': {'academic_standing_message': standing_message}
                }, status=400)
            
            # Check for schedule conflicts
            has_conflicts, conflicts = check_schedule_conflicts(student_id, course)
            if has_conflicts:
                return JsonResponse({
                    'success': False, 
                    'message': 'Schedule conflicts detected',
                    'data': {'schedule_conflicts': conflicts}
                }, status=400)
            
            # Check if student is already enrolled
            if Enrollment.objects.filter(student_id=student_id, course_id=course_id, status='active').exists():
                return JsonResponse({'success': False, 'message': 'You are already enrolled in this course'}, status=400)
            
            # Check if student is already waitlisted
            if Enrollment.objects.filter(student_id=student_id, course_id=course_id, status='waitlisted').exists():
                return JsonResponse({'success': False, 'message': 'You are already on the waitlist for this course'}, status=400)
            
            # Check if course is at enrollment limit
            current_enrollment_count = Enrollment.objects.filter(course_id=course_id, status='active').count()
            if current_enrollment_count >= course.enrollment_limit:
                # Add to waitlist instead
                enrollment = Enrollment(
                    id=str(uuid.uuid4()),
                    student_id=student_id,
                    course_id=course_id,
                    status='waitlisted'
                )
                message = 'You have been added to the waitlist for this course'
            else:
                # Add to course
                enrollment = Enrollment(
                    id=str(uuid.uuid4()),
                    student_id=student_id,
                    course_id=course_id,
                    status='active'
                )
                message = 'Successfully enrolled in course'
            
            # Save enrollment
            enrollment.save()
            
            # Update course student list
            course.add_student(student_id)
            
            return JsonResponse({
                'success': True,
                'message': message,
                'data': enrollment.to_json()
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to enroll in course'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def drop_course(request, course_id):
    """Drop a course enrollment"""
    if request.method == 'DELETE':
        try:
            # Check if user has student role
            if not check_student_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Get student from request (attached by middleware)
            student_profile = request.student
            student_id = student_profile.student_id
            
            # Check enrollment period (for dropping, we might have different rules)
            # For now, we'll allow dropping at any time
            # period_valid, period_message = check_enrollment_period(student_profile)
            # if not period_valid:
            #     return JsonResponse({
            #         'success': False, 
            #         'message': 'Outside of enrollment period',
            #         'data': {'enrollment_period_message': period_message}
            #     }, status=400)
            
            # Get enrollment record
            try:
                enrollment = Enrollment.objects.get(student_id=student_id, course_id=course_id)
            except Enrollment.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'You are not enrolled in this course'}, status=404)
            
            # Check if enrollment can be dropped (might have restrictions based on timing, etc.)
            # For now, we'll allow dropping at any time
            enrollment_status = enrollment.status
            
            # Delete enrollment
            enrollment.delete()
            
            # Remove student from course student list
            try:
                course = Course.objects.get(id=course_id)
                course.remove_student(student_id)
            except Course.DoesNotExist:
                pass  # Course doesn't exist anymore, but enrollment was deleted
            
            # If there are students on the waitlist and the course is now below capacity,
            # we could implement automatic enrollment of waitlisted students here
            # For now, we'll just return success
            
            return JsonResponse({
                'success': True,
                'message': f'Successfully dropped course (previously {enrollment_status})'
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to drop course'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def get_student_enrollments(request):
    """Get all enrollments for the current student"""
    if request.method == 'GET':
        try:
            # Check if user has student role
            if not check_student_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Get student from request (attached by middleware)
            student_profile = request.student
            student_id = student_profile.student_id
            
            # Get all enrollments for this student
            enrollments = Enrollment.objects.filter(student_id=student_id).select_related('course')
            
            # Convert to JSON format
            enrollments_data = []
            for enrollment in enrollments:
                enrollment_data = enrollment.to_json()
                # Add course details
                if hasattr(enrollment, 'course'):
                    enrollment_data['course'] = enrollment.course.to_json()
                enrollments_data.append(enrollment_data)
            
            return JsonResponse({'enrollments': enrollments_data})
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to fetch enrollments'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def get_waitlisted_courses(request):
    """Get all courses where student is on the waitlist"""
    if request.method == 'GET':
        try:
            # Check if user has student role
            if not check_student_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Get student from request (attached by middleware)
            student_profile = request.student
            student_id = student_profile.student_id
            
            # Get all waitlisted enrollments for this student
            waitlisted_enrollments = Enrollment.objects.filter(
                student_id=student_id, 
                status='waitlisted'
            ).select_related('course')
            
            # Convert to JSON format
            waitlisted_data = []
            for enrollment in waitlisted_enrollments:
                enrollment_data = enrollment.to_json()
                # Add course details
                if hasattr(enrollment, 'course'):
                    enrollment_data['course'] = enrollment.course.to_json()
                waitlisted_data.append(enrollment_data)
            
            return JsonResponse({'waitlisted_courses': waitlisted_data})
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to fetch waitlisted courses'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


# Cart functionality
@csrf_exempt
def get_cart(request):
    """Get student's course registration cart"""
    if request.method == 'GET':
        try:
            # Check if user has student role
            if not check_student_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Get student from request (attached by middleware)
            student_profile = request.student
            student_id = student_profile.student_id
            
            # Check enrollment period
            period_valid, period_message = check_enrollment_period(student_profile)
            if not period_valid:
                return JsonResponse({
                    'success': False, 
                    'message': 'Outside of enrollment period',
                    'data': {'enrollment_period_message': period_message}
                }, status=400)
            
            # In a real implementation, we would store cart items in the database or session
            # For now, we'll return an empty cart structure
            cart_data = {
                'items': [],
                'total_credits': 0,
                'total_courses': 0
            }
            
            return JsonResponse({'cart': cart_data})
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to fetch cart'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def add_to_cart(request, course_id):
    """Add a course to student's registration cart"""
    if request.method == 'POST':
        try:
            # Check if user has student role
            if not check_student_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Get student from request (attached by middleware)
            student_profile = request.student
            student_id = student_profile.student_id
            
            # Check enrollment period
            period_valid, period_message = check_enrollment_period(student_profile)
            if not period_valid:
                return JsonResponse({
                    'success': False, 
                    'message': 'Outside of enrollment period',
                    'data': {'enrollment_period_message': period_message}
                }, status=400)
            
            # Get course
            try:
                course = Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Course not found'}, status=404)
            
            # Check prerequisites
            prereq_met, missing_prereqs = check_prerequisites(student_id, course)
            if not prereq_met:
                return JsonResponse({
                    'success': False, 
                    'message': 'Prerequisites not met',
                    'data': {'missing_prerequisites': missing_prereqs}
                }, status=400)
            
            # Check academic standing
            standing_met, standing_message = check_academic_standing(student_profile, course)
            if not standing_met:
                return JsonResponse({
                    'success': False, 
                    'message': 'Academic standing requirements not met',
                    'data': {'academic_standing_message': standing_message}
                }, status=400)
            
            # Check for schedule conflicts with courses already in cart
            # In a real implementation, we would also check against courses in the cart
            has_conflicts, conflicts = check_schedule_conflicts(student_id, course)
            if has_conflicts:
                return JsonResponse({
                    'success': False, 
                    'message': 'Schedule conflicts detected',
                    'data': {'schedule_conflicts': conflicts}
                }, status=400)
            
            # In a real implementation, we would add the course to the student's cart
            # For now, we'll just return success
            return JsonResponse({
                'success': True,
                'message': f'Course {course.code} added to cart',
                'data': course.to_json()
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to add course to cart'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def remove_from_cart(request, course_id):
    """Remove a course from student's registration cart"""
    if request.method == 'DELETE':
        try:
            # Check if user has student role
            if not check_student_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Get student from request (attached by middleware)
            student_profile = request.student
            
            # In a real implementation, we would remove the course from the student's cart
            # For now, we'll just return success
            return JsonResponse({
                'success': True,
                'message': f'Course removed from cart'
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to remove course from cart'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def clear_cart(request):
    """Clear all items from student's registration cart"""
    if request.method == 'DELETE':
        try:
            # Check if user has student role
            if not check_student_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Get student from request (attached by middleware)
            student_profile = request.student
            
            # In a real implementation, we would clear the student's cart
            # For now, we'll just return success
            return JsonResponse({
                'success': True,
                'message': 'Cart cleared successfully'
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to clear cart'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def enroll_from_cart(request):
    """Enroll student in all courses in their registration cart"""
    if request.method == 'POST':
        try:
            # Check if user has student role
            if not check_student_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Get student from request (attached by middleware)
            student_profile = request.student
            student_id = student_profile.student_id
            
            # Check enrollment period
            period_valid, period_message = check_enrollment_period(student_profile)
            if not period_valid:
                return JsonResponse({
                    'success': False, 
                    'message': 'Outside of enrollment period',
                    'data': {'enrollment_period_message': period_message}
                }, status=400)
            
            # In a real implementation, we would get the cart items and enroll the student in each course
            # For now, we'll just return success
            return JsonResponse({
                'success': True,
                'message': 'Successfully enrolled in all courses from cart',
                'data': {
                    'enrolled_courses': [],
                    'waitlisted_courses': [],
                    'failed_courses': []
                }
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to enroll from cart'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)