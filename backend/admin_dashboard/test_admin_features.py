"""
Test script for administrative course management features
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

from users.models import Admin, Faculty, Student
from courses.models import Course, Enrollment
from .models import EnrollmentOverrideRequest

class TestAdminFeatures(TestCase):
    def setUp(self):
        """Set up test data"""
        # Create test users
        self.admin_user = User.objects.create_user(
            username='admin_test',
            password='testpass123'
        )
        self.admin = Admin.objects.create(
            user=self.admin_user,
            employee_id='ADM001'
        )
        
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
            enrollment_limit=30
        )
        
        # Create test client
        self.client = Client()
        
    def test_create_enrollment_override_request(self):
        """Test creating an enrollment override request"""
        data = {
            'student_id': self.student.student_id,
            'course_id': self.course.id,
            'request_type': 'prerequisite_override',
            'reason': 'Student has equivalent experience'
        }
        
        response = self.client.post(
            '/api/admin/enrollment/overrides/create/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['data']['request_type'], 'prerequisite_override')
        
    def test_get_pending_override_requests(self):
        """Test getting pending enrollment override requests"""
        # Create a test override request
        override_request = EnrollmentOverrideRequest.objects.create(
            id=str(uuid.uuid4()),
            student=self.student,
            course=self.course,
            request_type='capacity_override',
            reason='Need to graduate on time'
        )
        
        response = self.client.get('/api/admin/enrollment/overrides/')
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertIn('special_requests', response_data)
        self.assertGreater(len(response_data['special_requests']), 0)
        
    def test_assign_faculty_to_course(self):
        """Test assigning faculty to a course"""
        data = {
            'course_id': self.course.id,
            'faculty_id': self.faculty.employee_id
        }
        
        response = self.client.post(
            '/api/admin/enrollment/faculty-assignment/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['data']['faculty_id'], self.faculty.employee_id)
        
        # Verify the assignment in the database
        updated_course = Course.objects.get(id=self.course.id)
        self.assertEqual(updated_course.instructor_id, self.faculty.employee_id)
        
    def test_get_course_faculty(self):
        """Test getting faculty assigned to a course"""
        # First assign faculty to course
        self.course.instructor_id = self.faculty.employee_id
        self.course.save()
        
        response = self.client.get(f'/api/admin/courses/{self.course.id}/faculty/')
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIsNotNone(response_data['data']['assigned_faculty'])
        self.assertEqual(
            response_data['data']['assigned_faculty']['faculty_id'], 
            self.faculty.employee_id
        )
        
    def test_generate_enrollment_report(self):
        """Test generating enrollment reports"""
        # Create a test enrollment
        Enrollment.objects.create(
            id=str(uuid.uuid4()),
            student=self.student,
            course=self.course,
            status='active'
        )
        
        # Test summary report
        response = self.client.get('/api/admin/enrollment/reports/')
        self.assertEqual(response.status_code, 200)
        
        # Test department report
        response = self.client.get('/api/admin/enrollment/reports/?type=by_department')
        self.assertEqual(response.status_code, 200)
        
        # Test course detail report
        response = self.client.get(f'/api/admin/enrollment/reports/?type=course_detail&course_id={self.course.id}')
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    import unittest
    unittest.main()