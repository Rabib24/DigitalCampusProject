import json
import uuid
import unittest
from django.test import TestCase, Client
from django.contrib.auth.hashers import make_password
from users.models import User, Faculty
from communications.models import Notification
from faculty.models import FacultySettings

class FacultyNotificationsTestCase(TestCase):
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
        
        # Create a test notification
        self.notification = Notification(
            id=str(uuid.uuid4()),
            user_id=self.faculty_user.id,
            title='Test Notification',
            message='This is a test notification',
            type='info',
            is_read=False
        )
        self.notification.save()
    
    def test_get_faculty_notifications(self):
        """Test getting faculty notifications"""
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
        
        # Get notifications
        response = self.client.get(
            '/api/v1/faculty/notifications/',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(response.status_code, 200)  # type: ignore
        data = json.loads(response.content)  # type: ignore
        self.assertTrue(data['success'])
        self.assertIn('notifications', data)
        self.assertEqual(len(data['notifications']), 1)
        
        notification = data['notifications'][0]
        self.assertEqual(notification['title'], 'Test Notification')
        self.assertEqual(notification['message'], 'This is a test notification')
        self.assertFalse(notification['is_read'])
    
    def test_get_unread_notifications(self):
        """Test getting unread notifications"""
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
        
        # Get unread notifications
        response = self.client.get(
            '/api/v1/faculty/notifications/unread/',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(response.status_code, 200)  # type: ignore
        data = json.loads(response.content)  # type: ignore
        self.assertTrue(data['success'])
        self.assertIn('notifications', data)
        self.assertEqual(len(data['notifications']), 1)
        
        notification = data['notifications'][0]
        self.assertEqual(notification['title'], 'Test Notification')
        self.assertFalse(notification['is_read'])
    
    def test_mark_notification_as_read(self):
        """Test marking a notification as read"""
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
        
        # Mark notification as read
        response = self.client.put(
            f'/api/v1/faculty/notifications/{self.notification.id}/read/',
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(response.status_code, 200)  # type: ignore
        data = json.loads(response.content)  # type: ignore
        self.assertTrue(data['success'])
        self.assertEqual(data['message'], 'Notification marked as read')
        
        # Verify notification is marked as read
        updated_notification = Notification.objects.get(id=self.notification.id)  # type: ignore
        self.assertTrue(updated_notification.is_read)
    
    def test_get_notification_count(self):
        """Test getting notification counts"""
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
        
        # Get notification counts
        response = self.client.get(
            '/api/v1/faculty/notifications/count/',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(response.status_code, 200)  # type: ignore
        data = json.loads(response.content)  # type: ignore
        self.assertTrue(data['success'])
        self.assertIn('counts', data)
        
        counts = data['counts']
        self.assertEqual(counts['total'], 1)
        self.assertEqual(counts['unread'], 1)

if __name__ == '__main__':
    unittest.main()