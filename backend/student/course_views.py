from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.contrib.auth.decorators import login_required
from django.db import models
from courses.models import Course, Enrollment, Section
from users.models import User, Student
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
                
                courses_data.append({
                    'id': course.id,
                    'code': course.code,
                    'name': course.name,
                    'credits': course.credits,
                    'department': course.department,
                    'instructor_id': course.instructor_id,
                    'schedule': course.schedule,
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
                
                courses_data.append({
                    'id': course.id,
                    'code': course.code,
                    'name': course.name,
                    'credits': course.credits,
                    'department': course.department,
                    'instructor_id': course.instructor_id,
                    'schedule': course.schedule,
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
            student = get_student_from_request(request)
            if not student:
                return JsonResponse({'success': False, 'message': 'Authentication required'}, status=401)
            
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
                
                courses.append({
                    'id': course.id,
                    'code': course.code,
                    'name': course.name,
                    'credits': course.credits,
                    'department': course.department,
                    'description': course.description,
                    'prerequisites': prereq_codes,
                    'prereqs_met': rec['prereqs_met'],
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
    
    # Check maximum limits
    if current_credits >= 18 or current_courses >= 6:
        return False, "Maximum enrollment limit reached (18 credits or 6 courses)"
    
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
        return False, "Minimum enrollment requirement not met (at least 2 courses or 6 credits required)"
    
    return True, "Minimum enrollment requirements satisfied"


# In-memory cart storage (in a real application, this would be stored in the database)
cart_storage = {}


def get_student_cart_key(student):
    """Generate a unique key for the student's cart"""
    return f"cart_{student.student_id}"


def add_to_cart_storage(student, course_data):
    """Add a course to the student's cart in storage"""
    cart_key = get_student_cart_key(student)
    if cart_key not in cart_storage:
        cart_storage[cart_key] = []
    
    # Check if course already in cart
    for item in cart_storage[cart_key]:
        if item.get('course_id') == course_data.get('course_id'):
            return  # Already in cart
    
    cart_storage[cart_key].append(course_data)


def remove_from_cart_storage(student, course_id):
    """Remove a course from the student's cart in storage"""
    cart_key = get_student_cart_key(student)
    if cart_key in cart_storage:
        cart_storage[cart_key] = [item for item in cart_storage[cart_key] if item.get('course_id') != course_id]


def get_cart_storage(student):
    """Get the student's cart from storage"""
    cart_key = get_student_cart_key(student)
    return cart_storage.get(cart_key, [])


def clear_cart_storage(student):
    """Clear the student's cart in storage"""
    cart_key = get_student_cart_key(student)
    if cart_key in cart_storage:
        cart_storage[cart_key] = []


def check_prerequisites(course_id, student):
    """Check if student meets course prerequisites"""
    try:
        from courses.models import Course, CoursePrerequisite
        course = Course.objects.get(id=course_id)
        
        # Get all prerequisites for this course
        prerequisites = CoursePrerequisite.objects.filter(course=course, is_corequisite=False)
        
        # If no prerequisites, return True
        if not prerequisites.exists():
            return True, "No prerequisites required"
        
        # Get completed courses
        completed_enrollments = Enrollment.objects.filter(
            student_id=student.student_id, 
            status='completed'
        )
        completed_course_ids = [enrollment.course_id for enrollment in completed_enrollments]
        
        # Check if all prerequisites are met
        missing_prerequisites = []
        for prereq_rel in prerequisites:
            if prereq_rel.prerequisite_course.id not in completed_course_ids:
                missing_prerequisites.append(prereq_rel.prerequisite_course.code)
        
        if missing_prerequisites:
            return False, f"Missing prerequisites: {missing_prerequisites}"
        
        return True, "Prerequisites satisfied"
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
        
        # Check if course has academic standing requirements (this would be stored in course model)
        # For now, we'll check if the course has a minimum GPA requirement
        # This is a placeholder - in a real implementation, this would be stored in the course model
        
        # Example: Some advanced courses might require a minimum GPA
        # We'll simulate this by checking if it's an advanced course (300+ level) and requiring 2.5 GPA
        if course.code and any(char.isdigit() for char in course.code):
            # Extract numeric part of course code
            import re
            numbers = re.findall(r'\d+', course.code)
            if numbers:
                course_level = int(numbers[0])
                # Advanced courses (300+ level) require minimum 2.5 GPA
                if course_level >= 300:
                    if student.cumulative_gpa is not None and float(student.cumulative_gpa) < 2.5:
                        return False, f"Academic standing requirement not met. Minimum 2.5 GPA required for {course.code}"
        
        return True, "Academic standing requirements satisfied"
        
    except Course.DoesNotExist:
        return False, "Course not found"
    except Exception as e:
        return False, f"Error checking academic standing: {str(e)}"


def check_enrollment_period(course_id, student):
    """Check if student can enroll during current enrollment period"""
    try:
        # Get current date
        from django.utils import timezone
        current_date = timezone.now().date()
        
        # Get all active enrollment periods
        active_periods = EnrollmentPeriod.objects.filter(is_active=True)
        
        # Check if any period is currently active
        current_period = None
        for period in active_periods:
            if period.start_date <= current_date <= period.end_date:
                current_period = period
                break
        
        # If no active period, enrollment is not allowed
        if not current_period:
            return False, "No active enrollment period. Enrollment is currently closed."
        
        # Check if student belongs to the allowed group for this period
        # If student_group is empty, it's open to all students
        if current_period.student_group:
            # For simplicity, we'll check if the student's degree program matches the student_group
            # In a real implementation, this would be more sophisticated
            if student.degree_program and current_period.student_group.lower() not in student.degree_program.lower():
                return False, f"Enrollment period restricted to {current_period.student_group} students only."
        
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
    
    # Check each time slot in schedule1 against each time slot in schedule2
    for slot1 in schedule1:
        for slot2 in schedule2:
            # Extract time information (assuming format like {"day": "Monday", "start": "09:00", "end": "10:30"})
            day1 = slot1.get('day', '') if isinstance(slot1, dict) else ''
            start1 = slot1.get('start', '') if isinstance(slot1, dict) else ''
            end1 = slot1.get('end', '') if isinstance(slot1, dict) else ''
            
            day2 = slot2.get('day', '') if isinstance(slot2, dict) else ''
            start2 = slot2.get('start', '') if isinstance(slot2, dict) else ''
            end2 = slot2.get('end', '') if isinstance(slot2, dict) else ''
            
            # Check if same day
            if day1 == day2 and day1 != '':
                # Check if time ranges overlap
                if start1 and end1 and start2 and end2:
                    # Simple overlap check: (StartA < EndB) and (StartB < EndA)
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
            # Check if course exists
            try:
                course = Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Course not found'}, status=404)
            
            # Check enrollment limits
            limits_valid, limits_message = validate_enrollment_limits(student)
            if not limits_valid:
                return JsonResponse({'success': False, 'message': limits_message}, status=400)
            
            # Check prerequisites
            prereqs_satisfied, prereq_message = check_prerequisites(course_id, student)
            if not prereqs_satisfied:
                return JsonResponse({'success': False, 'message': prereq_message}, status=400)
            
            # Check schedule conflicts
            schedule_clear, schedule_message = check_schedule_conflicts(course_id, student)
            if not schedule_clear:
                return JsonResponse({'success': False, 'message': schedule_message}, status=400)
            
            # Check academic standing
            standing_clear, standing_message = check_academic_standing(course_id, student)
            if not standing_clear:
                return JsonResponse({'success': False, 'message': standing_message}, status=400)
            
            # Check enrollment period
            period_clear, period_message = check_enrollment_period(course_id, student)
            if not period_clear:
                return JsonResponse({'success': False, 'message': period_message}, status=400)
            
            # Check if already enrolled
            existing_enrollment = Enrollment.objects.filter(
                student_id=student.student_id,
                course_id=course_id,
                status__in=['active', 'completed']
            ).first()
            
            if existing_enrollment:
                return JsonResponse({
                    'success': False, 
                    'message': 'Already enrolled in this course'
                }, status=400)
            
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
                        
                        # Log the enrollment action
                        EnrollmentAuditLogger.log_enrollment(
                            student=student,
                            course=course,
                            section=new_section,
                            request=request,
                            enrollment_id=enrollment.id,
                            section_created=True,
                            section_number=new_section.section_number
                        )
                        
                        return JsonResponse({
                            'success': True,
                            'message': f'Successfully enrolled in course {course_id} (Section {new_section.section_number})',
                            'enrollment': enrollment.to_json(),
                            'section_created': True,
                            'section_number': new_section.section_number
                        })
                    else:
                        # Add student to waitlist if section creation fails
                        course.add_to_waitlist(student.student_id)
                        waitlist_position = course.get_waitlist_position(student.student_id)
                        return JsonResponse({
                            'success': True,
                            'message': f'Course is full. You have been added to the waitlist at position {waitlist_position}',
                            'waitlisted': True,
                            'waitlist_position': waitlist_position
                        })
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
                            return JsonResponse({
                                'success': True,
                                'message': f'Course is full. You have been added to the waitlist at position {waitlist_position}',
                                'waitlisted': True,
                                'waitlist_position': waitlist_position
                            })
                    
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
                    
                    section_info = f" (Section {available_section.section_number})" if hasattr(available_section, 'section_number') else ""
                    
                    # Log the enrollment action
                    EnrollmentAuditLogger.log_enrollment(
                        student=student,
                        course=course,
                        section=available_section,
                        request=request,
                        enrollment_id=enrollment.id,
                        section_info=section_info
                    )
                    
                    return JsonResponse({
                        'success': True,
                        'message': f'Successfully enrolled in course {course_id}{section_info}',
                        'enrollment': enrollment.to_json(),
                        'section_created': hasattr(available_section, 'section_number') and available_section.section_number > sections.count(),
                        'section_number': available_section.section_number if hasattr(available_section, 'section_number') else None
                    })
            
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
                enrollment_id=enrollment.id
            )
            
            return JsonResponse({
                'success': True,
                'message': f'Successfully enrolled in course {course_id}',
                'enrollment': enrollment.to_json()
            })
            
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
            # Get cart items from storage
            cart_items = get_cart_storage(student)
            
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
            
            # Add to cart storage
            add_to_cart_storage(student, course_data)
            
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
            # Remove from cart storage
            remove_from_cart_storage(student, course_id)
            
            # Log the remove from cart action
            EnrollmentAuditLogger.log_remove_from_cart(
                student=student,
                request=request,
                course_id=course_id
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
            # Clear cart storage
            clear_cart_storage(student)
            
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
            # Get cart items
            cart_items = get_cart_storage(student)
            
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
            clear_cart_storage(student)
            
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