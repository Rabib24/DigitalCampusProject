import os
import sys
import django
import json

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from courses.models import Course, Enrollment
from users.models import User, Student
import uuid

def create_sample_courses():
    """Create sample courses for testing"""
    
    # Clear existing courses and enrollments
    Course.objects.all().delete()
    Enrollment.objects.all().delete()
    
    # Sample schedule data
    sample_schedule = [
        {"day": "Monday", "start": "09:00", "end": "10:30"},
        {"day": "Wednesday", "start": "09:00", "end": "10:30"}
    ]
    
    # Create sample courses
    courses_data = [
        {
            "id": str(uuid.uuid4()),
            "code": "CS-101",
            "name": "Introduction to Computer Science",
            "description": "Fundamental concepts of computer science and programming.",
            "credits": 3,
            "instructor_id": "FAC001",
            "schedule": sample_schedule,
            "department": "Computer Science",
            "enrollment_limit": 30,
            "start_date": "2025-09-01",
            "end_date": "2025-12-15"
        },
        {
            "id": str(uuid.uuid4()),
            "code": "MA-201",
            "name": "Calculus II",
            "description": "Advanced calculus topics including integration techniques.",
            "credits": 4,
            "instructor_id": "FAC002",
            "schedule": [
                {"day": "Tuesday", "start": "11:00", "end": "12:30"},
                {"day": "Thursday", "start": "11:00", "end": "12:30"}
            ],
            "department": "Mathematics",
            "enrollment_limit": 25,
            "start_date": "2025-09-01",
            "end_date": "2025-12-15"
        },
        {
            "id": str(uuid.uuid4()),
            "code": "PH-102",
            "name": "Physics II",
            "description": "Electricity and magnetism fundamentals.",
            "credits": 4,
            "instructor_id": "FAC003",
            "schedule": [
                {"day": "Monday", "start": "14:00", "end": "15:30"},
                {"day": "Wednesday", "start": "14:00", "end": "15:30"},
                {"day": "Friday", "start": "14:00", "end": "15:30"}
            ],
            "department": "Physics",
            "enrollment_limit": 20,
            "start_date": "2025-09-01",
            "end_date": "2025-12-15"
        },
        {
            "id": str(uuid.uuid4()),
            "code": "EN-101",
            "name": "English Composition",
            "description": "Writing and composition skills development.",
            "credits": 3,
            "instructor_id": "FAC004",
            "schedule": [
                {"day": "Tuesday", "start": "09:00", "end": "10:30"},
                {"day": "Thursday", "start": "09:00", "end": "10:30"}
            ],
            "department": "English",
            "enrollment_limit": 35,
            "start_date": "2025-09-01",
            "end_date": "2025-12-15"
        }
    ]
    
    # Create courses in database
    courses = []
    for course_data in courses_data:
        course = Course(**course_data)
        course.save()
        courses.append(course)
        print(f"Created course: {course.code} - {course.name}")
    
    # Create sample enrollments for a test student
    try:
        # Get or create a test student
        user, created = User.objects.get_or_create(
            username="teststudent",
            defaults={
                "first_name": "Test",
                "last_name": "Student",
                "email": "teststudent@university.edu",
                "role": "student"
            }
        )
        
        if created:
            user.set_password("DigitalIUB123")
            user.save()
            print("Created test user")
        
        # Get or create student profile
        student, created = Student.objects.get_or_create(
            user=user,
            defaults={
                "student_id": "STU001",
                "degree_program": "Computer Science",
                "cumulative_gpa": 3.5
            }
        )
        
        if created:
            print("Created student profile")
        
        # Enroll student in some courses
        for i, course in enumerate(courses[:3]):  # Enroll in first 3 courses
            enrollment = Enrollment(
                id=str(uuid.uuid4()),
                student_id=student.student_id,
                course_id=course.id,
                status="active"
            )
            enrollment.save()
            course.add_student(student.student_id)
            print(f"Enrolled student in {course.code}")
            
    except Exception as e:
        print(f"Error creating enrollments: {e}")
    
    print("Sample courses and enrollments created successfully!")

if __name__ == "__main__":
    create_sample_courses()