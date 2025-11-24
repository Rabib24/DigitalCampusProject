#!/usr/bin/env python
"""
Setup script to prepare faculty dashboard for testing
"""
import os
import django
import uuid
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User, Faculty
from courses.models import Course
from assignments.models import Assignment
from permissions.models import Permission, UserPermission

def setup_faculty_dashboard_test():
    """
    Setup test data for faculty dashboard
    """
    print("=== Setting up faculty dashboard test data ===")
    
    # Get test faculty user
    try:
        user = User.objects.get(username='testfaculty')
        faculty = Faculty.objects.get(user=user)
        print(f"Found faculty user: {user.username}")
    except User.DoesNotExist:
        print("Test faculty user not found. Please run setup_test_data.py first.")
        return
    except Faculty.DoesNotExist:
        print("Faculty profile not found for test user.")
        return
    
    # Create courses if they don't exist
    courses_count = Course.objects.filter(instructor_id=faculty.employee_id).count()
    if courses_count == 0:
        print("Creating test courses...")
        Course.objects.create(
            id=str(uuid.uuid4()),
            code='CS101',
            name='Introduction to Computer Science',
            instructor_id=faculty.employee_id,
            credits=3,
            description='Basic concepts of computer science',
            enrollment_limit=30,
            department='Computer Science',
            start_date=date(2023, 9, 1),
            end_date=date(2023, 12, 15)
        )
        
        Course.objects.create(
            id=str(uuid.uuid4()),
            code='CS201',
            name='Data Structures',
            instructor_id=faculty.employee_id,
            credits=4,
            description='Advanced data structures and algorithms',
            enrollment_limit=25,
            department='Computer Science',
            start_date=date(2023, 9, 1),
            end_date=date(2023, 12, 15)
        )
        print("Courses created successfully!")
    else:
        print(f"Found {courses_count} existing courses for faculty.")
    
    # Create assignments if they don't exist
    courses = Course.objects.filter(instructor_id=faculty.employee_id)
    assignments_count = 0
    for course in courses:
        assignments_count += Assignment.objects.filter(course_id=course.id).count()
    
    if assignments_count == 0:
        print("Creating test assignments...")
        for course in courses:
            # Create 2 assignments per course
            Assignment.objects.create(
                id=str(uuid.uuid4()),
                course_id=course.id,
                title=f'{course.code} - Assignment 1',
                description=f'First assignment for {course.name}',
                due_date=date.today() + timedelta(days=7),
                points=100,
                type='homework',
                start_date=date.today(),
                allow_late_submission=True,
                late_penalty=10.0,
                max_submissions=1,
                visible_to_students=True,
                category='homework',
                weight=1.0
            )
            
            Assignment.objects.create(
                id=str(uuid.uuid4()),
                course_id=course.id,
                title=f'{course.code} - Assignment 2',
                description=f'Second assignment for {course.name}',
                due_date=date.today() + timedelta(days=14),
                points=100,
                type='homework',
                start_date=date.today(),
                allow_late_submission=True,
                late_penalty=10.0,
                max_submissions=1,
                visible_to_students=True,
                category='homework',
                weight=1.0
            )
        print("Assignments created successfully!")
    else:
        print(f"Found {assignments_count} existing assignments for faculty.")
    
    # Grant required permissions
    print("Setting up permissions...")
    try:
        permission = Permission.objects.get(codename='course_view')
    except Permission.DoesNotExist:
        permission = Permission.objects.create(
            id=str(uuid.uuid4()),
            name='View Courses',
            codename='course_view',
            category='course'
        )
    
    try:
        user_permission = UserPermission.objects.get(user=user, permission=permission)
        print("Permission already granted.")
    except UserPermission.DoesNotExist:
        user_permission = UserPermission.objects.create(
            id=str(uuid.uuid4()),
            user=user,
            permission=permission,
            scope={'department': faculty.department}
        )
        print("Permission granted successfully!")
    
    print("\n=== Faculty dashboard test data setup complete ===")
    print("Faculty can now access the dashboard with the following credentials:")
    print(f"  Username: {user.username}")
    print(f"  Password: testpass123")

if __name__ == "__main__":
    setup_faculty_dashboard_test()