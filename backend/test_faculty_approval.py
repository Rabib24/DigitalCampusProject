"""
Test script for faculty approval workflow
"""

import os
import sys
import django
from django.test import TestCase
from django.utils import timezone
import uuid

# Setup Django
sys.path.append('h:/Systemproject/DigitalCampus/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User, Student, Faculty
from courses.models import Course
from student.models import FacultyApprovalRequest

def test_faculty_approval_workflow():
    """Test the faculty approval workflow"""
    print("Testing faculty approval workflow...")
    
    # Create test users if they don't exist
    try:
        student_user = User.objects.get(username='test_student')
    except User.DoesNotExist:
        student_user = User.objects.create_user(
            username='test_student',
            email='test_student@university.edu',
            password='testpass123',
            first_name='Test',
            last_name='Student',
            role='student'
        )
    
    try:
        student = Student.objects.get(user=student_user)
    except Student.DoesNotExist:
        student = Student.objects.create(
            user=student_user,
            student_id='STU_TEST001',
            degree_program='Computer Science',
            year='Sophomore',
            cumulative_gpa=3.5
        )
    
    try:
        faculty_user = User.objects.get(username='test_faculty')
    except User.DoesNotExist:
        faculty_user = User.objects.create_user(
            username='test_faculty',
            email='test_faculty@university.edu',
            password='testpass123',
            first_name='Test',
            last_name='Faculty',
            role='faculty'
        )
    
    try:
        faculty = Faculty.objects.get(user=faculty_user)
    except Faculty.DoesNotExist:
        faculty = Faculty.objects.create(
            user=faculty_user,
            employee_id='FAC_TEST001',
            department='Computer Science',
            title='Assistant Professor'
        )
    
    # Create a test course if it doesn't exist
    try:
        course = Course.objects.get(code='CS101')
    except Course.DoesNotExist:
        course = Course.objects.create(
            id='CS101-001',
            code='CS101',
            name='Introduction to Computer Science',
            description='Basic concepts of computer science',
            credits=3,
            instructor_id=faculty.employee_id,
            department='Computer Science',
            enrollment_limit=30,
            start_date=timezone.now().date(),
            end_date=timezone.now().date().replace(year=timezone.now().year + 1)
        )
    
    # Create a faculty approval request
    approval_request = FacultyApprovalRequest.objects.create(
        id=str(uuid.uuid4()),
        student=student,
        course=course,
        faculty=faculty,
        approval_type='prerequisite_override',
        reason='Student has equivalent experience from prior coursework',
        status='pending'
    )
    
    print(f"Created approval request: {approval_request}")
    
    # Test approving the request
    approval_request.approve(faculty_user, 'Approved with conditions')
    print(f"Approved request: {approval_request.status}")
    
    # Test rejecting a new request
    rejection_request = FacultyApprovalRequest.objects.create(
        id=str(uuid.uuid4()),
        student=student,
        course=course,
        faculty=faculty,
        approval_type='capacity_override',
        reason='Course is full but student needs to enroll',
        status='pending'
    )
    
    rejection_request.reject(faculty_user, 'Course capacity cannot be exceeded')
    print(f"Rejected request: {rejection_request.status}")
    
    # Test requesting revision
    revision_request = FacultyApprovalRequest.objects.create(
        id=str(uuid.uuid4()),
        student=student,
        course=course,
        faculty=faculty,
        approval_type='academic_plan_exception',
        reason='Student requests exception to academic plan',
        status='pending'
    )
    
    revision_request.request_revision(faculty_user, 'Please provide more details about the academic plan exception')
    print(f"Revision requested for: {revision_request.status}")
    
    print("Faculty approval workflow test completed successfully!")

if __name__ == '__main__':
    test_faculty_approval_workflow()