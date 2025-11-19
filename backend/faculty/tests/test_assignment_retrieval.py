import json
from django.test import TestCase, Client
from django.contrib.auth.models import User
from courses.models import Course
from assignments.models import Assignment
from users.models import Faculty
import uuid
from django.utils import timezone

class AssignmentRetrievalTestCase(TestCase):
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
        
        # Create a test course
        self.course_id = str(uuid.uuid4())
        self.course = Course.objects.create(
            id=self.course_id,
            code='CS101',
            name='Introduction to Computer Science',
            description='Basic programming concepts',
            credits=3,
            instructor_id='FAC001',
            department='Computer Science'
        )
        
        # Create test assignments
        self.assignment1_id = str(uuid.uuid4())
        self.assignment1 = Assignment.objects.create(
            id=self.assignment1_id,
            course_id=self.course_id,
            title='Homework 1',
            description='First homework assignment',
            due_date=timezone.now(),
            points=100,
            type='homework'
        )
        
        self.assignment2_id = str(uuid.uuid4())
        self.assignment2 = Assignment.objects.create(
            id=self.assignment2_id,
            course_id=self.course_id,
            title='Project 1',
            description='First project assignment',
            due_date=timezone.now(),
            points=150,
            type='project'
        )
        
        # Create test client
        self.client = Client()
        
    def test_get_faculty_assignments(self):
        """Test getting all assignments for a faculty member"""
        # Make GET request
        response = self.client.get('/api/faculty/assignments/list/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertEqual(len(response_data['data']), 2)
        
        # Check that assignments have the expected data
        assignment_titles = [assignment['title'] for assignment in response_data['data']]
        self.assertIn('Homework 1', assignment_titles)
        self.assertIn('Project 1', assignment_titles)
        
    def test_get_assignment_detail(self):
        """Test getting detailed information for a specific assignment"""
        # Make GET request
        response = self.client.get(f'/api/faculty/assignments/{self.assignment1_id}/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertEqual(response_data['data']['title'], 'Homework 1')
        self.assertEqual(response_data['data']['points'], 100)
        
        # Check that submission stats are included
        self.assertIn('submission_stats', response_data['data'])
        
    def test_get_assignment_detail_not_found(self):
        """Test getting details for a non-existent assignment"""
        # Make GET request for non-existent assignment
        fake_assignment_id = str(uuid.uuid4())
        response = self.client.get(f'/api/faculty/assignments/{fake_assignment_id}/')
        
        # Check response
        self.assertEqual(response.status_code, 404)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['message'], 'Assignment not found')
        
    def test_search_assignments(self):
        """Test searching assignments"""
        # Make GET request with search query
        response = self.client.get('/api/faculty/assignments/search/?q=Homework')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertEqual(len(response_data['data']), 1)
        self.assertEqual(response_data['data'][0]['title'], 'Homework 1')
        
    def test_search_assignments_no_query(self):
        """Test searching assignments without a query"""
        # Make GET request without search query
        response = self.client.get('/api/faculty/assignments/search/')
        
        # Check response
        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['message'], 'Search query is required')
        
    def test_get_assignment_analytics(self):
        """Test getting analytics for an assignment"""
        # Make GET request
        response = self.client.get(f'/api/faculty/assignments/{self.assignment1_id}/analytics/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertEqual(response_data['data']['assignment_id'], self.assignment1_id)
        self.assertEqual(response_data['data']['title'], 'Homework 1')
        
    def test_get_assignment_analytics_not_found(self):
        """Test getting analytics for a non-existent assignment"""
        # Make GET request for non-existent assignment
        fake_assignment_id = str(uuid.uuid4())
        response = self.client.get(f'/api/faculty/assignments/{fake_assignment_id}/analytics/')
        
        # Check response
        self.assertEqual(response.status_code, 404)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['message'], 'Assignment not found')
        
    def test_get_faculty_assignments_with_filtering(self):
        """Test getting faculty assignments with filtering"""
        # Create another course and assignment to test filtering
        course2_id = str(uuid.uuid4())
        Course.objects.create(
            id=course2_id,
            code='CS102',
            name='Data Structures',
            description='Data structures course',
            credits=3,
            instructor_id='FAC001',
            department='Computer Science'
        )
        
        Assignment.objects.create(
            id=str(uuid.uuid4()),
            course_id=course2_id,
            title='CS102 Homework',
            description='Homework for CS102',
            due_date=timezone.now(),
            points=100,
            type='homework'
        )
        
        # Make GET request with course filter
        response = self.client.get(f'/api/faculty/assignments/list/?course_id={self.course_id}')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        # Should only return assignments from the first course
        self.assertEqual(len(response_data['data']), 2)
        for assignment in response_data['data']:
            self.assertEqual(assignment['course_id'], self.course_id)