import json
from django.test import TestCase, Client
from django.contrib.auth.models import User
from users.models import Faculty
import uuid
from datetime import datetime, timedelta

class AppointmentSchedulingTestCase(TestCase):
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
        
    def test_create_appointment(self):
        """Test creating a new appointment"""
        # Prepare data
        future_time = datetime.now() + timedelta(days=1)
        data = {
            'student_id': 'STU001',
            'start_time': future_time.isoformat(),
            'duration_minutes': 30,
            'type': 'advising',
            'title': 'Academic Advising Session',
            'description': 'Discuss course selection for next semester',
            'location': 'Office Hours'
        }
        
        # Make POST request
        response = self.client.post(
            '/api/faculty/appointments/create/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['message'], 'Appointment created successfully')
        self.assertIn('data', response_data)
        self.assertEqual(response_data['data']['student_id'], 'STU001')
        self.assertEqual(response_data['data']['type'], 'advising')
        self.assertEqual(response_data['data']['status'], 'scheduled')
        
    def test_create_appointment_missing_required_fields(self):
        """Test creating an appointment with missing required fields"""
        # Prepare incomplete data
        future_time = datetime.now() + timedelta(days=1)
        data = {
            'student_id': 'STU001',
            'start_time': future_time.isoformat()
            # Missing required fields: duration_minutes, type
        }
        
        # Make POST request
        response = self.client.post(
            '/api/faculty/appointments/create/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertIn('Missing required field', response_data['message'])
        
    def test_create_appointment_invalid_time_format(self):
        """Test creating an appointment with invalid time format"""
        # Prepare data with invalid time format
        data = {
            'student_id': 'STU001',
            'start_time': 'invalid-date-format',
            'duration_minutes': 30,
            'type': 'advising'
        }
        
        # Make POST request
        response = self.client.post(
            '/api/faculty/appointments/create/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertIn('Invalid start_time format', response_data['message'])
        
    def test_get_faculty_appointments(self):
        """Test getting all appointments for faculty member"""
        # Make GET request
        response = self.client.get('/api/faculty/appointments/list/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        
    def test_get_faculty_appointments_with_filtering(self):
        """Test getting faculty appointments with filtering"""
        # Make GET request with status filter
        response = self.client.get('/api/faculty/appointments/list/?status=scheduled')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        
        # Make GET request with type filter
        response = self.client.get('/api/faculty/appointments/list/?type=advising')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        
    def test_get_appointment_detail(self):
        """Test getting detailed information for a specific appointment"""
        # First create an appointment
        future_time = datetime.now() + timedelta(days=1)
        data = {
            'student_id': 'STU001',
            'start_time': future_time.isoformat(),
            'duration_minutes': 30,
            'type': 'advising'
        }
        
        create_response = self.client.post(
            '/api/faculty/appointments/create/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(create_response.status_code, 200)
        create_data = json.loads(create_response.content)
        appointment_id = create_data['data']['id']
        
        # Make GET request for the appointment
        response = self.client.get(f'/api/faculty/appointments/{appointment_id}/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertEqual(response_data['data']['id'], appointment_id)
        
    def test_get_appointment_detail_not_found(self):
        """Test getting details for a non-existent appointment"""
        # Make GET request for non-existent appointment
        fake_appointment_id = str(uuid.uuid4())
        response = self.client.get(f'/api/faculty/appointments/{fake_appointment_id}/')
        
        # Check response
        self.assertEqual(response.status_code, 404)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['message'], 'Appointment not found')
        
    def test_update_appointment(self):
        """Test updating an existing appointment"""
        # First create an appointment
        future_time = datetime.now() + timedelta(days=1)
        data = {
            'student_id': 'STU001',
            'start_time': future_time.isoformat(),
            'duration_minutes': 30,
            'type': 'advising'
        }
        
        create_response = self.client.post(
            '/api/faculty/appointments/create/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(create_response.status_code, 200)
        create_data = json.loads(create_response.content)
        appointment_id = create_data['data']['id']
        
        # Prepare update data
        updated_data = {
            'duration_minutes': 45,
            'title': 'Extended Advising Session',
            'status': 'confirmed'
        }
        
        # Make PUT request to update appointment
        response = self.client.put(
            f'/api/faculty/appointments/{appointment_id}/update/',
            data=json.dumps(updated_data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['message'], 'Appointment updated successfully')
        self.assertEqual(response_data['data']['duration_minutes'], 45)
        self.assertEqual(response_data['data']['title'], 'Extended Advising Session')
        self.assertEqual(response_data['data']['status'], 'confirmed')
        
    def test_cancel_appointment(self):
        """Test cancelling an appointment"""
        # First create an appointment
        future_time = datetime.now() + timedelta(days=1)
        data = {
            'student_id': 'STU001',
            'start_time': future_time.isoformat(),
            'duration_minutes': 30,
            'type': 'advising'
        }
        
        create_response = self.client.post(
            '/api/faculty/appointments/create/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(create_response.status_code, 200)
        create_data = json.loads(create_response.content)
        appointment_id = create_data['data']['id']
        
        # Make DELETE request to cancel appointment
        response = self.client.delete(f'/api/faculty/appointments/{appointment_id}/cancel/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['message'], 'Appointment cancelled successfully')
        self.assertEqual(response_data['data']['status'], 'cancelled')
        
    def test_get_appointment_types(self):
        """Test getting available appointment types"""
        # Make GET request
        response = self.client.get('/api/faculty/appointments/types/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertIsInstance(response_data['data'], list)
        self.assertGreater(len(response_data['data']), 0)
        
    def test_get_faculty_availability(self):
        """Test getting faculty availability for scheduling"""
        # Make GET request
        response = self.client.get('/api/faculty/appointments/availability/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertIn('availability_slots', response_data['data'])