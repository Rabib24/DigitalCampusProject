from django.db import models
from django.utils import timezone


class Appointment(models.Model):
    """Appointment model for faculty advising"""
    id = models.CharField(max_length=50, primary_key=True)
    faculty_id = models.CharField(max_length=50)  # reference to Faculty User
    student_id = models.CharField(max_length=50)  # reference to Student User
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    location = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20)  # scheduled, completed, cancelled, no-show
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    notes = models.TextField(blank=True)
    
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no-show', 'No Show'),
    ]
    
    def cancel(self):
        """Cancel the appointment"""
        self.status = 'cancelled'
        self.updated_at = timezone.now()
        self.save()
    
    def complete(self):
        """Mark the appointment as completed"""
        self.status = 'completed'
        self.updated_at = timezone.now()
        self.save()
    
    def mark_no_show(self):
        """Mark the appointment as no-show"""
        self.status = 'no-show'
        self.updated_at = timezone.now()
        self.save()
    
    def to_json(self):
        """Convert appointment to JSON format"""
        # Convert datetime fields to string representations
        start_datetime_str = None
        end_datetime_str = None
        created_at_str = None
        updated_at_str = None
        
        try:
            if self.start_datetime:
                start_datetime_str = str(self.start_datetime)
        except:
            pass
            
        try:
            if self.end_datetime:
                end_datetime_str = str(self.end_datetime)
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
            'faculty_id': self.faculty_id,
            'student_id': self.student_id,
            'title': self.title,
            'description': self.description,
            'start_datetime': start_datetime_str,
            'end_datetime': end_datetime_str,
            'location': self.location,
            'status': self.status,
            'created_at': created_at_str,
            'updated_at': updated_at_str,
            'notes': self.notes,
        }
    
    def __str__(self):
        return f"Appointment: {self.title} - {self.faculty_id} with {self.student_id}"