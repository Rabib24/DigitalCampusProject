"""
Assign courses to faculty 40001 and create assignments for those courses
"""

import os
import sys
import django
from datetime import datetime, timedelta

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(__file__))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from courses.models import Course, Enrollment
from assignments.models import Assignment, Grade
from users.models import User, Faculty
from django.utils import timezone
import uuid

def assign_courses_to_faculty():
    """Assign courses to faculty 40001 and create assignments"""
    
    print("\n=== Assigning Courses to Faculty 40001 ===\n")
    
    # Get faculty
    try:
        faculty_user = User.objects.get(username='40001', role='faculty')
        faculty = Faculty.objects.get(user=faculty_user)
        print(f"✓ Found faculty: {faculty_user.first_name} {faculty_user.last_name}")
        print(f"  Employee ID: {faculty.employee_id}\n")
    except Exception as e:
        print(f"❌ Error getting faculty: {e}")
        return
    
    # Get all courses or first 5 courses
    all_courses = Course.objects.all()[:5]
    
    if not all_courses.exists():
        print("❌ No courses found in database")
        return
    
    print(f"Found {all_courses.count()} courses to assign\n")
    
    # Assign courses to faculty
    assigned_count = 0
    for course in all_courses:
        # Update course instructor
        course.instructor_id = faculty.employee_id
        course.save()
        print(f"✓ Assigned course: {course.code} - {course.name}")
        print(f"  Instructor ID: {course.instructor_id}")
        assigned_count += 1
        
        # Create assignments for this course
        create_assignments_for_course(course, faculty)
    
    print(f"\n✓ Total courses assigned: {assigned_count}")
    
    # Verify courses are linked to faculty
    faculty_courses = Course.objects.filter(instructor_id=faculty.employee_id)
    print(f"\n=== Verification ===")
    print(f"✓ Courses assigned to faculty {faculty.employee_id}: {faculty_courses.count()}")
    for course in faculty_courses:
        print(f"  - {course.code}: {course.name}")
        assignments = Assignment.objects.filter(course_id=course.id)
        print(f"    Assignments: {assignments.count()}")


def create_assignments_for_course(course, faculty):
    """Create sample assignments for a course"""
    
    print(f"\n  Creating assignments for {course.code}...")
    
    # Define assignment types
    assignment_types = [
        {
            'title': f'Chapter 1 Reading - {course.code}',
            'type': 'homework',
            'points': 10,
            'days_offset': 7,
        },
        {
            'title': f'Quiz 1 - {course.code}',
            'type': 'exam',
            'points': 20,
            'days_offset': 14,
        },
        {
            'title': f'Assignment 1 - {course.code}',
            'type': 'homework',
            'points': 15,
            'days_offset': 21,
        },
        {
            'title': f'Midterm Project - {course.code}',
            'type': 'project',
            'points': 50,
            'days_offset': 35,
        },
        {
            'title': f'Quiz 2 - {course.code}',
            'type': 'exam',
            'points': 20,
            'days_offset': 42,
        },
    ]
    
    # Create assignments
    for i, assignment_data in enumerate(assignment_types):
        now = timezone.now()
        due_date = now + timedelta(days=assignment_data['days_offset'])
        start_date = now - timedelta(days=1)
        
        assignment = Assignment.objects.create(
            id=f"ASSIGN-{course.id}-{i+1}-{uuid.uuid4().hex[:8]}",
            course_id=course.id,
            title=assignment_data['title'],
            description=f"{assignment_data['title']} for {course.code}: {course.name}",
            due_date=due_date,
            start_date=start_date,
            points=assignment_data['points'],
            type=assignment_data['type'],
            allow_late_submission=True,
            late_penalty=10.00,  # 10% penalty for late submissions
            max_submissions=3,
            visible_to_students=True,
            category=assignment_data['type'],
            weight=assignment_data['points'] / 100.0,
        )
        
        print(f"    ✓ {assignment.title} ({assignment.type}, {assignment.points} pts)")
        
        # Get students enrolled in this course
        enrollments = Enrollment.objects.filter(course_id=course.id)
        
        # Create grades for students
        for enrollment in enrollments[:5]:  # Grade first 5 students
            try:
                grade = Grade.objects.create(
                    id=f"GRADE-{assignment.id}-{enrollment.student_id}-{uuid.uuid4().hex[:8]}",
                    student_id=enrollment.student_id,
                    course_id=course.id,
                    assignment_id=assignment.id,
                    value=max(0, assignment_data['points'] - (i * 2)),  # Vary grades
                    max_points=assignment_data['points'],
                    letter_grade='A' if i % 2 == 0 else 'B',
                    weight=assignment_data['points'] / 100.0,
                    category=assignment_data['type'],
                    grader_id=faculty.employee_id,
                    comments='Good work' if i % 2 == 0 else 'Needs improvement',
                )
            except Exception as e:
                # Skip if grade already exists
                pass
    
    print(f"    ✓ Created {len(assignment_types)} assignments")


if __name__ == '__main__':
    assign_courses_to_faculty()
