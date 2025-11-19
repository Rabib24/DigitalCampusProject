import json
import uuid
import unittest
from django.test import TestCase, Client, RequestFactory
from django.contrib.auth.hashers import make_password
from users.models import User, Faculty
from courses.models import Course
from communications.models import Notification
from faculty.filtering import FacultyDataFilter, FacultyDataSorter, apply_filtering_and_sorting

class FacultyFilteringTestCase(TestCase):
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
        Course(
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
        ).save()
        
        Course(
            id=str(uuid.uuid4()),
            code='CS201',
            name='Data Structures',
            description='Advanced data structures and algorithms',
            credits=4,
            instructor_id='EMP001',
            department='Computer Science',
            enrollment_limit=25,
            start_date='2023-09-01',
            end_date='2023-12-15'
        ).save()
        
        Course(
            id=str(uuid.uuid4()),
            code='MATH101',
            name='Calculus I',
            description='Introduction to calculus',
            credits=3,
            instructor_id='EMP001',
            department='Mathematics',
            enrollment_limit=35,
            start_date='2023-09-01',
            end_date='2023-12-15'
        ).save()
        
        # Create test notifications
        Notification(
            id=str(uuid.uuid4()),
            user_id=self.faculty_user.id,
            title='Welcome Notification',
            message='Welcome to the faculty dashboard',
            type='info',
            is_read=False
        ).save()
        
        Notification(
            id=str(uuid.uuid4()),
            user_id=self.faculty_user.id,
            title='Assignment Due',
            message='Assignment is due tomorrow',
            type='warning',
            is_read=False
        ).save()
        
        Notification(
            id=str(uuid.uuid4()),
            user_id=self.faculty_user.id,
            title='Grade Submission',
            message='Grades are ready for submission',
            type='success',
            is_read=True
        ).save()
    
    def test_filter_courses_by_code(self):
        """Test filtering courses by code"""
        courses = Course.objects.filter(instructor_id='EMP001')  # type: ignore
        filter_params = {'code': 'CS'}
        
        filtered_courses = FacultyDataFilter.filter_courses(courses, filter_params)
        
        self.assertEqual(filtered_courses.count(), 2)
        for course in filtered_courses:
            self.assertIn('CS', course.code)
    
    def test_filter_courses_by_department(self):
        """Test filtering courses by department"""
        courses = Course.objects.filter(instructor_id='EMP001')  # type: ignore
        filter_params = {'department': 'Computer Science'}
        
        filtered_courses = FacultyDataFilter.filter_courses(courses, filter_params)
        
        self.assertEqual(filtered_courses.count(), 2)
        for course in filtered_courses:
            self.assertEqual(course.department, 'Computer Science')
    
    def test_filter_courses_by_credits(self):
        """Test filtering courses by credits"""
        courses = Course.objects.filter(instructor_id='EMP001')  # type: ignore
        filter_params = {'credits': 4}
        
        filtered_courses = FacultyDataFilter.filter_courses(courses, filter_params)
        
        self.assertEqual(filtered_courses.count(), 1)
        self.assertEqual(filtered_courses.first().code, 'CS201')
    
    def test_sort_courses_by_code(self):
        """Test sorting courses by code"""
        courses = Course.objects.filter(instructor_id='EMP001')  # type: ignore
        
        # Sort ascending
        sorted_courses = FacultyDataSorter.sort_courses(courses, 'code')
        course_codes = [course.code for course in sorted_courses]
        self.assertEqual(course_codes, sorted(course_codes))
        
        # Sort descending
        sorted_courses = FacultyDataSorter.sort_courses(courses, '-code')
        course_codes = [course.code for course in sorted_courses]
        self.assertEqual(course_codes, sorted(course_codes, reverse=True))
    
    def test_filter_notifications_by_type(self):
        """Test filtering notifications by type"""
        notifications = Notification.objects.filter(user_id=self.faculty_user.id)  # type: ignore
        filter_params = {'type': 'info'}
        
        filtered_notifications = FacultyDataFilter.filter_notifications(notifications, filter_params)
        
        self.assertEqual(filtered_notifications.count(), 1)
        self.assertEqual(filtered_notifications.first().type, 'info')
    
    def test_filter_notifications_by_read_status(self):
        """Test filtering notifications by read status"""
        notifications = Notification.objects.filter(user_id=self.faculty_user.id)  # type: ignore
        filter_params = {'is_read': 'true'}
        
        filtered_notifications = FacultyDataFilter.filter_notifications(notifications, filter_params)
        
        self.assertEqual(filtered_notifications.count(), 1)
        self.assertTrue(filtered_notifications.first().is_read)
    
    def test_apply_filtering_and_sorting(self):
        """Test applying filtering and sorting to a queryset"""
        # Create a request with filter and sort parameters
        request = self.factory.get('/?filter_department=Computer Science&sort=code')
        
        # Get courses
        courses = Course.objects.filter(instructor_id='EMP001')  # type: ignore
        
        # Apply filtering and sorting
        result = apply_filtering_and_sorting(courses, request, 'courses')
        
        # Check results
        self.assertEqual(result.count(), 2)
        course_codes = [course.code for course in result]
        self.assertEqual(course_codes, sorted(course_codes))  # Should be sorted by code ascending
    
    def test_get_faculty_courses_with_filtering_and_sorting(self):
        """Test getting faculty courses with filtering and sorting"""
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
        
        # Get courses with filtering and sorting
        response = self.client.get(
            '/api/v1/faculty/courses/list/?filter_department=Computer Science&sort=code',
            HTTP_AUTHORIZATION=f'Bearer {token}'
        )
        
        self.assertEqual(response.status_code, 200)  # type: ignore
        response_data = json.loads(response.content)  # type: ignore
        self.assertTrue(response_data['success'])
        self.assertEqual(len(response_data['data']), 2)
        
        # Check that courses are sorted by code
        course_codes = [course['code'] for course in response_data['data']]
        self.assertEqual(course_codes, sorted(course_codes))

if __name__ == '__main__':
    unittest.main()