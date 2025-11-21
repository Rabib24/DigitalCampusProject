"""
Test file to verify login functionality for all user roles
"""
import json
import os
import django
from django.test import TestCase, Client
from django.contrib.auth.models import User
from users.models import Student, Faculty

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

class LoginFunctionalityTest(TestCase):
    def setUp(self):
        """Set up test data for different user roles"""
        # Create test users for different roles
        # Student user
        self.student_user = User.objects.create_user(
            username='teststudent',
            email='teststudent@example.com',
            password='testpass123'
        )
        self.student_user.role = 'student'
        self.student_user.save()
        
        self.student = Student.objects.create(
            user=self.student_user,
            student_id='STU001',
            degree_program='Computer Science'
        )
        
        # Faculty user
        self.faculty_user = User.objects.create_user(
            username='testfaculty',
            email='testfaculty@example.com',
            password='testpass123'
        )
        self.faculty_user.role = 'faculty'
        self.faculty_user.save()
        
        self.faculty = Faculty.objects.create(
            user=self.faculty_user,
            employee_id='FAC001',
            department='Computer Science',
            title='Assistant Professor'
        )
        
        # Admin user
        self.admin_user = User.objects.create_user(
            username='testadmin',
            email='testadmin@example.com',
            password='testpass123'
        )
        self.admin_user.role = 'admin'
        self.admin_user.save()
        
        # Create a test client
        self.client = Client()
        
    def test_student_login_success(self):
        """Test successful student login using general endpoint"""
        url = '/api/v1/auth/login/'
        data = {
            'identifier': 'teststudent@example.com',
            'password': 'testpass123'
        }
        
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('user', response_data)
        self.assertIn('token', response_data)
        self.assertEqual(response_data['user']['email'], 'teststudent@example.com')
        self.assertEqual(response_data['user']['role'], 'student')
        
    def test_student_login_with_username(self):
        """Test student login with username using general endpoint"""
        url = '/api/v1/auth/login/'
        data = {
            'identifier': 'teststudent',
            'password': 'testpass123'
        }
        
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('user', response_data)
        self.assertEqual(response_data['user']['username'], 'teststudent')
        self.assertEqual(response_data['user']['role'], 'student')
        
    def test_faculty_login_success(self):
        """Test successful faculty login using faculty-specific endpoint"""
        url = '/api/v1/faculty/auth/login/'
        data = {
            'identifier': 'testfaculty@example.com',
            'password': 'testpass123'
        }
        
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('user', response_data)
        self.assertIn('token', response_data)
        self.assertEqual(response_data['user']['email'], 'testfaculty@example.com')
        self.assertEqual(response_data['user']['role'], 'faculty')
        
    def test_faculty_login_with_username(self):
        """Test faculty login with username using faculty-specific endpoint"""
        url = '/api/v1/faculty/auth/login/'
        data = {
            'identifier': 'testfaculty',
            'password': 'testpass123'
        }
        
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('user', response_data)
        self.assertEqual(response_data['user']['username'], 'testfaculty')
        self.assertEqual(response_data['user']['role'], 'faculty')
        
    def test_admin_login_success(self):
        """Test successful admin login using general endpoint"""
        url = '/api/v1/auth/login/'
        data = {
            'identifier': 'testadmin@example.com',
            'password': 'testpass123'
        }
        
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('user', response_data)
        self.assertIn('token', response_data)
        self.assertEqual(response_data['user']['email'], 'testadmin@example.com')
        self.assertEqual(response_data['user']['role'], 'admin')
        
    def test_invalid_credentials_general_endpoint(self):
        """Test login with invalid credentials using general endpoint"""
        url = '/api/v1/auth/login/'
        data = {
            'identifier': 'teststudent@example.com',
            'password': 'wrongpassword'
        }
        
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 401)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['message'], 'Invalid credentials')
        
    def test_invalid_credentials_faculty_endpoint(self):
        """Test login with invalid credentials using faculty endpoint"""
        url = '/api/v1/faculty/auth/login/'
        data = {
            'identifier': 'testfaculty@example.com',
            'password': 'wrongpassword'
        }
        
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 401)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['message'], 'Invalid credentials')
        
    def test_nonexistent_user_general_endpoint(self):
        """Test login with nonexistent user using general endpoint"""
        url = '/api/v1/auth/login/'
        data = {
            'identifier': 'nonexistent@example.com',
            'password': 'testpass123'
        }
        
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 401)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['message'], 'Invalid credentials')
        
    def test_nonexistent_user_faculty_endpoint(self):
        """Test login with nonexistent user using faculty endpoint"""
        url = '/api/v1/faculty/auth/login/'
        data = {
            'identifier': 'nonexistent@example.com',
            'password': 'testpass123'
        }
        
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 401)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['message'], 'Invalid credentials')