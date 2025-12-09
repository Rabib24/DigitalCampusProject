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
from student.views import student_grades, student_grade_stats
from users.models import User, Student
from courses.models import Course, Enrollment
from assignments.models import Grade

def test_student_grades_endpoints():
    try:
        # Get a student user
        student_user = User.objects.filter(role='student').first()
        if not student_user:
            print("No student users found in database")
            return
            
        print(f"Testing with user: {student_user.username}")
        
        # Create a JWT token for the student
        payload = {
            'user_id': str(student_user.id),
            'exp': 9999999999  # Far future expiration
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        
        # Test student grades endpoint
        print("Testing student grades endpoint...")
        request = RequestFactory().get('/student/grades/')
        request.META['HTTP_AUTHORIZATION'] = f'Bearer {token}'
        
        response = student_grades(request)
        print(f"Grades endpoint status: {response.status_code}")
        print(f"Grades endpoint content: {response.content.decode()}")
        
        # Test student grade stats endpoint
        print("Testing student grade stats endpoint...")
        request = RequestFactory().get('/student/grades/stats/')
        request.META['HTTP_AUTHORIZATION'] = f'Bearer {token}'
        
        response = student_grade_stats(request)
        print(f"Grade stats endpoint status: {response.status_code}")
        print(f"Grade stats endpoint content: {response.content.decode()}")
        
    except Exception as e:
        print(f"Error during test: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_student_grades_endpoints()