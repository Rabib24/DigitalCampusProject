from django.db import models
from django.utils import timezone


class CampusActivity(models.Model):
    """Campus Activity model"""
    id = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    type = models.CharField(max_length=50)  # club, competition, student-feature
    organizer_id = models.CharField(max_length=50)  # reference to User
    participants = models.JSONField(null=True, blank=True)  # array: user IDs
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    location = models.CharField(max_length=200)
    registration_deadline = models.DateTimeField()
    max_participants = models.IntegerField()
    status = models.CharField(max_length=20)  # draft, open, closed, cancelled, completed
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    tags = models.JSONField(null=True, blank=True)  # array: string tags
    
    TYPE_CHOICES = [
        ('club', 'Club'),
        ('competition', 'Competition'),
        ('student-feature', 'Student Feature'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    def add_participant(self, user_id):
        """Add a participant to the activity"""
        if self.participants is None:
            self.participants = []
        if isinstance(self.participants, list) and user_id not in self.participants:
            self.participants.append(user_id)
            self.save()
    
    def update_status(self, status):
        """Update the activity status"""
        self.status = status
        self.updated_at = timezone.now()
        self.save()
    
    def to_json(self):
        """Convert campus activity to JSON format"""
        # Convert datetime fields to string representations
        start_date_str = None
        end_date_str = None
        registration_deadline_str = None
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
            if self.registration_deadline:
                registration_deadline_str = str(self.registration_deadline)
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
            'title': self.title,
            'description': self.description,
            'type': self.type,
            'organizer_id': self.organizer_id,
            'participants': self.participants,
            'start_date': start_date_str,
            'end_date': end_date_str,
            'location': self.location,
            'registration_deadline': registration_deadline_str,
            'max_participants': self.max_participants,
            'status': self.status,
            'created_at': created_at_str,
            'updated_at': updated_at_str,
            'tags': self.tags,
        }
    
    def __str__(self):
        return f"Campus Activity: {self.title}"
