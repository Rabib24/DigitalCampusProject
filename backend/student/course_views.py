from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json


@csrf_exempt
def get_available_courses(request):
    """Get all available courses for enrollment"""
    if request.method == 'GET':
        # Return mock data for now
        courses = [
            {
                'id': 'CS101',
                'name': 'Introduction to Computer Science',
                'credits': 3,
                'department': 'Computer Science',
                'instructor': 'Dr. Smith',
                'schedule': 'MWF 10:00-11:00',
                'available_seats': 25,
                'total_seats': 30
            },
            {
                'id': 'MATH201',
                'name': 'Calculus II',
                'credits': 4,
                'department': 'Mathematics',
                'instructor': 'Prof. Johnson',
                'schedule': 'TTH 14:00-15:30',
                'available_seats': 10,
                'total_seats': 25
            }
        ]
        
        return JsonResponse({'courses': courses})
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def search_courses(request):
    """Search for courses by keyword"""
    if request.method == 'GET':
        # Get search query from request
        query = request.GET.get('query', '')
        
        # Return mock data for now
        courses = [
            {
                'id': 'CS101',
                'name': 'Introduction to Computer Science',
                'credits': 3,
                'department': 'Computer Science',
                'instructor': 'Dr. Smith'
            }
        ]
        
        return JsonResponse({'courses': courses})
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def get_recommended_courses_view(request):
    """Get recommended courses for student"""
    if request.method == 'GET':
        # Return mock data for now
        courses = [
            {
                'id': 'CS201',
                'name': 'Data Structures',
                'credits': 3,
                'department': 'Computer Science',
                'prerequisites': ['CS101']
            }
        ]
        
        return JsonResponse({'courses': courses})
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def enroll_in_course(request, course_id):
    """Enroll student in a course"""
    if request.method == 'POST':
        # Return mock data for now
        return JsonResponse({
            'success': True,
            'message': f'Successfully enrolled in course {course_id}',
            'enrollment': {
                'course_id': course_id,
                'student_id': 'STU001',
                'enrollment_date': timezone.now().isoformat(),
                'status': 'enrolled'
            }
        })
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def drop_course(request, course_id):
    """Drop a course enrollment"""
    if request.method == 'POST':
        # Return mock data for now
        return JsonResponse({
            'success': True,
            'message': f'Successfully dropped course {course_id}'
        })
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def get_waitlisted_courses(request):
    """Get student's waitlisted courses"""
    if request.method == 'GET':
        # Return mock data for now
        waitlisted_courses = [
            {
                'course_id': 'CS301',
                'course_name': 'Algorithms',
                'waitlist_position': 3,
                'waitlist_date': timezone.now().isoformat()
            }
        ]
        
        return JsonResponse({'waitlisted_courses': waitlisted_courses})
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def get_student_enrollments(request):
    """Get all student enrollments"""
    if request.method == 'GET':
        # Return mock data for now
        enrollments = [
            {
                'course_id': 'CS101',
                'course_name': 'Introduction to Computer Science',
                'credits': 3,
                'grade': 'A',
                'status': 'completed'
            },
            {
                'course_id': 'MATH201',
                'course_name': 'Calculus II',
                'credits': 4,
                'grade': None,
                'status': 'in_progress'
            }
        ]
        
        return JsonResponse({'enrollments': enrollments})
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def get_cart(request):
    """Get student's course cart"""
    if request.method == 'GET':
        # Return mock data for now
        cart_items = [
            {
                'course_id': 'PHYS101',
                'course_name': 'Physics I',
                'credits': 4,
                'added_date': timezone.now().isoformat()
            }
        ]
        
        return JsonResponse({'cart_items': cart_items})
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def add_to_cart(request, course_id):
    """Add course to student's cart"""
    if request.method == 'POST':
        # Return mock data for now
        return JsonResponse({
            'success': True,
            'message': f'Course {course_id} added to cart'
        })
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def remove_from_cart(request, course_id):
    """Remove course from student's cart"""
    if request.method == 'POST':
        # Return mock data for now
        return JsonResponse({
            'success': True,
            'message': f'Course {course_id} removed from cart'
        })
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def clear_cart(request):
    """Clear student's course cart"""
    if request.method == 'POST':
        # Return mock data for now
        return JsonResponse({
            'success': True,
            'message': 'Cart cleared successfully'
        })
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def enroll_from_cart(request):
    """Enroll student in all courses in cart"""
    if request.method == 'POST':
        # Return mock data for now
        return JsonResponse({
            'success': True,
            'message': 'Successfully enrolled in all courses from cart',
            'enrollments': [
                {
                    'course_id': 'PHYS101',
                    'status': 'enrolled'
                }
            ]
        })
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)