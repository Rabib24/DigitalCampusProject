from django.db import models
from django.utils import timezone
from users.models import User, Staff

class ITAdminSettings(models.Model):
    """IT admin settings model for storing IT admin preferences"""
    staff = models.OneToOneField(Staff, on_delete=models.CASCADE, related_name='it_settings')
    
    # Notification preferences
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    
    # Dashboard preferences
    dashboard_widgets = models.JSONField(default=dict, blank=True)  # Customizable dashboard widgets
    theme = models.CharField(max_length=20, default='light')  # light, dark, auto
    language = models.CharField(max_length=10, default='en')  # Language preference
    
    # IT-specific settings
    show_system_logs = models.BooleanField(default=True)
    show_security_alerts = models.BooleanField(default=True)
    default_log_level = models.CharField(max_length=10, default='INFO')  # Default log level to display
    
    # Created and updated timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"IT Settings for {self.staff}"
    
    def to_json(self):
        """Convert settings to JSON format"""
        return {
            'email_notifications': self.email_notifications,
            'push_notifications': self.push_notifications,
            'dashboard_widgets': self.dashboard_widgets,
            'theme': self.theme,
            'language': self.language,
            'show_system_logs': self.show_system_logs,
            'show_security_alerts': self.show_security_alerts,
            'default_log_level': self.default_log_level,
        }