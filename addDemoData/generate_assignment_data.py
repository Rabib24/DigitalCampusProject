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

from assignments.models import Assignment, Submission, Grade
from courses.models import Course
from users.models import User

def generate_assignments():
    """Generate demo assignments, submissions, and grades"""
    print("Generating demo assignments, submissions, and grades...")
    
    # Get courses
    courses = Course.objects.all()
    if not courses.exists():
        print("No courses found. Please generate courses first.")
        return
    
    # Get student and faculty users
    student_users = User.objects.filter(role='student')
    faculty_users = User.objects.filter(role='faculty')
    
    if not student_users.exists() or not faculty_users.exists():
        print("Students or faculty not found. Please generate users first.")
        return
    
    assignment_types = ['homework', 'exam', 'project']
    categories = ['homework', 'quiz', 'midterm', 'final', 'project']
    
    # Create assignments for each course
    for course in courses:
        # Create 3-5 assignments per course
        num_assignments = random.randint(3, 5)
        
        for i in range(num_assignments):
            # Create assignment
            assignment_type = random.choice(assignment_types)
            category = random.choice(categories)
            
            # Set dates
            start_date = datetime(2023, 9, random.randint(1, 30))
            due_date = start_date + timedelta(days=random.randint(7, 30))
            
            assignment = Assignment.objects.create(
                id=f'ASSIGN{random.randint(1000, 9999)}',
                course_id=course.id,
                title=f'{assignment_type.title()} {i+1} for {course.code}',
                description=f'This is a {assignment_type} assignment for {course.name}.',
                due_date=due_date,
                points=random.choice([50, 100, 150, 200]),
                type=assignment_type,
                created_at=start_date,
                start_date=start_date,
                allow_late_submission=random.choice([True, False]),
                late_penalty=random.choice([0.0, 5.0, 10.0, 15.0]),
                max_submissions=random.choice([1, 3, 5]),
                visible_to_students=True,
                category=category,
                weight=random.choice([10.0, 15.0, 20.0, 25.0])
            )
            
            # Get students enrolled in this course
            enrolled_students = [s for s in student_users if hasattr(s, 'student')]
            
            if enrolled_students:
                # Create submissions for 70-90% of enrolled students
                num_submissions = int(len(enrolled_students) * random.uniform(0.7, 0.9))
                submitting_students = random.sample(enrolled_students, min(num_submissions, len(enrolled_students)))
                
                for student in submitting_students:
                    # Create submission
                    submitted_at = start_date + timedelta(days=random.randint(1, (due_date - start_date).days))
                    
                    # Determine if it's a late submission
                    late_submission = submitted_at > due_date
                    
                    submission = Submission.objects.create(
                        id=f'SUBMIT{random.randint(10000, 99999)}',
                        assignment_id=assignment.id,
                        student_id=student.id,
                        content=f'This is the submission content for {assignment.title} by {student.get_full_name()}.',
                        submitted_at=submitted_at,
                        late_submission=late_submission,
                        revision_history=json.dumps([])  # Empty initially
                    )
                    
                    # Create grade for the submission
                    max_points = assignment.points
                    points_earned = round(random.uniform(0.5, 1.0) * max_points, 2)
                    
                    # Calculate letter grade
                    percentage = (points_earned / max_points) * 100
                    if percentage >= 90:
                        letter_grade = 'A'
                    elif percentage >= 80:
                        letter_grade = 'B'
                    elif percentage >= 70:
                        letter_grade = 'C'
                    elif percentage >= 60:
                        letter_grade = 'D'
                    else:
                        letter_grade = 'F'
                    
                    Grade.objects.create(
                        id=f'GRADE{random.randint(10000, 99999)}',
                        student_id=student.id,
                        course_id=course.id,
                        assignment_id=assignment.id,
                        value=points_earned,
                        max_points=max_points,
                        letter_grade=letter_grade,
                        weight=assignment.weight,
                        category=assignment.category,
                        grader_id=course.instructor_id,
                        comments=f'Good work on this {assignment.type}.'
                    )
    
    print("Demo assignments, submissions, and grades generated successfully!")

if __name__ == '__main__':
    generate_assignments()