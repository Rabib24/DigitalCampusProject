"""
Script to find Computer Science students and their IDs
"""

import os
import sys
import django

# Add project path to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Student

def find_cs_students():
    """Find students in Computer Science programs"""
    try:
        # Look for students with Computer Science in their degree program
        cs_students = Student.objects.filter(
            degree_program__icontains='Computer'
        )
        
        print("=" * 60)
        print("COMPUTER SCIENCE STUDENTS")
        print("=" * 60)
        
        if cs_students.exists():
            for student in cs_students:
                print(f"Name: {student.user.get_full_name()}")
                print(f"Student ID: {student.student_id}")
                print(f"Degree Program: {student.degree_program}")
                print("-" * 40)
        else:
            print("No Computer Science students found.")
            # Let's check all students and their programs
            all_students = Student.objects.all()
            print("\nAll Degree Programs:")
            programs = set()
            for student in all_students:
                if student.degree_program:
                    programs.add(student.degree_program)
            for program in sorted(programs):
                print(f"  - {program}")
        
        print("=" * 60)
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    find_cs_students()