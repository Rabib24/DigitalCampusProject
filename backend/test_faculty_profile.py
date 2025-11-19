import json
from django.test import TestCase, Client
from django.contrib.auth.hashers import make_password
from users.models import User, Faculty
from faculty.models import FacultySettings

class FacultyProfileTestCase(TestCase):
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
            phone_number='123-456-7890'
        )
        
        # Create faculty profile
        self.faculty_profile = Faculty.objects.create(
            user=self.faculty_user,
            employee_id='EMP001',
            department='Computer Science',
            office_location='Room 101',
            title='Professor',
            office_hours=[
                {'day': 'Monday', 'start': '09:00', 'end': '12:00'},
                {'day': 'Wednesday', 'start': '13:00', 'end': '16:00'}
            ]
        )
    
    def test_get_faculty_profile(self):
        """Test getting faculty profile"""
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
        
        # Get profile
        response = self.client.get(
            '/api/v1/faculty/profile/',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertIn('profile', data)
        
        profile = data['profile']
        self.assertEqual(profile['first_name'], 'Test')
        self.assertEqual(profile['last_name'], 'Faculty')
        self.assertEqual(profile['employee_id'], 'EMP001')
        self.assertEqual(profile['department'], 'Computer Science')
        self.assertEqual(profile['office_location'], 'Room 101')
        self.assertEqual(profile['title'], 'Professor')
        self.assertEqual(len(profile['office_hours']), 2)
    
    def test_update_faculty_profile(self):
        """Test updating faculty profile"""
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
        
        # Update profile
        response = self.client.put(
            '/api/v1/faculty/profile/update/',
            data=json.dumps({
                'first_name': 'Updated',
                'last_name': 'Professor',
                'phone_number': '987-654-3210',
                'department': 'Mathematics',
                'office_location': 'Room 202',
                'title': 'Associate Professor'
            }),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        
        # Verify updates
        updated_user = User.objects.get(id=self.faculty_user.id)
        updated_faculty = Faculty.objects.get(id=self.faculty_profile.id)
        
        self.assertEqual(updated_user.first_name, 'Updated')
        self.assertEqual(updated_user.last_name, 'Professor')
        self.assertEqual(updated_user.phone_number, '987-654-3210')
        self.assertEqual(updated_faculty.department, 'Mathematics')
        self.assertEqual(updated_faculty.office_location, 'Room 202')
        self.assertEqual(updated_faculty.title, 'Associate Professor')
    
    def test_update_privacy_settings(self):
        """Test updating faculty privacy settings"""
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
        
        # Update privacy settings
        response = self.client.put(
            '/api/v1/faculty/profile/privacy/',
            data=json.dumps({
                'profile_visibility': 'private',
                'show_email': False,
                'show_office_hours': False
            }),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data['success'])
        
        # Verify updates
        settings = FacultySettings.objects.get(faculty=self.faculty_profile)
        self.assertEqual(settings.profile_visibility, 'private')
        self.assertFalse(settings.show_email)
        self.assertFalse(settings.show_office_hours)

if __name__ == '__main__':
    unittest.main()