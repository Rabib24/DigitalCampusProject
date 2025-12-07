from django.db import models
from django.utils import timezone
from users.models import User, Admin, Student
from courses.models import Course

class AdminSettings(models.Model):
    """Admin settings model for storing admin preferences"""
    admin = models.OneToOneField(Admin, on_delete=models.CASCADE, related_name='settings')
    
    # Notification preferences
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    
    # Dashboard preferences
    dashboard_widgets = models.JSONField(default=dict, blank=True)  # Customizable dashboard widgets
    theme = models.CharField(max_length=20, default='light')  # light, dark, auto
    language = models.CharField(max_length=10, default='en')  # Language preference
    
    # Security settings
    two_factor_auth = models.BooleanField(default=False)
    session_timeout = models.IntegerField(default=30)  # Session timeout in minutes
    
    # Created and updated timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Settings for {self.admin}"
    
    def to_json(self):
        """Convert settings to JSON format"""
        return {
            'email_notifications': self.email_notifications,
            'push_notifications': self.push_notifications,
            'dashboard_widgets': self.dashboard_widgets,
            'theme': self.theme,
            'language': self.language,
            'two_factor_auth': self.two_factor_auth,
            'session_timeout': self.session_timeout,
        }


class EnrollmentOverrideRequest(models.Model):
    """Model to track special enrollment requests that need admin approval"""
    REQUEST_TYPES = [
        ('prerequisite_override', 'Prerequisite Override'),
        ('capacity_override', 'Capacity Override'),
        ('time_period_override', 'Time Period Override'),
        ('restricted_course', 'Restricted Course Access'),
        ('other', 'Other')
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ]
    
    id = models.CharField(max_length=50, primary_key=True)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    request_type = models.CharField(max_length=50, choices=REQUEST_TYPES)
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    requested_at = models.DateTimeField(default=timezone.now)
    processed_at = models.DateTimeField(null=True, blank=True)
    processed_by = models.CharField(max_length=100, blank=True)  # Admin who processed the request
    admin_notes = models.TextField(blank=True)  # Notes from admin during processing
    
    class Meta:
        ordering = ['-requested_at']
    
    def approve(self, admin_user):
        """Approve the enrollment override request"""
        self.status = 'approved'
        self.processed_at = timezone.now()
        self.processed_by = admin_user
        self.save()
    
    def reject(self, admin_user, notes=''):
        """Reject the enrollment override request"""
        self.status = 'rejected'
        self.processed_at = timezone.now()
        self.processed_by = admin_user
        self.admin_notes = notes
        self.save()
    
    def to_json(self):
        """Convert enrollment override request to JSON format"""
        return {
            'id': self.id,
            'student_id': self.student.student_id,
            'student_name': f'{self.student.user.first_name} {self.student.user.last_name}',
            'course_id': self.course.id,
            'course_code': self.course.code,
            'course_name': self.course.name,
            'request_type': self.request_type,
            'reason': self.reason,
            'status': self.status,
            'requested_at': self.requested_at.isoformat() if self.requested_at else None,
            'processed_at': self.processed_at.isoformat() if self.processed_at else None,
            'processed_by': self.processed_by,
            'admin_notes': self.admin_notes
        }
    
    def __str__(self):
        return f"{self.student.student_id} - {self.course.code} - {self.request_type} ({self.status})"