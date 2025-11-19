import json
from django.test import TestCase, Client
from django.contrib.auth.models import User
from users.models import Faculty
import uuid

class CGPASimulationTestCase(TestCase):
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
        
    def test_simulate_cgpa(self):
        """Test CGPA simulation with what-if scenarios"""
        # Prepare data
        scenario_data = {
            'courses': [
                {
                    'code': 'CS301',
                    'name': 'Data Structures',
                    'credits': 3
                },
                {
                    'code': 'MATH201',
                    'name': 'Discrete Math',
                    'credits': 3
                }
            ],
            'grades': {
                'CS301': 'A',
                'MATH201': 'B+'
            }
        }
        
        # Make POST request
        response = self.client.post(
            '/api/faculty/advising/cgpa-simulation/STU001/',
            data=json.dumps(scenario_data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertIn('projection', response_data['data'])
        self.assertIn('projected_cgpa', response_data['data']['projection'])
        
    def test_get_course_recommendations_cgpa(self):
        """Test getting course recommendations based on CGPA goals"""
        # Make GET request with target CGPA
        response = self.client.get('/api/faculty/advising/course-recommendations/STU001/?target_cgpa=3.5')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertIn('recommended_courses', response_data['data'])
        self.assertIn('required_courses', response_data['data'])
        self.assertIn('elective_courses', response_data['data'])
        
    def test_project_graduation_timeline(self):
        """Test projecting graduation timeline"""
        # Make GET request
        response = self.client.get('/api/faculty/advising/graduation-timeline/STU001/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertIn('remaining_credits', response_data['data'])
        self.assertIn('semesters_needed', response_data['data'])
        self.assertIn('graduation_date', response_data['data'])
        
    def test_optimize_academic_plan(self):
        """Test optimizing academic plan for CGPA improvement"""
        # Prepare data
        optimization_data = {
            'target_cgpa': 3.5,
            'timeline_semesters': 6
        }
        
        # Make POST request
        response = self.client.post(
            '/api/faculty/advising/optimize-plan/STU001/',
            data=json.dumps(optimization_data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertIn('recommendations', response_data['data'])
        self.assertIn('semester_plan', response_data['data'])
        self.assertIn('resources', response_data['data'])
        
    def test_simulate_cgpa_student_not_found(self):
        """Test CGPA simulation for non-existent student"""
        # Prepare data
        scenario_data = {
            'courses': [
                {
                    'code': 'CS301',
                    'name': 'Data Structures',
                    'credits': 3
                }
            ],
            'grades': {
                'CS301': 'A'
            }
        }
        
        # Make POST request for non-existent student
        fake_student_id = 'STU999'
        response = self.client.post(
            f'/api/faculty/advising/cgpa-simulation/{fake_student_id}/',
            data=json.dumps(scenario_data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 404)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['message'], 'Student not found')
        
    def test_get_course_recommendations_cgpa_default_target(self):
        """Test getting course recommendations with default target CGPA"""
        # Make GET request without target CGPA parameter
        response = self.client.get('/api/faculty/advising/course-recommendations/STU001/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)