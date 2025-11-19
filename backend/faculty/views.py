from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from users.models import User
import json


def check_faculty_role(request):
    """Check if the authenticated user has faculty role"""
    # In a real implementation, you would extract user info from JWT token
    # For now, we'll return True to allow access
    return True


@csrf_exempt
def dashboard_overview(request):
    """Get faculty dashboard overview"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    # Mock data - in a real app, this would come from the database
    data = {
        'activeClasses': 3,
        'totalStudents': 85,
        'pendingGrades': 12,
        'advisedStudents': 15,
        'attendanceRate': 87,
        'pendingAssignments': [
            {'id': 1, 'title': 'Midterm Exam', 'course': 'CS101'},
            {'id': 2, 'title': 'Project Report', 'course': 'CS201'},
            {'id': 3, 'title': 'Lab Assignment', 'course': 'CS101'},
        ]
    }
    
    return JsonResponse(data)


@csrf_exempt
def courses_list(request):
    """Get faculty courses list"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    # Mock data
    courses = [
        {'id': 1, 'code': 'CS101', 'name': 'Introduction to Computer Science', 'semester': 'Fall 2023', 'studentCount': 30},
        {'id': 2, 'code': 'CS201', 'name': 'Data Structures', 'semester': 'Fall 2023', 'studentCount': 25},
        {'id': 3, 'code': 'CS301', 'name': 'Algorithms', 'semester': 'Spring 2024', 'studentCount': 30},
    ]
    
    return JsonResponse({'courses': courses})


@csrf_exempt
def course_detail(request, course_id):
    """Get faculty course detail"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    # Mock data
    course = {
        'id': course_id,
        'code': f'CS{course_id}01',
        'name': f'Course {course_id}',
        'semester': 'Fall 2023',
        'description': 'Course description',
        'studentCount': 30,
        'syllabus': 'Syllabus content',
    }
    
    return JsonResponse(course)


@csrf_exempt
def assignments_list(request):
    """Get faculty assignments list"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    # Mock data
    assignments = [
        {'id': 1, 'title': 'Midterm Exam', 'course': 'CS101', 'dueDate': '2023-10-15', 'submitted': 25, 'total': 30},
        {'id': 2, 'title': 'Project Report', 'course': 'CS201', 'dueDate': '2023-10-20', 'submitted': 20, 'total': 25},
        {'id': 3, 'title': 'Lab Assignment', 'course': 'CS101', 'dueDate': '2023-10-10', 'submitted': 28, 'total': 30},
    ]
    
    return JsonResponse({'assignments': assignments})


@csrf_exempt
def assignment_detail(request, assignment_id):
    """Get faculty assignment detail"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    # Mock data
    assignment = {
        'id': assignment_id,
        'title': f'Assignment {assignment_id}',
        'course': 'CS101',
        'description': 'Assignment description',
        'dueDate': '2023-10-15',
        'totalPoints': 100,
        'submissions': 25,
        'totalStudents': 30,
    }
    
    return JsonResponse(assignment)


@csrf_exempt
def gradebook(request, course_id):
    """Get course gradebook"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    # Mock data
    students = [
        {'id': 1, 'name': 'John Doe', 'studentId': 'S001', 'assignments': [85, 92, 78], 'overallGrade': 85},
        {'id': 2, 'name': 'Jane Smith', 'studentId': 'S002', 'assignments': [90, 88, 95], 'overallGrade': 91},
        {'id': 3, 'name': 'Bob Johnson', 'studentId': 'S003', 'assignments': [76, 82, 79], 'overallGrade': 79},
    ]
    
    return JsonResponse({'students': students})


@csrf_exempt
def update_grade(request, grade_id):
    """Update student grade"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            # In a real app, update the grade in the database
            return JsonResponse({'success': True, 'message': 'Grade updated successfully'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to update grade'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def advisees_list(request):
    """Get faculty advisees list"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    # Mock data
    advisees = [
        {'id': 1, 'name': 'John Doe', 'studentId': 'S001', 'email': 'john.doe@university.edu', 'major': 'Computer Science'},
        {'id': 2, 'name': 'Jane Smith', 'studentId': 'S002', 'email': 'jane.smith@university.edu', 'major': 'Mathematics'},
        {'id': 3, 'name': 'Bob Johnson', 'studentId': 'S003', 'email': 'bob.johnson@university.edu', 'major': 'Physics'},
    ]
    
    return JsonResponse({'advisees': advisees})


@csrf_exempt
def advisee_detail(request, student_id):
    """Get faculty advisee detail"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    # Mock data
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


@csrf_exempt
def research_projects(request):
    """Get faculty research projects"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    # Mock data
    projects = [
        {'id': 1, 'title': 'AI in Education', 'status': 'Active', 'startDate': '2023-01-01', 'endDate': '2024-12-31'},
        {'id': 2, 'title': 'Data Security', 'status': 'Completed', 'startDate': '2022-01-01', 'endDate': '2022-12-31'},
        {'id': 3, 'title': 'Machine Learning', 'status': 'Active', 'startDate': '2023-06-01', 'endDate': '2024-06-01'},
    ]
    
    return JsonResponse({'projects': projects})


@csrf_exempt
def analytics(request):
    """Get faculty analytics"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    # Mock data
    data = {
        'studentPerformance': [
            {'month': 'Jan', 'averageGrade': 85},
            {'month': 'Feb', 'averageGrade': 87},
            {'month': 'Mar', 'averageGrade': 89},
            {'month': 'Apr', 'averageGrade': 86},
        ],
        'attendance': [
            {'month': 'Jan', 'rate': 92},
            {'month': 'Feb', 'rate': 88},
            {'month': 'Mar', 'rate': 91},
            {'month': 'Apr', 'rate': 89},
        ]
    }
    
    return JsonResponse(data)


@csrf_exempt
def recordings(request):
    """Get faculty recordings"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    # Mock data
    recordings = [
        {'id': 1, 'title': 'Lecture 1 - Introduction', 'date': '2023-09-01', 'duration': '55:30', 'course': 'CS101'},
        {'id': 2, 'title': 'Lecture 2 - Data Types', 'date': '2023-09-03', 'duration': '58:15', 'course': 'CS101'},
        {'id': 3, 'title': 'Lecture 1 - Arrays', 'date': '2023-09-05', 'duration': '52:45', 'course': 'CS201'},
    ]
    
    return JsonResponse({'recordings': recordings})