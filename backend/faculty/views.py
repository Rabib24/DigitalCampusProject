from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from users.models import User
from courses.models import Course
from assignments.models import Assignment
from research.models import ResearchProject
from assignments.models import Grade
from courses.models import Enrollment
import json

# Import our new decorators
from .decorators import faculty_required, faculty_permission_required

def check_faculty_role(request):
    """Check if the authenticated user has faculty role"""
    # With the FacultyRoleMiddleware, we can assume the user is authenticated
    # and has faculty role if they reach this point
    return hasattr(request, 'faculty') and request.faculty is not None

def check_faculty_permission(request, permission_codename, attributes=None):
    """Check if the faculty user has a specific permission with optional attributes"""
    if not check_faculty_role(request):
        return False
    
    # Check if user has the required permission
    return request.user.has_attribute_permission(permission_codename, attributes)


@csrf_exempt
@faculty_permission_required('course_view')
def dashboard_overview(request):
    """Get faculty dashboard overview"""
    try:
        # Get courses taught by this faculty
        courses = Course.objects.filter(instructor_id=request.faculty.employee_id)  # type: ignore
        active_classes = courses.count()
        
        # Calculate total students across all courses
        total_students = 0
        for course in courses:
            total_students += course.get_student_count()
        
        # Get pending assignments (assignments due within next 7 days)
        from django.utils import timezone
        from datetime import timedelta
        
        pending_assignments = []
        pending_grades = 0
        
        for course in courses:
            # Get assignments for this course that are due soon
            assignments = Assignment.objects.filter(
                course_id=course.id,
                due_date__lte=timezone.now() + timedelta(days=7),
                due_date__gte=timezone.now()
            )  # type: ignore
            
            for assignment in assignments:
                pending_assignments.append({
                    'id': assignment.id,
                    'title': assignment.title,
                    'course': course.code
                })
            
            # Count submissions that need grading
            # In a real implementation, you would check for submissions without grades
            pending_grades += assignments.count()
        
        # Get advised students (this would require a relationship between faculty and students)
        # For now, we'll use a placeholder value
        advised_students = 0
        
        # Calculate attendance rate (this would require actual attendance data)
        # For now, we'll use a placeholder value
        attendance_rate = 90
        
        data = {
            'activeClasses': active_classes,
            'totalStudents': total_students,
            'pendingGrades': pending_grades,
            'advisedStudents': advised_students,
            'attendanceRate': attendance_rate,
            'pendingAssignments': pending_assignments[:5]  # Limit to 5 assignments
        }
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to fetch dashboard data'}, status=500)
    
    return JsonResponse(data)


@csrf_exempt
@faculty_required
def courses_list(request):
    """Get faculty courses list"""
    try:
        # Get courses taught by this faculty
        courses_qs = Course.objects.filter(instructor_id=request.faculty.employee_id)  # type: ignore
        
        # Convert to JSON format
        courses = [course.to_json() for course in courses_qs]
        
        # Add student count to each course
        for course_data in courses:
            course_id = course_data['id']
            enrollment_count = Enrollment.objects.filter(course_id=course_id).count()  # type: ignore
            course_data['studentCount'] = enrollment_count
            # Add semester information (this would come from academic calendar in a real system)
            course_data['semester'] = 'Fall 2023'
        
        return JsonResponse({'courses': courses})
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to fetch courses'}, status=500)


@csrf_exempt
@faculty_permission_required('course_view')
def course_detail(request, course_id):
    """Get faculty course detail"""
    try:
        # Get course where instructor_id matches faculty employee_id
        try:
            course = Course.objects.get(id=course_id, instructor_id=request.faculty.employee_id)  # type: ignore
        except Course.DoesNotExist:  # type: ignore
            return JsonResponse({'success': False, 'message': 'Course not found or access denied'}, status=404)
        
        # Convert to JSON format
        course_data = course.to_json()
        
        # Add student count
        enrollment_count = Enrollment.objects.filter(course_id=course_id).count()  # type: ignore
        course_data['studentCount'] = enrollment_count
        
        # Add semester information
        course_data['semester'] = 'Fall 2023'
        
        return JsonResponse(course_data)
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to fetch course details'}, status=500)


@csrf_exempt
@faculty_required
def assignments_list(request):
    """Get faculty assignments list"""
    try:
        # Get courses taught by this faculty
        courses = Course.objects.filter(instructor_id=request.faculty.employee_id)  # type: ignore
        course_ids = [course.id for course in courses]
        
        # Get assignments for these courses
        assignments_qs = Assignment.objects.filter(course_id__in=course_ids)  # type: ignore
        
        # Convert to JSON format
        assignments = []
        for assignment in assignments_qs:
            assignment_data = assignment.to_json()
            
            # Add submission statistics
            # In a real implementation, you would get actual submission counts
            assignment_data['submitted'] = 0
            assignment_data['total'] = 30  # Placeholder value
            
            # Get course code for this assignment
            try:
                course = Course.objects.get(id=assignment.course_id)  # type: ignore
                assignment_data['course'] = course.code
            except Course.DoesNotExist:  # type: ignore
                assignment_data['course'] = 'Unknown'
            
            assignments.append(assignment_data)
        
        return JsonResponse({'assignments': assignments})
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to fetch assignments'}, status=500)


@csrf_exempt
@faculty_required
def assignment_detail(request, assignment_id):
    """Get faculty assignment detail"""
    try:
        # Get assignment
        try:
            assignment = Assignment.objects.get(id=assignment_id)  # type: ignore
        except Assignment.DoesNotExist:  # type: ignore
            return JsonResponse({'success': False, 'message': 'Assignment not found'}, status=404)
        
        # Verify faculty teaches the course for this assignment
        try:
            course = Course.objects.get(id=assignment.course_id, instructor_id=request.faculty.employee_id)  # type: ignore
        except Course.DoesNotExist:  # type: ignore
            return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
        
        # Convert to JSON format
        assignment_data = assignment.to_json()
        
        # Add course code
        assignment_data['course'] = course.code
        
        # Add submission statistics
        assignment_data['submissions'] = 25  # Placeholder value
        assignment_data['totalStudents'] = 30  # Placeholder value
        
        return JsonResponse(assignment_data)
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to fetch assignment details'}, status=500)


@csrf_exempt
@faculty_permission_required('grade_view')
def gradebook(request, course_id):
    """Get course gradebook"""
    try:
        # Verify faculty teaches this course
        try:
            course = Course.objects.get(id=course_id, instructor_id=request.faculty.employee_id)  # type: ignore
        except Course.DoesNotExist:  # type: ignore
            return JsonResponse({'success': False, 'message': 'Course not found or access denied'}, status=404)
        
        # Get enrollments for this course
        enrollments = Enrollment.objects.filter(course_id=course_id)  # type: ignore
        
        # Get students data
        students = []
        for enrollment in enrollments:
            # In a real implementation, you would get actual student data from the User model
            student_data = {
                'id': enrollment.student_id,
                'name': f'Student {enrollment.student_id}',
                'studentId': enrollment.student_id,
                'assignments': [85, 92, 78],  # Placeholder values
                'overallGrade': 85  # Placeholder value
            }
            students.append(student_data)
        
        return JsonResponse({'students': students})
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to fetch gradebook'}, status=500)


@csrf_exempt
@faculty_permission_required('grade_edit')
def update_grade(request, grade_id):
    """Update student grade"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            
            # Get grade
            try:
                grade = Grade.objects.get(id=grade_id)  # type: ignore
            except Grade.DoesNotExist:  # type: ignore
                return JsonResponse({'success': False, 'message': 'Grade not found'}, status=404)
            
            # Verify faculty teaches the course for this grade
            try:
                course = Course.objects.get(id=grade.course_id, instructor_id=request.faculty.employee_id)  # type: ignore
            except Course.DoesNotExist:  # type: ignore
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Update grade fields
            if 'value' in data:
                grade.value = data['value']
            
            if 'letter_grade' in data:
                grade.letter_grade = data['letter_grade']
            
            if 'comments' in data:
                grade.comments = data['comments']
            
            # Save updated grade
            grade.save()
            
            return JsonResponse({'success': True, 'message': 'Grade updated successfully', 'data': grade.to_json()})
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to update grade'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
@faculty_required
def advisees_list(request):
    """Get faculty advisees list"""
    try:
        # In a real implementation, you would get advisees based on advisor-student relationships
        # For now, we'll return an empty list as a placeholder
        advisees = []
        
        return JsonResponse({'advisees': advisees})
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to fetch advisees'}, status=500)


@csrf_exempt
@faculty_required
def advisee_detail(request, student_id):
    """Get faculty advisee detail"""
    try:
        # In a real implementation, you would verify the faculty is the advisor for this student
        # and then get the student's data
        
        # For now, we'll return placeholder data
        advisee = {
            'id': student_id,
            'name': f'Student {student_id}',
            'studentId': f'S00{student_id}',
            'email': f'student{student_id}@university.edu',
            'major': 'Computer Science',
            'advisorNotes': 'Good progress',
            'gpa': 3.5,
        }
        
        return JsonResponse(advisee)
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to fetch advisee details'}, status=500)


@csrf_exempt
@faculty_required
def research_projects(request):
    """Get faculty research projects"""
    try:
        # Get research projects owned by this faculty
        projects_qs = ResearchProject.objects.filter(owner_id=request.faculty.employee_id)  # type: ignore
        
        # Convert to JSON format
        projects = [project.to_json() for project in projects_qs]
        
        return JsonResponse({'projects': projects})
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to fetch research projects'}, status=500)


@csrf_exempt
@faculty_required
def analytics(request):
    """Get faculty analytics"""
    try:
        # Get courses taught by this faculty
        courses = Course.objects.filter(instructor_id=request.faculty.employee_id)  # type: ignore
        
        # Generate placeholder analytics data
        # In a real implementation, you would calculate actual analytics from the data
        student_performance = [
            {'month': 'Jan', 'averageGrade': 85},
            {'month': 'Feb', 'averageGrade': 87},
            {'month': 'Mar', 'averageGrade': 89},
            {'month': 'Apr', 'averageGrade': 86},
        ]
        
        attendance = [
            {'month': 'Jan', 'rate': 92},
            {'month': 'Feb', 'rate': 88},
            {'month': 'Mar', 'rate': 91},
            {'month': 'Apr', 'rate': 89},
        ]
        
        data = {
            'studentPerformance': student_performance,
            'attendance': attendance
        }
        
        return JsonResponse(data)
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to fetch analytics'}, status=500)


@csrf_exempt
@faculty_required
def recordings(request):
    """Get faculty recordings"""
    try:
        # In a real implementation, you would get actual recordings data
        # For now, we'll return an empty list as a placeholder
        recordings = []
        
        return JsonResponse({'recordings': recordings})
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to fetch recordings'}, status=500)