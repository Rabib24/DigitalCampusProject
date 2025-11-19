import json
import uuid
import unittest
from django.test import TestCase, Client
from django.contrib.auth.hashers import make_password
from users.models import User, Faculty
from faculty.models import FacultySettings

class FacultyFormsTestCase(TestCase):
    def setUp(self):
        """Set up test data"""
        self.client = Client()
        
        # Create a test faculty user
        self.faculty_user = User(
            username='faculty123',
            email='faculty@test.com',
            first_name='Test',
            last_name='Faculty',
            role='faculty',
            status='active',
            password=make_password('testpassword')
        )
        self.faculty_user.save()
        
        # Create faculty profile
        self.faculty_profile = Faculty(
            user=self.faculty_user,
            employee_id='EMP001',
            department='Computer Science',
            title='Professor'
        )
        self.faculty_profile.save()
    
    def test_validate_form_field(self):
        """Test validating a form field"""
        # Login to get token
        login_response = self.client.post(
            '/api/v1/faculty/auth/login/',
            data=json.dumps({
                'identifier': 'faculty@test.com',
                'password': 'testpassword'
            }),
            content_type='application/json'
        )
        
        self.assertEqual(login_response.status_code, 200)  # type: ignore
        login_data = json.loads(login_response.content)  # type: ignore
        token = login_data['token']
        
        # Validate a valid email field
        response = self.client.post(
            '/api/v1/faculty/forms/validate-field/',
            data=json.dumps({
                'field_name': 'email',
                'field_value': 'test@example.com',
                'field_type': 'email',
                'required': True
            }),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(response.status_code, 200)  # type: ignore
        data = json.loads(response.content)  # type: ignore
        self.assertTrue(data['success'])
        self.assertTrue(data['valid'])
        self.assertEqual(len(data['errors']), 0)
        
        # Validate an invalid email field
        response = self.client.post(
            '/api/v1/faculty/forms/validate-field/',
            data=json.dumps({
                'field_name': 'email',
                'field_value': 'invalid-email',
                'field_type': 'email',
                'required': True
            }),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(response.status_code, 200)  # type: ignore
        data = json.loads(response.content)  # type: ignore
        self.assertTrue(data['success'])
        self.assertFalse(data['valid'])
        self.assertGreater(len(data['errors']), 0)
    
    def test_validate_form(self):
        """Test validating an entire form"""
        # Login to get token
        login_response = self.client.post(
            '/api/v1/faculty/auth/login/',
            data=json.dumps({
                'identifier': 'faculty@test.com',
                'password': 'testpassword'
            }),
            content_type='application/json'
        )
        
        self.assertEqual(login_response.status_code, 200)  # type: ignore
        login_data = json.loads(login_response.content)  # type: ignore
        token = login_data['token']
        
        # Validate a form with valid data
        response = self.client.post(
            '/api/v1/faculty/forms/validate/',
            data=json.dumps({
                'form_data': {
                    'name': 'John Doe',
                    'email': 'john@example.com',
                    'age': '30'
                },
                'validation_rules': {
                    'name': {
                        'required': True,
                        'min_length': 2
                    },
                    'email': {
                        'required': True,
                        'type': 'email'
                    },
                    'age': {
                        'required': True,
                        'type': 'number'
                    }
                }
            }),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(response.status_code, 200)  # type: ignore
        data = json.loads(response.content)  # type: ignore
        self.assertTrue(data['success'])
        self.assertTrue(data['valid'])
        self.assertEqual(len(data['errors']), 0)
        
        # Validate a form with invalid data
        response = self.client.post(
            '/api/v1/faculty/forms/validate/',
            data=json.dumps({
                'form_data': {
                    'name': '',
                    'email': 'invalid-email',
                    'age': 'not-a-number'
                },
                'validation_rules': {
                    'name': {
                        'required': True,
                        'min_length': 2
                    },
                    'email': {
                        'required': True,
                        'type': 'email'
                    },
                    'age': {
                        'required': True,
                        'type': 'number'
                    }
                }
            }),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(response.status_code, 200)  # type: ignore
        data = json.loads(response.content)  # type: ignore
        self.assertTrue(data['success'])
        self.assertFalse(data['valid'])
        self.assertGreater(len(data['errors']), 0)
    
    def test_save_and_load_form_draft(self):
        """Test saving and loading a form draft"""
        # Login to get token
        login_response = self.client.post(
            '/api/v1/faculty/auth/login/',
            data=json.dumps({
                'identifier': 'faculty@test.com',
                'password': 'testpassword'
            }),
            content_type='application/json'
        )
        
        self.assertEqual(login_response.status_code, 200)  # type: ignore
        login_data = json.loads(login_response.content)  # type: ignore
        token = login_data['token']
        
        # Save a form draft
        response = self.client.post(
            '/api/v1/faculty/forms/drafts/save/',
            data=json.dumps({
                'form_name': 'test_form',
                'form_data': {
                    'field1': 'value1',
                    'field2': 'value2'
                }
            }),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(response.status_code, 200)  # type: ignore
        data = json.loads(response.content)  # type: ignore
        self.assertTrue(data['success'])
        self.assertIn('draft_id', data)
        
        draft_id = data['draft_id']
        
        # Load the form draft
        response = self.client.get(
            f'/api/v1/faculty/forms/drafts/load/test_form/',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(response.status_code, 200)  # type: ignore
        data = json.loads(response.content)  # type: ignore
        self.assertTrue(data['success'])
        self.assertIn('draft', data)
        
        draft = data['draft']
        self.assertEqual(draft['form_name'], 'test_form')
        self.assertEqual(draft['form_data']['field1'], 'value1')
        self.assertEqual(draft['form_data']['field2'], 'value2')

if __name__ == '__main__':
    unittest.main()