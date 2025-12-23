"""
Assign courses and assignments to faculty members for testing
"""

import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(__file__))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User, Faculty
from courses.models import Course
from assignments.models import Assignment

def assign_data_to_faculty():
    """Assign existing courses to faculty members"""
    
    print("\n=== Assigning Data to Faculty ===\n")
    
    # Get all faculty members
    faculty_members = Faculty.objects.all()[:5]  # First 5 faculty
    
    if not faculty_members:
        print("❌ No faculty members found")
        return
    
    print(f"Found {faculty_members.count()} faculty members")
    
    # Get all courses
    all_courses = list(Course.objects.all())
    
    if not all_courses:
        print("❌ No courses found in database")
        return
    
    print(f"Found {len(all_courses)} courses in database")
    
    # Distribute courses among faculty
    courses_per_faculty = len(all_courses) // len(faculty_members)
    if courses_per_faculty == 0:
        courses_per_faculty = 1
    
    course_index = 0
    for faculty in faculty_members:
        # Assign courses to this faculty
        assigned_count = 0
        for i in range(courses_per_faculty):
            if course_index >= len(all_courses):
                break
            
            course = all_courses[course_index]
            course.instructor_id = faculty.employee_id
            course.save()
            assigned_count += 1
            course_index += 1
        
        print(f"✓ Assigned {assigned_count} courses to {faculty.user.first_name} {faculty.user.last_name} ({faculty.employee_id})")
    
    print(f"\n✓ Total courses assigned: {course_index}")
    print("\n=== Assignment Complete ===\n")


if __name__ == '__main__':
    assign_data_to_faculty()
