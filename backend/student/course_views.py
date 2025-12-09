from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.contrib.auth.decorators import login_required
from django.db import models
from courses.models import Course, Enrollment, Section
from assignments.models import Assignment, Submission, Grade
from users.models import User, Student
from .models import EnrollmentPeriod  # Add this import
from django.conf import settings
import json
import jwt
from .rate_limiter import course_enrollment_rate_limit, course_search_rate_limit, cart_operation_rate_limit
from .audit_logger import EnrollmentAuditLogger


def get_authenticated_student(request):
    """Extract student user from JWT token in request"""
    auth_header = request.META.get('HTTP_AUTHORIZATION')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None, 'Authentication required'
    
    token = auth_header.split(' ')[1]
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = payload.get('user_id')
        
        if not user_id:
            return None, 'Invalid token'
            
        user = User.objects.get(id=user_id)
        
        # Check if user has student role
        if user.role != 'student':
            return None, 'Access denied. Student role required.'
            
        # Get student profile
        try:
            student = Student.objects.get(user=user)
            return student, None
        except Student.DoesNotExist:
            return None, 'Student profile not found.'
            
    except User.DoesNotExist:
        return None, 'User not found.'
    except jwt.ExpiredSignatureError:
        return None, 'Token has expired.'
    except jwt.InvalidTokenError:
        return None, 'Invalid token.'
    except Exception as e:
        return None, f'Authentication error: {str(e)}'


@csrf_exempt
@course_search_rate_limit
def get_available_courses(request):
    """Get all available courses for enrollment"""
    if request.method == 'GET':
        # Authenticate student
        student, error = get_authenticated_student(request)
        if not student:
            return JsonResponse({'success': False, 'message': error}, status=401)
        
        try:
            # Get all courses from database
            courses = Course.objects.all()
            courses_data = []
            
            for course in courses:
                # Calculate available seats
                enrolled_count = course.get_student_count()
                available_seats = course.enrollment_limit - enrolled_count
                
                # Format schedule data for frontend
                formatted_schedule = format_schedule_for_frontend(course.schedule)
                
                courses_data.append({
                    'id': course.id,
                    'code': course.code,
                    'name': course.name,
                    'credits': course.credits,
                    'department': course.department,
                    'instructor_id': course.instructor_id,
                    'schedule': formatted_schedule,
                    'available_seats': available_seats,
                    'total_seats': course.enrollment_limit,
                    'description': course.description
                })
            
            # Log the view courses action
            EnrollmentAuditLogger.log_view_courses(
                student=student,
                request=request,
                course_count=len(courses_data)
            )
            
            return JsonResponse({'courses': courses_data})
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to fetch courses: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
@course_search_rate_limit
def search_courses(request):
    """Search for courses by keyword with advanced filtering options"""
    if request.method == 'GET':
        # Authenticate student
        student, error = get_authenticated_student(request)
        if not student:
            return JsonResponse({'success': False, 'message': error}, status=401)
        
        # Get search parameters from request
        query = request.GET.get('query', '')
        department = request.GET.get('department', '')
        min_credits = request.GET.get('min_credits', '')
        max_credits = request.GET.get('max_credits', '')
        sort_by = request.GET.get('sort_by', 'name')
        
        try:
            # Build query filters
            courses_queryset = Course.objects.all()
            
            # Apply text search
            if query:
                courses_queryset = courses_queryset.filter(
                    models.Q(name__icontains=query) |
                    models.Q(code__icontains=query) |
                    models.Q(department__icontains=query)
                )
            
            # Apply department filter
            if department:
                courses_queryset = courses_queryset.filter(department=department)
            
            # Apply credit filters
            if min_credits:
                courses_queryset = courses_queryset.filter(credits__gte=int(min_credits))
            
            # Apply credit filters
            if max_credits:
                courses_queryset = courses_queryset.filter(credits__lte=int(max_credits))
            
            # Apply sorting
            if sort_by == 'code':
                courses_queryset = courses_queryset.order_by('code')
            elif sort_by == 'department':
                courses_queryset = courses_queryset.order_by('department')
            elif sort_by == 'credits':
                courses_queryset = courses_queryset.order_by('-credits')
            elif sort_by == 'availability':
                # This requires annotation, so we'll handle it after the query
                pass
            else:  # default to name
                courses_queryset = courses_queryset.order_by('name')
            
            # Execute query
            courses = list(courses_queryset)
            
            # For availability sorting, we need to calculate available seats
            if sort_by == 'availability':
                # Create a list of tuples (course, available_seats)
                courses_with_availability = []
                for course in courses:
                    enrolled_count = course.get_student_count()
                    available_seats = course.enrollment_limit - enrolled_count
                    courses_with_availability.append((course, available_seats))
                
                # Sort by available seats (descending)
                courses_with_availability.sort(key=lambda x: x[1], reverse=True)
                
                # Extract just the courses
                courses = [course_tuple[0] for course_tuple in courses_with_availability]
            
            courses_data = []
            
            for course in courses:
                # Calculate available seats
                enrolled_count = course.get_student_count()
                available_seats = course.enrollment_limit - enrolled_count
                
                # Format schedule data for frontend
                formatted_schedule = format_schedule_for_frontend(course.schedule)
                
                courses_data.append({
                    'id': course.id,
                    'code': course.code,
                    'name': course.name,
                    'credits': course.credits,
                    'department': course.department,
                    'instructor_id': course.instructor_id,
                    'schedule': formatted_schedule,
                    'available_seats': available_seats,
                    'total_seats': course.enrollment_limit,
                    'description': course.description
                })
            
            # Log the search courses action
            EnrollmentAuditLogger.log_search_courses(
                student=student,
                request=request,
                course_count=len(courses_data),
                search_params={
                    'query': query,
                    'department': department,
                    'min_credits': min_credits,
                    'max_credits': max_credits,
                    'sort_by': sort_by
                }
            )
            
            return JsonResponse({'courses': courses_data})
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to search courses: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
@course_search_rate_limit
def get_recommended_courses_view(request):
    """Get recommended courses for student based on their profile and academic history"""
    if request.method == 'GET':
        try:
            from courses.models import Course, CoursePrerequisite
            # Get the authenticated student
            student, error = get_authenticated_student(request)  # Use the correct function
            if not student:
                return JsonResponse({'success': False, 'message': error}, status=401)
            
            # Get student's major/program
            student_major = student.degree_program
            
            # Get student's completed courses
            completed_enrollments = Enrollment.objects.filter(
                student_id=student.student_id, 
                status='completed'
            )
            completed_course_ids = [enrollment.course_id for enrollment in completed_enrollments]
            
            # Get student's current enrollments
            current_enrollments = Enrollment.objects.filter(
                student_id=student.student_id, 
                status='active'
            )
            current_course_ids = [enrollment.course_id for enrollment in current_enrollments]
            
            # Get all courses
            all_courses = Course.objects.all()
            
            # Filter courses by student's major/program
            major_courses = [course for course in all_courses if course.department == student_major]
            
            # Score courses based on relevance
            scored_courses = []
            for course in major_courses:
                # Skip if already completed or currently enrolled
                if course.id in completed_course_ids or course.id in current_course_ids:
                    continue
                
                # Calculate score based on various factors
                score = 0
                
                # Check prerequisites - higher score if prerequisites are met
                prereqs_met = True
                prerequisites = CoursePrerequisite.objects.filter(course=course, is_corequisite=False)
                if prerequisites.exists():
                    for prereq_rel in prerequisites:
                        if prereq_rel.prerequisite_course.id not in completed_course_ids:
                            prereqs_met = False
                            break
                
                if prereqs_met:
                    score += 30  # Bonus for having prerequisites met
                
                # Check if it's a follow-up to a recently completed course
                if prerequisites.exists():
                    for prereq_rel in prerequisites:
                        if prereq_rel.prerequisite_course.id in completed_course_ids:
                            score += 20  # Bonus for being a sequel
                
                # Department match bonus
                score += 15
                
                # Add course credits to score (higher credit courses slightly preferred)
                score += course.credits
                
                # Add to scored courses if score > 0
                if score > 0:
                    scored_courses.append({
                        'course': course,
                        'score': score,
                        'prereqs_met': prereqs_met
                    })
            
            # Sort by score descending
            scored_courses.sort(key=lambda x: x['score'], reverse=True)
            
            # Take top 10 recommendations
            top_recommendations = scored_courses[:10]
            
            # Format for response
            courses = []
            for rec in top_recommendations:
                course = rec['course']
                # Get prerequisite course codes for display
                prereq_rels = CoursePrerequisite.objects.filter(course=course, is_corequisite=False)
                prereq_codes = [prereq_rel.prerequisite_course.code for prereq_rel in prereq_rels]
                
                # Format schedule data for frontend
                formatted_schedule = format_schedule_for_frontend(course.schedule)
                
                courses.append({
                    'id': course.id,
                    'code': course.code,
                    'name': course.name,
                    'credits': course.credits,
                    'department': course.department,
                    'description': course.description,
                    'prerequisites': prereq_codes,
                    'prereqs_met': rec['prereqs_met'],
                    'schedule': formatted_schedule,
                    'available_seats': course.enrollment_limit - (course.students.count() if course.students else 0) if course.students else course.enrollment_limit,
                    'total_seats': course.enrollment_limit
                })
            
            # Log the search courses action for recommendations
            EnrollmentAuditLogger.log_search_courses(
                student=student,
                request=request,
                course_count=len(courses),
                search_params={
                    'type': 'recommendations',
                    'major': student_major
                }
            )
            
            return JsonResponse({'courses': courses})
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to generate recommendations: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


def validate_enrollment_limits(student):
    """Validate student enrollment limits"""
    # Get current enrollments
    current_enrollments = Enrollment.objects.filter(student_id=student.student_id, status='active')
    
    # Calculate current credits and course count
    current_credits = 0
    for enrollment in current_enrollments:
        try:
            course = Course.objects.get(id=enrollment.course_id)
            current_credits += course.credits
        except Course.DoesNotExist:
            # Skip invalid courses
            pass
    
    current_courses = current_enrollments.count()
    
    # Check maximum limits with more detailed feedback
    if current_credits >= 18:
        return False, f"Maximum credit limit reached. Current: {current_credits}/18 credits."
    
    if current_courses >= 6:
        return False, f"Maximum course limit reached. Current: {current_courses}/6 courses."
    
    # Check for special circumstances (e.g., student athlete, honors student, etc.)
    # These students might have different limits
    special_status = getattr(student, 'special_enrollment_status', None)
    if special_status:
        # Could have different limits based on special status
        # This is a placeholder for future extension
        pass
    
    return True, "Enrollment limits satisfied"


def validate_minimum_enrollment(student):
    """Validate student minimum enrollment requirements"""
    # Get current enrollments
    current_enrollments = Enrollment.objects.filter(student_id=student.student_id, status='active')
    
    # Calculate current credits and course count
    current_credits = 0
    for enrollment in current_enrollments:
        try:
            course = Course.objects.get(id=enrollment.course_id)
            current_credits += course.credits
        except Course.DoesNotExist:
            # Skip invalid courses
            pass
    
    current_courses = current_enrollments.count()
    
    # Check minimum requirements (2 courses OR 6 credits, whichever is reached first)
    if current_courses < 2 and current_credits < 6:
        return False, f"Minimum enrollment requirement not met. Current: {current_courses} courses, {current_credits} credits. Required: at least 2 courses or 6 credits."
    
    # Check for special circumstances that might modify requirements
    special_programs = getattr(student, 'special_programs', [])
    if special_programs:
        # Some special programs might have different minimum requirements
        # This is a placeholder for future extension
        pass
    
    return True, "Minimum enrollment requirements satisfied"


# Cart functionality now uses database storage


def add_to_cart_db(student, course):
    """Add a course to the student's cart in database"""
    try:
        from .models import StudentEnrollmentCart
        import uuid
        
        # Check if course already in cart
        existing_item = StudentEnrollmentCart.objects.filter(
            student=student, 
            course=course
        ).first()
        
        if existing_item:
            return True, "Course already in cart"
        
        # Add course to cart
        cart_item = StudentEnrollmentCart(
            id=str(uuid.uuid4()),
            student=student,
            course=course
        )
        cart_item.save()
        
        return True, "Course added to cart successfully"
    except Exception as e:
        return False, f"Failed to add course to cart: {str(e)}"


def remove_from_cart_db(student, course_id):
    """Remove a course from the student's cart in database"""
    try:
        from .models import StudentEnrollmentCart
        from courses.models import Course
        
        # Get the course
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return False, "Course not found"
        
        # Remove course from cart
        StudentEnrollmentCart.objects.filter(
            student=student, 
            course=course
        ).delete()
        
        return True, "Course removed from cart successfully"
    except Exception as e:
        return False, f"Failed to remove course from cart: {str(e)}"


def get_cart_db(student):
    """Get the student's cart from database"""
    try:
        from .models import StudentEnrollmentCart
        
        # Get cart items
        cart_items = StudentEnrollmentCart.objects.filter(student=student)
        
        # Convert to JSON format
        cart_data = []
        for item in cart_items:
            cart_data.append(item.to_json())
        
        return True, cart_data
    except Exception as e:
        return False, f"Failed to fetch cart: {str(e)}"


def clear_cart_db(student):
    """Clear the student's cart in database"""
    try:
        from .models import StudentEnrollmentCart
        
        # Clear cart
        StudentEnrollmentCart.objects.filter(student=student).delete()
        
        return True, "Cart cleared successfully"
    except Exception as e:
        return False, f"Failed to clear cart: {str(e)}"


def check_prerequisites(course_id, student):
    """Check if student meets course prerequisites and corequisites"""
    try:
        from courses.models import Course, CoursePrerequisite
        course = Course.objects.get(id=course_id)
        
        # Get all prerequisites for this course
        prerequisites = CoursePrerequisite.objects.filter(course=course, is_corequisite=False)
        corequisites = CoursePrerequisite.objects.filter(course=course, is_corequisite=True)
        
        # If no prerequisites or corequisites, return True
        if not prerequisites.exists() and not corequisites.exists():
            return True, "No prerequisites or corequisites required"
        
        # Get completed courses
        completed_enrollments = Enrollment.objects.filter(
            student_id=student.student_id, 
            status='completed'
        )
        completed_course_ids = [enrollment.course_id for enrollment in completed_enrollments]
        
        # Get currently enrolled courses (for corequisite checking)
        active_enrollments = Enrollment.objects.filter(
            student_id=student.student_id, 
            status='active'
        )
        active_course_ids = [enrollment.course_id for enrollment in active_enrollments]
        
        # Combine active and completed for corequisite checking
        enrolled_course_ids = completed_course_ids + active_course_ids
        
        # Check if all prerequisites are met
        missing_prerequisites = []
        for prereq_rel in prerequisites:
            if prereq_rel.prerequisite_course.id not in completed_course_ids:
                missing_prerequisites.append(prereq_rel.prerequisite_course.code)
        
        if missing_prerequisites:
            return False, f"Missing prerequisites: {missing_prerequisites}"
        
        # Check if all corequisites are met (must be currently enrolled or completed)
        missing_corequisites = []
        for coreq_rel in corequisites:
            if coreq_rel.prerequisite_course.id not in enrolled_course_ids:
                missing_corequisites.append(coreq_rel.prerequisite_course.code)
        
        if missing_corequisites:
            return False, f"Missing corequisites: {missing_corequisites}"
        
        return True, "Prerequisites and corequisites satisfied"
    except Course.DoesNotExist:
        return False, "Course not found"
    except Exception as e:
        return False, f"Error checking prerequisites: {str(e)}"


def check_schedule_conflicts(course_id, student):
    """Check for schedule conflicts with existing enrollments"""
    try:
        # Get the new course
        new_course = Course.objects.get(id=course_id)
        
        # If no schedule for new course, no conflict
        if not new_course.schedule:
            return True, "No schedule conflicts"
        
        # Get student's current active enrollments
        current_enrollments = Enrollment.objects.filter(
            student_id=student.student_id,
            status='active'
        )
        
        # Check for conflicts with each enrolled course
        for enrollment in current_enrollments:
            try:
                existing_course = Course.objects.get(id=enrollment.course_id)
                
                # If no schedule for existing course, skip
                if not existing_course.schedule:
                    continue
                
                # Check for time conflicts
                if schedules_conflict(new_course.schedule, existing_course.schedule):
                    return False, f"Schedule conflict with {existing_course.name}"
                    
            except Course.DoesNotExist:
                # Skip invalid courses
                continue
        
        return True, "No schedule conflicts"
        
    except Course.DoesNotExist:
        return False, "Course not found"
    except Exception as e:
        return False, f"Error checking schedule conflicts: {str(e)}"


def check_academic_standing(course_id, student):
    """Check if student meets academic standing requirements for course"""
    try:
        # Get the course
        course = Course.objects.get(id=course_id)
        
        # Check if student has any academic probation or suspension
        if hasattr(student, 'academic_status') and student.academic_status:
            if student.academic_status.lower() in ['suspended', 'expelled', 'disqualified']:
                return False, f"Academic standing requirement not met. Student is {student.academic_status.lower()}."
        
        # Check course-specific academic requirements
        # This would ideally be stored in the course model in a real implementation
        
        # Extract numeric part of course code for level determination
        import re
        numbers = re.findall(r'\d+', course.code) if course.code else []
        course_level = int(numbers[0]) if numbers else 0
        
        # Get student's current GPA
        student_gpa = float(student.cumulative_gpa) if student.cumulative_gpa is not None else 0.0
        
        # Department-specific GPA requirements
        department_requirements = {
            'computer_science': 2.0,
            'engineering': 2.5,
            'business': 2.0,
            'medicine': 3.0,
            'law': 3.0
        }
        
        # Check department minimum GPA if applicable
        department = course.department.lower() if course.department else ''
        if department in department_requirements:
            min_gpa = department_requirements[department]
            if student_gpa < min_gpa:
                return False, f"Academic standing requirement not met. Minimum {min_gpa} GPA required for {department.title()} courses."
        
        # Advanced course requirements (300+ level)
        if course_level >= 300:
            # Advanced courses require minimum 2.5 GPA
            if student_gpa < 2.5:
                return False, f"Academic standing requirement not met. Minimum 2.5 GPA required for advanced {course.code} course."
        
        # Very advanced course requirements (400+ level)
        if course_level >= 400:
            # Very advanced courses require minimum 3.0 GPA
            if student_gpa < 3.0:
                return False, f"Academic standing requirement not met. Minimum 3.0 GPA required for very advanced {course.code} course."
        
        # Special program requirements
        if hasattr(student, 'degree_program') and student.degree_program:
            program = student.degree_program.lower()
            # Honors program requires 3.5+ GPA
            if 'honors' in program and student_gpa < 3.5:
                return False, f"Academic standing requirement not met. Minimum 3.5 GPA required for Honors program."
        
        return True, "Academic standing requirements satisfied"
        
    except Course.DoesNotExist:
        return False, "Course not found"
    except Exception as e:
        return False, f"Error checking academic standing: {str(e)}"


def check_enrollment_period(course_id, student):
    """Check if student can enroll during current enrollment period"""
    try:
        # Get current date and time
        from django.utils import timezone
        current_datetime = timezone.now()
        
        # Get all active enrollment periods
        active_periods = EnrollmentPeriod.objects.filter(is_active=True)
        
        # Check if any period is currently active
        current_period = None
        upcoming_period = None
        earliest_upcoming_date = None
        
        for period in active_periods:
            # Check if period is currently active
            if period.start_date <= current_datetime <= period.end_date:
                current_period = period
            # Check if period is upcoming
            elif period.start_date > current_datetime:
                if earliest_upcoming_date is None or period.start_date < earliest_upcoming_date:
                    earliest_upcoming_date = period.start_date
                    upcoming_period = period
        
        # If no active period, check if there's an upcoming period
        if not current_period:
            if upcoming_period:
                return False, f"Enrollment is not currently open. Next enrollment period begins on {upcoming_period.start_date}."
            else:
                return False, "No active enrollment period. Enrollment is currently closed."
        
        # Check if student belongs to the allowed group for this period
        # If student_group is empty, it's open to all students
        if current_period.student_group:
            # More sophisticated check for student group membership
            student_groups = [group.strip().lower() for group in current_period.student_group.split(',')]
            student_matches = False
            
            # Check if student's degree program matches any allowed group
            if student.degree_program:
                student_program_lower = student.degree_program.lower()
                for group in student_groups:
                    if group in student_program_lower or student_program_lower in group:
                        student_matches = True
                        break
            
            # If no match by degree program, check by student ID patterns
            if not student_matches:
                student_id_lower = student.student_id.lower()
                for group in student_groups:
                    if group in student_id_lower or student_id_lower in group:
                        student_matches = True
                        break
            
            if not student_matches:
                return False, f"Enrollment period restricted to {current_period.student_group} students only."
        
        # Check if it's too early in the period (if configured)
        # This could be extended to check specific time windows within the enrollment period
        
        return True, "Enrollment period validation passed"
        
    except Exception as e:
        return False, f"Error checking enrollment period: {str(e)}"


def schedules_conflict(schedule1, schedule2):
    """Check if two schedules conflict with each other"""
    # If either schedule is None or empty, no conflict
    if not schedule1 or not schedule2:
        return False
    
    # If schedules are not lists, convert them
    if not isinstance(schedule1, list):
        schedule1 = [schedule1]
    if not isinstance(schedule2, list):
        schedule2 = [schedule2]
    
    # Normalize time formats for comparison
    def normalize_time(time_str):
        """Convert time string to minutes since midnight for easier comparison"""
        if not time_str:
            return 0
        try:
            hours, minutes = map(int, time_str.split(':'))
            return hours * 60 + minutes
        except:
            return 0
    
    # Check each time slot in schedule1 against each time slot in schedule2
    for slot1 in schedule1:
        for slot2 in schedule2:
            # Extract time information (assuming format like {"day": "Monday", "start": "09:00", "end": "10:30"})
            day1 = slot1.get('day', '') if isinstance(slot1, dict) else ''
            start1 = normalize_time(slot1.get('start', '') if isinstance(slot1, dict) else '')
            end1 = normalize_time(slot1.get('end', '') if isinstance(slot1, dict) else '')
            
            day2 = slot2.get('day', '') if isinstance(slot2, dict) else ''
            start2 = normalize_time(slot2.get('start', '') if isinstance(slot2, dict) else '')
            end2 = normalize_time(slot2.get('end', '') if isinstance(slot2, dict) else '')
            
            # Check if same day
            if day1 == day2 and day1 != '':
                # Check if time ranges overlap
                if start1 and end1 and start2 and end2:
                    # Overlap check: (StartA < EndB) and (StartB < EndA)
                    if start1 < end2 and start2 < end1:
                        return True
    
    return False


def create_new_section(course, default_instructor_id=None):
    """Create a new section for a course when all existing sections are full"""
    try:
        # Get the highest section number for this course
        from courses.models import Section
        existing_sections = Section.objects.filter(course=course)
        
        # If no sections exist yet, create the first one (section 1)
        if not existing_sections.exists():
            section_number = 1
        else:
            # Get the highest section number and increment by 1
            max_section = existing_sections.aggregate(models.Max('section_number'))['section_number__max']
            section_number = max_section + 1 if max_section else 1
        
        # Create new section with same attributes as course but with new section number
        import uuid
        section_id = f"{course.id}-SEC{section_number:03d}"
        
        new_section = Section(
            id=section_id,
            course=course,
            section_number=section_number,
            instructor_id=default_instructor_id or course.instructor_id,
            schedule=course.schedule,
            students=[],
            enrollment_limit=course.enrollment_limit,
            waitlist=[],
        )
        new_section.save()
        
        return new_section
    except Exception as e:
        print(f"Error creating new section: {str(e)}")
        return None


def enroll_in_course_helper(student, course_id):
    """Helper function to enroll a student in a course"""
    try:
        from courses.models import Course, Enrollment, Section
        
        # Check if course exists
        try:
            course = Course.objects.get(id=course_id)
        except Course.DoesNotExist:
            return {'success': False, 'message': 'Course not found'}
        
        # Check enrollment limits
        limits_valid, limits_message = validate_enrollment_limits(student)
        if not limits_valid:
            return {'success': False, 'message': limits_message}
        
        # Check prerequisites
        prereqs_satisfied, prereq_message = check_prerequisites(course_id, student)
        if not prereqs_satisfied:
            return {'success': False, 'message': prereq_message}
        
        # Check schedule conflicts
        schedule_clear, schedule_message = check_schedule_conflicts(course_id, student)
        if not schedule_clear:
            return {'success': False, 'message': schedule_message}
        
        # Check academic standing
        standing_clear, standing_message = check_academic_standing(course_id, student)
        if not standing_clear:
            return {'success': False, 'message': standing_message}
        
        # Check enrollment period
        period_clear, period_message = check_enrollment_period(course_id, student)
        if not period_clear:
            return {'success': False, 'message': period_message}
        
        # Check if already enrolled
        existing_enrollment = Enrollment.objects.filter(
            student_id=student.student_id,
            course_id=course_id,
            status__in=['active', 'completed']
        ).first()
        
        if existing_enrollment:
            return {'success': False, 'message': 'Already enrolled in this course'}
        
        # Check if course is full
        enrolled_count = course.get_student_count()
        if enrolled_count >= course.enrollment_limit:
            # Check if there are any sections for this course
            sections = Section.objects.filter(course=course)
            
            # If no sections exist, create the first one
            if not sections.exists():
                new_section = create_new_section(course)
                if new_section:
                    # Enroll student in the new section
                    import uuid
                    enrollment = Enrollment(
                        id=str(uuid.uuid4()),
                        student_id=student.student_id,
                        course_id=course_id,
                        section_id=new_section.id,
                        status='active'
                    )
                    enrollment.save()
                    
                    # Add student to section
                    new_section.add_student(student.student_id)
                    
                    return {
                        'success': True,
                        'message': f'Successfully enrolled in course {course_id} (Section {new_section.section_number})',
                        'status': 'enrolled',
                        'section_number': new_section.section_number,
                        'section_created': True
                    }
                else:
                    # Add student to waitlist if section creation fails
                    course.add_to_waitlist(student.student_id)
                    waitlist_position = course.get_waitlist_position(student.student_id)
                    return {
                        'success': True,
                        'message': f'Course is full. You have been added to the waitlist at position {waitlist_position}',
                        'status': 'waitlisted',
                        'waitlist_position': waitlist_position
                    }
            else:
                # Check if any existing sections have space
                available_section = None
                for section in sections:
                    if not section.is_full():
                        available_section = section
                        break
                
                # If no sections have space, create a new section
                if not available_section:
                    new_section = create_new_section(course)
                    if new_section:
                        available_section = new_section
                    else:
                        # Add student to course waitlist if section creation fails
                        course.add_to_waitlist(student.student_id)
                        waitlist_position = course.get_waitlist_position(student.student_id)
                        return {
                            'success': True,
                            'message': f'Course is full. You have been added to the waitlist at position {waitlist_position}',
                            'status': 'waitlisted',
                            'waitlist_position': waitlist_position
                        }
                
                # Enroll student in available section
                import uuid
                enrollment = Enrollment(
                    id=str(uuid.uuid4()),
                    student_id=student.student_id,
                    course_id=course_id,
                    section_id=available_section.id,
                    status='active'
                )
                enrollment.save()
                
                # Add student to section
                available_section.add_student(student.student_id)
                
                return {
                    'success': True,
                    'message': f'Successfully enrolled in course {course_id} (Section {available_section.section_number})',
                    'status': 'enrolled',
                    'section_number': available_section.section_number,
                    'section_created': False
                }
        
        # Create enrollment in original course (no sections yet)
        import uuid
        enrollment = Enrollment(
            id=str(uuid.uuid4()),
            student_id=student.student_id,
            course_id=course_id,
            status='active'
        )
        enrollment.save()
        
        # Add student to course
        course.add_student(student.student_id)
        
        return {
            'success': True,
            'message': f'Successfully enrolled in course {course_id}',
            'status': 'enrolled'
        }
        
    except Exception as e:
        return {'success': False, 'message': f'Failed to enroll in course: {str(e)}'}


@csrf_exempt
@course_enrollment_rate_limit
def enroll_in_course(request, course_id):
    """Enroll student in a course"""
    if request.method == 'POST':
        # Authenticate student
        student, error = get_authenticated_student(request)
        if not student:
            return JsonResponse({'success': False, 'message': error}, status=401)
        
        try:
            # Use the helper function to enroll in the course
            result = enroll_in_course_helper(student, course_id)
            
            if not result.get('success'):
                return JsonResponse({
                    'success': False, 
                    'message': result.get('message')
                }, status=400 if 'message' in result else 500)
            
            # If enrollment was successful, log the action
            if result.get('status') == 'enrolled':
                try:
                    from courses.models import Course, Enrollment
                    course = Course.objects.get(id=course_id)
                    enrollment = Enrollment.objects.get(
                        student_id=student.student_id,
                        course_id=course_id,
                        status='active'
                    )
                    
                    # Log the enrollment action
                    EnrollmentAuditLogger.log_enrollment(
                        student=student,
                        course=course,
                        request=request,
                        enrollment_id=enrollment.id,
                        status=result.get('status'),
                        section_number=result.get('section_number'),
                        section_created=result.get('section_created', False)
                    )
                except Exception as log_error:
                    # Log error but don't fail the enrollment
                    print(f"Failed to log enrollment: {log_error}")
            
            # Return the result
            response_data = {
                'success': True,
                'message': result.get('message')
            }
            
            # Add additional fields if present in result
            if 'enrollment' in result:
                response_data['enrollment'] = result['enrollment']
            if 'section_created' in result:
                response_data['section_created'] = result['section_created']
            if 'section_number' in result:
                response_data['section_number'] = result['section_number']
            if 'waitlisted' in result:
                response_data['waitlisted'] = result['waitlisted']
            if 'waitlist_position' in result:
                response_data['waitlist_position'] = result['waitlist_position']
            
            return JsonResponse(response_data)
            
        except Exception as e:
            return JsonResponse({
                'success': False, 
                'message': f'Failed to enroll in course: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
@course_enrollment_rate_limit
def drop_course(request, course_id):
    """Drop a course enrollment"""
    if request.method == 'POST':
        # Authenticate student
        student, error = get_authenticated_student(request)
        if not student:
            return JsonResponse({'success': False, 'message': error}, status=401)
        
        try:
            # Check if enrollment exists
            try:
                enrollment = Enrollment.objects.get(
                    student_id=student.student_id,
                    course_id=course_id,
                    status='active'
                )
            except Enrollment.DoesNotExist:
                return JsonResponse({
                    'success': False, 
                    'message': 'Active enrollment not found for this course'
                }, status=404)
            
            # Update enrollment status
            enrollment.status = 'dropped'
            enrollment.save()
            
            # Remove student from course
            try:
                course = Course.objects.get(id=course_id)
                course.remove_student(student.student_id)
                
                # Log the drop action
                EnrollmentAuditLogger.log_drop(
                    student=student,
                    course=course,
                    request=request,
                    enrollment_id=enrollment.id
                )
            except Course.DoesNotExist:
                # Course doesn't exist, but we still dropped the enrollment
                # Log the drop action without course reference
                EnrollmentAuditLogger.log_drop(
                    student=student,
                    request=request,
                    enrollment_id=enrollment.id
                )
            
            return JsonResponse({
                'success': True,
                'message': f'Successfully dropped course {course_id}'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False, 
                'message': f'Failed to drop course: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def get_waitlisted_courses(request):
    """Get student's waitlisted courses"""
    if request.method == 'GET':
        # Authenticate student
        student, error = get_authenticated_student(request)
        if not student:
            return JsonResponse({'success': False, 'message': error}, status=401)
        
        try:
            # Get all courses where student is on waitlist
            courses = Course.objects.filter(waitlist__contains=[student.student_id])
            waitlisted_courses = []
            
            for course in courses:
                waitlist_position = course.get_waitlist_position(student.student_id)
                waitlisted_courses.append({
                    'course_id': course.id,
                    'course_name': course.name,
                    'course_code': course.code,
                    'waitlist_position': waitlist_position,
                    'department': course.department
                })
            
            # Log the view waitlist action
            EnrollmentAuditLogger.log_view_waitlist(
                student=student,
                request=request,
                waitlisted_count=len(waitlisted_courses)
            )
            
            return JsonResponse({'waitlisted_courses': waitlisted_courses})
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to fetch waitlisted courses: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def get_student_enrollments(request):
    """Get all student enrollments"""
    if request.method == 'GET':
        # Authenticate student
        student, error = get_authenticated_student(request)
        if not student:
            return JsonResponse({'success': False, 'message': error}, status=401)
        
        try:
            # Get student's enrollments
            enrollments = Enrollment.objects.filter(student_id=student.student_id)
            enrollments_data = []
            
            for enrollment in enrollments:
                try:
                    # Get course details
                    course = Course.objects.get(id=enrollment.course_id)
                    enrollments_data.append({
                        'id': enrollment.id,
                        'course_id': enrollment.course_id,
                        'course_name': course.name,
                        'course_code': course.code,
                        'credits': course.credits,
                        'grade': enrollment.grade,
                        'status': enrollment.status,
                        'enrollment_date': enrollment.enrollment_date.isoformat() if enrollment.enrollment_date else None
                    })
                except Course.DoesNotExist:
                    # Handle case where course no longer exists
                    enrollments_data.append({
                        'id': enrollment.id,
                        'course_id': enrollment.course_id,
                        'course_name': 'Unknown Course',
                        'course_code': 'UNKNOWN',
                        'credits': 0,
                        'grade': enrollment.grade,
                        'status': enrollment.status,
                        'enrollment_date': enrollment.enrollment_date.isoformat() if enrollment.enrollment_date else None
                    })
            
            return JsonResponse({'enrollments': enrollments_data})
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to fetch enrollments: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
@cart_operation_rate_limit
def get_cart(request):
    """Get student's course cart"""
    if request.method == 'GET':
        # Authenticate student
        student, error = get_authenticated_student(request)
        if not student:
            return JsonResponse({'success': False, 'message': error}, status=401)
        
        try:
            # Get cart items from database
            success, cart_items = get_cart_db(student)
            if not success:
                return JsonResponse({'success': False, 'message': cart_items}, status=500)
            
            # Log the view cart action
            EnrollmentAuditLogger.log_view_cart(
                student=student,
                request=request,
                item_count=len(cart_items)
            )
            
            return JsonResponse({'cart_items': cart_items})
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to fetch cart: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
@cart_operation_rate_limit
def add_to_cart(request, course_id):
    """Add course to student's cart"""
    if request.method == 'POST':
        # Authenticate student
        student, error = get_authenticated_student(request)
        if not student:
            return JsonResponse({'success': False, 'message': error}, status=401)
        
        try:
            # Check if course exists
            try:
                course = Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Course not found'}, status=404)
            
            # Prepare course data for cart
            course_data = {
                'course_id': course.id,
                'course_name': course.name,
                'course_code': course.code,
                'credits': course.credits,
                'department': course.department,
                'added_date': timezone.now().isoformat()
            }
            
            # Add to cart in database
            success, message = add_to_cart_db(student, course)
            if not success:
                return JsonResponse({'success': False, 'message': message}, status=500)
            
            # Log the add to cart action
            EnrollmentAuditLogger.log_add_to_cart(
                student=student,
                course=course,
                request=request,
                course_data=course_data
            )
            
            return JsonResponse({
                'success': True,
                'message': f'Course {course_id} added to cart'
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to add course to cart: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
@cart_operation_rate_limit
def remove_from_cart(request, course_id):
    """Remove course from student's cart"""
    if request.method == 'POST':
        # Authenticate student
        student, error = get_authenticated_student(request)
        if not student:
            return JsonResponse({'success': False, 'message': error}, status=401)
        
        try:
            # Get the course object
            try:
                course = Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Course not found'}, status=404)
            
            # Remove from cart in database
            success, message = remove_from_cart_db(student, course_id)
            if not success:
                return JsonResponse({'success': False, 'message': message}, status=500)
            
            # Log the remove from cart action
            EnrollmentAuditLogger.log_remove_from_cart(
                student=student,
                course=course,
                request=request
            )
            
            return JsonResponse({
                'success': True,
                'message': f'Course {course_id} removed from cart'
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to remove course from cart: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
@cart_operation_rate_limit
def clear_cart(request):
    """Clear student's course cart"""
    if request.method == 'POST':
        # Authenticate student
        student, error = get_authenticated_student(request)
        if not student:
            return JsonResponse({'success': False, 'message': error}, status=401)
        
        try:
            # Clear cart in database
            success, message = clear_cart_db(student)
            if not success:
                return JsonResponse({'success': False, 'message': message}, status=500)
            
            # Log the clear cart action
            EnrollmentAuditLogger.log_clear_cart(
                student=student,
                request=request
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Cart cleared successfully'
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to clear cart: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
@course_enrollment_rate_limit
def enroll_from_cart(request):
    """Enroll student in all courses in cart"""
    if request.method == 'POST':
        # Authenticate student
        student, error = get_authenticated_student(request)
        if not student:
            return JsonResponse({'success': False, 'message': error}, status=401)
        
        try:
            # Get cart items from database
            success, cart_items = get_cart_db(student)
            if not success:
                return JsonResponse({'success': False, 'message': cart_items}, status=500)
            
            if not cart_items:
                return JsonResponse({'success': False, 'message': 'Cart is empty'}, status=400)
            
            # Track successful enrollments
            successful_enrollments = []
            failed_enrollments = []
            
            # Enroll in each course in cart
            for item in cart_items:
                course_id = item.get('course_id')
                
                try:
                    # Check if course exists
                    course = Course.objects.get(id=course_id)
                    
                    # Check enrollment limits
                    limits_valid, limits_message = validate_enrollment_limits(student)
                    if not limits_valid:
                        failed_enrollments.append({
                            'course_id': course_id,
                            'reason': limits_message
                        })
                        continue
                    
                    # Check prerequisites
                    prereqs_satisfied, prereq_message = check_prerequisites(course_id, student)
                    if not prereqs_satisfied:
                        failed_enrollments.append({
                            'course_id': course_id,
                            'reason': prereq_message
                        })
                        continue
                    
                    # Check schedule conflicts
                    schedule_clear, schedule_message = check_schedule_conflicts(course_id, student)
                    if not schedule_clear:
                        failed_enrollments.append({
                            'course_id': course_id,
                            'reason': schedule_message
                        })
                        continue
                    
                    # Check academic standing
                    standing_clear, standing_message = check_academic_standing(course_id, student)
                    if not standing_clear:
                        failed_enrollments.append({
                            'course_id': course_id,
                            'reason': standing_message
                        })
                        continue
                    
                    # Check enrollment period
                    period_clear, period_message = check_enrollment_period(course_id, student)
                    if not period_clear:
                        failed_enrollments.append({
                            'course_id': course_id,
                            'reason': period_message
                        })
                        continue
                    
                    # Check if already enrolled
                    existing_enrollment = Enrollment.objects.filter(
                        student_id=student.student_id,
                        course_id=course_id,
                        status__in=['active', 'completed']
                    ).first()
                    
                    if existing_enrollment:
                        failed_enrollments.append({
                            'course_id': course_id,
                            'reason': 'Already enrolled in this course'
                        })
                        continue
                    
                    # Check if course is full
                    enrolled_count = course.get_student_count()
                    if enrolled_count >= course.enrollment_limit:
                        # Check if there are any sections for this course
                        from courses.models import Section
                        sections = Section.objects.filter(course=course)
                        
                        # If no sections exist, create the first one
                        if not sections.exists():
                            new_section = create_new_section(course)
                            if new_section:
                                # Enroll student in the new section
                                import uuid
                                enrollment = Enrollment(
                                    id=str(uuid.uuid4()),
                                    student_id=student.student_id,
                                    course_id=course_id,
                                    section_id=new_section.id,
                                    status='active'
                                )
                                enrollment.save()
                                
                                # Add student to section
                                new_section.add_student(student.student_id)
                                
                                successful_enrollments.append({
                                    'course_id': course_id,
                                    'status': 'enrolled',
                                    'section_number': new_section.section_number,
                                    'section_created': True
                                })
                                continue
                            else:
                                # Add student to waitlist if section creation fails
                                course.add_to_waitlist(student.student_id)
                                waitlist_position = course.get_waitlist_position(student.student_id)
                                successful_enrollments.append({
                                    'course_id': course_id,
                                    'status': 'waitlisted',
                                    'waitlist_position': waitlist_position
                                })
                                continue
                        else:
                            # Check if any existing sections have space
                            available_section = None
                            for section in sections:
                                if not section.is_full():
                                    available_section = section
                                    break
                            
                            # If no sections have space, create a new section
                            if not available_section:
                                new_section = create_new_section(course)
                                if new_section:
                                    available_section = new_section
                                else:
                                    # Add student to course waitlist if section creation fails
                                    course.add_to_waitlist(student.student_id)
                                    waitlist_position = course.get_waitlist_position(student.student_id)
                                    successful_enrollments.append({
                                        'course_id': course_id,
                                        'status': 'waitlisted',
                                        'waitlist_position': waitlist_position
                                    })
                                    continue
                            
                            # Enroll student in available section
                            import uuid
                            enrollment = Enrollment(
                                id=str(uuid.uuid4()),
                                student_id=student.student_id,
                                course_id=course_id,
                                section_id=available_section.id,
                                status='active'
                            )
                            enrollment.save()
                            
                            # Add student to section
                            available_section.add_student(student.student_id)
                            
                            # Log the enrollment action
                            EnrollmentAuditLogger.log_enrollment(
                                student=student,
                                course=course,
                                section=available_section,
                                request=request,
                                course_id=course_id,
                                status='enrolled',
                                section_number=available_section.section_number,
                                section_created=hasattr(available_section, 'section_number') and available_section.section_number > sections.count()
                            )
                            
                            successful_enrollments.append({
                                'course_id': course_id,
                                'status': 'enrolled',
                                'section_number': available_section.section_number,
                                'section_created': hasattr(available_section, 'section_number') and available_section.section_number > sections.count()
                            })
                            continue
                    
                    # Create enrollment in original course (no sections yet)
                    import uuid
                    enrollment = Enrollment(
                        id=str(uuid.uuid4()),
                        student_id=student.student_id,
                        course_id=course_id,
                        status='active'
                    )
                    enrollment.save()
                    
                    # Add student to course
                    course.add_student(student.student_id)
                    
                    # Log the enrollment action
                    EnrollmentAuditLogger.log_enrollment(
                        student=student,
                        course=course,
                        request=request,
                        course_id=course_id,
                        status='enrolled'
                    )
                    
                    successful_enrollments.append({
                        'course_id': course_id,
                        'status': 'enrolled'
                    })
                    
                except Course.DoesNotExist:
                    failed_enrollments.append({
                        'course_id': course_id,
                        'reason': 'Course not found'
                    })
                except Exception as e:
                    failed_enrollments.append({
                        'course_id': course_id,
                        'reason': str(e)
                    })
            
            # Clear cart after enrollment attempt
            clear_cart_db(student)
            
            # Log the enroll from cart action
            EnrollmentAuditLogger.log_enroll_from_cart(
                student=student,
                request=request,
                successful_count=len(successful_enrollments),
                failed_count=len(failed_enrollments),
                successful_enrollments=successful_enrollments,
                failed_enrollments=failed_enrollments
            )
            
            response_data = {
                'success': True,
                'message': f'Successfully processed cart enrollment: {len(successful_enrollments)} successful, {len(failed_enrollments)} failed',
                'successful_enrollments': successful_enrollments,
                'failed_enrollments': failed_enrollments
            }
            
            return JsonResponse(response_data)
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to enroll from cart: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def get_student_assignments(request):
    """Get all assignments for student's enrolled courses"""
    if request.method == 'GET':
        # Authenticate student
        student, error = get_authenticated_student(request)
        if not student:
            return JsonResponse({'success': False, 'message': error}, status=401)
        
        try:
            # Get student's active enrollments
            enrollments = Enrollment.objects.filter(
                student_id=student.student_id,
                status='active'
            )
            
            # Get course IDs
            course_ids = [enrollment.course_id for enrollment in enrollments]
            
            # Get assignments for these courses
            assignments = Assignment.objects.filter(course_id__in=course_ids)
            
            # Convert to JSON format with additional fields for frontend
            assignments_data = []
            for assignment in assignments:
                assignment_data = assignment.to_json()
                
                # Add course code
                try:
                    course = Course.objects.get(id=assignment.course_id)
                    assignment_data['course'] = course.code
                except Course.DoesNotExist:
                    assignment_data['course'] = 'Unknown'
                
                # Add submission status
                try:
                    submission = Submission.objects.filter(
                        assignment_id=assignment.id,
                        student_id=student.student_id
                    ).first()
                    
                    if submission:
                        assignment_data['status'] = 'submitted'
                        assignment_data['submittedDate'] = submission.submitted_at.isoformat() if submission.submitted_at else None
                        
                        # Get grade if exists
                        grade = Grade.objects.filter(
                            assignment_id=assignment.id,
                            student_id=student.student_id
                        ).first()
                        
                        if grade and grade.value is not None:
                            assignment_data['grade'] = float(str(grade.value))
                            assignment_data['feedback'] = grade.feedback
                    else:
                        assignment_data['status'] = 'pending'
                except Exception:
                    assignment_data['status'] = 'pending'
                
                # Map due_date to dueDate for UI
                if 'due_date' in assignment_data:
                    assignment_data['dueDate'] = assignment_data['due_date']
                
                # Add priority based on due date
                from django.utils import timezone
                from datetime import timedelta
                if 'due_date' in assignment_data and assignment_data['due_date']:
                    try:
                        due_date = timezone.datetime.fromisoformat(assignment_data['due_date'].replace('Z', '+00:00'))
                        days_until_due = (due_date - timezone.now()).days
                        if days_until_due <= 3:
                            assignment_data['priority'] = 'high'
                        elif days_until_due <= 7:
                            assignment_data['priority'] = 'medium'
                        else:
                            assignment_data['priority'] = 'low'
                    except:
                        assignment_data['priority'] = 'medium'
                else:
                    assignment_data['priority'] = 'medium'
                
                assignments_data.append(assignment_data)
            
            return JsonResponse(assignments_data, safe=False)
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to fetch assignments: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def get_student_courses(request):
    """Get all student's courses"""
    if request.method == 'GET':
        # Authenticate student
        student, error = get_authenticated_student(request)
        if not student:
            return JsonResponse({'success': False, 'message': error}, status=401)
        
        try:
            # Get student's active enrollments
            enrollments = Enrollment.objects.filter(
                student_id=student.student_id,
                status='active'
            )
            
            # Get courses data
            courses_data = []
            for enrollment in enrollments:
                try:
                    # Get course details
                    course = Course.objects.get(id=enrollment.course_id)
                    
                    # Format schedule data
                    formatted_schedule = format_schedule_for_frontend(course.schedule)
                    
                    # Get assignments for this course
                    assignments = Assignment.objects.filter(course_id=course.id)
                    
                    # Count submitted assignments
                    submitted_count = 0
                    for assignment in assignments:
                        submission = Submission.objects.filter(
                            assignment_id=assignment.id,
                            student_id=student.student_id
                        ).first()
                        if submission:
                            submitted_count += 1
                    
                    course_data = {
                        'id': course.id,
                        'code': course.code,
                        'name': course.name,
                        'credits': course.credits,
                        'department': course.department,
                        'schedule': formatted_schedule,
                        'description': course.description,
                        'instructor_id': course.instructor_id,
                        'assignments': {
                            'total': assignments.count(),
                            'submitted': submitted_count
                        }
                    }
                    courses_data.append(course_data)
                except Course.DoesNotExist:
                    # Skip courses that don't exist
                    pass
            
            return JsonResponse(courses_data, safe=False)
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to fetch courses: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def get_student_enrollment_periods(request):
    """Get all active enrollment periods for students"""
    if request.method == 'GET':
        try:
            # Authenticate student
            student, error = get_authenticated_student(request)
            if not student:
                return JsonResponse({'success': False, 'message': error}, status=401)
            
            # Get all active enrollment periods
            enrollment_periods = EnrollmentPeriod.objects.filter(is_active=True)
            
            # Convert to JSON format
            periods_data = []
            for period in enrollment_periods:
                periods_data.append(period.to_json())
            
            return JsonResponse({'enrollment_periods': periods_data})
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to fetch enrollment periods: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


def format_schedule_for_frontend(schedule_data):
    """Format schedule data to match frontend expectations"""
    if not schedule_data:
        return None
    
    try:
        # If schedule_data is a JSON string, parse it
        if isinstance(schedule_data, str):
            import json
            try:
                schedule_data = json.loads(schedule_data)
            except json.JSONDecodeError:
                # If parsing fails, return as-is
                return {
                    'days': '',
                    'time': schedule_data,
                    'room': ''
                }
        
        # If schedule_data is a list of schedule entries
        if isinstance(schedule_data, list) and len(schedule_data) > 0:
            # Process all schedule entries and combine them
            days_list = []
            times_list = []
            rooms_list = []
            
            # Create day abbreviations mapping
            day_mapping = {
                'Monday': 'M',
                'Tuesday': 'T',
                'Wednesday': 'W',
                'Thursday': 'R',
                'Friday': 'F',
                'Saturday': 'S',
                'Sunday': 'U'
            }
            
            # Process each schedule entry
            for entry in schedule_data:
                # Get day abbreviation
                day = entry.get('day', '')
                if day in day_mapping:
                    days_list.append(day_mapping[day])
                elif day:
                    days_list.append(day[:1].upper())  # First letter capitalized
                
                # Get time range
                start_time = entry.get('start_time', '')
                end_time = entry.get('end_time', '')
                if start_time and end_time:
                    times_list.append(f"{start_time} - {end_time}")
                
                # Get location
                location = entry.get('location', '')
                if location:
                    rooms_list.append(location)
            
            # Combine all information
            days_combined = ''.join(sorted(set(days_list))) if days_list else ''
            times_combined = ', '.join(sorted(set(times_list))) if times_list else ''
            rooms_combined = ', '.join(sorted(set(rooms_list))) if rooms_list else ''
            
            # Apply special abbreviations for common patterns
            day_abbr = days_combined
            if 'M' in days_combined and 'W' in days_combined and len(days_combined) == 2:
                day_abbr = 'MW'
            elif 'T' in days_combined and 'R' in days_combined and len(days_combined) == 2:
                day_abbr = 'ST'
            elif 'F' in days_combined and len(days_combined) == 1:
                day_abbr = 'AR'
            
            return {
                'days': day_abbr,
                'time': times_combined,
                'room': rooms_combined
            }
        # If schedule_data is already in the correct format
        elif isinstance(schedule_data, dict) and 'days' in schedule_data:
            return schedule_data
        else:
            return None
    except Exception as e:
        # If any error occurs, return None to avoid breaking the frontend
        return None
