"""
Test file for faculty modal management functionality
"""
import json
import uuid
from django.test import TestCase, Client
from django.contrib.auth.models import User
from users.models import Faculty

class FacultyModalManagementTest(TestCase):
    def setUp(self):
        """Set up test data"""
        # Create a test user
        self.user = User.objects.create_user(
            username='testfaculty',
            email='testfaculty@example.com',
            password='testpass123'
        )
        
        # Create a test faculty profile
        self.faculty = Faculty.objects.create(
            user=self.user,
            employee_id='FAC001',
            department='Computer Science',
            title='Assistant Professor',
            phone='123-456-7890',
            office_hours='MWF 9-11 AM'
        )
        
        # Create a test client
        self.client = Client()
        self.client.login(username='testfaculty', password='testpass123')
        
    def test_create_modal_session(self):
        """Test creating a modal session"""
        url = '/api/faculty/modals/create/'
        data = {
            'modal_type': 'course_creation',
            'initial_data': {
                'course_code': 'CS101',
                'course_name': 'Introduction to Computer Science'
            }
        }
        
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertIn('session_id', response_data['data'])
        self.assertEqual(response_data['data']['modal_type'], 'course_creation')
        
    def test_update_modal_state(self):
        """Test updating modal state"""
        # First create a modal session
        from faculty.modal_management import modal_manager
        modal_session = modal_manager.create_modal_session(
            user_id=self.user.id,
            modal_type='course_update',
            initial_data={'course_id': 'CS101'}
        )
        
        # Then update the modal state
        url = f'/api/faculty/modals/{modal_session["session_id"]}/update/'
        update_data = {
            'data': {
                'course_name': 'Updated Course Name',
                'credits': 3
            }
        }
        
        response = self.client.put(
            url,
            data=json.dumps(update_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        
    def test_get_modal_state(self):
        """Test getting modal state"""
        # First create a modal session
        from faculty.modal_management import modal_manager
        initial_data = {
            'course_code': 'CS101',
            'course_name': 'Introduction to Computer Science'
        }
        modal_session = modal_manager.create_modal_session(
            user_id=self.user.id,
            modal_type='course_creation',
            initial_data=initial_data
        )
        
        # Then get the modal state
        url = f'/api/faculty/modals/{modal_session["session_id"]}/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['data']['modal_type'], 'course_creation')
        self.assertEqual(response_data['data']['data'], initial_data)
        
    def test_close_modal_session(self):
        """Test closing a modal session"""
        # First create a modal session
        from faculty.modal_management import modal_manager
        modal_session = modal_manager.create_modal_session(
            user_id=self.user.id,
            modal_type='course_creation'
        )
        
        # Then close the modal session
        url = f'/api/faculty/modals/{modal_session["session_id"]}/close/'
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertFalse(modal_manager.get_modal_state(modal_session["session_id"])['is_active'])
        
    def test_get_user_modal_sessions(self):
        """Test getting user's modal sessions"""
        # Create a few modal sessions
        from faculty.modal_management import modal_manager
        modal_manager.create_modal_session(
            user_id=self.user.id,
            modal_type='course_creation'
        )
        modal_manager.create_modal_session(
            user_id=self.user.id,
            modal_type='assignment_creation'
        )
        
        # Get user's modal sessions
        url = '/api/faculty/modals/sessions/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(len(response_data['data']), 2)
        
    def test_get_user_audit_logs(self):
        """Test getting user's audit logs"""
        # Create some audit logs
        from faculty.modal_management import audit_logger
        audit_logger.log_action(
            user_id=self.user.id,
            action_type='course_create_initiated',
            description='Course creation initiated through modal',
            details={'course_code': 'CS101'}
        )
        audit_logger.log_action(
            user_id=self.user.id,
            action_type='course_create_completed',
            description='Course creation completed',
            details={'course_code': 'CS101', 'course_id': 'COURSE001'}
        )
        
        # Get user's audit logs
        url = '/api/faculty/modals/audit-logs/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertGreaterEqual(len(response_data['data']), 2)
        
    def test_execute_modal_operation(self):
        """Test executing a modal operation"""
        url = '/api/faculty/modals/execute/'
        data = {
            'operation_type': 'create_course',
            'operation_data': {
                'course_code': 'CS101',
                'course_name': 'Introduction to Computer Science',
                'credits': 3
            }
        }
        
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        
    def test_modal_session_access_control(self):
        """Test that users can only access their own modal sessions"""
        # Create another user
        other_user = User.objects.create_user(
            username='otherfaculty',
            email='otherfaculty@example.com',
            password='testpass123'
        )
        
        Faculty.objects.create(
            user=other_user,
            employee_id='FAC002',
            department='Mathematics',
            title='Associate Professor'
        )
        
        # Create a modal session for the other user
        from faculty.modal_management import modal_manager
        other_modal_session = modal_manager.create_modal_session(
            user_id=other_user.id,
            modal_type='course_creation'
        )
        
        # Try to access the other user's modal session
        url = f'/api/faculty/modals/{other_modal_session["session_id"]}/'
        response = self.client.get(url)
        
        # Should be denied access
        self.assertEqual(response.status_code, 403)
        
    def test_modal_history_tracking(self):
        """Test that modal state changes are tracked in history"""
        # Create a modal session
        from faculty.modal_management import modal_manager
        modal_session = modal_manager.create_modal_session(
            user_id=self.user.id,
            modal_type='course_creation',
            initial_data={'course_code': 'CS101'}
        )
        
        # Update the modal state multiple times
        modal_manager.update_modal_state(
            session_id=modal_session['session_id'],
            updated_data={'course_name': 'Intro to CS'}
        )
        
        modal_manager.update_modal_state(
            session_id=modal_session['session_id'],
            updated_data={'credits': 3}
        )
        
        # Check that history is tracked
        final_state = modal_manager.get_modal_state(modal_session['session_id'])
        self.assertGreaterEqual(len(final_state['history']), 2)
        self.assertEqual(final_state['data']['course_code'], 'CS101')
        self.assertEqual(final_state['data']['course_name'], 'Intro to CS')
        self.assertEqual(final_state['data']['credits'], 3)