from django.db import models
from django.utils import timezone
from users.models import User, Staff

class FinanceAdminSettings(models.Model):
    """Finance admin settings model for storing finance admin preferences"""
    staff = models.OneToOneField(Staff, on_delete=models.CASCADE, related_name='finance_settings')
    
    # Notification preferences
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    
    # Dashboard preferences
    dashboard_widgets = models.JSONField(default=dict, blank=True)  # Customizable dashboard widgets
    theme = models.CharField(max_length=20, default='light')  # light, dark, auto
    language = models.CharField(max_length=10, default='en')  # Language preference
    
    # Finance-specific settings
    default_currency = models.CharField(max_length=3, default='USD')  # Default currency
    show_payment_history = models.BooleanField(default=True)
    show_overdue_payments = models.BooleanField(default=True)
    
    # Created and updated timestamps
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Finance Settings for {self.staff}"
    
    def to_json(self):
        """Convert settings to JSON format"""
        return {
            'email_notifications': self.email_notifications,
            'push_notifications': self.push_notifications,
            'dashboard_widgets': self.dashboard_widgets,
            'theme': self.theme,
            'language': self.language,
            'default_currency': self.default_currency,
            'show_payment_history': self.show_payment_history,
            'show_overdue_payments': self.show_overdue_payments,
        }