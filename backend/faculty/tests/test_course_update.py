import json
from django.test import TestCase, Client
from django.contrib.auth.models import User
from courses.models import Course
from users.models import Faculty
import uuid

class CourseUpdateTestCase(TestCase):
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
        
    def test_update_course_put_method(self):
        """Test updating a course with PUT method"""
        # Prepare update data
        update_data = {
            'code': 'CS201',
            'name': 'Advanced Computer Science',
            'description': 'Advanced programming concepts',
            'credits': 4
        }
        
        # Make PUT request
        response = self.client.put(
            f'/api/faculty/courses/{self.course_id}/',
            data=json.dumps(update_data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['data']['code'], 'CS201')
        self.assertEqual(response_data['data']['name'], 'Advanced Computer Science')
        self.assertEqual(response_data['data']['credits'], 4)
        
        # Verify changes in database
        updated_course = Course.objects.get(id=self.course_id)
        self.assertEqual(updated_course.code, 'CS201')
        self.assertEqual(updated_course.name, 'Advanced Computer Science')
        self.assertEqual(updated_course.credits, 4)
        
    def test_update_course_patch_method(self):
        """Test updating a course with PATCH method"""
        # Prepare partial update data
        update_data = {
            'name': 'Updated Computer Science Course',
            'credits': 4
        }
        
        # Make PATCH request
        response = self.client.patch(
            f'/api/faculty/courses/{self.course_id}/',
            data=json.dumps(update_data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['data']['name'], 'Updated Computer Science Course')
        self.assertEqual(response_data['data']['credits'], 4)
        # Code should remain unchanged
        self.assertEqual(response_data['data']['code'], 'CS101')
        
        # Verify changes in database
        updated_course = Course.objects.get(id=self.course_id)
        self.assertEqual(updated_course.name, 'Updated Computer Science Course')
        self.assertEqual(updated_course.credits, 4)
        self.assertEqual(updated_course.code, 'CS101')  # Should be unchanged
        
    def test_bulk_update_courses(self):
        """Test bulk updating multiple courses"""
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
        
        # Prepare bulk update data
        bulk_data = {
            'courses': [
                {
                    'id': self.course_id,
                    'name': 'Updated CS101',
                    'credits': 4
                },
                {
                    'id': course2_id,
                    'name': 'Updated CS102',
                    'credits': 3
                }
            ]
        }
        
        # Make PUT request for bulk update
        response = self.client.put(
            '/api/faculty/courses/bulk-update/',
            data=json.dumps(bulk_data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(len(response_data['updated_courses']), 2)
        self.assertEqual(len(response_data['errors']), 0)
        
        # Verify changes in database
        updated_course1 = Course.objects.get(id=self.course_id)
        updated_course2 = Course.objects.get(id=course2_id)
        self.assertEqual(updated_course1.name, 'Updated CS101')
        self.assertEqual(updated_course1.credits, 4)
        self.assertEqual(updated_course2.name, 'Updated CS102')
        self.assertEqual(updated_course2.credits, 3)
        
    def test_update_course_change_tracking(self):
        """Test that course updates track changes correctly"""
        # Prepare update data
        update_data = {
            'name': 'Updated Course Name',
            'credits': 4
        }
        
        # Make PUT request
        response = self.client.put(
            f'/api/faculty/courses/{self.course_id}/',
            data=json.dumps(update_data),
            content_type='application/json'
        )
        
        # Check response includes change tracking
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('changes', response_data)
        self.assertEqual(len(response_data['changes']), 2)  # name and credits changed
        
        # Check specific changes
        changes = response_data['changes']
        self.assertIn('name', changes)
        self.assertIn('credits', changes)
        self.assertEqual(changes['name']['from'], 'Introduction to Computer Science')
        self.assertEqual(changes['name']['to'], 'Updated Course Name')
        self.assertEqual(changes['credits']['from'], 3)
        self.assertEqual(changes['credits']['to'], 4)
        
    def test_update_nonexistent_course(self):
        """Test updating a course that doesn't exist"""
        # Prepare update data
        update_data = {
            'name': 'Nonexistent Course',
            'credits': 3
        }
        
        # Make PUT request for non-existent course
        fake_course_id = str(uuid.uuid4())
        response = self.client.put(
            f'/api/faculty/courses/{fake_course_id}/',
            data=json.dumps(update_data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 404)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['message'], 'Course not found or access denied')
        
    def test_update_course_code_uniqueness(self):
        """Test that course code uniqueness is enforced"""
        # Create another course with a different code
        course2_id = str(uuid.uuid4())
        Course.objects.create(
            id=course2_id,
            code='CS202',
            name='Another Course',
            description='Another course description',
            credits=3,
            instructor_id='FAC001',
            department='Computer Science'
        )
        
        # Try to update first course with the second course's code
        update_data = {
            'code': 'CS202'  # This code already exists
        }
        
        # Make PUT request
        response = self.client.put(
            f'/api/faculty/courses/{self.course_id}/',
            data=json.dumps(update_data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 400)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['message'], 'A course with this code already exists')