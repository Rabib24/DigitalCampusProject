from django.db import models
from django.utils import timezone


class ConsentLog(models.Model):
    """Consent Log model for faculty recordings and data sharing"""
    id = models.CharField(max_length=50, primary_key=True)
    user_id = models.CharField(max_length=50)  # reference to User
    faculty_id = models.CharField(max_length=50, blank=True)  # reference to Faculty User (if applicable)
    consent_type = models.CharField(max_length=100)  # recording, data_sharing, research_participation, etc.
    resource_id = models.CharField(max_length=50, blank=True)  # ID of the resource (course, recording, etc.)
    resource_type = models.CharField(max_length=50, blank=True)  # course, recording, research_project, etc.
    granted = models.BooleanField()  # True if consent is granted, False if revoked
    granted_at = models.DateTimeField(null=True, blank=True)
    revoked_at = models.DateTimeField(null=True, blank=True)
    expiry_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    
    CONSENT_TYPE_CHOICES = [
        ('recording', 'Recording'),
        ('data_sharing', 'Data Sharing'),
        ('research_participation', 'Research Participation'),
        ('other', 'Other'),
    ]
    
    RESOURCE_TYPE_CHOICES = [
        ('course', 'Course'),
        ('recording', 'Recording'),
        ('research_project', 'Research Project'),
        ('other', 'Other'),
    ]
    
    def grant_consent(self):
        """Grant consent"""
        self.granted = True
        self.granted_at = timezone.now()
        self.revoked_at = None
        self.updated_at = timezone.now()
        self.save()
    
    def revoke_consent(self):
        """Revoke consent"""
        self.granted = False
        self.revoked_at = timezone.now()
        self.updated_at = timezone.now()
        self.save()
    
    def is_active(self):
        """Check if consent is currently active"""
        if not self.granted:
            return False
        if self.expiry_date and timezone.now().date() > self.expiry_date:
            return False
        return True
    
    def to_json(self):
        """Convert consent log to JSON format"""
        # Convert datetime and date fields to string representations
        granted_at_str = None
        revoked_at_str = None
        expiry_date_str = None
        created_at_str = None
        updated_at_str = None
        
        try:
            if self.granted_at:
                granted_at_str = str(self.granted_at)
        except:
            pass
            
        try:
            if self.revoked_at:
                revoked_at_str = str(self.revoked_at)
        except:
            pass
            
        try:
            if self.expiry_date:
                expiry_date_str = str(self.expiry_date)
        except:
            pass
            
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
            'faculty_id': self.faculty_id,
            'consent_type': self.consent_type,
            'resource_id': self.resource_id,
            'resource_type': self.resource_type,
            'granted': self.granted,
            'granted_at': granted_at_str,
            'revoked_at': revoked_at_str,
            'expiry_date': expiry_date_str,
            'notes': self.notes,
            'created_at': created_at_str,
            'updated_at': updated_at_str,
        }
    
    def __str__(self):
        status = "Granted" if self.granted else "Revoked"
        return f"Consent Log: {self.consent_type} - {status}"