"""
Test script for faculty course management features
"""
import os
import sys
import django
import json
from django.test import TestCase, Client
from django.contrib.auth.models import User
from django.utils import timezone
import uuid

# Add the project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Faculty, Student
from courses.models import Course, Enrollment

class TestFacultyEnrollmentFeatures(TestCase):
    def setUp(self):
        """Set up test data"""
        # Create test users
        self.faculty_user = User.objects.create_user(
            username='faculty_test',
            password='testpass123'
        )
        self.faculty = Faculty.objects.create(
            user=self.faculty_user,
            employee_id='FAC001',
            department='Computer Science',
            title='Professor'
        )
        
        self.student_user = User.objects.create_user(
            username='student_test',
            password='testpass123'
        )
        self.student = Student.objects.create(
            user=self.student_user,
            student_id='STU001',
            major='Computer Science'
        )
        
        # Create test course
        self.course = Course.objects.create(
            id=str(uuid.uuid4()),
            code='CS101',
            name='Introduction to Computer Science',
            department='Computer Science',
            credits=3,
            enrollment_limit=1,
            instructor_id=self.faculty.employee_id
        )
        
        # Create test client
        self.client = Client()
        
    def test_manage_course_enrollment_add_student(self):
        """Test adding a student to a course"""
        data = {
            'action': 'add',
            'student_id': self.student.student_id
        }
        
        response = self.client.post(
            f'/api/faculty/courses/{self.course.id}/enrollment/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['data']['status'], 'active')
        
    def test_manage_course_enrollment_add_to_waitlist(self):
        """Test adding a student to waitlist when course is full"""
        # First enroll a student to fill the course
        Enrollment.objects.create(
            id=str(uuid.uuid4()),
            student=self.student,
            course=self.course,
            status='active'
        )
        
        # Create another student
        student2_user = User.objects.create_user(
            username='student2_test',
            password='testpass123'
        )
        student2 = Student.objects.create(
            user=student2_user,
            student_id='STU002',
            major='Computer Science'
        )
        
        # Try to add second student to full course
        data = {
            'action': 'add',
            'student_id': student2.student_id
        }
        
        response = self.client.post(
            f'/api/faculty/courses/{self.course.id}/enrollment/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('waitlist', response_data['message'])
        
    def test_get_course_roster(self):
        """Test getting course roster"""
        # Add a student to the course
        Enrollment.objects.create(
            id=str(uuid.uuid4()),
            student=self.student,
            course=self.course,
            status='active'
        )
        
        response = self.client.get(f'/api/faculty/courses/{self.course.id}/roster/')
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertIn('results', response_data)
        self.assertGreater(len(response_data['results']), 0)
        
    def test_get_course_waitlist(self):
        """Test getting course waitlist"""
        # Add a student to the waitlist
        Enrollment.objects.create(
            id=str(uuid.uuid4()),
            student=self.student,
            course=self.course,
            status='waitlisted'
        )
        
        response = self.client.get(f'/api/faculty/courses/{self.course.id}/waitlist/')
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertIn('results', response_data)
        self.assertGreater(len(response_data['results']), 0)

if __name__ == '__main__':
    import unittest
    unittest.main()