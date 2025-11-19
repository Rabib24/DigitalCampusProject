import json
from django.test import TestCase, Client
from django.contrib.auth.models import User
from courses.models import Course
from assignments.models import Assignment, Grade
from users.models import Faculty
import uuid
from django.utils import timezone

class GradingSubmissionTestCase(TestCase):
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
        
        # Create test client
        self.client = Client()
        
    def test_submit_grade(self):
        """Test submitting a grade for a student"""
        # Prepare data
        student_id = 'STU001'
        data = {
            'assignment_id': self.assignment_id,
            'student_id': student_id,
            'points': 85,
            'max_points': 100,
            'letter_grade': 'B',
            'comments': 'Good work, but could improve variable naming'
        }
        
        # Make POST request
        response = self.client.post(
            '/api/faculty/grades/submit/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['message'], 'Grade submitted successfully')
        self.assertIn('data', response_data)
        
        # Verify grade in database
        grade = Grade.objects.get(assignment_id=self.assignment_id, student_id=student_id)
        self.assertEqual(float(str(grade.value)), 85.0)
        self.assertEqual(float(str(grade.max_points)), 100.0)
        self.assertEqual(grade.letter_grade, 'B')
        self.assertEqual(grade.comments, 'Good work, but could improve variable naming')
        
    def test_submit_grade_missing_required_fields(self):
        """Test submitting a grade with missing required fields"""
        # Prepare incomplete data
        student_id = 'STU001'
        data = {
            'assignment_id': self.assignment_id,
            'student_id': student_id
            # Missing required fields: points, max_points
        }
        
        # Make POST request
        response = self.client.post(
            '/api/faculty/grades/submit/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertIn('Missing required field', response_data['message'])
        
    def test_submit_grade_assignment_not_found(self):
        """Test submitting a grade for a non-existent assignment"""
        # Prepare data with invalid assignment ID
        student_id = 'STU001'
        fake_assignment_id = str(uuid.uuid4())
        data = {
            'assignment_id': fake_assignment_id,
            'student_id': student_id,
            'points': 85,
            'max_points': 100
        }
        
        # Make POST request
        response = self.client.post(
            '/api/faculty/grades/submit/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 404)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['message'], 'Assignment not found')
        
    def test_update_existing_grade(self):
        """Test updating an existing grade"""
        # First, create a grade
        student_id = 'STU001'
        grade_id = str(uuid.uuid4())
        initial_grade = Grade.objects.create(
            id=grade_id,
            assignment_id=self.assignment_id,
            student_id=student_id,
            value=75,
            max_points=100,
            letter_grade='C',
            comments='Needs improvement'
        )
        
        # Prepare updated data
        data = {
            'assignment_id': self.assignment_id,
            'student_id': student_id,
            'points': 90,
            'max_points': 100,
            'letter_grade': 'A-',
            'comments': 'Great improvement!'
        }
        
        # Make POST request
        response = self.client.post(
            '/api/faculty/grades/submit/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['message'], 'Grade submitted successfully')
        
        # Verify updated grade in database
        updated_grade = Grade.objects.get(assignment_id=self.assignment_id, student_id=student_id)
        self.assertEqual(float(str(updated_grade.value)), 90.0)
        self.assertEqual(float(str(updated_grade.max_points)), 100.0)
        self.assertEqual(updated_grade.letter_grade, 'A-')
        self.assertEqual(updated_grade.comments, 'Great improvement!')
        
    def test_bulk_grade_submissions(self):
        """Test bulk grading multiple students"""
        # Prepare data for multiple grades
        data = {
            'grades': [
                {
                    'assignment_id': self.assignment_id,
                    'student_id': 'STU001',
                    'points': 85,
                    'max_points': 100,
                    'letter_grade': 'B',
                    'comments': 'Good work'
                },
                {
                    'assignment_id': self.assignment_id,
                    'student_id': 'STU002',
                    'points': 92,
                    'max_points': 100,
                    'letter_grade': 'A-',
                    'comments': 'Excellent work'
                },
                {
                    'assignment_id': self.assignment_id,
                    'student_id': 'STU003',
                    'points': 78,
                    'max_points': 100,
                    'letter_grade': 'C+',
                    'comments': 'Satisfactory work'
                }
            ]
        }
        
        # Make POST request
        response = self.client.post(
            '/api/faculty/grades/bulk/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('processed_grades', response_data)
        self.assertIn('errors', response_data)
        self.assertEqual(len(response_data['processed_grades']), 3)
        self.assertEqual(len(response_data['errors']), 0)
        
        # Verify grades in database
        grade1 = Grade.objects.get(assignment_id=self.assignment_id, student_id='STU001')
        self.assertEqual(float(str(grade1.value)), 85.0)
        self.assertEqual(grade1.letter_grade, 'B')
        
        grade2 = Grade.objects.get(assignment_id=self.assignment_id, student_id='STU002')
        self.assertEqual(float(str(grade2.value)), 92.0)
        self.assertEqual(grade2.letter_grade, 'A-')
        
        grade3 = Grade.objects.get(assignment_id=self.assignment_id, student_id='STU003')
        self.assertEqual(float(str(grade3.value)), 78.0)
        self.assertEqual(grade3.letter_grade, 'C+')
        
    def test_export_gradebook(self):
        """Test exporting gradebook data for a course"""
        # Create some grades first
        Grade.objects.create(
            id=str(uuid.uuid4()),
            assignment_id=self.assignment_id,
            student_id='STU001',
            value=85,
            max_points=100,
            letter_grade='B'
        )
        
        Grade.objects.create(
            id=str(uuid.uuid4()),
            assignment_id=self.assignment_id,
            student_id='STU002',
            value=92,
            max_points=100,
            letter_grade='A-'
        )
        
        # Make GET request
        response = self.client.get(f'/api/faculty/grades/export/{self.course_id}/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertIn('course', response_data['data'])
        self.assertIn('assignments', response_data['data'])
        self.assertIn('grades', response_data['data'])
        
    def test_calculate_grade_statistics(self):
        """Test calculating grade statistics for an assignment"""
        # Create some grades first
        Grade.objects.create(
            id=str(uuid.uuid4()),
            assignment_id=self.assignment_id,
            student_id='STU001',
            value=85,
            max_points=100,
            letter_grade='B'
        )
        
        Grade.objects.create(
            id=str(uuid.uuid4()),
            assignment_id=self.assignment_id,
            student_id='STU002',
            value=92,
            max_points=100,
            letter_grade='A-'
        )
        
        Grade.objects.create(
            id=str(uuid.uuid4()),
            assignment_id=self.assignment_id,
            student_id='STU003',
            value=78,
            max_points=100,
            letter_grade='C+'
        )
        
        # Make GET request
        response = self.client.get(f'/api/faculty/grades/statistics/{self.assignment_id}/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertEqual(response_data['data']['assignment_id'], self.assignment_id)
        self.assertEqual(response_data['data']['total_grades'], 3)
        self.assertIn('average_percentage', response_data['data'])
        self.assertIn('grade_distribution', response_data['data'])