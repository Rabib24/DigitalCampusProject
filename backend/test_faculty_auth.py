import json
import jwt
from django.test import TestCase, Client
from django.contrib.auth.hashers import make_password
from users.models import User, Faculty
from faculty.models import FacultySettings

class FacultyAuthTestCase(TestCase):
    def setUp(self):
        """Set up test data"""
        self.client = Client()
        
        # Create a test faculty user
        self.faculty_user = User.objects.create(
            username='faculty123',
            email='faculty@test.com',
            first_name='Test',
            last_name='Faculty',
            role='faculty',
            status='active',
            password=make_password('testpassword'),
            mfa_enabled=False
        )
        
        # Create faculty profile
        self.faculty_profile = Faculty.objects.create(
            user=self.faculty_user,
            employee_id='EMP001',
            department='Computer Science',
            title='Professor'
        )
        
        # Create a test student user (should not be able to access faculty endpoints)
        self.student_user = User.objects.create(
            username='student123',
            email='student@test.com',
            first_name='Test',
            last_name='Student',
            role='student',
            status='active',
            password=make_password('testpassword')
        )
    
    def test_faculty_login_success(self):
        """Test successful faculty login"""
        response = self.client.post(
            '/api/v1/faculty/auth/login/',
            data=json.dumps({
                'identifier': 'faculty@test.com',
                'password': 'testpassword'
            }),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertIn('token', data)
        self.assertIn('user', data)
        self.assertEqual(data['user']['role'], 'faculty')
    
    def test_faculty_login_invalid_credentials(self):
        """Test faculty login with invalid credentials"""
        response = self.client.post(
            '/api/v1/faculty/auth/login/',
            data=json.dumps({
                'identifier': 'faculty@test.com',
                'password': 'wrongpassword'
            }),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 401)
        data = response.json()
        self.assertFalse(data['success'])
    
    def test_student_cannot_access_faculty_endpoints(self):
        """Test that student users cannot access faculty endpoints"""
        # First login as student to get a token
        login_response = self.client.post(
            '/api/v1/auth/login/',
            data=json.dumps({
                'identifier': 'student@test.com',
                'password': 'testpassword'
            }),
            content_type='application/json'
        )
        
        self.assertEqual(login_response.status_code, 200)
        login_data = login_response.json()
        token = login_data['token']
        
        # Try to access faculty dashboard with student token
        response = self.client.get(
            '/api/v1/faculty/dashboard/overview/',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(response.status_code, 403)
        data = response.json()
        self.assertFalse(data['success'])
        self.assertIn('Access denied', data['message'])
    
    def test_faculty_settings_creation(self):
        """Test that faculty settings are automatically created"""
        # Check that settings were created
        settings = FacultySettings.objects.filter(faculty=self.faculty_profile)
        self.assertTrue(settings.exists())
        
        # Check default values
        settings = settings.first()
        self.assertTrue(settings.email_notifications)
        self.assertEqual(settings.theme, 'light')
        self.assertEqual(settings.language, 'en')
    
    def test_faculty_settings_update(self):
        """Test updating faculty settings"""
        # Login to get token
        login_response = self.client.post(
            '/api/v1/faculty/auth/login/',
            data=json.dumps({
                'identifier': 'faculty@test.com',
                'password': 'testpassword'
            }),
            content_type='application/json'
        )
        
        self.assertEqual(login_response.status_code, 200)
        login_data = login_response.json()
        token = login_data['token']
        
        # Update settings
        response = self.client.put(
            '/api/v1/faculty/settings/update/',
            data=json.dumps({
                'theme': 'dark',
                'language': 'es',
                'email_notifications': False
            }),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertEqual(data['settings']['theme'], 'dark')
        self.assertEqual(data['settings']['language'], 'es')
        self.assertFalse(data['settings']['email_notifications'])
    
    def test_faculty_logout(self):
        """Test faculty logout"""
        # Login to get token
        login_response = self.client.post(
            '/api/v1/faculty/auth/login/',
            data=json.dumps({
                'identifier': 'faculty@test.com',
                'password': 'testpassword'
            }),
            content_type='application/json'
        )
        
        self.assertEqual(login_response.status_code, 200)
        login_data = login_response.json()
        token = login_data['token']
        
        # Logout
        response = self.client.post(
            '/api/v1/faculty/auth/logout/',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        
        # Try to use the same token again (should fail)
        dashboard_response = self.client.get(
            '/api/v1/faculty/dashboard/overview/',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(dashboard_response.status_code, 401)

if __name__ == '__main__':
    unittest.main()