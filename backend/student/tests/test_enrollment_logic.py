"""
Unit tests for student enrollment business logic
"""
import pytest
from django.test import TestCase
from django.utils import timezone
from unittest.mock import patch, MagicMock
from student.models import Student, Enrollment, EnrollmentPeriod, Course
from student.enrollment_logic import (
    validate_enrollment_eligibility,
    check_prerequisites,
    check_schedule_conflicts,
    calculate_enrollment_limits
)

class EnrollmentLogicTestCase(TestCase):
    def setUp(self):
        # Create test data
        self.student = Student.objects.create(
            student_id="STU001",
            first_name="John",
            last_name="Doe",
            email="john.doe@university.edu",
            academic_standing="good"
        )
        
        self.course = Course.objects.create(
            course_id="CS101",
            name="Introduction to Computer Science",
            credits=3,
            department="Computer Science"
        )
        
        self.enrollment_period = EnrollmentPeriod.objects.create(
            name="Fall 2023 Registration",
            start_date=timezone.now() - timezone.timedelta(days=7),
            end_date=timezone.now() + timezone.timedelta(days=7),
            priority_end_date=timezone.now() + timezone.timedelta(days=3)
        )

    def test_validate_enrollment_eligibility_success(self):
        """Test successful enrollment eligibility validation"""
        result = validate_enrollment_eligibility(self.student, self.course)
        self.assertTrue(result['eligible'])
        self.assertIsNone(result['reason'])

    def test_validate_enrollment_eligibility_outside_period(self):
        """Test enrollment eligibility when outside registration period"""
        # Create expired enrollment period
        expired_period = EnrollmentPeriod.objects.create(
            name="Expired Registration",
            start_date=timezone.now() - timezone.timedelta(days=14),
            end_date=timezone.now() - timezone.timedelta(days=7)
        )
        
        with patch('student.enrollment_logic.get_current_enrollment_period', return_value=expired_period):
            result = validate_enrollment_eligibility(self.student, self.course)
            self.assertFalse(result['eligible'])
            self.assertIn("not active", result['reason'].lower())

    def test_check_prerequisites_met(self):
        """Test prerequisite checking when prerequisites are met"""
        # For a course with no prerequisites, this should pass
        result = check_prerequisites(self.student, self.course)
        self.assertTrue(result['met'])
        self.assertIsNone(result['reason'])

    def test_check_schedule_conflicts_no_conflicts(self):
        """Test schedule conflict detection with no conflicts"""
        result = check_schedule_conflicts(self.student, self.course)
        self.assertFalse(result['conflict'])
        self.assertIsNone(result['reason'])

    def test_calculate_enrollment_limits(self):
        """Test enrollment limit calculations"""
        limits = calculate_enrollment_limits(self.student)
        self.assertEqual(limits['max_credits'], 18)
        self.assertEqual(limits['min_credits'], 6)
        self.assertEqual(limits['max_courses'], 6)
        self.assertEqual(limits['min_courses'], 2)