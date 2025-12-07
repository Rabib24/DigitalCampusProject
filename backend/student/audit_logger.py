"""
Audit logger for student enrollment actions.
This module provides utilities for logging enrollment-related actions for audit purposes.
"""

import uuid
from django.utils import timezone
from django.http import HttpRequest
from .models import EnrollmentAuditLog
from users.models import Student
from courses.models import Course, Section


class EnrollmentAuditLogger:
    """
    Utility class for logging enrollment-related actions.
    """
    
    @staticmethod
    def get_client_ip(request):
        """
        Get the client IP address from the request.
        """
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    @staticmethod
    def log_action(
        student: Student,
        action: str,
        course: Course = None,
        section: Section = None,
        request: HttpRequest = None,
        **action_details
    ):
        """
        Log an enrollment-related action.
        
        Args:
            student: Student who performed the action
            action: Action type (must be one of ACTION_CHOICES)
            course: Course related to the action (optional)
            section: Section related to the action (optional)
            request: HTTP request object (optional, for IP/user agent)
            **action_details: Additional details about the action
        """
        # Create audit log entry
        audit_log = EnrollmentAuditLog(
            id=str(uuid.uuid4()),
            student=student,
            course=course,
            section=section,
            action=action,
            action_details=action_details or {},
            timestamp=timezone.now()
        )
        
        # Add IP address and user agent if request is provided
        if request:
            audit_log.ip_address = EnrollmentAuditLogger.get_client_ip(request)
            audit_log.user_agent = request.META.get('HTTP_USER_AGENT', '')
        
        # Save the audit log
        audit_log.save()
        
        return audit_log
    
    @staticmethod
    def log_enrollment(student: Student, course: Course, section: Section = None, request: HttpRequest = None, **details):
        """Log a course enrollment action."""
        return EnrollmentAuditLogger.log_action(
            student=student,
            action='enroll',
            course=course,
            section=section,
            request=request,
            **details
        )
    
    @staticmethod
    def log_drop(student: Student, course: Course, section: Section = None, request: HttpRequest = None, **details):
        """Log a course drop action."""
        return EnrollmentAuditLogger.log_action(
            student=student,
            action='drop',
            course=course,
            section=section,
            request=request,
            **details
        )
    
    @staticmethod
    def log_add_to_cart(student: Student, course: Course, request: HttpRequest = None, **details):
        """Log adding a course to cart."""
        return EnrollmentAuditLogger.log_action(
            student=student,
            action='add_to_cart',
            course=course,
            request=request,
            **details
        )
    
    @staticmethod
    def log_remove_from_cart(student: Student, course: Course, request: HttpRequest = None, **details):
        """Log removing a course from cart."""
        return EnrollmentAuditLogger.log_action(
            student=student,
            action='remove_from_cart',
            course=course,
            request=request,
            **details
        )
    
    @staticmethod
    def log_clear_cart(student: Student, request: HttpRequest = None, **details):
        """Log clearing the cart."""
        return EnrollmentAuditLogger.log_action(
            student=student,
            action='clear_cart',
            request=request,
            **details
        )
    
    @staticmethod
    def log_enroll_from_cart(student: Student, request: HttpRequest = None, **details):
        """Log enrolling from cart."""
        return EnrollmentAuditLogger.log_action(
            student=student,
            action='enroll_from_cart',
            request=request,
            **details
        )
    
    @staticmethod
    def log_view_courses(student: Student, request: HttpRequest = None, **details):
        """Log viewing available courses."""
        return EnrollmentAuditLogger.log_action(
            student=student,
            action='view_courses',
            request=request,
            **details
        )
    
    @staticmethod
    def log_search_courses(student: Student, request: HttpRequest = None, **details):
        """Log searching for courses."""
        return EnrollmentAuditLogger.log_action(
            student=student,
            action='search_courses',
            request=request,
            **details
        )
    
    @staticmethod
    def log_view_cart(student: Student, request: HttpRequest = None, **details):
        """Log viewing the cart."""
        return EnrollmentAuditLogger.log_action(
            student=student,
            action='view_cart',
            request=request,
            **details
        )
    
    @staticmethod
    def log_view_waitlist(student: Student, request: HttpRequest = None, **details):
        """Log viewing waitlisted courses."""
        return EnrollmentAuditLogger.log_action(
            student=student,
            action='view_waitlist',
            request=request,
            **details
        )