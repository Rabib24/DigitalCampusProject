from django.db import models
from django.utils import timezone


class EnrollmentPeriod(models.Model):
    """Model to track enrollment periods for different student groups"""
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    student_group = models.CharField(max_length=50, blank=True)  # e.g., 'freshmen', 'sophomores', etc.
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['start_date', 'end_date']
    
    def is_current(self):
        """Check if this enrollment period is currently active"""
        current_date = timezone.now().date()
        return self.is_active and self.start_date <= current_date <= self.end_date
    
    def to_json(self):
        """Convert enrollment period to JSON format"""
        # Convert date fields to string representations
        start_date_str = None
        end_date_str = None
        created_at_str = None
        updated_at_str = None
        
        try:
            if self.start_date:
                start_date_str = str(self.start_date)
        except:
            pass
            
        try:
            if self.end_date:
                end_date_str = str(self.end_date)
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
            'name': self.name,
            'description': self.description,
            'start_date': start_date_str,
            'end_date': end_date_str,
            'student_group': self.student_group,
            'is_active': self.is_active,
            'created_at': created_at_str,
            'updated_at': updated_at_str,
        }
    
    def __str__(self):
        return f"{self.name} ({self.start_date} to {self.end_date})"