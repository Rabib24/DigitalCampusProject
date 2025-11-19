import json
from django.test import TestCase, Client
from django.contrib.auth.models import User
from courses.models import Course
from assignments.models import Assignment
from users.models import Faculty
import uuid
from django.utils import timezone

class AssignmentCreationTestCase(TestCase):
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
        
        # Create test client
        self.client = Client()
        
    def test_create_assignment(self):
        """Test creating a new assignment"""
        # Prepare data
        due_date = timezone.now().isoformat()
        start_date = timezone.now().isoformat()
        
        data = {
            'course_id': self.course_id,
            'title': 'Homework 1',
            'description': 'Complete the programming exercises',
            'due_date': due_date,
            'points': 100,
            'type': 'homework',
            'start_date': start_date,
            'allow_late_submission': True,
            'late_penalty': 10.0,
            'max_submissions': 3,
            'visible_to_students': True,
            'category': 'Programming',
            'weight': 0.2
        }
        
        # Make POST request
        response = self.client.post(
            '/api/faculty/assignments/create/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['message'], 'Assignment created successfully')
        self.assertIn('data', response_data)
        
        # Verify assignment in database
        assignment = Assignment.objects.get(title='Homework 1')
        self.assertEqual(assignment.course_id, self.course_id)
        self.assertEqual(assignment.points, 100)
        self.assertEqual(assignment.type, 'homework')
        
    def test_create_assignment_missing_required_fields(self):
        """Test creating an assignment with missing required fields"""
        # Prepare incomplete data
        data = {
            'course_id': self.course_id,
            'title': 'Incomplete Assignment'
            # Missing required fields: description, due_date, points, type
        }
        
        # Make POST request
        response = self.client.post(
            '/api/faculty/assignments/create/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertIn('Missing required field', response_data['message'])
        
    def test_create_assignment_course_not_found(self):
        """Test creating an assignment for a course that doesn't exist"""
        # Prepare data with invalid course ID
        fake_course_id = str(uuid.uuid4())
        due_date = timezone.now().isoformat()
        
        data = {
            'course_id': fake_course_id,
            'title': 'Invalid Course Assignment',
            'description': 'This assignment references a non-existent course',
            'due_date': due_date,
            'points': 100,
            'type': 'homework'
        }
        
        # Make POST request
        response = self.client.post(
            '/api/faculty/assignments/create/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 404)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['message'], 'Course not found or access denied')
        
    def test_create_assignment_with_template(self):
        """Test creating an assignment using a template"""
        # First, create a template assignment
        template_id = str(uuid.uuid4())
        due_date = timezone.now().isoformat()
        
        template_assignment = Assignment.objects.create(
            id=template_id,
            course_id=self.course_id,
            title='Template Assignment',
            description='Template description',
            due_date=due_date,
            points=50,
            type='homework',
            category='Template Category'
        )
        
        # Prepare data using the template
        new_due_date = timezone.now().isoformat()
        data = {
            'template_id': template_id,
            'course_id': self.course_id,
            'title': 'New Assignment from Template',
            'description': 'New description overriding template',
            'due_date': new_due_date,
            'points': 75,  # Override template points
            'type': 'homework'
        }
        
        # Make POST request
        response = self.client.post(
            '/api/faculty/assignments/create/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['message'], 'Assignment created successfully')
        self.assertIn('data', response_data)
        
        # Verify assignment in database
        assignment = Assignment.objects.get(title='New Assignment from Template')
        self.assertEqual(assignment.course_id, self.course_id)
        self.assertEqual(assignment.points, 75)  # Should use overridden value
        self.assertEqual(assignment.description, 'New description overriding template')  # Should use overridden value
        self.assertEqual(assignment.category, 'Template Category')  # Should use template value
        
    def test_create_assignment_with_rubric(self):
        """Test creating an assignment with a rubric"""
        # Prepare data with rubric
        due_date = timezone.now().isoformat()
        
        rubric = {
            'criteria': [
                {
                    'name': 'Code Quality',
                    'points': 40,
                    'description': 'Code should be clean and well-structured'
                },
                {
                    'name': 'Functionality',
                    'points': 60,
                    'description': 'Program should work as specified'
                }
            ]
        }
        
        data = {
            'course_id': self.course_id,
            'title': 'Rubric Assignment',
            'description': 'Assignment with detailed rubric',
            'due_date': due_date,
            'points': 100,
            'type': 'project',
            'rubric': rubric
        }
        
        # Make POST request
        response = self.client.post(
            '/api/faculty/assignments/create/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['message'], 'Assignment created successfully')
        self.assertIn('data', response_data)
        
        # Verify assignment in database
        assignment = Assignment.objects.get(title='Rubric Assignment')
        self.assertEqual(assignment.course_id, self.course_id)
        self.assertIsNotNone(assignment.rubric)
        self.assertEqual(len(assignment.rubric['criteria']), 2)
        
    def test_get_assignment_templates(self):
        """Test getting assignment templates"""
        # Create a few assignments that can serve as templates
        due_date = timezone.now().isoformat()
        
        Assignment.objects.create(
            id=str(uuid.uuid4()),
            course_id=self.course_id,
            title='Template 1',
            description='First template assignment',
            due_date=due_date,
            points=50,
            type='homework'
        )
        
        Assignment.objects.create(
            id=str(uuid.uuid4()),
            course_id=self.course_id,
            title='Template 2',
            description='Second template assignment',
            due_date=due_date,
            points=100,
            type='project'
        )
        
        # Make GET request
        response = self.client.get('/api/faculty/assignments/templates/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertGreaterEqual(len(response_data['data']), 2)