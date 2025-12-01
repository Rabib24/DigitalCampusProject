import os
import django
import sys

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from courses.models import Course
from users.models import User

def check_faculty_courses():
    """Check if faculty user 2221002 has courses assigned"""
    try:
        # Get the faculty user
        user = User.objects.get(username='2221002')
        print(f"Found faculty user: {user.username}")
        
        # Get courses taught by this faculty
        courses = Course.objects.filter(instructor_id=user.id)
        print(f"Number of courses taught by {user.username}: {courses.count()}")
        
        # Print course details
        for course in courses:
            print(f"- {course.code}: {course.name}")
            
        if courses.count() == 0:
            print("No courses found for this faculty member.")
            print("You may need to run the demo data script to generate courses.")
            
    except User.DoesNotExist:
        print("Faculty user 2221002 not found")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_faculty_courses()