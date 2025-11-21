from django.db import models
from django.utils import timezone
from users.models import User, Staff

class LibraryStaffSettings(models.Model):
    """Library staff settings model for storing library staff preferences"""
    staff = models.OneToOneField(Staff, on_delete=models.CASCADE, related_name='library_settings')
    
    # Notification preferences
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    
    # Dashboard preferences
    dashboard_widgets = models.JSONField(default=dict, blank=True)  # Customizable dashboard widgets
    theme = models.CharField(max_length=20, default='light')  # light, dark, auto
    language = models.CharField(max_length=10, default='en')  # Language preference
    
    # Library-specific settings
    default_location = models.CharField(max_length=100, blank=True)  # Default library location
    show_overdue_items = models.BooleanField(default=True)
    show_reservation_requests = models.BooleanField(default=True)
    
    # Created and updated timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Library Settings for {self.staff}"
    
    def to_json(self):
        """Convert settings to JSON format"""
        return {
            'email_notifications': self.email_notifications,
            'push_notifications': self.push_notifications,
            'dashboard_widgets': self.dashboard_widgets,
            'theme': self.theme,
            'language': self.language,
            'default_location': self.default_location,
            'show_overdue_items': self.show_overdue_items,
            'show_reservation_requests': self.show_reservation_requests,
        }