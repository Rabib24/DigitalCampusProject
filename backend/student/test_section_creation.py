"""
Test script for automatic section creation functionality
"""
import os
import sys
import django
from django.test import TestCase
from django.utils import timezone
from courses.models import Course, Section, Enrollment
from student.models import Student
from users.models import User

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def test_section_creation():
    """Test automatic section creation functionality"""
    print("Testing automatic section creation...")
    
    # Create a test course
    course = Course.objects.create(
        id="TEST101",
        code="TEST101",
        name="Test Course",
        description="A test course for section creation",
        credits=3,
        instructor_id="INST001",
        schedule=[{"day": "Monday", "start": "09:00", "end": "10:30"}],
        students=[],
        enrollment_limit=2,  # Small limit for testing
        department="Test Department",
        start_date=timezone.now().date(),
        end_date=timezone.now().date().replace(year=timezone.now().year + 1)
    )
    print(f"Created course: {course.name}")
    
    # Create test students
    students = []
    for i in range(5):
        user = User.objects.create(
            username=f"student{i}",
            email=f"student{i}@test.edu",
            role="student"
        )
        student = Student.objects.create(
            user=user,
            student_id=f"STU{i:03d}",
            first_name=f"Student{i}",
            last_name="Test",
            degree_program="Test Program"
        )
        students.append(student)
    
    print(f"Created {len(students)} test students")
    
    # Enroll first 2 students (should fill the course)
    for i in range(2):
        student = students[i]
        course.add_student(student.student_id)
        enrollment = Enrollment.objects.create(
            id=f"ENROLL{i:03d}",
            student_id=student.student_id,
            course_id=course.id,
            status="active"
        )
        print(f"Enrolled student {student.student_id} in course")
    
    print(f"Course is now full: {course.get_student_count()}/{course.enrollment_limit}")
    
    # Try to enroll 3rd student (should trigger section creation)
    third_student = students[2]
    
    # Check if sections exist
    existing_sections = Section.objects.filter(course=course)
    print(f"Existing sections before enrollment: {existing_sections.count()}")
    
    # Simulate enrollment logic
    if course.get_student_count() >= course.enrollment_limit:
        # Check for existing sections
        if not existing_sections.exists():
            # Create first section
            from student.course_views import create_new_section
            new_section = create_new_section(course)
            if new_section:
                print(f"Created new section: {new_section}")
                # Enroll student in new section
                new_section.add_student(third_student.student_id)
                enrollment = Enrollment.objects.create(
                    id="ENROLL003",
                    student_id=third_student.student_id,
                    course_id=course.id,
                    section_id=new_section.id,
                    status="active"
                )
                print(f"Enrolled student {third_student.student_id} in new section {new_section.section_number}")
            else:
                print("Failed to create new section")
        else:
            print("Sections already exist")
    
    # Verify section creation
    sections_after = Section.objects.filter(course=course)
    print(f"Sections after enrollment attempt: {sections_after.count()}")
    
    if sections_after.exists():
        section = sections_after.first()
        print(f"Section {section.section_number} has {section.get_student_count()} students")
        print(f"Section students: {section.students}")
    
    # Clean up
    for student in students:
        student.user.delete()
        student.delete()
    
    for section in sections_after:
        section.delete()
    
    course.delete()
    
    print("Test completed successfully!")

if __name__ == "__main__":
    test_section_creation()