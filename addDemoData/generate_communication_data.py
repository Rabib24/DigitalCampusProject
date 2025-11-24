import os
import sys
import django
import random
from datetime import datetime, timedelta
import json

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from communications.models import Notification, CalendarEvent, Alert
from users.models import User

def generate_communication_data():
    """Generate demo communications data"""
    print("Generating demo communications data...")
    
    # Get all users
    all_users = User.objects.all()
    if not all_users.exists():
        print("No users found. Please generate users first.")
        return
    
    # Get faculty and student users
    faculty_users = User.objects.filter(role='faculty')
    student_users = User.objects.filter(role='student')
    
    # Notification types
    notification_types = ['info', 'warning', 'error', 'success']
    
    # Create notifications for users
    notification_titles = [
        "Assignment Deadline Reminder",
        "New Course Material Available",
        "Campus Event This Weekend",
        "System Maintenance Scheduled",
        "Financial Aid Application Deadline",
        "Library Book Due Soon",
        "Exam Schedule Published",
        "Research Symposium Registration Open",
        "Career Fair This Thursday",
        "New Campus Policy Announcement"
    ]
    
    notification_messages = [
        "This is a reminder that your assignment is due tomorrow. Please make sure to submit on time.",
        "New lecture slides and reading materials have been uploaded to your course page.",
        "Join us this weekend for the annual campus cultural festival. Food and entertainment provided.",
        "The system will be undergoing maintenance this Saturday from 2 AM to 6 AM. Services may be temporarily unavailable.",
        "The deadline for financial aid applications is approaching. Please submit your application by Friday.",
        "Your library book is due in 3 days. Please return or renew before the due date to avoid fines.",
        "The final exam schedule has been published. Please check your course pages for details.",
        "Registration is now open for the annual research symposium. Register by the end of the week.",
        "The career fair is happening this Thursday from 10 AM to 4 PM in the Student Union Building.",
        "A new campus policy regarding parking permits has been implemented. Please review the updated guidelines."
    ]
    
    for i in range(20):
        # Select a random user
        user = random.choice(all_users)
        
        Notification.objects.create(
            id=f'NOTIF{random.randint(10000, 99999)}',
            user_id=user.id,
            title=random.choice(notification_titles),
            message=random.choice(notification_messages),
            type=random.choice(notification_types),
            is_read=random.choice([True, False])
        )
    
    # Calendar event types and visibility
    event_types = ['event', 'deadline', 'exam']
    visibility_options = ['public', 'private', 'course']
    
    # Create calendar events
    event_titles = [
        "Final Exams Week",
        "Spring Break",
        "Faculty Meeting",
        "Student Club Fair",
        "Research Presentation",
        "Guest Lecture Series",
        "Internship Workshop",
        "Alumni Networking Event",
        "Graduation Ceremony",
        "Orientation for New Students"
    ]
    
    event_descriptions = [
        "Final examination period for all courses. Please check your individual schedules.",
        "University-wide spring break. Offices closed. No classes scheduled.",
        "Monthly faculty meeting to discuss departmental updates and initiatives.",
        "Annual student club fair showcasing organizations and recruitment opportunities.",
        "Student and faculty research presentations open to the campus community.",
        "Guest lecture series featuring industry experts and academics.",
        "Workshop on finding and applying for internship opportunities.",
        "Networking event for alumni and current students to connect professionally.",
        "Commencement ceremony celebrating graduating students and their achievements.",
        "Orientation program for newly admitted students and their families."
    ]
    
    locations = [
        "Main Auditorium",
        "Student Union Building",
        "Library Conference Room",
        "Engineering Building",
        "Science Complex",
        "Business School",
        "Campus Quad",
        "Sports Center",
        "Arts Center",
        "Online"
    ]
    
    for i in range(15):
        # Select a random organizer
        organizer = random.choice(all_users)
        
        # Event details
        event_type = random.choice(event_types)
        visibility = random.choice(visibility_options)
        
        # Set dates
        start_datetime = datetime(2023, random.randint(1, 12), random.randint(1, 28), random.randint(9, 17), 0)
        end_datetime = start_datetime + timedelta(hours=random.randint(1, 4))
        
        # Create attendees list
        num_attendees = random.randint(3, 15)
        attendees = []
        if all_users.exists():
            attendee_users = random.sample(list(all_users), min(num_attendees, len(all_users)))
            attendees = [user.id for user in attendee_users]
        
        CalendarEvent.objects.create(
            id=f'EVENT{random.randint(1000, 9999)}',
            title=random.choice(event_titles),
            description=random.choice(event_descriptions),
            start_datetime=start_datetime,
            end_datetime=end_datetime,
            location=random.choice(locations),
            type=event_type,
            attendees=json.dumps(attendees),
            visibility=visibility,
            recurrence=json.dumps({"frequency": "none"})  # No recurrence for simplicity
        )
    
    # Alert types, priorities, audiences, and statuses
    alert_types = ['emergency', 'announcement', 'notification']
    alert_priorities = ['low', 'medium', 'high', 'urgent']
    alert_audiences = ['campus', 'department', 'course', 'individual']
    alert_statuses = ['draft', 'scheduled', 'sending', 'sent', 'failed']
    
    # Create alerts
    alert_titles = [
        "Campus Closure Due to Severe Weather",
        "System Outage Notice",
        "New Academic Policy Implementation",
        "Campus Safety Alert",
        "Holiday Schedule Announcement",
        "Technology Upgrade Maintenance",
        "Health Services Update",
        "Parking Changes Effective Monday",
        "New Course Registration Now Open",
        "Faculty Office Hours Change"
    ]
    
    alert_messages = [
        "The campus will be closed tomorrow due to severe weather conditions. All classes and activities are cancelled.",
        "We are experiencing a system outage with the student portal. Our IT team is working to resolve the issue.",
        "A new academic policy regarding course withdrawals will be implemented starting next semester.",
        "Please be aware of suspicious activity in the campus area. Report any concerns to campus security immediately.",
        "Please note the adjusted holiday schedule for the upcoming semester. Offices will be closed on observed holidays.",
        "Scheduled maintenance for campus technology systems will occur this weekend. Some services may be temporarily unavailable.",
        "Health services have extended hours during finals week. Appointments are available for student consultations.",
        "New parking regulations will take effect Monday. Please review the updated permit requirements and designated areas.",
        "Registration for spring semester courses is now open. Log in to the student portal to enroll in your courses.",
        "Several faculty members have adjusted their office hours for the fall semester. Please check the updated schedules."
    ]
    
    for i in range(10):
        # Select a random creator
        creator = random.choice(all_users)
        
        # Alert details
        alert_type = random.choice(alert_types)
        priority = random.choice(alert_priorities)
        audience = random.choice(alert_audiences)
        status = random.choice(alert_statuses)
        
        # Set dates
        created_at = datetime(2023, random.randint(1, 12), random.randint(1, 28))
        updated_at = created_at
        scheduled_at = None
        sent_at = None
        
        if status == 'scheduled':
            scheduled_at = created_at + timedelta(days=random.randint(1, 7))
            updated_at = scheduled_at
        elif status in ['sending', 'sent']:
            sent_at = created_at + timedelta(hours=random.randint(1, 24))
            updated_at = sent_at
        elif status == 'failed':
            updated_at = created_at + timedelta(hours=random.randint(1, 24))
        
        # Audience IDs based on audience type
        audience_ids = []
        if audience == 'department' and faculty_users.exists():
            # Select a few departments
            departments = list(set([f.faculty.department for f in faculty_users if hasattr(f, 'faculty') and f.faculty.department]))
            if departments:
                selected_departments = random.sample(departments, min(2, len(departments)))
                audience_ids = selected_departments
        elif audience == 'course':
            # Course IDs would go here in a real implementation
            audience_ids = [f"COURSE{random.randint(100, 999)}" for _ in range(random.randint(1, 3))]
        elif audience == 'individual' and all_users.exists():
            # Select individual users
            selected_users = random.sample(list(all_users), min(5, len(all_users)))
            audience_ids = [user.id for user in selected_users]
        
        Alert.objects.create(
            id=f'ALERT{random.randint(1000, 9999)}',
            title=random.choice(alert_titles),
            message=random.choice(alert_messages),
            type=alert_type,
            priority=priority,
            audience=audience,
            audience_ids=json.dumps(audience_ids),
            channels=json.dumps(["email", "sms", "display"]),
            scheduled_at=scheduled_at,
            sent_at=sent_at,
            status=status,
            created_by=creator.id,
            created_at=created_at,
            updated_at=updated_at
        )
    
    print("Demo communications data generated successfully!")

if __name__ == '__main__':
    generate_communication_data()