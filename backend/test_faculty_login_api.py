"""
Test file for faculty login API integration
"""
import json
from django.test import TestCase, Client
from django.contrib.auth.models import User
from users.models import Faculty
from faculty.models import FacultySettings
import jwt
from django.conf import settings

class FacultyLoginAPITest(TestCase):
    def setUp(self):
        """Set up test data"""
        # Create a test user
        self.user = User.objects.create_user(
            username='testfaculty',
            email='testfaculty@example.com',
            password='testpass123'
        )
        self.user.role = 'faculty'
        self.user.save()
        
        # Create a test faculty profile
        self.faculty = Faculty.objects.create(
            user=self.user,
            employee_id='FAC001',
            department='Computer Science',
            title='Assistant Professor',
            phone='123-456-7890',
            office_hours='MWF 9-11 AM'
        )
        
        # Create faculty settings
        FacultySettings.objects.create(faculty=self.faculty)
        
        # Create a test client
        self.client = Client()
        
    def test_faculty_login_success(self):
        """Test successful faculty login"""
        url = '/api/faculty/auth/login/'
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
        
        # Verify JWT token
        token = response_data['token']
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        self.assertEqual(decoded_token['user_id'], self.user.id)
        self.assertEqual(decoded_token['role'], 'faculty')
        
    def test_faculty_login_with_username(self):
        """Test faculty login with username"""
        url = '/api/faculty/auth/login/'
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
        
    def test_faculty_login_invalid_credentials(self):
        """Test faculty login with invalid credentials"""
        url = '/api/faculty/auth/login/'
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
        
    def test_faculty_login_nonexistent_user(self):
        """Test faculty login with nonexistent user"""
        url = '/api/faculty/auth/login/'
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
        
    def test_faculty_login_account_lockout(self):
        """Test faculty account lockout after failed attempts"""
        url = '/api/faculty/auth/login/'
        
        # Try 5 failed login attempts
        for i in range(5):
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
        
        # 6th attempt should be locked out
        data = {
            'identifier': 'testfaculty@example.com',
            'password': 'testpass123'
        }
        
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 403)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertIn('locked', response_data['message'].lower())
        
    def test_faculty_logout(self):
        """Test faculty logout"""
        # First login to get a token
        login_url = '/api/faculty/auth/login/'
        login_data = {
            'identifier': 'testfaculty@example.com',
            'password': 'testpass123'
        }
        
        login_response = self.client.post(
            login_url,
            data=json.dumps(login_data),
            content_type='application/json'
        )
        
        self.assertEqual(login_response.status_code, 200)
        login_response_data = json.loads(login_response.content)
        token = login_response_data['token']
        
        # Now logout
        logout_url = '/api/faculty/auth/logout/'
        logout_response = self.client.post(
            logout_url,
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(logout_response.status_code, 200)
        logout_response_data = json.loads(logout_response.content)
        self.assertTrue(logout_response_data['success'])
        self.assertEqual(logout_response_data['message'], 'Logged out successfully')