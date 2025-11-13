from django.db import models
from django.utils import timezone


class EmergencyContact(models.Model):
    """Emergency Contact model"""
    id = models.CharField(max_length=50, primary_key=True)
    user_id = models.CharField(max_length=50)  # reference to User
    name = models.CharField(max_length=100)
    relationship = models.CharField(max_length=50)
    phone = models.CharField(max_length=20)
    email = models.CharField(max_length=100, blank=True)
    is_primary = models.BooleanField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    
    def to_json(self):
        """Convert emergency contact to JSON format"""
        # Convert datetime fields to string representations
        created_at_str = None
        updated_at_str = None
        
        try:
            if self.created_at:
                created_at_str = str(self.created_at)
        except:
            pass
            
        try:
            if self.updated_at:
                updated_at_str = str(self.updated_at)
        except:
            pass
        
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'relationship': self.relationship,
            'phone': self.phone,
            'email': self.email,
            'is_primary': self.is_primary,
            'created_at': created_at_str,
            'updated_at': updated_at_str,
        }
    
    def __str__(self):
        return f"Emergency Contact: {self.name} for {self.user_id}"
