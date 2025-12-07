"""
Security tests for access control validation
"""
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from django.utils import timezone
from student.models import Student, EnrollmentPeriod, Course

class SecurityTest(TestCase):
    def setUp(self):
        """Set up test data for security testing"""
        # Create test users with different roles
        self.student_user = User.objects.create_user(
            username='student',
            password='studentpass123'
        )
        
        self.faculty_user = User.objects.create_user(
            username='faculty',
            password='facultypass123'
        )
        
        self.admin_user = User.objects.create_user(
            username='admin',
            password='adminpass123'
        )
        
        # Create student profile
        self.student = Student.objects.create(
            student_id="STU001",
            first_name="John",
            last_name="Doe",
            email="john.doe@university.edu",
            academic_standing="good",
            user=self.student_user
        )
        
        # Create test course
        self.course = Course.objects.create(
            course_id="SEC101",
            name="Security Testing Course",
            credits=3,
            department="Security",
            max_capacity=30
        )
        
        # Create enrollment period
        self.enrollment_period = EnrollmentPeriod.objects.create(
            name="Security Test Registration",
            start_date=timezone.now() - timezone.timedelta(days=1),
            end_date=timezone.now() + timezone.timedelta(days=1),
            priority_end_date=timezone.now() + timezone.timedelta(hours=12)
        )

    def test_student_access_control(self):
        """Test that students can only access student endpoints"""
        client = APIClient()
        client.force_authenticate(user=self.student_user)
        
        # Student should be able to access student enrollment endpoints
        response = client.get('/api/student/courses/available/')
        # Should be accessible (might return 200 or 404 depending on data)
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND])
        
        # Student should NOT be able to access admin endpoints
        response = client.get('/api/admin/enrollment/reports/')
        # Should be forbidden
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_faculty_access_control(self):
        """Test that faculty can only access faculty endpoints"""
        client = APIClient()
        client.force_authenticate(user=self.faculty_user)
        
        # Faculty should be able to access faculty enrollment endpoints
        response = client.get('/api/faculty/courses/')
        # Should be accessible (might return 200 or 404 depending on data)
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND])
        
        # Faculty should NOT be able to access student cart endpoints
        response = client.post('/api/student/enrollment/cart/')
        # Should be forbidden
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_access_control(self):
        """Test that admins can access administrative endpoints"""
        client = APIClient()
        client.force_authenticate(user=self.admin_user)
        
        # Admin should be able to access admin endpoints
        response = client.get('/api/admin/enrollment/reports/')
        # Should be accessible (might return 200 or 404 depending on data)
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND])

    def test_unauthenticated_access(self):
        """Test that unauthenticated users cannot access protected endpoints"""
        client = APIClient()
        
        # Unauthenticated user should not be able to access any protected endpoints
        response = client.get('/api/student/courses/available/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        response = client.get('/api/faculty/courses/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        response = client.get('/api/admin/enrollment/reports/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_input_validation(self):
        """Test input validation for enrollment endpoints"""
        client = APIClient()
        client.force_authenticate(user=self.student_user)
        
        # Test with malicious input
        malicious_inputs = [
            "<script>alert('xss')</script>",
            "'; DROP TABLE courses; --",
            "../../../../etc/passwd",
            "UNION SELECT * FROM users",
            ""
        ]
        
        for malicious_input in malicious_inputs:
            response = client.get(f'/api/student/courses/search/?query={malicious_input}')
            # Should handle malicious input gracefully, not crash
            self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_400_BAD_REQUEST, status.HTTP_404_NOT_FOUND])