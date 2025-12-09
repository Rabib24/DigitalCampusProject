import os
import sys
import django
from django.conf import settings

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

import jwt
from django.test import RequestFactory
from student.course_views import get_student_courses, get_student_assignments
from faculty.views import courses_list, assignments_list
from users.models import User

def test_dashboard_endpoints():
    try:
        # Get a student user
        student_user = User.objects.filter(role='student').first()
        if not student_user:
            print("No student users found in database")
            return
            
        print(f"Testing with student user: {student_user.username}")
        
        # Get a faculty user
        faculty_user = User.objects.filter(role='faculty').first()
        if not faculty_user:
            print("No faculty users found in database")
            return
            
        print(f"Testing with faculty user: {faculty_user.username}")
        
        # Create JWT tokens
        student_payload = {
            'user_id': str(student_user.id),
            'exp': 9999999999  # Far future expiration
        }
        student_token = jwt.encode(student_payload, settings.SECRET_KEY, algorithm='HS256')
        
        faculty_payload = {
            'user_id': str(faculty_user.id),
            'exp': 9999999999  # Far future expiration
        }
        faculty_token = jwt.encode(faculty_payload, settings.SECRET_KEY, algorithm='HS256')
        
        # Test student courses endpoint
        print("\nTesting student courses endpoint...")
        request = RequestFactory().get('/student/courses/')
        request.META['HTTP_AUTHORIZATION'] = f'Bearer {student_token}'
        
        response = get_student_courses(request)
        print(f"Student courses endpoint status: {response.status_code}")
        print(f"Student courses endpoint content length: {len(response.content)}")
        
        # Test student assignments endpoint
        print("\nTesting student assignments endpoint...")
        request = RequestFactory().get('/student/assignments/')
        request.META['HTTP_AUTHORIZATION'] = f'Bearer {student_token}'
        
        response = get_student_assignments(request)
        print(f"Student assignments endpoint status: {response.status_code}")
        print(f"Student assignments endpoint content length: {len(response.content)}")
        
        # Test faculty courses endpoint
        print("\nTesting faculty courses endpoint...")
        request = RequestFactory().get('/faculty/courses/')
        request.META['HTTP_AUTHORIZATION'] = f'Bearer {faculty_token}'
        
        response = courses_list(request)
        print(f"Faculty courses endpoint status: {response.status_code}")
        print(f"Faculty courses endpoint content length: {len(response.content)}")
        
        # Test faculty assignments endpoint
        print("\nTesting faculty assignments endpoint...")
        request = RequestFactory().get('/faculty/assignments/')
        request.META['HTTP_AUTHORIZATION'] = f'Bearer {faculty_token}'
        
        response = assignments_list(request)
        print(f"Faculty assignments endpoint status: {response.status_code}")
        print(f"Faculty assignments endpoint content length: {len(response.content)}")
        
    except Exception as e:
        print(f"Error during test: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_dashboard_endpoints()