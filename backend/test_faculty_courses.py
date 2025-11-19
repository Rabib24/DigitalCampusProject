import json
import uuid
import unittest
from django.test import TestCase, Client
from django.contrib.auth.hashers import make_password
from users.models import User, Faculty
from courses.models import Course
from faculty.models import FacultySettings

class FacultyCoursesTestCase(TestCase):
    def setUp(self):
        """Set up test data"""
        self.client = Client()
        
        # Create a test faculty user
        self.faculty_user = User.objects.create(
            username='faculty123',
            email='faculty@test.com',
            first_name='Test',
            last_name='Faculty',
            role='faculty',
            status='active',
            password=make_password('testpassword')
        )
        
        # Create faculty profile
        self.faculty_profile = Faculty(
            user=self.faculty_user,
            employee_id='EMP001',
            department='Computer Science',
            title='Professor'
        )
        self.faculty_profile.save()
        
        # Create a test course
        self.course = Course(
            id=str(uuid.uuid4()),
            code='CS101',
            name='Introduction to Computer Science',
            description='Basic concepts of computer science',
            credits=3,
            instructor_id='EMP001',
            department='Computer Science',
            enrollment_limit=30,
            start_date='2023-09-01',
            end_date='2023-12-15'
        )
        self.course.save()
    
    def test_get_faculty_courses(self):
        """Test getting faculty courses"""
        # Login to get token
        login_response = self.client.post(
            '/api/v1/faculty/auth/login/',
            data=json.dumps({
                'identifier': 'faculty@test.com',
                'password': 'testpassword'
            }),
            content_type='application/json'
        )
        
        self.assertEqual(login_response.status_code, 200)  # type: ignore
        login_data = json.loads(login_response.content)  # type: ignore
        token = login_data['token']
        
        # Get courses
        response = self.client.get(
            '/api/v1/faculty/courses/list/',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(response.status_code, 200)  # type: ignore
        data = json.loads(response.content)  # type: ignore
        self.assertTrue(data['success'])
        self.assertIn('courses', data)
        self.assertEqual(len(data['courses']), 1)
        
        course = data['courses'][0]
        self.assertEqual(course['code'], 'CS101')
        self.assertEqual(course['name'], 'Introduction to Computer Science')
    
    def test_get_course_detail(self):
        """Test getting course detail"""
        # Login to get token
        login_response = self.client.post(
            '/api/v1/faculty/auth/login/',
            data=json.dumps({
                'identifier': 'faculty@test.com',
                'password': 'testpassword'
            }),
            content_type='application/json'
        )
        
        self.assertEqual(login_response.status_code, 200)  # type: ignore
        login_data = json.loads(login_response.content)  # type: ignore
        token = login_data['token']
        
        # Get course detail
        response = self.client.get(
            f'/api/v1/faculty/courses/{self.course.id}/',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(response.status_code, 200)  # type: ignore
        data = json.loads(response.content)  # type: ignore
        self.assertTrue(data['success'])
        self.assertIn('course', data)
        
        course = data['course']
        self.assertEqual(course['code'], 'CS101')
        self.assertEqual(course['name'], 'Introduction to Computer Science')
    
    def test_create_course(self):
        """Test creating a new course"""
        # Login to get token
        login_response = self.client.post(
            '/api/v1/faculty/auth/login/',
            data=json.dumps({
                'identifier': 'faculty@test.com',
                'password': 'testpassword'
            }),
            content_type='application/json'
        )
        
        self.assertEqual(login_response.status_code, 200)  # type: ignore
        login_data = json.loads(login_response.content)  # type: ignore
        token = login_data['token']
        
        # Create a new course
        response = self.client.post(
            '/api/v1/faculty/courses/create/',
            data=json.dumps({
                'code': 'CS201',
                'name': 'Data Structures',
                'description': 'Advanced data structures and algorithms',
                'credits': 4,
                'department': 'Computer Science',
                'enrollment_limit': 25,
                'start_date': '2023-09-01',
                'end_date': '2023-12-15'
            }),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(response.status_code, 200)  # type: ignore
        data = json.loads(response.content)  # type: ignore
        self.assertTrue(data['success'])
        self.assertIn('course', data)
        
        course = data['course']
        self.assertEqual(course['code'], 'CS201')
        self.assertEqual(course['name'], 'Data Structures')
        self.assertEqual(course['credits'], 4)
    
    def test_update_course(self):
        """Test updating a course"""
        # Login to get token
        login_response = self.client.post(
            '/api/v1/faculty/auth/login/',
            data=json.dumps({
                'identifier': 'faculty@test.com',
                'password': 'testpassword'
            }),
            content_type='application/json'
        )
        
        self.assertEqual(login_response.status_code, 200)  # type: ignore
        login_data = json.loads(login_response.content)  # type: ignore
        token = login_data['token']
        
        # Update course
        response = self.client.put(
            f'/api/v1/faculty/courses/{self.course.id}/update/',
            data=json.dumps({
                'name': 'Intro to CS - Updated',
                'credits': 4,
                'description': 'Updated description'
            }),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(response.status_code, 200)  # type: ignore
        data = json.loads(response.content)  # type: ignore
        self.assertTrue(data['success'])
        self.assertIn('course', data)
        
        course = data['course']
        self.assertEqual(course['name'], 'Intro to CS - Updated')
        self.assertEqual(course['credits'], 4)
        self.assertEqual(course['description'], 'Updated description')

if __name__ == '__main__':
    unittest.main()