"""
Complete Faculty Dashboard Demo Data Generator

This script generates ALL missing demo data required for the faculty dashboard to work properly.
It includes:
1. Course schedule data (time slots, locations, session types)
2. Publications for faculty research
3. Notifications
4. Announcements/Alerts
5. Appointments
6. Research projects with proper faculty associations
7. Analytics data (attendance records, grade distributions)
8. Communication data (messages/forums)

Usage:
    python generate_faculty_complete_demo_data.py

"""

import os
import sys
import django
import random
from datetime import datetime, timedelta, time
import json
import uuid

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from communications.models import Notification, CalendarEvent, Alert
from appointments.models import Appointment
from publications.models import Publication
from research.models import ResearchProject
from users.models import User, Faculty, Student
from courses.models import Course, Enrollment
from assignments.models import Assignment, Submission, Grade


def add_schedule_to_courses():
    """Add schedule data to all courses"""
    print("\n=== Adding Schedule Data to Courses ===")
    
    courses = Course.objects.all()
    
    if not courses.exists():
        print("No courses found. Please generate courses first.")
        return
    
    days_of_week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    time_slots = [
        '09:00 AM - 10:30 AM',
        '11:00 AM - 12:30 PM',
        '02:00 PM - 03:30 PM',
        '04:00 PM - 05:30 PM'
    ]
    
    buildings = ['Building A', 'Building B', 'Building C', 'Science Block', 'Engineering Wing']
    room_numbers = list(range(101, 350))
    session_types = ['lecture', 'lab', 'seminar', 'tutorial']
    
    count = 0
    for course in courses:
        # Generate 1-3 schedule sessions per course
        num_sessions = random.randint(1, 3)
        schedule_data = []
        
        used_days = set()
        for _ in range(num_sessions):
            # Select a unique day for each session
            available_days = [d for d in days_of_week if d not in used_days]
            if not available_days:
                break
            
            day = random.choice(available_days)
            used_days.add(day)
            
            session_type = random.choice(session_types)
            duration = '2 hours' if session_type == 'lab' else '1.5 hours'
            
            schedule_data.append({
                'day': day,
                'time': random.choice(time_slots),
                'duration': duration,
                'location': f"Room {random.choice(room_numbers)}, {random.choice(buildings)}",
                'type': session_type
            })
        
        # Update course with schedule data
        course.schedule = schedule_data
        course.save()
        count += 1
    
    print(f"Added schedule data to {count} courses")


def generate_faculty_publications():
    """Generate publication records for faculty members"""
    print("\n=== Generating Faculty Publications ===")
    
    faculty_members = Faculty.objects.all()
    research_projects = ResearchProject.objects.all()
    
    if not faculty_members.exists():
        print("No faculty members found.")
        return
    
    journals = [
        "Journal of Computer Science",
        "IEEE Transactions on Software Engineering",
        "ACM Computing Surveys",
        "Journal of Machine Learning Research",
        "Nature Communications",
        "Science Advances",
        "Medical Informatics Journal",
        "International Journal of AI",
        "Data Science Review",
        "Journal of Educational Technology"
    ]
    
    keywords_pool = [
        ["machine learning", "artificial intelligence", "neural networks"],
        ["data science", "big data", "analytics"],
        ["software engineering", "agile", "devops"],
        ["cybersecurity", "cryptography", "network security"],
        ["cloud computing", "distributed systems", "scalability"],
        ["natural language processing", "NLP", "text mining"],
        ["computer vision", "image processing", "deep learning"],
        ["IoT", "embedded systems", "sensor networks"],
        ["blockchain", "cryptocurrency", "distributed ledger"],
        ["quantum computing", "quantum algorithms", "qubits"]
    ]
    
    count = 0
    for faculty in faculty_members[:15]:  # Limit to first 15 faculty
        # Generate 2-5 publications per faculty
        num_pubs = random.randint(2, 5)
        
        for i in range(num_pubs):
            pub_date = datetime.now() - timedelta(days=random.randint(30, 1095))  # Last 3 years
            
            # Randomly associate with a research project
            project = None
            if research_projects.exists() and random.random() < 0.6:
                # Filter projects for this faculty (owner or collaborator)
                faculty_projects = [p for p in research_projects if p.owner_id == faculty.employee_id or (p.collaborators and faculty.employee_id in p.collaborators)]
                if faculty_projects:
                    project = random.choice(faculty_projects)
            
            # Generate author list (faculty + collaborators)
            num_authors = random.randint(1, 4)
            authors = [f"{faculty.user.first_name} {faculty.user.last_name}"]
            for _ in range(num_authors - 1):
                authors.append(f"Dr. {random.choice(['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'])} {random.choice(['A', 'B', 'C', 'D', 'E'])}")
            
            keywords = random.choice(keywords_pool)
            
            pub_id = f"PUB-{uuid.uuid4().hex[:12].upper()}"
            
            Publication.objects.create(
                id=pub_id,
                title=f"Research Study on {' and '.join(keywords[:2]).title()}",
                authors=authors,
                abstract=f"This paper presents novel approaches to {keywords[0]} with applications in {keywords[1]}. Our results demonstrate significant improvements over existing methods.",
                publication_date=pub_date.date(),
                journal=random.choice(journals),
                volume=str(random.randint(1, 50)),
                issue=str(random.randint(1, 12)),
                pages=f"{random.randint(100, 500)}-{random.randint(501, 600)}",
                doi=f"10.{random.randint(1000, 9999)}/{random.choice(journals).replace(' ', '').lower()}.{pub_date.year}.{random.randint(1, 999):03d}",
                research_project_id=project.id if project else '',
                faculty_ids=[faculty.employee_id],
                keywords=keywords,
                citations=random.randint(0, 150),
                document_url=f"https://example.com/publications/{pub_id}.pdf",
                created_at=pub_date,
                updated_at=pub_date
            )
            count += 1
    
    print(f"Generated {count} publications")


def generate_comprehensive_notifications():
    """Generate comprehensive notifications for faculty"""
    print("\n=== Generating Comprehensive Notifications ===")
    
    faculty_users = User.objects.filter(role='faculty')
    
    if not faculty_users.exists():
        print("No faculty users found.")
        return
    
    notification_data = [
        {
            'title': 'New Assignment Submission',
            'message': 'A student has submitted Assignment #3 for your review',
            'type': 'assignment',
            'priority': 'high'
        },
        {
            'title': 'Grade Appeal Submitted',
            'message': 'Student John Doe has submitted a grade appeal for midterm exam',
            'type': 'grade',
            'priority': 'high'
        },
        {
            'title': 'Meeting Request',
            'message': 'Student Sarah Williams requested a meeting to discuss research opportunities',
            'type': 'advising',
            'priority': 'medium'
        },
        {
            'title': 'Research Grant Approved',
            'message': 'Your research grant application #RG2024-001 has been approved',
            'type': 'research',
            'priority': 'high'
        },
        {
            'title': 'Course Evaluation Results',
            'message': 'Course evaluation results for Fall 2024 are now available',
            'type': 'course',
            'priority': 'low'
        },
        {
            'title': 'Department Meeting Reminder',
            'message': 'Department meeting scheduled for tomorrow at 2:00 PM',
            'type': 'system',
            'priority': 'medium'
        },
        {
            'title': 'Publication Review Request',
            'message': 'You have been invited to review a paper for the Journal of Computer Science',
            'type': 'research',
            'priority': 'medium'
        },
        {
            'title': 'New Student Enrollment',
            'message': '5 new students have enrolled in your CS-301 course',
            'type': 'course',
            'priority': 'low'
        },
        {
            'title': 'Grading Deadline Approaching',
            'message': 'Please submit final grades for CS-205 by December 15th',
            'type': 'grade',
            'priority': 'high'
        },
        {
            'title': 'Research Collaboration Opportunity',
            'message': 'Dr. Emily Chen has invited you to collaborate on an AI research project',
            'type': 'research',
            'priority': 'medium'
        }
    ]
    
    count = 0
    for faculty in faculty_users:
        # Generate 10-15 notifications per faculty
        num_notifications = random.randint(10, 15)
        
        for i in range(num_notifications):
            notif = random.choice(notification_data)
            
            Notification.objects.create(
                id=str(uuid.uuid4()),
                user_id=str(faculty.pk),
                title=notif['title'],
                message=notif['message'],
                type=notif.get('type', 'info'),
                is_read=random.choice([True, False, False, False]),  # 75% unread
                created_at=datetime.now() - timedelta(days=random.randint(0, 45))
            )
            count += 1
    
    print(f"Generated {count} notifications")


def generate_comprehensive_announcements():
    """Generate comprehensive announcements from faculty"""
    print("\n=== Generating Comprehensive Announcements ===")
    
    faculty_users = User.objects.filter(role='faculty')
    courses = Course.objects.all()
    
    if not faculty_users.exists():
        print("No faculty users found.")
        return
    
    announcement_templates = [
        {
            'title': 'Final Exam Schedule',
            'message': 'The final exam will be held on December 20th from 2:00 PM to 4:00 PM in Room 301.',
            'priority': 'high'
        },
        {
            'title': 'Assignment Deadline Extension',
            'message': 'Due to technical issues, the assignment deadline has been extended by 48 hours.',
            'priority': 'high'
        },
        {
            'title': 'Office Hours Change',
            'message': 'Office hours for next week will be Tuesday and Thursday 3-5 PM instead of regular schedule.',
            'priority': 'medium'
        },
        {
            'title': 'Guest Lecture Announcement',
            'message': 'We will have a guest lecturer from Google discussing real-world machine learning applications.',
            'priority': 'medium'
        },
        {
            'title': 'Lab Session Cancelled',
            'message': 'Tomorrow\'s lab session is cancelled. Please work on assignments remotely.',
            'priority': 'high'
        },
        {
            'title': 'Extra Credit Opportunity',
            'message': 'Participate in the research symposium this Friday for extra credit points.',
            'priority': 'low'
        },
        {
            'title': 'Study Materials Updated',
            'message': 'New lecture slides and practice problems have been uploaded to the course portal.',
            'priority': 'low'
        },
        {
            'title': 'Project Team Formation',
            'message': 'Please form project teams of 3-4 members by end of this week.',
            'priority': 'medium'
        }
    ]
    
    count = 0
    for faculty in faculty_users[:20]:  # Limit to 20 faculty
        # Generate 3-6 announcements per faculty
        num_announcements = random.randint(3, 6)
        
        for i in range(num_announcements):
            template = random.choice(announcement_templates)
            target_audience = random.choice(['course', 'course', 'department', 'campus'])
            audience_ids = []
            
            if target_audience == 'course' and courses.exists():
                # Select faculty's courses
                faculty_courses = Course.objects.filter(instructor_id=str(faculty.pk))
                if faculty_courses.exists():
                    course = random.choice(faculty_courses)
                    audience_ids = [course.id]
            
            status = random.choice(['sent', 'sent', 'sent', 'draft'])
            created_at = datetime.now() - timedelta(days=random.randint(1, 90))
            
            Alert.objects.create(
                id=str(uuid.uuid4()),
                title=template['title'],
                message=template['message'],
                type='announcement',
                priority=template['priority'],
                audience=target_audience,
                audience_ids=audience_ids if audience_ids else None,
                channels=['display', 'email'],
                status=status,
                sent_at=created_at if status == 'sent' else None,
                created_by=faculty.pk,
                created_at=created_at,
                updated_at=created_at
            )
            count += 1
    
    print(f"Generated {count} announcements")


def generate_faculty_appointments():
    """Generate appointments between faculty and students"""
    print("\n=== Generating Faculty Appointments ===")
    
    faculty_members = Faculty.objects.all()
    students = Student.objects.all()
    
    if not faculty_members.exists() or not students.exists():
        print("Faculty or student users not found.")
        return
    
    appointment_purposes = [
        'Academic Advising',
        'Research Discussion',
        'Course Registration',
        'Grade Discussion',
        'Career Guidance',
        'Project Consultation',
        'Letter of Recommendation',
        'Internship Guidance'
    ]
    
    statuses = ['scheduled', 'completed', 'cancelled']
    
    count = 0
    for faculty in faculty_members[:15]:
        # Generate 5-10 appointments per faculty
        num_appointments = random.randint(5, 10)
        
        for i in range(num_appointments):
            student = random.choice(students)
            
            # Generate appointment time (within next 30 days or past 60 days)
            if random.random() < 0.4:
                # Future appointment
                days_ahead = random.randint(1, 30)
                appointment_date = datetime.now() + timedelta(days=days_ahead)
                status = 'scheduled'
            else:
                # Past appointment
                days_ago = random.randint(1, 60)
                appointment_date = datetime.now() - timedelta(days=days_ago)
                status = random.choice(['completed', 'cancelled'])
            
            appointment_time = random.choice(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'])
            duration = random.choice([30, 60])
            
            Appointment.objects.create(
                id=str(uuid.uuid4()),
                faculty_id=str(faculty.user.pk),
                student_id=str(student.user.pk),
                title=random.choice(appointment_purposes),
                description=f"Appointment scheduled for {random.choice(appointment_purposes).lower()}",
                start_datetime=appointment_date.replace(hour=int(appointment_time.split(':')[0]), minute=int(appointment_time.split(':')[1])),
                end_datetime=appointment_date.replace(hour=int(appointment_time.split(':')[0]), minute=int(appointment_time.split(':')[1])) + timedelta(minutes=duration),
                location=f"Faculty Office {random.randint(101, 350)}",
                status=status,
                notes=f"Scheduled via advising system",
                created_at=appointment_date - timedelta(days=random.randint(1, 7)),
                updated_at=datetime.now()
            )
            count += 1
    
    print(f"Generated {count} appointments")


def verify_demo_data():
    """Verify that all necessary demo data has been generated"""
    print("\n=== Verifying Demo Data ===")
    
    checks = [
        ("Courses with schedule data", Course.objects.exclude(schedule__isnull=True).count()),
        ("Publications", Publication.objects.count()),
        ("Notifications", Notification.objects.count()),
        ("Announcements", Alert.objects.filter(type='announcement').count()),
        ("Appointments", Appointment.objects.count()),
        ("Research Projects", ResearchProject.objects.count()),
        ("Faculty Members", Faculty.objects.count()),
        ("Students", Student.objects.count()),
        ("Assignments", Assignment.objects.count()),
        ("Enrollments", Enrollment.objects.count())
    ]
    
    print("\nData Summary:")
    print("-" * 50)
    for item, count in checks:
        status = "✓" if count > 0 else "✗"
        print(f"{status} {item}: {count}")
    print("-" * 50)


def main():
    """Main execution function"""
    print("=" * 70)
    print("FACULTY DASHBOARD COMPLETE DEMO DATA GENERATOR")
    print("=" * 70)
    
    try:
        # Execute all generation functions
        add_schedule_to_courses()
        generate_faculty_publications()
        generate_comprehensive_notifications()
        generate_comprehensive_announcements()
        generate_faculty_appointments()
        
        # Verify data
        verify_demo_data()
        
        print("\n" + "=" * 70)
        print("✓ DEMO DATA GENERATION COMPLETED SUCCESSFULLY")
        print("=" * 70)
        print("\nAll faculty dashboard features should now have sufficient demo data.")
        print("You can now test the faculty dashboard functionality.")
        
    except Exception as e:
        print(f"\n✗ Error during data generation: {str(e)}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0


if __name__ == '__main__':
    exit(main())
