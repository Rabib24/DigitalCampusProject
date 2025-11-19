import json
from django.test import TestCase, Client
from django.contrib.auth.models import User
from courses.models import Course
from users.models import Faculty
import uuid

class CourseDeleteTestCase(TestCase):
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
        
    def test_delete_course(self):
        """Test deleting a course"""
        # Make DELETE request
        response = self.client.delete(f'/api/faculty/courses/{self.course_id}/')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['message'], 'Course archived successfully')
        self.assertIn('audit_log', response_data)
        
        # Verify course is archived in database
        updated_course = Course.objects.get(id=self.course_id)
        self.assertIn('[ARCHIVED on', updated_course.description)
        
    def test_delete_nonexistent_course(self):
        """Test deleting a course that doesn't exist"""
        # Make DELETE request for non-existent course
        fake_course_id = str(uuid.uuid4())
        response = self.client.delete(f'/api/faculty/courses/{fake_course_id}/')
        
        # Check response
        self.assertEqual(response.status_code, 404)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['message'], 'Course not found or access denied')
        
    def test_bulk_delete_courses(self):
        """Test bulk deleting multiple courses"""
        # Create another course
        course2_id = str(uuid.uuid4())
        Course.objects.create(
            id=course2_id,
            code='CS102',
            name='Data Structures',
            description='Data structures and algorithms',
            credits=3,
            instructor_id='FAC001',
            department='Computer Science'
        )
        
        # Prepare bulk delete data
        bulk_data = {
            'course_ids': [self.course_id, course2_id]
        }
        
        # Make DELETE request for bulk deletion
        response = self.client.delete(
            '/api/faculty/courses/bulk-delete/',
            data=json.dumps(bulk_data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(len(response_data['deleted_courses']), 2)
        self.assertEqual(len(response_data['errors']), 0)
        
        # Verify courses are archived in database
        updated_course1 = Course.objects.get(id=self.course_id)
        updated_course2 = Course.objects.get(id=course2_id)
        self.assertIn('[ARCHIVED on', updated_course1.description)
        self.assertIn('[ARCHIVED on', updated_course2.description)
        
    def test_bulk_delete_courses_with_errors(self):
        """Test bulk deleting courses with some errors"""
        # Prepare bulk delete data with one valid and one invalid course ID
        fake_course_id = str(uuid.uuid4())
        bulk_data = {
            'course_ids': [self.course_id, fake_course_id]
        }
        
        # Make DELETE request for bulk deletion
        response = self.client.delete(
            '/api/faculty/courses/bulk-delete/',
            data=json.dumps(bulk_data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(len(response_data['deleted_courses']), 1)
        self.assertEqual(len(response_data['errors']), 1)
        self.assertEqual(response_data['errors'][0]['course_id'], fake_course_id)
        self.assertEqual(response_data['errors'][0]['error'], 'Course not found or access denied')
        
    def test_bulk_delete_invalid_format(self):
        """Test bulk delete with invalid data format"""
        # Prepare invalid bulk delete data
        invalid_data = {
            'invalid_field': 'invalid_value'
        }
        
        # Make DELETE request with invalid data
        response = self.client.delete(
            '/api/faculty/courses/bulk-delete/',
            data=json.dumps(invalid_data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertIn('Invalid data format', response_data['message'])