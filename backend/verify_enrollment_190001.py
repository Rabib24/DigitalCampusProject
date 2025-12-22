"""
Script to verify enrollment for student 190001
"""

import os
import sys
import django

# Add project path to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from courses.models import Enrollment
from users.models import Student

def verify_enrollment():
    """Verify the enrollment for student 190001"""
    try:
        student = Student.objects.get(student_id='190001')
        enrollments = Enrollment.objects.filter(student_id='190001')
        
        print("=" * 60)
        print("ENROLLMENT VERIFICATION FOR STUDENT 190001")
        print("=" * 60)
        print(f"Student: {student.user.get_full_name()}")
        print(f"Student ID: {student.student_id}")
        print(f"Degree Program: {student.degree_program}")
        print(f"Total Enrollments: {enrollments.count()}")
        print("-" * 60)
        
        for enrollment in enrollments:
            print(f"Course ID: {enrollment.course_id}")
            print(f"  Status: {enrollment.status}")
            print(f"  Grade: {enrollment.grade}")
            print(f"  Enrollment Date: {enrollment.enrollment_date}")
            print("-" * 30)
            
        print("=" * 60)
        print("VERIFICATION COMPLETE")
        print("=" * 60)
        
    except Student.DoesNotExist:
        print("Student 190001 not found!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    verify_enrollment()