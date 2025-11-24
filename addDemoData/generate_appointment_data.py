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

from appointments.models import Appointment
from users.models import User

def generate_appointment_data():
    """Generate demo appointment data"""
    print("Generating demo appointment data...")
    
    # Get faculty and student users
    faculty_users = User.objects.filter(role='faculty')
    student_users = User.objects.filter(role='student')
    
    if not faculty_users.exists() or not student_users.exists():
        print("Faculty or student users not found. Please generate users first.")
        return
    
    # Appointment statuses
    appointment_statuses = ['scheduled', 'completed', 'cancelled', 'no-show']
    
    # Create appointments
    appointment_titles = [
        "Academic Advising Session",
        "Research Project Discussion",
        "Course Selection Guidance",
        "Thesis Proposal Review",
        "Career Planning Meeting",
        "Study Abroad Information",
        "Internship Opportunities",
        "Graduate School Preparation",
        "Course Difficulty Concerns",
        "Research Collaboration Discussion"
    ]
    
    appointment_descriptions = [
        "Discussion about academic progress and course planning for the upcoming semester.",
        "Meeting to discuss ongoing research project and potential collaboration opportunities.",
        "Guidance session for selecting courses that align with academic and career goals.",
        "Review of thesis proposal and feedback on research methodology and content.",
        "Career planning discussion to explore potential career paths and opportunities.",
        "Information session about study abroad programs and application procedures.",
        "Discussion about internship opportunities and how to apply for positions.",
        "Preparation guidance for graduate school applications and entrance exams.",
        "Addressing concerns about course difficulty and strategies for improvement.",
        "Exploring potential research collaboration opportunities between faculty and student."
    ]
    
    locations = [
        "Faculty Office - Building A, Room 101",
        "Faculty Office - Building B, Room 205",
        "Faculty Office - Building C, Room 303",
        "Library - Study Room 1",
        "Library - Study Room 2",
        "Student Center - Conference Room",
        "Engineering Building - Lab 101",
        "Science Building - Room 405",
        "Business School - Room 202",
        "Online Meeting"
    ]
    
    # Create 30 appointments
    for i in range(30):
        # Select a random faculty member and student
        faculty = random.choice(faculty_users)
        student = random.choice(student_users)
        
        # Appointment details
        status = random.choice(appointment_statuses)
        
        # Set dates
        start_datetime = datetime(2023, random.randint(1, 12), random.randint(1, 28), random.randint(9, 16), random.choice([0, 30]))
        end_datetime = start_datetime + timedelta(minutes=random.choice([30, 60]))
        
        # Notes based on status
        notes = ""
        if status == 'completed':
            notes = "Meeting completed successfully. Student showed good understanding of the topics discussed."
        elif status == 'cancelled':
            notes = "Appointment cancelled by student due to scheduling conflict."
        elif status == 'no-show':
            notes = "Student did not attend the scheduled appointment."
        
        Appointment.objects.create(
            id=f'APPT{random.randint(10000, 99999)}',
            faculty_id=faculty.id,
            student_id=student.id,
            title=random.choice(appointment_titles),
            description=random.choice(appointment_descriptions),
            start_datetime=start_datetime,
            end_datetime=end_datetime,
            location=random.choice(locations),
            status=status,
            notes=notes
        )
    
    print("Demo appointment data generated successfully!")

if __name__ == '__main__':
    generate_appointment_data()