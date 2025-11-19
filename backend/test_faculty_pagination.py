import json
import uuid
import unittest
from django.test import TestCase, Client, RequestFactory
from django.contrib.auth.hashers import make_password
from users.models import User, Faculty
from courses.models import Course
from communications.models import Notification
from faculty.pagination import FacultyPaginator, paginated_api_response, cursor_pagination_response

class FacultyPaginationTestCase(TestCase):
    def setUp(self):
        """Set up test data"""
        self.client = Client()
        self.factory = RequestFactory()
        
        # Create a test faculty user
        self.faculty_user = User(
            username='faculty123',
            email='faculty@test.com',
            first_name='Test',
            last_name='Faculty',
            role='faculty',
            status='active',
            password=make_password('testpassword')
        )
        self.faculty_user.save()
        
        # Create faculty profile
        self.faculty_profile = Faculty(
            user=self.faculty_user,
            employee_id='EMP001',
            department='Computer Science',
            title='Professor'
        )
        self.faculty_profile.save()
        
        # Create test courses
        for i in range(5):
            Course(
                id=str(uuid.uuid4()),
                code=f'CS10{i}',
                name=f'Course {i}',
                description=f'Description for course {i}',
                credits=3,
                instructor_id='EMP001',
                department='Computer Science',
                enrollment_limit=30,
                start_date='2023-09-01',
                end_date='2023-12-15'
            ).save()
        
        # Create test notifications
        for i in range(5):
            Notification(
                id=str(uuid.uuid4()),
                user_id=self.faculty_user.id,
                title=f'Notification {i}',
                message=f'Message for notification {i}',
                type='info',
                is_read=False
            ).save()
    
    def test_faculty_paginator(self):
        """Test the FacultyPaginator class"""
        # Create a request object
        request = self.factory.get('/?page=1&page_size=2')
        
        # Get courses
        courses = Course.objects.filter(instructor_id='EMP001')  # type: ignore
        
        # Create paginator
        paginator = FacultyPaginator(courses, page_size=2)
        paginated_data = paginator.get_paginated_response(request)
        
        # Check pagination data
        self.assertEqual(len(paginated_data['items']), 2)
        self.assertEqual(paginated_data['pagination']['current_page'], 1)
        self.assertEqual(paginated_data['pagination']['page_size'], 2)
        self.assertEqual(paginated_data['pagination']['total_items'], 5)
        self.assertEqual(paginated_data['pagination']['total_pages'], 3)
        self.assertTrue(paginated_data['pagination']['has_next'])
    
    def test_paginated_api_response(self):
        """Test the paginated_api_response function"""
        # Create a request object
        request = self.factory.get('/?page=1&page_size=2')
        
        # Get courses
        courses = Course.objects.filter(instructor_id='EMP001')  # type: ignore
        
        # Get paginated response
        response = paginated_api_response(courses, request)
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(len(response_data['data']), 2)
        self.assertIn('pagination', response_data)
    
    def test_cursor_pagination_response(self):
        """Test the cursor_pagination_response function"""
        # Create a request object
        request = self.factory.get('/?page_size=2')
        
        # Get notifications
        notifications = Notification.objects.filter(user_id=self.faculty_user.id)  # type: ignore
        
        # Get cursor-based paginated response
        response = cursor_pagination_response(notifications, request, cursor_field='created_at')
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(len(response_data['data']), 2)
        self.assertIn('pagination', response_data)
    
    def test_get_faculty_courses_with_pagination(self):
        """Test getting faculty courses with pagination"""
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
        
        # Get courses with pagination
        response = self.client.get(
            '/api/v1/faculty/courses/list/?page=1&page_size=2',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(response.status_code, 200)  # type: ignore
        response_data = json.loads(response.content)  # type: ignore
        self.assertTrue(response_data['success'])
        self.assertEqual(len(response_data['data']), 2)
        self.assertIn('pagination', response_data)
        
        pagination = response_data['pagination']
        self.assertEqual(pagination['current_page'], 1)
        self.assertEqual(pagination['page_size'], 2)
        self.assertEqual(pagination['total_items'], 5)
        self.assertEqual(pagination['total_pages'], 3)

if __name__ == '__main__':
    unittest.main()