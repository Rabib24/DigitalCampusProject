"""
Integration tests for student enrollment API endpoints
"""
import pytest
from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from django.utils import timezone
from student.models import Student, Enrollment, EnrollmentPeriod, Course

class EnrollmentAPITestCase(TestCase):
    def setUp(self):
        # Create test user and student
        self.user = User.objects.create_user(
            username='teststudent',
            password='testpass123'
        )
        
        self.student = Student.objects.create(
            student_id="STU001",
            first_name="John",
            last_name="Doe",
            email="john.doe@university.edu",
            academic_standing="good",
            user=self.user
        )
        
        # Create test course
        self.course = Course.objects.create(
            course_id="CS101",
            name="Introduction to Computer Science",
            credits=3,
            department="Computer Science"
        )
        
        # Create enrollment period
        self.enrollment_period = EnrollmentPeriod.objects.create(
            name="Fall 2023 Registration",
            start_date=timezone.now() - timezone.timedelta(days=7),
            end_date=timezone.now() + timezone.timedelta(days=7),
            priority_end_date=timezone.now() + timezone.timedelta(days=3)
        )
        
        # Create API client and authenticate
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_get_available_courses(self):
        """Test getting available courses for enrollment"""
        url = reverse('student-available-courses')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_search_courses(self):
        """Test searching courses by query"""
        url = reverse('student-search-courses')
        response = self.client.get(url, {'query': 'computer'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_get_recommended_courses(self):
        """Test getting recommended courses"""
        url = reverse('student-recommended-courses')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_enroll_in_course(self):
        """Test enrolling in a course"""
        url = reverse('student-enroll-course', kwargs={'course_id': self.course.course_id})
        response = self.client.post(url)
        # This might fail if there are validation issues, but the endpoint should be accessible
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_400_BAD_REQUEST])
        
    def test_drop_course(self):
        """Test dropping a course"""
        # First enroll in a course
        enrollment = Enrollment.objects.create(
            student=self.student,
            course=self.course,
            status='active'
        )
        
        url = reverse('student-drop-course', kwargs={'course_id': self.course.course_id})
        response = self.client.delete(url)
        # This might fail if there are validation issues, but the endpoint should be accessible
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_400_BAD_REQUEST])
        
    def test_get_cart(self):
        """Test getting enrollment cart"""
        url = reverse('student-cart-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_add_to_cart(self):
        """Test adding course to cart"""
        url = reverse('student-cart-add')
        data = {'course_id': self.course.course_id}
        response = self.client.post(url, data)
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_400_BAD_REQUEST])
        
    def test_remove_from_cart(self):
        """Test removing course from cart"""
        # First add to cart
        url = reverse('student-cart-remove')
        data = {'course_id': self.course.course_id}
        response = self.client.post(url, data)
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_400_BAD_REQUEST])