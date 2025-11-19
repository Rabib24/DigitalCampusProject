import json
from django.test import TestCase, Client
from django.contrib.auth.models import User
from users.models import Faculty
import uuid

class AcademicProgressTestCase(TestCase):
    def setUp(self):
        """Set up test data"""
        # Create a test user
        self.user = User.objects.create_user(
            username='testfaculty',
            email='faculty@test.com',
            password='testpass123'
        )
        
        # Create a faculty profile
        self.faculty = Faculty.objects.create(
            user=self.user,
            employee_id='FAC001',
            department='Computer Science',
            title='Assistant Professor',
            office_hours='MWF 9-11 AM'
        )
        
        # Create test client
        self.client = Client()
        
    def test_get_academic_progress(self):
        """Test getting academic progress tracking for a student"""
        # Make GET request
        response = self.client.get('/api/faculty/advising/progress/STU001/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertIn('degree_audit', response_data['data'])
        self.assertIn('overall_progress', response_data['data'])
        self.assertIn('projected_gpa', response_data['data'])
        
    def test_get_academic_progress_student_not_found(self):
        """Test getting academic progress for a non-existent student"""
        # Make GET request for non-existent student
        fake_student_id = 'STU999'
        response = self.client.get(f'/api/faculty/advising/progress/{fake_student_id}/')
        
        # Check response
        self.assertEqual(response.status_code, 404)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['message'], 'Student not found')
        
    def test_get_gpa_projection(self):
        """Test getting GPA calculation and projection for a student"""
        # Make GET request
        response = self.client.get('/api/faculty/advising/gpa-projection/STU001/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertIn('scenarios', response_data['data'])
        self.assertIn('recommendation', response_data['data'])
        
    def test_check_degree_requirements(self):
        """Test checking degree requirements for a student"""
        # Make GET request
        response = self.client.get('/api/faculty/advising/requirements/STU001/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertIn('requirements_met', response_data['data'])
        self.assertIn('requirements_pending', response_data['data'])
        self.assertIn('compliance_percentage', response_data['data'])
        
    def test_get_course_recommendations(self):
        """Test getting course recommendations for a student"""
        # Make GET request
        response = self.client.get('/api/faculty/advising/recommendations/STU001/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertIn('recommended_courses', response_data['data'])
        self.assertIn('prerequisites_needed', response_data['data'])
        self.assertIn('planning_tools', response_data['data'])