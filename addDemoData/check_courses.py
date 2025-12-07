import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from courses.models import Course

def check_course_counts():
    """Check course counts by department"""
    print("Course counts by department:")
    departments = Course.objects.values_list('department', flat=True).distinct()
    for dept in departments:
        count = Course.objects.filter(department=dept).count()
        print(f"  {dept}: {count} courses")
    
    print(f"\nTotal courses in database: {Course.objects.count()}")

if __name__ == '__main__':
    check_course_counts()