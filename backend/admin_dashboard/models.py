from django.db import models
from django.utils import timezone
from users.models import User, Admin

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