import json
from django.test import TestCase, Client
from django.contrib.auth.models import User
from courses.models import Course
from assignments.models import Assignment, Submission
from users.models import Faculty
import uuid
from django.utils import timezone

class SubmissionReviewTestCase(TestCase):
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
            content='This is a sample submission content for review.',
            submitted_at=timezone.now()
        )
        
        # Create test client
        self.client = Client()
        
    def test_review_submission(self):
        """Test reviewing a student submission"""
        # Prepare data
        data = {
            'comments': 'Good work overall. Consider adding more comments to your code.',
            'annotations': [
                {
                    'line': 10,
                    'comment': 'This function could be simplified',
                    'type': 'suggestion'
                },
                {
                    'line': 25,
                    'comment': 'Good use of variable naming conventions',
                    'type': 'positive'
                }
            ],
            'grade': 85.5,
            'feedback': 'Excellent submission with minor improvements needed.'
        }
        
        # Make POST request
        response = self.client.post(
            f'/api/faculty/submissions/{self.submission_id}/review/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['message'], 'Submission reviewed successfully')
        self.assertIn('data', response_data)
        self.assertIn('review_data', response_data['data'])
        
        # Verify submission was updated in database
        updated_submission = Submission.objects.get(id=self.submission_id)
        self.assertEqual(float(str(updated_submission.grade)), 85.5)
        self.assertEqual(updated_submission.feedback, 'Excellent submission with minor improvements needed.')
        self.assertIsNotNone(updated_submission.revision_history)
        self.assertEqual(len(updated_submission.revision_history), 1)
        
    def test_get_submission_reviews(self):
        """Test getting all reviews for a specific submission"""
        # First, add a review to the submission
        review_data = {
            'reviewer_id': 'FAC001',
            'reviewed_at': timezone.now().isoformat(),
            'comments': 'Initial review',
            'annotations': [],
            'grade': 85.5,
            'feedback': 'Good work'
        }
        
        self.submission.revision_history = [review_data]
        self.submission.grade = 85.5
        self.submission.feedback = 'Good work'
        self.submission.save()
        
        # Make GET request
        response = self.client.get(f'/api/faculty/submissions/{self.submission_id}/reviews/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertIn('reviews', response_data['data'])
        self.assertEqual(len(response_data['data']['reviews']), 1)
        self.assertEqual(response_data['data']['reviews'][0]['comments'], 'Initial review')
        
    def test_add_peer_reviewer(self):
        """Test adding a peer reviewer to a submission"""
        # Prepare data
        data = {
            'peer_reviewer_id': 'STU002'
        }
        
        # Make POST request
        response = self.client.post(
            f'/api/faculty/submissions/{self.submission_id}/peer-reviewer/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['message'], 'Peer reviewer added successfully')
        self.assertIn('data', response_data)
        self.assertEqual(response_data['data']['peer_reviewer_id'], 'STU002')
        
    def test_get_peer_reviews(self):
        """Test getting all peer reviews for an assignment"""
        # Make GET request
        response = self.client.get(f'/api/faculty/assignments/{self.assignment_id}/peer-reviews/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertIn('peer_reviews', response_data['data'])
        
    def test_review_submission_not_found(self):
        """Test reviewing a non-existent submission"""
        # Prepare data
        data = {
            'comments': 'Good work',
            'grade': 85.5
        }
        
        # Make POST request for non-existent submission
        fake_submission_id = str(uuid.uuid4())
        response = self.client.post(
            f'/api/faculty/submissions/{fake_submission_id}/review/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 404)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['message'], 'Submission not found')
        
    def test_review_submission_with_multiple_reviews(self):
        """Test adding multiple reviews to a submission"""
        # First review
        data1 = {
            'comments': 'First review',
            'grade': 80.0,
            'feedback': 'Good start'
        }
        
        response1 = self.client.post(
            f'/api/faculty/submissions/{self.submission_id}/review/',
            data=json.dumps(data1),
            content_type='application/json'
        )
        
        self.assertEqual(response1.status_code, 200)
        
        # Second review
        data2 = {
            'comments': 'Second review',
            'grade': 90.0,
            'feedback': 'Great improvement'
        }
        
        response2 = self.client.post(
            f'/api/faculty/submissions/{self.submission_id}/review/',
            data=json.dumps(data2),
            content_type='application/json'
        )
        
        self.assertEqual(response2.status_code, 200)
        
        # Verify submission has two reviews in revision history
        updated_submission = Submission.objects.get(id=self.submission_id)
        self.assertEqual(len(updated_submission.revision_history), 2)
        self.assertEqual(updated_submission.revision_history[0]['comments'], 'First review')
        self.assertEqual(updated_submission.revision_history[1]['comments'], 'Second review')