import os
import sys
import django
from django.conf import settings

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from courses.models import Course

def check_all_courses():
    try:
        courses = Course.objects.all()
        print(f"Total courses in database: {courses.count()}")
        
        if courses.count() > 0:
            print("\nCourse List:")
            print("-" * 80)
            for course in courses:
                print(f"ID: {course.id}")
                print(f"Code: {course.code}")
                print(f"Name: {course.name}")
                print(f"Department: {course.department}")
                print(f"Credits: {course.credits}")
                print(f"Enrollment Limit: {course.enrollment_limit}")
                print(f"Schedule: {course.schedule}")
                print("-" * 80)
        else:
            print("No courses found in database")
            
    except Exception as e:
        print(f"Error checking courses: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_all_courses()