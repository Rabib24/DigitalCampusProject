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
from student.course_views import get_student_assignments
from users.models import User

def debug_student_assignments():
    try:
        # Get a student user
        student_user = User.objects.filter(role='student').first()
        if not student_user:
            print("No student users found in database")
            return
            
        print(f"Testing with student user: {student_user.username}")
        
        # Create JWT token
        payload = {
            'user_id': str(student_user.id),
            'exp': 9999999999  # Far future expiration
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        
        # Test student assignments endpoint
        print("Testing student assignments endpoint...")
        request = RequestFactory().get('/student/assignments/')
        request.META['HTTP_AUTHORIZATION'] = f'Bearer {token}'
        
        response = get_student_assignments(request)
        print(f"Status: {response.status_code}")
        print(f"Content: {response.content.decode()}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_student_assignments()