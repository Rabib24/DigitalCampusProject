"""
Comprehensive Faculty Dashboard Demo Data Generator

This script generates all necessary demo data for the faculty dashboard to function properly,
including:
1. Notifications for faculty users
2. Announcements/Alerts created by faculty
3. Appointments between faculty and advisees
4. Research projects and publications
5. Course schedule data
6. Analytics-ready data (attendance, grades, etc.)

Run this script to populate the database with sample data for testing the faculty dashboard.
"""

import os
import sys
import django
import random
from datetime import datetime, timedelta
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
from assignments.models import Assignment, AssignmentSubmission, Grade


def generate_faculty_notifications():
    """Generate notifications specifically for faculty users"""
    print("Generating faculty notifications...")
    
    faculty_users = User.objects.filter(role='faculty')
    
    if not faculty_users.exists():
        print("No faculty users found. Please generate users first.")
        return
    
    faculty_notification_titles = [
        "New Assignment Submission",
        "Student Request for Meeting",
        "Department Meeting Reminder",
        "Grading Deadline Approaching",
        "Research Grant Application Approved",
        "Course Evaluation Results Available",
        "Faculty Development Workshop",
        "Student Grade Appeal",
        "Publication Review Request",
        "Research Collaboration Opportunity",
        "New Course Material Request",
        "Academic Calendar Update",
        "Semester Final Exam Schedule",
        "Faculty Performance Review",
        "Research Funding Opportunity"
    ]
    
    faculty_notification_messages = [
        "A student has submitted an assignment for CS-301: Data Science and Machine Learning",
        "Sarah Williams (S2024002) has requested a meeting to discuss course progress",
        "Department meeting scheduled for tomorrow at 2:00 PM in Conference Room A",
        "Please complete grading for CS-205 assignments by end of week",
        "Your research grant application has been approved for funding",
        "Course evaluation results for Fall 2023 are now available in the faculty portal",
        "Faculty development workshop on innovative teaching methods this Friday",
        "A student has filed a grade appeal for Assignment #3 in CS-101",
        "You have been invited to review a publication for the Journal of Computer Science",
        "Dr. John Smith has invited you to collaborate on a research project",
        "Students have requested additional reading materials for CS-401",
        "The academic calendar has been updated with new important dates",
        "Final exam schedule for the semester has been published",
        "Annual faculty performance review period begins next week",
        "New research funding opportunity from the National Science Foundation"
    ]
    
    notification_types = ['info', 'warning', 'success']
    
    for faculty in faculty_users:
        # Generate 5-10 notifications per faculty
        num_notifications = random.randint(5, 10)
        
        for i in range(num_notifications):
            Notification.objects.create(
                id=str(uuid.uuid4()),
                user_id=faculty.user_id,
                title=random.choice(faculty_notification_titles),
                message=random.choice(faculty_notification_messages),
                type=random.choice(notification_types),
                is_read=random.choice([True, False, False]),  # More likely to be unread
                created_at=datetime.now() - timedelta(days=random.randint(0, 30))
            )
    
    print(f"Generated notifications for {faculty_users.count()} faculty members")


def generate_faculty_announcements():
    """Generate announcements/alerts created by faculty"""
    print("Generating faculty announcements...")
    
    faculty_users = User.objects.filter(role='faculty')
    courses = Course.objects.all()
    
    if not faculty_users.exists():
        print("No faculty users found.")
        return
    
    announcement_titles = [
        "Final Exam Schedule Published",
        "Office Hours Change",
        "New Research Grant Opportunity",
        "Assignment Deadline Extended",
        "Guest Lecturer This Week",
        "Lab Session Cancelled",
        "Midterm Exam Review Session",
        "Project Team Formation",
        "Extra Credit Opportunity",
        "Course Materials Updated",
        "Study Group Formation",
        "Research Paper Requirements",
        "Field Trip Announcement",
        "Software Installation Instructions",
        "Academic Integrity Reminder"
    ]
    
    announcement_messages = [
        "The final exam schedule has been published. Please check your course page for details.",
        "My office hours for next week will be adjusted due to a conference. New times posted on the course page.",
        "The National Science Foundation has announced a new research grant opportunity for AI research.",
        "The assignment deadline has been extended by 48 hours due to technical issues.",
        "We have a guest lecturer this Thursday discussing industry applications of machine learning.",
        "Tomorrow's lab session is cancelled. Please work on your assignments remotely.",
        "Midterm exam review session scheduled for Friday 3-5 PM in Room 205.",
        "Please form project teams by Friday. Each team should have 3-4 members.",
        "Extra credit opportunity available for those who participate in the research symposium.",
        "New lecture slides and reading materials have been uploaded to the course page.",
        "Study groups are forming for the upcoming final exam. Sign up sheet available in class.",
        "Updated requirements for the final research paper have been posted.",
        "Field trip to the Data Science Lab scheduled for next Tuesday. Sign up required.",
        "Please install Python 3.11 and required libraries before next week's lab session.",
        "Reminder: All work must be your own. Review the academic integrity policy."
    ]
    
    for faculty in faculty_users[:10]:  # Limit to first 10 faculty
        # Generate 2-5 announcements per faculty
        num_announcements = random.randint(2, 5)
        
        for i in range(num_announcements):
            target_audience = random.choice(['campus', 'department', 'course'])
            audience_ids = []
            
            if target_audience == 'course' and courses.exists():
                # Select a random course
                course = random.choice(courses)
                audience_ids = [course.course_id]
            elif target_audience == 'department':
                if hasattr(faculty, 'faculty'):
                    audience_ids = [faculty.faculty.department]
            
            status = random.choice(['draft', 'sent', 'sent', 'sent'])  # More likely to be sent
            created_at = datetime.now() - timedelta(days=random.randint(1, 60))
            
            Alert.objects.create(
                id=str(uuid.uuid4()),
                title=random.choice(announcement_titles),
                message=random.choice(announcement_messages),
                type='announcement',
                priority=random.choice(['low', 'medium', 'high']),
                audience=target_audience,
                audience_ids=audience_ids if audience_ids else None,
                channels=['display', 'email'],
                status=status,
                sent_at=created_at if status == 'sent' else None,
                created_by=faculty.user_id,
                created_at=created_at,
                updated_at=created_at
            )
    
    print("Generated faculty announcements")


def generate_faculty_appointments():
    """Generate appointments between faculty and their advisees"""
    print("Generating faculty appointments...")
    
    faculty_users = User.objects.filter(role='faculty')
    student_users = User.objects.filter(role='student')
    
    if not faculty_users.exists() or not student_users.exists():
        print("Faculty or student users not found.")
        return
    
    appointment_titles = [
        "Academic Advising - Course Selection",
        "Research Project Discussion",
        "Career Planning Meeting",
        "Thesis Progress Review",
        "Graduate School Preparation",
        "Internship Planning",
        "Academic Performance Review",
        "Study Abroad Consultation",
        "Major Declaration Guidance",
        "Capstone Project Planning"
    ]
    
    locations = [
        "Room 205, Building A",
        "Room 301, Building B",
        "Room 102, Building C",
        "Faculty Office 405",
        "Online Meeting",
        "Library Study Room 3",
        "Conference Room A"
    ]
    
    statuses = ['scheduled', 'scheduled', 'completed', 'cancelled', 'no-show']
    
    for faculty in faculty_users[:10]:  # First 10 faculty
        # Generate 3-8 appointments per faculty
        num_appointments = random.randint(3, 8)
        
        for i in range(num_appointments):
            student = random.choice(student_users)
            
            # Appointments in past, present, and future
            days_offset = random.randint(-30, 30)
            start_datetime = datetime.now() + timedelta(
                days=days_offset,
                hours=random.randint(9, 16)
            )
            duration = random.choice([30, 60])
            end_datetime = start_datetime + timedelta(minutes=duration)
            
            status = random.choice(statuses) if days_offset < 0 else 'scheduled'
            
            notes = ""
            if status == 'completed':
                notes = "Discussed course selection and career goals. Student is on track."
            elif status == 'cancelled':
                notes = "Rescheduled due to faculty conference attendance."
            
            Appointment.objects.create(
                id=str(uuid.uuid4()),
                faculty_id=faculty.user_id,
                student_id=student.user_id,
                title=random.choice(appointment_titles),
                description=f"Meeting with {student.first_name} {student.last_name}",
                start_datetime=start_datetime,
                end_datetime=end_datetime,
                location=random.choice(locations),
                status=status,
                notes=notes,
                created_at=datetime.now() - timedelta(days=random.randint(1, 60))
            )
    
    print("Generated faculty appointments")


def generate_research_publications():
    """Generate research publications for faculty"""
    print("Generating research publications...")
    
    faculty_users = User.objects.filter(role='faculty')
    
    if not faculty_users.exists():
        print("No faculty users found.")
        return
    
    publication_titles = [
        "Machine Learning Applications in Healthcare Data Analysis",
        "Deep Learning Approaches for Natural Language Processing",
        "Blockchain Technology in Supply Chain Management",
        "Cybersecurity Frameworks for IoT Devices",
        "Data-Driven Decision Making in Education",
        "AI Ethics and Responsible Computing",
        "Cloud Computing Architecture for Big Data",
        "Computer Vision for Medical Image Analysis",
        "Quantum Computing Algorithms and Applications",
        "Software Engineering Best Practices for Agile Development"
    ]
    
    journals = [
        "Journal of Computer Science",
        "IEEE Transactions on Software Engineering",
        "ACM Computing Surveys",
        "Nature Machine Intelligence",
        "Science Advances",
        "Communications of the ACM",
        "Journal of Artificial Intelligence Research",
        "Data Mining and Knowledge Discovery",
        "International Journal of Cybersecurity",
        "Educational Technology & Society"
    ]
    
    keywords_list = [
        ["machine learning", "healthcare", "data analysis", "predictive modeling"],
        ["deep learning", "NLP", "transformers", "BERT"],
        ["blockchain", "supply chain", "distributed ledger", "smart contracts"],
        ["cybersecurity", "IoT", "security frameworks", "threat detection"],
        ["data science", "education", "analytics", "decision making"],
        ["AI ethics", "responsible AI", "fairness", "transparency"],
        ["cloud computing", "big data", "scalability", "architecture"],
        ["computer vision", "medical imaging", "CNN", "image segmentation"],
        ["quantum computing", "algorithms", "qubits", "quantum supremacy"],
        ["software engineering", "agile", "DevOps", "best practices"]
    ]
    
    for faculty in faculty_users[:8]:  # First 8 faculty
        # Generate 2-5 publications per faculty
        num_publications = random.randint(2, 5)
        
        for i in range(num_publications):
            pub_date = datetime.now() - timedelta(days=random.randint(30, 365*3))
            
            # Co-authors
            num_coauthors = random.randint(1, 3)
            coauthors = [f"{faculty.first_name} {faculty.last_name}"]
            coauthors += [f"Dr. {chr(65+j)}. Smith" for j in range(num_coauthors)]
            
            keywords = random.choice(keywords_list)
            
            Publication.objects.create(
                id=str(uuid.uuid4()),
                title=random.choice(publication_titles),
                authors=coauthors,
                abstract=f"This paper presents research on {keywords[0]} and its applications in {keywords[1]}.",
                publication_date=pub_date.date(),
                journal=random.choice(journals),
                volume=str(random.randint(10, 50)),
                issue=str(random.randint(1, 12)),
                pages=f"{random.randint(100, 500)}-{random.randint(501, 600)}",
                doi=f"10.{random.randint(1000, 9999)}/jcs.{random.randint(2020, 2024)}.{random.randint(1000, 9999)}",
                faculty_ids=[faculty.user_id],
                keywords=keywords,
                citations=random.randint(0, 150),
                created_at=pub_date,
                updated_at=pub_date
            )
    
    print("Generated research publications")


def generate_course_schedule_data():
    """Generate calendar events for faculty course schedules"""
    print("Generating course schedule data...")
    
    faculty_users = User.objects.filter(role='faculty')
    courses = Course.objects.all()
    
    if not faculty_users.exists() or not courses.exists():
        print("Faculty or courses not found.")
        return
    
    days_of_week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    class_times = ['09:00', '10:30', '13:00', '14:30', '16:00']
    
    for faculty in faculty_users[:10]:
        # Get courses taught by this faculty
        faculty_courses = courses.filter(instructor_id=faculty.user_id)[:3]
        
        for course in faculty_courses:
            # Create 2-3 class sessions per week
            num_sessions = random.randint(2, 3)
            selected_days = random.sample(days_of_week, num_sessions)
            
            for day in selected_days:
                # Map day to date offset (Monday=0, Friday=4)
                day_offset = days_of_week.index(day)
                start_time = random.choice(class_times)
                hour = int(start_time.split(':')[0])
                
                # Create recurring event for the semester
                start_datetime = datetime.now().replace(
                    hour=hour, minute=0, second=0, microsecond=0
                )
                # Adjust to next occurrence of the day
                days_ahead = day_offset - start_datetime.weekday()
                if days_ahead <= 0:
                    days_ahead += 7
                start_datetime += timedelta(days=days_ahead)
                
                end_datetime = start_datetime + timedelta(hours=1, minutes=30)
                
                CalendarEvent.objects.create(
                    id=str(uuid.uuid4()),
                    title=f"{course.course_code}: {course.course_name}",
                    description=f"Lecture for {course.course_name}",
                    start_datetime=start_datetime,
                    end_datetime=end_datetime,
                    location=f"Room {random.randint(100, 500)}, Building {random.choice(['A', 'B', 'C'])}",
                    type='event',
                    course_id=course.course_id,
                    visibility='course',
                    recurrence=json.dumps({"frequency": "weekly", "until": "2024-12-15"}),
                    created_at=datetime.now() - timedelta(days=90)
                )
    
    print("Generated course schedule data")


def generate_analytics_data():
    """Ensure data exists for analytics calculations"""
    print("Ensuring analytics data exists...")
    
    # This doesn't create new data, but verifies that the existing data
    # generated by other scripts is sufficient for analytics
    
    courses = Course.objects.all()
    enrollments = Enrollment.objects.all()
    assignments = Assignment.objects.all()
    grades = Grade.objects.all()
    
    print(f"  Courses: {courses.count()}")
    print(f"  Enrollments: {enrollments.count()}")
    print(f"  Assignments: {assignments.count()}")
    print(f"  Grades: {grades.count()}")
    
    if courses.count() == 0 or enrollments.count() == 0:
        print("  Warning: Run generate_course_data.py and generate_enrollment_data.py first")
    if assignments.count() == 0:
        print("  Warning: Run generate_assignment_data.py first")
    if grades.count() == 0:
        print("  Warning: Run generate_grade_data.py first")
    
    print("Analytics data check complete")


def main():
    """Main function to generate all faculty dashboard data"""
    print("=" * 70)
    print("FACULTY DASHBOARD COMPREHENSIVE DEMO DATA GENERATOR")
    print("=" * 70)
    print()
    
    try:
        # Generate data in order of dependencies
        generate_faculty_notifications()
        print()
        
        generate_faculty_announcements()
        print()
        
        generate_faculty_appointments()
        print()
        
        generate_research_publications()
        print()
        
        generate_course_schedule_data()
        print()
        
        generate_analytics_data()
        print()
        
        print("=" * 70)
        print("✓ FACULTY DASHBOARD DEMO DATA GENERATION COMPLETE!")
        print("=" * 70)
        print()
        print("Generated data includes:")
        print("  - Faculty notifications")
        print("  - Faculty announcements/alerts")
        print("  - Faculty-student appointments")
        print("  - Research publications")
        print("  - Course schedule events")
        print()
        print("The faculty dashboard should now have sufficient data to function properly.")
        print()
        print("Note: Make sure you have already run:")
        print("  - generate_user_data.py (for users)")
        print("  - generate_course_data.py (for courses)")
        print("  - generate_enrollment_data.py (for enrollments)")
        print("  - generate_assignment_data.py (for assignments)")
        print("  - generate_grade_data.py (for grades)")
        print("  - generate_research_data.py (for research projects)")
        
    except Exception as e:
        print(f"\n❌ Error generating data: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
