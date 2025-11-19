import json
from django.test import TestCase, Client
from django.contrib.auth.models import User
from users.models import Faculty
import uuid

class AdvisingTestCase(TestCase):
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
        
    def test_get_advisee_list(self):
        """Test getting list of advisees for faculty member"""
        # Make GET request
        response = self.client.get('/api/faculty/advising/advisees/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        
    def test_get_advisee_list_with_filtering(self):
        """Test getting advisee list with filtering"""
        # Make GET request with academic standing filter
        response = self.client.get('/api/faculty/advising/advisees/?academic_standing=Good')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        
        # Make GET request with major filter
        response = self.client.get('/api/faculty/advising/advisees/?major=Computer Science')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        
    def test_get_advisee_list_with_sorting(self):
        """Test getting advisee list with sorting"""
        # Make GET request with sorting
        response = self.client.get('/api/faculty/advising/advisees/?sort_by=gpa&sort_order=desc')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        
    def test_search_advisees(self):
        """Test searching advisees"""
        # Make GET request with search query
        response = self.client.get('/api/faculty/advising/advisees/search/?q=John')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        
    def test_search_advisees_with_filters(self):
        """Test searching advisees with advanced filters"""
        # Make GET request with GPA range filter
        response = self.client.get('/api/faculty/advising/advisees/search/?min_gpa=3.5&max_gpa=4.0')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        
        # Make GET request with year filter
        response = self.client.get('/api/faculty/advising/advisees/search/?year=Junior')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        
    def test_get_advisee_detail(self):
        """Test getting detailed information for a specific advisee"""
        # Make GET request for a specific student
        response = self.client.get('/api/faculty/advising/advisees/STU001/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertEqual(response_data['data']['student_id'], 'STU001')
        
    def test_get_advisee_detail_not_found(self):
        """Test getting details for a non-existent advisee"""
        # Make GET request for non-existent student
        fake_student_id = 'STU999'
        response = self.client.get(f'/api/faculty/advising/advisees/{fake_student_id}/')
        
        # Check response
        self.assertEqual(response.status_code, 404)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['message'], 'Student not found')
        
    def test_get_advisee_categories(self):
        """Test getting advisee grouping and categorization features"""
        # Make GET request
        response = self.client.get('/api/faculty/advising/advisees/categories/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertIn('academic_standing', response_data['data'])
        self.assertIn('major', response_data['data'])
        self.assertIn('year', response_data['data'])
        self.assertIn('gpa_ranges', response_data['data'])