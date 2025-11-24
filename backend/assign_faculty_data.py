#!/usr/bin/env python
import os
import sys
import django
import uuid
from datetime import date

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from courses.models import Course, Enrollment
from assignments.models import Assignment, Grade

def assign_courses_and_students():
    """Assign courses and students to faculty member 2221002"""
    try:
        # Get the faculty user
        faculty_user = User.objects.get(username='2221002')
        faculty = faculty_user.faculty
        print(f"Found faculty: {faculty_user.username} ({faculty_user.first_name} {faculty_user.last_name})")
        
        # Get or create courses for this faculty
        courses = list(Course.objects.filter(instructor_id=faculty.employee_id))
        
        # If no courses exist, create some
        if not courses:
            print("Creating courses for faculty...")
            course1 = Course(
                id=str(uuid.uuid4()),
                code='CS101',
                name='Introduction to Computer Science',
                description='Basic concepts of computer science',
                credits=3,
                instructor_id=faculty.employee_id,
                enrollment_limit=30,
                department='Computer Science',
                start_date=date(2025, 9, 1),
                end_date=date(2025, 12, 15)
            )
            course1.save()
            
            course2 = Course(
                id=str(uuid.uuid4()),
                code='CS201',
                name='Data Structures',
                description='Advanced data structures and algorithms',
                credits=3,
                instructor_id=faculty.employee_id,
                enrollment_limit=25,
                department='Computer Science',
                start_date=date(2025, 9, 1),
                end_date=date(2025, 12, 15)
            )
            course2.save()
            
            course3 = Course(
                id=str(uuid.uuid4()),
                code='CS301',
                name='Algorithms',
                description='Design and analysis of algorithms',
                credits=3,
                instructor_id=faculty.employee_id,
                enrollment_limit=20,
                department='Computer Science',
                start_date=date(2025, 9, 1),
                end_date=date(2025, 12, 15)
            )
            course3.save()
            
            courses = [course1, course2, course3]
            print("Created 3 courses for faculty")
        else:
            print(f"Faculty already has {len(courses)} courses")
        
        # Get some students to enroll (only those that have student objects)
        all_users = User.objects.filter(role='student')
        students = []
        for user in all_users:
            try:
                student = user.student
                students.append(user)
                if len(students) >= 10:  # Limit to 10 students
                    break
            except User.student.RelatedObjectDoesNotExist:
                # Skip users that don't have student objects
                continue
        
        print(f"Found {len(students)} students with student objects to enroll")
        
        # Enroll students in courses
        for i, course in enumerate(courses):
            # Get current enrollments for this course
            current_enrollments = Enrollment.objects.filter(course_id=course.id)
            print(f"Course {course.code} currently has {current_enrollments.count()} students")
            
            # Enroll students in each course (different students for each course)
            students_to_enroll = students[i*3:(i+1)*3] if i < len(courses)-1 else students[i*3:]
            
            for student_user in students_to_enroll:
                try:
                    student = student_user.student
                    # Check if student is already enrolled
                    existing_enrollment = Enrollment.objects.filter(
                        student_id=student.student_id, 
                        course_id=course.id
                    ).first()
                    
                    if not existing_enrollment:
                        enrollment = Enrollment(
                            id=str(uuid.uuid4()),
                            student_id=student.student_id,
                            course_id=course.id
                        )
                        enrollment.save()
                        print(f"Enrolled {student_user.first_name} {student_user.last_name} in {course.code}")
                    else:
                        print(f"{student_user.first_name} {student_user.last_name} already enrolled in {course.code}")
                except User.student.RelatedObjectDoesNotExist:
                    print(f"Skipping {student_user.username} as they don't have a student object")
                    continue
        
        # Verify enrollments
        print("\nFinal enrollment counts:")
        for course in courses:
            enrollments = Enrollment.objects.filter(course_id=course.id)
            print(f"- {course.code}: {enrollments.count()} students")
            
        # Create some assignments for the courses
        print("\nCreating assignments...")
        for course in courses:
            # Check if assignments already exist for this course
            existing_assignments = Assignment.objects.filter(course_id=course.id)
            if existing_assignments.count() == 0:
                # Create a few assignments
                for i in range(3):
                    assignment = Assignment(
                        id=str(uuid.uuid4()),
                        course_id=course.id,
                        title=f'{course.code} Assignment {i+1}',
                        description=f'Description for {course.code} Assignment {i+1}',
                        due_date=date(2025, 10, 15+i),
                        points=100,
                        type='homework',
                        start_date=date(2025, 10, 1+i),
                        allow_late_submission=True,
                        late_penalty=10,
                        max_submissions=1,
                        visible_to_students=True,
                        category='homework',
                        weight=1.0
                    )
                    assignment.save()
                print(f"Created 3 assignments for {course.code}")
            else:
                print(f"{course.code} already has {existing_assignments.count()} assignments")
        
        # Create some grades for students
        print("\nCreating grades...")
        for course in courses:
            enrollments = Enrollment.objects.filter(course_id=course.id)
            assignments = Assignment.objects.filter(course_id=course.id)
            
            if assignments.count() > 0:
                for enrollment in enrollments:
                    # Create grades for each assignment
                    for i, assignment in enumerate(assignments):
                        # Check if grade already exists
                        existing_grade = Grade.objects.filter(
                            student_id=enrollment.student_id,
                            assignment_id=assignment.id
                        ).first()
                        
                        if not existing_grade:
                            # Generate a grade based on student ID and assignment
                            base_grade = 75 + (int(enrollment.student_id[-1]) + i) % 20
                            letter_grade = 'A' if base_grade >= 90 else 'B' if base_grade >= 80 else 'C' if base_grade >= 70 else 'D' if base_grade >= 60 else 'F'
                            
                            grade = Grade(
                                id=str(uuid.uuid4()),
                                student_id=enrollment.student_id,
                                course_id=course.id,
                                assignment_id=assignment.id,
                                value=base_grade,
                                max_points=100,
                                letter_grade=letter_grade,
                                weight=1.0,
                                category='assignment',
                                grader_id=faculty.employee_id
                            )
                            grade.save()
                print(f"Created grades for {course.code}")
            else:
                print(f"No assignments found for {course.code}, skipping grade creation")
        
        print("\nData assignment completed successfully!")
        
    except User.DoesNotExist:
        print("Faculty user not found")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    assign_courses_and_students()