import json
from django.test import TestCase, Client
from django.contrib.auth.models import User
from courses.models import Course
from assignments.models import Assignment, Submission
from users.models import Faculty
import uuid
from django.utils import timezone

class PlagiarismCheckTestCase(TestCase):
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
        
        # Create a test assignment
        self.assignment_id = str(uuid.uuid4())
        self.assignment = Assignment.objects.create(
            id=self.assignment_id,
            course_id=self.course_id,
            title='Homework 1',
            description='First homework assignment',
            due_date=timezone.now(),
            points=100,
            type='homework'
        )
        
        # Create a test submission
        self.submission_id = str(uuid.uuid4())
        self.submission = Submission.objects.create(
            id=self.submission_id,
            assignment_id=self.assignment_id,
            student_id='STU001',
            content='This is a sample submission content for testing plagiarism detection.',
            submitted_at=timezone.now()
        )
        
        # Create test client
        self.client = Client()
        
    def test_check_submission_plagiarism(self):
        """Test checking a submission for plagiarism"""
        # Prepare data
        data = {
            'threshold': 0.7
        }
        
        # Make POST request
        response = self.client.post(
            f'/api/faculty/plagiarism/check/submission/{self.submission_id}/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['message'], 'Plagiarism check completed')
        self.assertIn('data', response_data)
        self.assertIn('result', response_data['data'])
        
        # Check that the result contains expected fields
        result = response_data['data']['result']
        self.assertIn('similarity_score', result)
        self.assertIn('is_plagiarized', result)
        self.assertIn('threshold', result)
        
    def test_check_submission_plagiarism_not_found(self):
        """Test checking plagiarism for a non-existent submission"""
        # Prepare data
        data = {
            'threshold': 0.7
        }
        
        # Make POST request for non-existent submission
        fake_submission_id = str(uuid.uuid4())
        response = self.client.post(
            f'/api/faculty/plagiarism/check/submission/{fake_submission_id}/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 404)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['message'], 'Submission not found')
        
    def test_check_assignment_plagiarism(self):
        """Test checking all submissions for an assignment for plagiarism"""
        # Create another submission for the same assignment
        Submission.objects.create(
            id=str(uuid.uuid4()),
            assignment_id=self.assignment_id,
            student_id='STU002',
            content='This is another sample submission content.',
            submitted_at=timezone.now()
        )
        
        # Prepare data
        data = {
            'threshold': 0.7
        }
        
        # Make POST request
        response = self.client.post(
            f'/api/faculty/plagiarism/check/assignment/{self.assignment_id}/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertIn('total_submissions', response_data['data'])
        self.assertIn('reports', response_data['data'])
        self.assertEqual(response_data['data']['total_submissions'], 2)
        
    def test_get_plagiarism_report(self):
        """Test getting a specific plagiarism report"""
        # Make GET request
        report_id = str(uuid.uuid4())
        response = self.client.get(f'/api/faculty/plagiarism/report/{report_id}/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertEqual(response_data['data']['id'], report_id)
        
    def test_configure_plagiarism_threshold(self):
        """Test configuring plagiarism detection threshold"""
        # Prepare data
        data = {
            'threshold': 0.8
        }
        
        # Make POST request
        response = self.client.post(
            '/api/faculty/plagiarism/configure/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['message'], 'Plagiarism threshold configured successfully')
        self.assertIn('data', response_data)
        self.assertEqual(response_data['data']['threshold'], 0.8)
        
    def test_configure_plagiarism_threshold_invalid(self):
        """Test configuring plagiarism detection threshold with invalid value"""
        # Prepare data with invalid threshold
        data = {
            'threshold': 1.5  # Invalid - should be between 0 and 1
        }
        
        # Make POST request
        response = self.client.post(
            '/api/faculty/plagiarism/configure/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['message'], 'Threshold must be between 0 and 1')
        
    def test_batch_plagiarism_check(self):
        """Test performing batch plagiarism checking for multiple submissions"""
        # Create another submission
        submission2_id = str(uuid.uuid4())
        Submission.objects.create(
            id=submission2_id,
            assignment_id=self.assignment_id,
            student_id='STU002',
            content='This is another sample submission content.',
            submitted_at=timezone.now()
        )
        
        # Prepare data
        data = {
            'submission_ids': [self.submission_id, submission2_id],
            'threshold': 0.7
        }
        
        # Make POST request
        response = self.client.post(
            '/api/faculty/plagiarism/batch/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertEqual(response_data['data']['total_submissions'], 2)
        self.assertEqual(response_data['data']['processed_submissions'], 2)
        self.assertIn('reports', response_data['data'])