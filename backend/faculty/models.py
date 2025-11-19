from django.db import models
from django.utils import timezone
from users.models import Faculty

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