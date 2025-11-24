#!/usr/bin/env python
import os
import sys
import django
from django.test import RequestFactory

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from courses.models import Course
from faculty.views import gradebook

def test_gradebook_access():
    """Test gradebook access for faculty user"""
    try:
        # Get the faculty user
        user = User.objects.get(username='2221002')
        print(f"Found user: {user.username} (ID: {user.id})")
        
        # Get courses taught by this faculty
        courses = Course.objects.filter(instructor_id=user.faculty.employee_id)
        print(f"Faculty teaches {courses.count()} courses")
        
        if courses.count() == 0:
            print("No courses found for this faculty member")
            return
            
        # Test accessing gradebook for the first course
        course = courses.first()
        print(f"Testing gradebook access for course: {course.code} - {course.name}")
        
        # Create a mock request
        factory = RequestFactory()
        request = factory.get(f'/faculty/courses/{course.id}/gradebook/')
        request.user = user
        request.faculty = user.faculty
        
        # Call the gradebook view
        response = gradebook(request, course.id)
        print(f"Gradebook response status: {response.status_code}")
        print(f"Response content: {response.content.decode('utf-8')}")
        
    except User.DoesNotExist:
        print("User not found")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_gradebook_access()