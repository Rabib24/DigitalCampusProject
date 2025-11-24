import uuid

from django.db import models
from django.utils import timezone
from users.models import Faculty, Student

class Grant(models.Model):
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='grants')
    title = models.CharField(max_length=255)
    description = models.TextField()
    funding_agency = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    submission_date = models.DateField(default=timezone.now)
    deadline = models.DateField()
    status = models.CharField(max_length=50, default='draft')
    documents = models.JSONField(null=True, blank=True)  # List of document metadata

    def to_json(self):
        return {
            'id': self.id,
            'faculty_id': self.faculty.employee_id if self.faculty else None,
            'title': self.title,
            'description': self.description,
            'funding_agency': self.funding_agency,
            'amount': float(self.amount),
            'submission_date': str(self.submission_date),
            'deadline': str(self.deadline),
            'status': self.status,
            'documents': self.documents or [],
        }

class EthicsApplication(models.Model):
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='ethics_applications')
    title = models.CharField(max_length=255)
    principal_investigator = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    submission_date = models.DateField(default=timezone.now)
    review_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=50, default='submitted')
    protocol_number = models.CharField(max_length=100, blank=True)
    risk_level = models.CharField(max_length=50, default='minimal')
    project_description = models.TextField(blank=True)
    consent_process = models.TextField(blank=True)
    data_management = models.TextField(blank=True)
    documents = models.JSONField(null=True, blank=True)  # List of document metadata

    def to_json(self):
        return {
            'id': self.id,
            'faculty_id': self.faculty.employee_id if self.faculty else None,
            'title': self.title,
            'principal_investigator': self.principal_investigator,
            'department': self.department,
            'submission_date': str(self.submission_date),
            'review_date': str(self.review_date) if self.review_date else None,
            'status': self.status,
            'protocol_number': self.protocol_number,
            'risk_level': self.risk_level,
            'project_description': self.project_description,
            'consent_process': self.consent_process,
            'data_management': self.data_management,
            'documents': self.documents or [],
        }

class FacultySettings(models.Model):
    """Faculty settings model for storing faculty preferences"""
    faculty = models.OneToOneField(Faculty, on_delete=models.CASCADE, related_name='settings')
    
    # Notification preferences
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    
    # Dashboard preferences
    dashboard_widgets = models.JSONField(default=dict, blank=True)  # Customizable dashboard widgets
    theme = models.CharField(max_length=20, default='light')  # light, dark, auto
    language = models.CharField(max_length=10, default='en')  # Language preference
    
    # Privacy settings
    profile_visibility = models.CharField(
        max_length=20, 
        choices=[
            ('public', 'Public'),
            ('internal', 'Internal Only'),
            ('private', 'Private')
        ],
        default='internal'
    )
    show_email = models.BooleanField(default=True)
    show_office_hours = models.BooleanField(default=True)
    
    # Communication preferences
    preferred_contact_method = models.CharField(
        max_length=20,
        choices=[
            ('email', 'Email'),
            ('phone', 'Phone'),
            ('office', 'Office Hours')
        ],
        default='email'
    )
    
    # Calendar preferences
    calendar_view = models.CharField(
        max_length=20,
        choices=[
            ('month', 'Month'),
            ('week', 'Week'),
            ('day', 'Day')
        ],
        default='week'
    )
    working_hours_start = models.TimeField(default='09:00:00')
    working_hours_end = models.TimeField(default='17:00:00')
    
    # Created and updated timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Settings for {self.faculty}"
    
    def to_json(self):
        """Convert settings to JSON format"""
        return {
            'email_notifications': self.email_notifications,
            'push_notifications': self.push_notifications,
            'sms_notifications': self.sms_notifications,
            'dashboard_widgets': self.dashboard_widgets,
            'theme': self.theme,
            'language': self.language,
            'profile_visibility': self.profile_visibility,
            'show_email': self.show_email,
            'show_office_hours': self.show_office_hours,
            'preferred_contact_method': self.preferred_contact_method,
            'calendar_view': self.calendar_view,
            'working_hours_start': str(self.working_hours_start),
            'working_hours_end': str(self.working_hours_end),
        }

class Collaboration(models.Model):
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='collaborations')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=50, default='active')
    project_id = models.CharField(max_length=50, blank=True)
    collaborators = models.JSONField(default=list, blank=True)
    documents = models.JSONField(default=list, blank=True)
    communications = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def to_json(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'faculty_id': self.faculty.employee_id if self.faculty else None,
            'start_date': str(self.start_date) if self.start_date else None,
            'end_date': str(self.end_date) if self.end_date else None,
            'status': self.status,
            'project_id': self.project_id,
            'collaborators': self.collaborators or [],
            'documents': self.documents or [],
            'communications': self.communications or [],
            'created_at': str(self.created_at),
            'updated_at': str(self.updated_at),
        }

class Milestone(models.Model):
    PRIORITY_CHOICES = [
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in-progress', 'In Progress'),
        ('completed', 'Completed'),
        ('archived', 'Archived'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='milestones')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='milestones')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(blank=True)
    deadline = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    reminders_sent = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def to_json(self):
        return {
            'id': str(self.id),
            'student_id': self.student.student_id,
            'faculty_id': self.faculty.employee_id if self.faculty else None,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'priority': self.priority,
            'status': self.status,
            'notes': self.notes,
            'deadline': self.deadline.isoformat() if self.deadline else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'reminders_sent': self.reminders_sent,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }


class Recording(models.Model):
    """Class recording model for faculty lectures and sessions"""
    id = models.CharField(max_length=50, primary_key=True)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name='recordings')
    course_id = models.CharField(max_length=50, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    file_url = models.CharField(max_length=500, blank=True)
    duration = models.CharField(max_length=20, blank=True)  # e.g., "1h 25m"
    file_size = models.CharField(max_length=20, blank=True)  # e.g., "450 MB"
    status = models.CharField(
        max_length=20,
        choices=[
            ('processing', 'Processing'),
            ('available', 'Available'),
            ('failed', 'Failed'),
            ('scheduled', 'Scheduled'),
        ],
        default='processing'
    )
    visibility = models.CharField(
        max_length=20,
        choices=[
            ('public', 'Public'),
            ('students', 'Students Only'),
            ('private', 'Private'),
        ],
        default='private'
    )
    view_count = models.IntegerField(default=0)
    download_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    recording_date = models.DateTimeField(default=timezone.now)

    def to_json(self):
        """Convert recording to JSON format"""
        return {
            'id': self.id,
            'faculty_id': self.faculty.employee_id if self.faculty else None,
            'course_id': self.course_id,
            'title': self.title,
            'description': self.description,
            'file_url': self.file_url,
            'duration': self.duration,
            'file_size': self.file_size,
            'status': self.status,
            'visibility': self.visibility,
            'view_count': self.view_count,
            'download_count': self.download_count,
            'created_at': str(self.created_at) if self.created_at else None,
            'updated_at': str(self.updated_at) if self.updated_at else None,
            'recording_date': str(self.recording_date) if self.recording_date else None,
        }
