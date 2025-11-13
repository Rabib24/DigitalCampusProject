from django.db import models
from django.utils import timezone


class Notification(models.Model):
    """Notification model"""
    id = models.CharField(max_length=50, primary_key=True)
    user_id = models.CharField(max_length=50)  # reference to User
    title = models.CharField(max_length=200)
    message = models.TextField()
    type = models.CharField(max_length=20)  # info, warning, error, success
    is_read = models.BooleanField()
    created_at = models.DateTimeField(default=timezone.now)
    
    TYPE_CHOICES = [
        ('info', 'Info'),
        ('warning', 'Warning'),
        ('error', 'Error'),
        ('success', 'Success'),
    ]
    
    def mark_as_read(self):
        """Mark the notification as read"""
        self.is_read = True
        self.save()
    
    def to_json(self):
        """Convert notification to JSON format"""
        # Convert datetime fields to string representations
        created_at_str = None
        
        try:
            if self.created_at:
                created_at_str = str(self.created_at)
        except:
            pass
        
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'message': self.message,
            'type': self.type,
            'is_read': self.is_read,
            'created_at': created_at_str,
        }
    
    def __str__(self):
        return f"Notification: {self.title} for {self.user_id}"


class CalendarEvent(models.Model):
    """Calendar Event model"""
    id = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    location = models.CharField(max_length=200, blank=True)
    type = models.CharField(max_length=20)  # event, deadline, exam
    attendees = models.JSONField(null=True, blank=True)  # array: user IDs
    course_id = models.CharField(max_length=50, blank=True)  # optional reference to Course
    created_at = models.DateTimeField(default=timezone.now)
    recurrence = models.JSONField(null=True, blank=True)  # object: recurrence pattern
    reminders = models.JSONField(null=True, blank=True)  # array: reminder settings
    attachments = models.JSONField(null=True, blank=True)  # array: file references
    visibility = models.CharField(max_length=20)  # public, private, course
    
    TYPE_CHOICES = [
        ('event', 'Event'),
        ('deadline', 'Deadline'),
        ('exam', 'Exam'),
    ]
    
    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('private', 'Private'),
        ('course', 'Course'),
    ]
    
    def add_attendee(self, user_id):
        """Add an attendee to the event"""
        if self.attendees is None:
            self.attendees = []
        if isinstance(self.attendees, list) and user_id not in self.attendees:
            self.attendees.append(user_id)
            self.save()
    
    def is_all_day(self):
        """Check if the event is an all-day event"""
        # This would check if the event spans a full day
        return False
    
    def to_json(self):
        """Convert calendar event to JSON format"""
        # Convert datetime fields to string representations
        start_datetime_str = None
        end_datetime_str = None
        created_at_str = None
        
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
        
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'start_datetime': start_datetime_str,
            'end_datetime': end_datetime_str,
            'location': self.location,
            'type': self.type,
            'attendees': self.attendees,
            'course_id': self.course_id,
            'created_at': created_at_str,
            'recurrence': self.recurrence,
            'reminders': self.reminders,
            'attachments': self.attachments,
            'visibility': self.visibility,
        }
    
    def __str__(self):
        return f"Calendar Event: {self.title}"


class Alert(models.Model):
    """Alert model"""
    id = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(max_length=200)
    message = models.TextField()
    type = models.CharField(max_length=20)  # emergency, announcement, notification
    priority = models.CharField(max_length=20)  # low, medium, high, urgent
    audience = models.CharField(max_length=20)  # campus, department, course, individual
    audience_ids = models.JSONField(null=True, blank=True)  # array: specific user/course/department IDs
    channels = models.JSONField(null=True, blank=True)  # array: email, sms, push, display
    scheduled_at = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20)  # draft, scheduled, sending, sent, failed
    created_by = models.CharField(max_length=50)  # reference to User
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    
    TYPE_CHOICES = [
        ('emergency', 'Emergency'),
        ('announcement', 'Announcement'),
        ('notification', 'Notification'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]
    
    AUDIENCE_CHOICES = [
        ('campus', 'Campus'),
        ('department', 'Department'),
        ('course', 'Course'),
        ('individual', 'Individual'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('scheduled', 'Scheduled'),
        ('sending', 'Sending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
    ]
    
    def schedule(self, scheduled_at):
        """Schedule the alert"""
        self.scheduled_at = scheduled_at
        self.status = 'scheduled'
        self.updated_at = timezone.now()
        self.save()
    
    def send(self):
        """Send the alert"""
        self.sent_at = timezone.now()
        self.status = 'sent'
        self.updated_at = timezone.now()
        self.save()
    
    def to_json(self):
        """Convert alert to JSON format"""
        # Convert datetime fields to string representations
        scheduled_at_str = None
        sent_at_str = None
        created_at_str = None
        updated_at_str = None
        
        try:
            if self.scheduled_at:
                scheduled_at_str = str(self.scheduled_at)
        except:
            pass
            
        try:
            if self.sent_at:
                sent_at_str = str(self.sent_at)
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
            'message': self.message,
            'type': self.type,
            'priority': self.priority,
            'audience': self.audience,
            'audience_ids': self.audience_ids,
            'channels': self.channels,
            'scheduled_at': scheduled_at_str,
            'sent_at': sent_at_str,
            'status': self.status,
            'created_by': self.created_by,
            'created_at': created_at_str,
            'updated_at': updated_at_str,
        }
    
    def __str__(self):
        return f"Alert: {self.title}"
