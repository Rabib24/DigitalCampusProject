from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from courses.models import Course, Enrollment
from users.models import Student
import json
import uuid

User = get_user_model()

class StudentCourseEnrollmentTest(TestCase):
    def setUp(self):
        # Create a student user
        self.student_user = User.objects.create_user(
            username='student1',
            email='student1@example.com',
            password='testpass123',
            role='student'
        )
        
        # Create student profile
        self.student_profile = Student.objects.create(
            user=self.student_user,
            student_id='STU001',
            degree_program='Computer Science'
        )
        
        # Create a course
        self.course = Course.objects.create(
            id='CS101',
            code='CS101',
            name='Introduction to Computer Science',
            description='Basic concepts of computer science',
            credits=3,
            instructor_id='FAC001',
            department='Computer Science',
            enrollment_limit=30,
            start_date='2023-09-01',
            end_date='2023-12-15'
        )
        
        # Create client
        self.client = Client()
        
    def test_get_available_courses(self):
        # Test getting available courses
        response = self.client.get('/api/v1/student/courses/available/')
        self.assertEqual(response.status_code, 401)  # Should require authentication
        
        # Login as student
        login_response = self.client.post('/api/v1/auth/login/', {
            'username': 'student1',
            'password': 'testpass123'
        })
        self.assertEqual(login_response.status_code, 200)
        
        # Get available courses with auth
        response = self.client.get('/api/v1/student/courses/available/')
        # Note: This test would need to be updated with proper JWT token handling
        
    def test_enroll_in_course(self):
        # Test enrolling in a course
        response = self.client.post(f'/api/v1/student/courses/{self.course.id}/enroll/')
        self.assertEqual(response.status_code, 401)  # Should require authentication
        
    def test_drop_course(self):
        # Test dropping a course
        response = self.client.delete(f'/api/v1/student/courses/{self.course.id}/drop/')
        self.assertEqual(response.status_code, 401)  # Should require authentication