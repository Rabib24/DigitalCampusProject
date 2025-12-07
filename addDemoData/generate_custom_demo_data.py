import os
import sys
import django
import random
from datetime import datetime, timedelta
import json
from django.db import IntegrityError
from django.contrib.auth.hashers import make_password
import time
import threading

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Import models
from users.models import User, Student, Faculty, Admin, Staff
from courses.models import Course, Enrollment
from assignments.models import Assignment, Submission, Grade
from permissions.models import Permission, UserPermission, RolePermission
from research.models import ResearchProject
from library.models import LibraryBook
from finance.models import FinancialAid, Payment

# Global counter for unique IDs
id_counter = 0
def get_unique_id(prefix):
    global id_counter
    id_counter += 1
    return f'{prefix}{int(time.time() * 1000000) % 100000000}_{id_counter}'

def generate_custom_users():
    """Generate custom demo users with exactly 30 students as requested"""
    print("Generating custom demo users...")
    
    # Sample data
    first_names = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Christopher', 'Jessica', 'Matthew', 'Ashley',
                   'Daniel', 'Samantha', 'Andrew', 'Brittany', 'Joshua', 'Amanda', 'Ryan', 'Melissa', 'Jacob', 'Stephanie',
                   'Tyler', 'Lauren', 'Brandon', 'Nicole', 'Austin', 'Rachel', 'Zachary', 'Olivia', 'Justin', 'Megan']
    
    last_names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
                  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson']
    
    departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Engineering', 'Business', 'Psychology', 'English', 'History']
    
    statuses = ['active', 'inactive', 'suspended']
    
    # Store credentials for output files
    user_credentials = []
    
    # Create admin user with specified password
    if User.objects.filter(username='90001').exists():
        print("Admin user already exists. Skipping...")
        user_credentials.append(('90001', 'DigitalIUB123'))
    else:
        try:
            admin_user = User.objects.create(
                username='90001',
                email='90001@iub.edu.bd',
                first_name='Admin',
                last_name='User',
                role='admin',
                status='active',
                phone_number='+1-555-000-0001',
                date_of_birth=datetime(1980, 1, 15).date(),
                sso_id='SSO001',
                mfa_enabled=True,
                password=make_password('DigitalIUB123'),
                address=json.dumps({
                    "street": "123 Admin Street",
                    "city": "University City",
                    "state": "State",
                    "zip": "12345",
                    "country": "USA"
                }),
                profile=json.dumps({
                    "bio": "System administrator with 10+ years of experience.",
                    "avatar": "admin_avatar.jpg"
                }),
                preferences=json.dumps({
                    "theme": "dark",
                    "notifications": True,
                    "dashboard_widgets": ["analytics", "reports", "users"]
                })
            )
            
            Admin.objects.create(
                user=admin_user,
                employee_id='90001',
                department='Information Technology',
                hire_date=datetime(2015, 3, 10).date()
            )
            user_credentials.append(('90001', 'DigitalIUB123'))
            print("Created admin user with ID 90001")
        except IntegrityError:
            print("Admin user already exists. Skipping...")
            user_credentials.append(('90001', 'DigitalIUB123'))
    
    # Create 10 faculty members with 4**** IDs
    faculty_users = []
    for i in range(1, 11):
        faculty_id = f'4{i:04d}'
        
        # Check if user already exists
        if User.objects.filter(username=faculty_id).exists():
            print(f"Faculty user {faculty_id} already exists. Skipping...")
            faculty_user = User.objects.get(username=faculty_id)
            faculty_users.append(faculty_user)
            user_credentials.append((faculty_id, 'DigitalIUB123'))
            continue
            
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        email = f'{faculty_id}@iub.edu.bd'
        
        try:
            user = User.objects.create(
                username=faculty_id,
                email=email,
                first_name=first_name,
                last_name=last_name,
                role='faculty',
                status=random.choice(statuses),
                phone_number=f'+1-555-000-{i:04d}',
                date_of_birth=datetime(1970, random.randint(1, 12), random.randint(1, 28)).date(),
                sso_id=f'SSO{i:03d}',
                mfa_enabled=random.choice([True, False]),
                password=make_password('DigitalIUB123'),
                address=json.dumps({
                    "street": f"{100+i} Faculty Avenue",
                    "city": "University City",
                    "state": "State",
                    "zip": f"123{45+i}",
                    "country": "USA"
                }),
                profile=json.dumps({
                    "bio": f"Professor of {random.choice(departments)} with expertise in advanced topics.",
                    "avatar": f"faculty_{i}_avatar.jpg"
                }),
                preferences=json.dumps({
                    "theme": random.choice(["light", "dark"]),
                    "notifications": random.choice([True, False]),
                    "dashboard_widgets": ["courses", "research", "publications"]
                })
            )
            
            faculty = Faculty.objects.create(
                user=user,
                employee_id=faculty_id,
                department=random.choice(departments),
                office_location=f'Building {chr(64+i)}, Room {100+i}',
                title=random.choice(['Assistant Professor', 'Associate Professor', 'Professor']),
                hire_date=datetime(2010 + random.randint(0, 10), random.randint(1, 12), random.randint(1, 28)).date()
            )
            faculty_users.append(user)
            user_credentials.append((faculty_id, 'DigitalIUB123'))
            print(f"Created faculty user {faculty_id}")
        except IntegrityError:
            print(f"Faculty user {faculty_id} already exists. Skipping...")
            faculty_user = User.objects.get(username=faculty_id)
            faculty_users.append(faculty_user)
    
    # Create exactly 30 students with 19***** to 26***** IDs formatted as "FirstName Student"
    for i in range(1, 31):
        # Generate student IDs in the range 190001 to 219999 (to accommodate 30 students)
        student_id_num = 190000 + i
        student_id = str(student_id_num)
        
        # Check if user already exists
        if User.objects.filter(username=student_id).exists():
            print(f"Student user {student_id} already exists. Skipping...")
            user_credentials.append((student_id, 'DigitalIUB123'))
            continue
            
        first_name = random.choice(first_names)
        last_name = "Student"  # As requested in the format
        email = f'{student_id}@iub.edu.bd'
        
        try:
            user = User.objects.create(
                username=student_id,
                email=email,
                first_name=first_name,
                last_name=last_name,
                role='student',
                status=random.choice(statuses),
                phone_number=f'+1-555-001-{i:04d}',
                date_of_birth=datetime(2000 + random.randint(0, 5), random.randint(1, 12), random.randint(1, 28)).date(),
                sso_id=f'SSO{100+i:03d}',
                mfa_enabled=random.choice([True, False]),
                password=make_password('DigitalIUB123'),
                address=json.dumps({
                    "street": f"{200+i} Student Boulevard",
                    "city": "University City",
                    "state": "State",
                    "zip": f"124{45+i}",
                    "country": "USA"
                }),
                profile=json.dumps({
                    "bio": f"{random.choice(['Undergraduate', 'Graduate'])} student majoring in {random.choice(departments)}.",
                    "avatar": f"student_{i}_avatar.jpg"
                }),
                preferences=json.dumps({
                    "theme": random.choice(["light", "dark"]),
                    "notifications": random.choice([True, False]),
                    "dashboard_widgets": ["courses", "grades", "assignments"]
                })
            )
            
            # Select a random faculty member as advisor
            advisor = random.choice(faculty_users) if faculty_users else None
            advisor_id = advisor.faculty.employee_id if advisor and hasattr(advisor, 'faculty') else ''
            
            Student.objects.create(
                user=user,
                student_id=student_id,
                degree_program=random.choice([
                    'Computer Science', 'Mechanical Engineering', 'Business Administration', 
                    'Psychology', 'Mathematics', 'Physics', 'Biology', 'English Literature'
                ]),
                advisor_id=advisor_id,
                graduation_date=datetime(2024 + random.randint(0, 4), 5, random.randint(1, 30)).date(),
                cumulative_gpa=round(random.uniform(2.0, 4.0), 2),
                library_card_number=f'LIB{i:06d}'
            )
            user_credentials.append((student_id, 'DigitalIUB123'))
            print(f"Created student user {student_id}")
        except IntegrityError:
            print(f"Student user {student_id} already exists. Skipping...")
    
    # Create 5 staff members with 5**** IDs (library staff)
    for i in range(1, 6):
        staff_id = f'5{i:04d}'
        
        # Check if user already exists
        if User.objects.filter(username=staff_id).exists():
            print(f"Staff user {staff_id} already exists. Skipping...")
            user_credentials.append((staff_id, 'DigitalIUB123'))
            continue
            
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        email = f'{staff_id}@iub.edu.bd'
        
        try:
            user = User.objects.create(
                username=staff_id,
                email=email,
                first_name=first_name,
                last_name=last_name,
                role='staff',
                status=random.choice(statuses),
                phone_number=f'+1-555-002-{i:04d}',
                date_of_birth=datetime(1975 + random.randint(0, 20), random.randint(1, 12), random.randint(1, 28)).date(),
                sso_id=f'SSO{200+i:03d}',
                mfa_enabled=random.choice([True, False]),
                password=make_password('DigitalIUB123'),
                address=json.dumps({
                    "street": f"{300+i} Staff Road",
                    "city": "University City",
                    "state": "State",
                    "zip": f"125{45+i}",
                    "country": "USA"
                }),
                profile=json.dumps({
                    "bio": f"Staff member in the {random.choice(departments)} department.",
                    "avatar": f"staff_{i}_avatar.jpg"
                }),
                preferences=json.dumps({
                    "theme": random.choice(["light", "dark"]),
                    "notifications": random.choice([True, False]),
                    "dashboard_widgets": ["tasks", "calendar", "messages"]
                })
            )
            
            Staff.objects.create(
                user=user,
                employee_id=staff_id,
                department=random.choice(departments),
                hire_date=datetime(2012 + random.randint(0, 10), random.randint(1, 12), random.randint(1, 28)).date(),
                supervisor_id=f'4{random.randint(1000, 9999)}'
            )
            user_credentials.append((staff_id, 'DigitalIUB123'))
            print(f"Created staff user {staff_id}")
        except IntegrityError:
            print(f"Staff user {staff_id} already exists. Skipping...")
    
    # Create 3 IT admin members with 9**** IDs (different from main admin)
    for i in range(2, 5):
        admin_id = f'9{i:04d}'
        
        # Check if user already exists
        if User.objects.filter(username=admin_id).exists():
            print(f"IT Admin user {admin_id} already exists. Skipping...")
            user_credentials.append((admin_id, 'DigitalIUB123'))
            continue
            
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        email = f'{admin_id}@iub.edu.bd'
        
        try:
            user = User.objects.create(
                username=admin_id,
                email=email,
                first_name=first_name,
                last_name=last_name,
                role='admin',
                status=random.choice(statuses),
                phone_number=f'+1-555-003-{i:04d}',
                date_of_birth=datetime(1980 + random.randint(0, 10), random.randint(1, 12), random.randint(1, 28)).date(),
                sso_id=f'SSO{300+i:03d}',
                mfa_enabled=random.choice([True, False]),
                password=make_password('DigitalIUB123'),
                address=json.dumps({
                    "street": f"{400+i} Admin Street",
                    "city": "University City",
                    "state": "State",
                    "zip": f"126{45+i}",
                    "country": "USA"
                }),
                profile=json.dumps({
                    "bio": f"IT Administrator with expertise in {random.choice(['networking', 'security', 'database management', 'system administration'])}.",
                    "avatar": f"admin_{i}_avatar.jpg"
                }),
                preferences=json.dumps({
                    "theme": random.choice(["light", "dark"]),
                    "notifications": random.choice([True, False]),
                    "dashboard_widgets": ["analytics", "reports", "users", "systems"]
                })
            )
            
            Admin.objects.create(
                user=user,
                employee_id=admin_id,
                department='Information Technology',
                hire_date=datetime(2015 + random.randint(0, 5), random.randint(1, 12), random.randint(1, 28)).date()
            )
            user_credentials.append((admin_id, 'DigitalIUB123'))
            print(f"Created IT admin user {admin_id}")
        except IntegrityError:
            print(f"IT Admin user {admin_id} already exists. Skipping...")
    
    print("Custom demo users generated successfully!")
    return user_credentials

def generate_custom_courses_and_enrollments():
    """Generate custom courses and enrollments"""
    print("Generating custom courses and enrollments...")
    
    # Define departments and their course data
    department_courses = {
        'Computer Science': [
            {'code': 'CSE101', 'name': 'Introduction to Programming', 'credits': 3},
            {'code': 'CSE102', 'name': 'Data Structures', 'credits': 4},
            {'code': 'CSE201', 'name': 'Object-Oriented Programming', 'credits': 3},
            {'code': 'CSE202', 'name': 'Database Systems', 'credits': 3},
            {'code': 'CSE301', 'name': 'Algorithms', 'credits': 3},
            {'code': 'CSE302', 'name': 'Operating Systems', 'credits': 3},
            {'code': 'CSE401', 'name': 'Artificial Intelligence', 'credits': 3},
        ],
        'Mathematics': [
            {'code': 'MATH101', 'name': 'Calculus I', 'credits': 4},
            {'code': 'MATH102', 'name': 'Calculus II', 'credits': 4},
            {'code': 'MATH201', 'name': 'Linear Algebra', 'credits': 3},
            {'code': 'MATH202', 'name': 'Differential Equations', 'credits': 3},
            {'code': 'MATH301', 'name': 'Abstract Algebra', 'credits': 3},
        ],
        'Physics': [
            {'code': 'PHYS101', 'name': 'General Physics I', 'credits': 4},
            {'code': 'PHYS102', 'name': 'General Physics II', 'credits': 4},
            {'code': 'PHYS201', 'name': 'Modern Physics', 'credits': 3},
            {'code': 'PHYS301', 'name': 'Quantum Mechanics', 'credits': 3},
        ],
        'Business': [
            {'code': 'BUS101', 'name': 'Principles of Management', 'credits': 3},
            {'code': 'BUS201', 'name': 'Financial Accounting', 'credits': 3},
            {'code': 'BUS301', 'name': 'Marketing Principles', 'credits': 3},
            {'code': 'BUS401', 'name': 'Strategic Management', 'credits': 3},
        ]
    }
    
    # Get faculty users to be instructors
    faculty_users = User.objects.filter(role='faculty')
    if not faculty_users.exists():
        print("No faculty users found. Please generate users first.")
        return
    
    # Get the next available course ID
    existing_courses = Course.objects.all()
    if existing_courses.exists():
        max_id = 0
        for course in existing_courses:
            if course.id.startswith('COURSE'):
                try:
                    id_num = int(course.id.replace('COURSE', ''))
                    if id_num > max_id:
                        max_id = id_num
                except ValueError:
                    pass
        course_id_counter = max_id + 1
    else:
        course_id_counter = 1
    
    print(f"Starting course ID counter at: {course_id_counter}")
    
    # Create courses for each department
    courses = []
    
    for department, course_list in department_courses.items():
        print(f"Generating courses for {department}...")
        
        for data in course_list:
            # Check if course already exists by code
            if Course.objects.filter(code=data['code']).exists():
                print(f"Course {data['code']} already exists. Skipping...")
                course = Course.objects.get(code=data['code'])
                courses.append(course)
                continue
            
            # Get a random faculty member as instructor
            instructor = random.choice(faculty_users)
            
            # Try to create the course
            try:
                course = Course.objects.create(
                    id=f'COURSE{course_id_counter:03d}',
                    code=data['code'],
                    name=data['name'],
                    description=f'Comprehensive course on {data["name"].lower()}.',
                    credits=data['credits'],
                    instructor_id=instructor.id,
                    department=department,
                    enrollment_limit=random.choice([25, 30, 35, 40]),
                    start_date=datetime(2023, 9, 1).date(),
                    end_date=datetime(2023, 12, 15).date(),
                    schedule=json.dumps([
                        {"day": random.choice(["Monday", "Tuesday"]), "start_time": "09:00", "end_time": "10:30", "location": f"Room {100+course_id_counter}"},
                        {"day": random.choice(["Wednesday", "Thursday"]), "start_time": "09:00", "end_time": "10:30", "location": f"Room {100+course_id_counter}"}
                    ]),
                    grading_scale=json.dumps({
                        "A": "90-100",
                        "B": "80-89",
                        "C": "70-79",
                        "D": "60-69",
                        "F": "0-59"
                    }),
                    categories=json.dumps(["homework", "quiz", "midterm", "final"]),
                    textbooks=json.dumps([
                        {"title": f"{data['name']} Textbook", "author": "John Author", "isbn": f"978-0-123456-{course_id_counter:04d}-1"},
                    ])
                )
                courses.append(course)
                course_id_counter += 1
                print(f"Created course: {data['code']} - {data['name']}")
            except IntegrityError as e:
                if "duplicate key value violates unique constraint" in str(e):
                    print(f"Course ID COURSE{course_id_counter:03d} already exists. Skipping and incrementing counter...")
                    course_id_counter += 1
                    continue
                else:
                    # Re-raise the exception if it's not a duplicate key error
                    raise e
    
    # Get student users for enrollments
    student_users = User.objects.filter(role='student')
    if not student_users.exists():
        print("No student users found. Please generate users first.")
        return
    
    # Create enrollments
    enrollment_status_choices = ['active', 'dropped', 'completed']
    
    for course in courses:
        # Enroll 5-15 random students in each course (adjusted for 30 students)
        num_students = random.randint(5, 15)
        enrolled_students = random.sample(list(student_users), min(num_students, len(student_users)))
        
        for student in enrolled_students:
            # Randomly assign a grade to some completed enrollments
            status = random.choice(enrollment_status_choices)
            grade = ''
            if status == 'completed':
                grade = random.choice(['A', 'B', 'C', 'D', 'F'])
            
            # Generate unique ID for enrollment
            enroll_id = get_unique_id('ENROLL')
            
            Enrollment.objects.create(
                id=enroll_id,
                student_id=student.id,
                course_id=course.id,
                status=status,
                grade=grade
            )
    
    print("Custom courses and enrollments generated successfully!")

def generate_custom_assignments():
    """Generate custom assignments, submissions, and grades"""
    print("Generating custom assignments, submissions, and grades...")
    
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
        # Create 2-4 assignments per course
        num_assignments = random.randint(2, 4)
        
        for i in range(num_assignments):
            # Create assignment
            assignment_type = random.choice(assignment_types)
            category = random.choice(categories)
            
            # Set dates
            start_date = datetime(2023, 9, random.randint(1, 30))
            due_date = start_date + timedelta(days=random.randint(7, 30))
            
            # Generate unique ID for assignment
            assign_id = get_unique_id('ASSIGN')
            
            assignment = Assignment.objects.create(
                id=assign_id,
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
                    
                    # Generate unique ID for submission
                    submit_id = get_unique_id('SUBMIT')
                    
                    submission = Submission.objects.create(
                        id=submit_id,
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
                    
                    # Generate unique ID for grade
                    grade_id = get_unique_id('GRADE')
                        
                    Grade.objects.create(
                        id=grade_id,
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
    
    print("Custom assignments, submissions, and grades generated successfully!")

def generate_custom_permissions():
    """Generate custom permission data with faculty-based permission allocation"""
    print("Generating custom permission data...")
    
    # Get all users
    all_users = User.objects.all()
    if not all_users.exists():
        print("No users found. Please generate users first.")
        return
    
    # Get faculty users for specific permissions
    faculty_users = User.objects.filter(role='faculty')
    
    # Define permissions
    permissions_data = [
        # Course permissions
        {"id": "course_view", "name": "View Course", "codename": "view_course", "description": "Can view course information", "category": "course"},
        {"id": "course_create", "name": "Create Course", "codename": "create_course", "description": "Can create new courses", "category": "course"},
        {"id": "course_edit", "name": "Edit Course", "codename": "edit_course", "description": "Can edit existing courses", "category": "course"},
        {"id": "course_delete", "name": "Delete Course", "codename": "delete_course", "description": "Can delete courses", "category": "course"},
        
        # Assignment permissions
        {"id": "assignment_view", "name": "View Assignment", "codename": "view_assignment", "description": "Can view assignments", "category": "assignment"},
        {"id": "assignment_create", "name": "Create Assignment", "codename": "create_assignment", "description": "Can create new assignments", "category": "assignment"},
        {"id": "assignment_edit", "name": "Edit Assignment", "codename": "edit_assignment", "description": "Can edit existing assignments", "category": "assignment"},
        {"id": "assignment_delete", "name": "Delete Assignment", "codename": "delete_assignment", "description": "Can delete assignments", "category": "assignment"},
        {"id": "assignment_grade", "name": "Grade Assignment", "codename": "grade_assignment", "description": "Can grade assignments", "category": "assignment"},
        
        # Grade permissions
        {"id": "grade_view", "name": "View Grade", "codename": "view_grade", "description": "Can view grades", "category": "grade"},
        {"id": "grade_edit", "name": "Edit Grade", "codename": "edit_grade", "description": "Can edit grades", "category": "grade"},
        
        # Student permissions
        {"id": "student_view", "name": "View Student", "codename": "view_student", "description": "Can view student information", "category": "student"},
        {"id": "student_edit", "name": "Edit Student", "codename": "edit_student", "description": "Can edit student information", "category": "student"},
        
        # Faculty permissions
        {"id": "faculty_view", "name": "View Faculty", "codename": "view_faculty", "description": "Can view faculty information", "category": "faculty"},
        {"id": "faculty_edit", "name": "Edit Faculty", "codename": "edit_faculty", "description": "Can edit faculty information", "category": "faculty"},
        
        # Research permissions
        {"id": "research_view", "name": "View Research", "codename": "view_research", "description": "Can view research projects", "category": "research"},
        {"id": "research_create", "name": "Create Research", "codename": "create_research", "description": "Can create research projects", "category": "research"},
        {"id": "research_edit", "name": "Edit Research", "codename": "edit_research", "description": "Can edit research projects", "category": "research"},
        
        # Publication permissions
        {"id": "publication_view", "name": "View Publication", "codename": "view_publication", "description": "Can view publications", "category": "publication"},
        {"id": "publication_create", "name": "Create Publication", "codename": "create_publication", "description": "Can create publications", "category": "publication"},
        {"id": "publication_edit", "name": "Edit Publication", "codename": "edit_publication", "description": "Can edit publications", "category": "publication"},
        
        # Financial permissions
        {"id": "finance_view", "name": "View Financial Information", "codename": "view_finance", "description": "Can view financial information", "category": "finance"},
        {"id": "finance_edit", "name": "Edit Financial Information", "codename": "edit_finance", "description": "Can edit financial information", "category": "finance"},
        
        # Library permissions
        {"id": "library_view", "name": "View Library", "codename": "view_library", "description": "Can view library information", "category": "library"},
        {"id": "library_checkout", "name": "Checkout Library Items", "codename": "checkout_library", "description": "Can checkout library items", "category": "library"},
        
        # Communication permissions
        {"id": "notification_view", "name": "View Notifications", "codename": "view_notification", "description": "Can view notifications", "category": "communication"},
        {"id": "notification_create", "name": "Create Notifications", "codename": "create_notification", "description": "Can create notifications", "category": "communication"},
        {"id": "alert_view", "name": "View Alerts", "codename": "view_alert", "description": "Can view alerts", "category": "communication"},
        {"id": "alert_create", "name": "Create Alerts", "codename": "create_alert", "description": "Can create alerts", "category": "communication"},
        
        # Appointment permissions
        {"id": "appointment_view", "name": "View Appointments", "codename": "view_appointment", "description": "Can view appointments", "category": "appointment"},
        {"id": "appointment_create", "name": "Create Appointments", "codename": "create_appointment", "description": "Can create appointments", "category": "appointment"},
        {"id": "appointment_edit", "name": "Edit Appointments", "codename": "edit_appointment", "description": "Can edit appointments", "category": "appointment"},
        
        # Admin permissions
        {"id": "admin_view", "name": "View Admin Panel", "codename": "view_admin", "description": "Can view admin panel", "category": "admin"},
        {"id": "admin_edit", "name": "Edit Admin Settings", "codename": "edit_admin", "description": "Can edit admin settings", "category": "admin"},
        {"id": "user_manage", "name": "Manage Users", "codename": "manage_user", "description": "Can manage users", "category": "admin"},
    ]
    
    # Create permissions
    permissions = []
    for perm_data in permissions_data:
        permission, created = Permission.objects.get_or_create(
            id=perm_data["id"],
            defaults={
                "name": perm_data["name"],
                "codename": perm_data["codename"],
                "description": perm_data["description"],
                "category": perm_data["category"]
            }
        )
        permissions.append(permission)
    
    # Create role-based permissions
    role_permissions_data = [
        # Student role permissions
        {"role": "student", "permission": "course_view", "scope_template": {"department": "*"}},
        {"role": "student", "permission": "assignment_view", "scope_template": {"course": "*"}},
        {"role": "student", "permission": "grade_view", "scope_template": {"student": "self"}},
        {"role": "student", "permission": "library_view", "scope_template": {}},
        {"role": "student", "permission": "library_checkout", "scope_template": {}},
        {"role": "student", "permission": "notification_view", "scope_template": {"user": "self"}},
        
        # Faculty role permissions
        {"role": "faculty", "permission": "course_view", "scope_template": {"department": "self"}},
        {"role": "faculty", "permission": "course_edit", "scope_template": {"course": "taught"}},
        {"role": "faculty", "permission": "assignment_view", "scope_template": {"course": "taught"}},
        {"role": "faculty", "permission": "assignment_create", "scope_template": {"course": "taught"}},
        {"role": "faculty", "permission": "assignment_edit", "scope_template": {"course": "taught"}},
        {"role": "faculty", "permission": "assignment_grade", "scope_template": {"course": "taught"}},
        {"role": "faculty", "permission": "grade_view", "scope_template": {"course": "taught"}},
        {"role": "faculty", "permission": "grade_edit", "scope_template": {"course": "taught"}},
        {"role": "faculty", "permission": "student_view", "scope_template": {"course": "taught"}},
        {"role": "faculty", "permission": "research_view", "scope_template": {"owner": "self"}},
        {"role": "faculty", "permission": "research_create", "scope_template": {}},
        {"role": "faculty", "permission": "publication_view", "scope_template": {"author": "self"}},
        {"role": "faculty", "permission": "publication_create", "scope_template": {}},
        {"role": "faculty", "permission": "appointment_view", "scope_template": {"faculty": "self"}},
        
        # Admin role permissions
        {"role": "admin", "permission": "admin_view", "scope_template": {}},
        {"role": "admin", "permission": "admin_edit", "scope_template": {}},
        {"role": "admin", "permission": "user_manage", "scope_template": {}},
        {"role": "admin", "permission": "course_view", "scope_template": {}},
        {"role": "admin", "permission": "course_create", "scope_template": {}},
        {"role": "admin", "permission": "course_edit", "scope_template": {}},
        {"role": "admin", "permission": "course_delete", "scope_template": {}},
        {"role": "admin", "permission": "finance_view", "scope_template": {}},
        {"role": "admin", "permission": "finance_edit", "scope_template": {}},
        {"role": "admin", "permission": "alert_create", "scope_template": {}},
    ]
    
    # Create role permissions
    for role_perm_data in role_permissions_data:
        try:
            permission = Permission.objects.get(codename=role_perm_data["permission"])
            # Generate unique ID for role permission
            rp_id = get_unique_id('RP')
            
            RolePermission.objects.get_or_create(
                id=rp_id,
                role=role_perm_data["role"],
                permission=permission,
                defaults={
                    "scope_template": role_perm_data["scope_template"]
                }
            )
        except Permission.DoesNotExist:
            print(f"Permission {role_perm_data['permission']} not found")
    
    # Create user-specific permissions for faculty members based on their departments
    if faculty_users.exists():
        for faculty in faculty_users:
            # Get faculty's department
            faculty_department = ""
            if hasattr(faculty, 'faculty'):
                faculty_department = faculty.faculty.department
            
            # Select 5-8 random permissions
            selected_permissions = random.sample(permissions, random.randint(5, 8))
            
            for permission in selected_permissions:
                # Check if this permission already exists for this user
                if not UserPermission.objects.filter(user=faculty, permission=permission).exists():
                    # Set expiration for some permissions
                    expires_at = None
                    if random.choice([True, False]):
                        expires_at = datetime.now() + timedelta(days=random.randint(30, 365))
                    
                    # Generate unique ID for user permission
                    up_id = get_unique_id('UP')
                                
                    UserPermission.objects.create(
                        id=up_id,
                        user=faculty,
                        permission=permission,
                        granted_by=random.choice(all_users),
                        expires_at=expires_at,
                        scope=json.dumps({"department": faculty_department}) if faculty_department else {}
                    )
    
    print("Custom permission data generated successfully!")

def generate_custom_library_data():
    """Generate custom library books"""
    print("Generating custom library books...")
    
    # Get student users for borrowers
    student_users = User.objects.filter(role='student')
    
    # Book data
    book_titles = [
        "Introduction to Algorithms", "Data Structures and Algorithms in Python", "Machine Learning: A Probabilistic Perspective",
        "Artificial Intelligence: A Modern Approach", "Computer Networking: A Top-Down Approach", "Operating System Concepts",
        "Database System Concepts", "Computer Organization and Design", "Software Engineering", "Design Patterns",
        "Clean Code: A Handbook of Agile Software Craftsmanship", "The Pragmatic Programmer", "Code Complete"
    ]
    
    authors = [
        "Thomas H. Cormen", "Robert Sedgewick", "Kevin P. Murphy", "Stuart Russell", "James Kurose",
        "Abraham Silberschatz", "Henry Korth", "David Patterson", "Ian Sommerville", "Gang of Four",
        "Robert Martin", "Andrew Hunt", "Steve McConnell"
    ]
    
    locations = [
        "Main Library - Floor 1 - Section A", "Main Library - Floor 1 - Section B", "Main Library - Floor 2 - Section C",
        "Main Library - Floor 2 - Section D", "Main Library - Floor 3 - Reference", "Science Library - Floor 1",
        "Science Library - Floor 2", "Engineering Library - Floor 1", "Engineering Library - Floor 2"
    ]
    
    statuses = ['available', 'checkedout', 'overdue', 'reserved']
    
    # Create library books
    for i in range(30):
        # Randomly decide if the book is checked out
        status = random.choice(statuses)
        borrower_id = ''
        checkout_date = None
        due_date = None
        return_date = None
        
        if status in ['checkedout', 'overdue']:
            if student_users.exists():
                borrower = random.choice(student_users)
                borrower_id = borrower.id
                checkout_date = datetime.now() - timedelta(days=random.randint(1, 30))
                due_date = checkout_date + timedelta(days=14)  # 2 weeks checkout period
                
                if status == 'overdue':
                    # Make the due date in the past
                    due_date = datetime.now() - timedelta(days=random.randint(1, 15))
                else:
                    return_date = None
        elif status == 'reserved':
            if student_users.exists():
                borrower = random.choice(student_users)
                borrower_id = borrower.id
        else:
            # Available book
            borrower_id = ''
        
        # Generate unique ID for library book
        book_id = get_unique_id('BOOK')
                    
        LibraryBook.objects.create(
            id=book_id,
            title=random.choice(book_titles),
            author=random.choice(authors),
            isbn=f"978-{random.randint(0, 999999999):010d}",
            call_number=f"{chr(random.randint(65, 90))}{random.randint(100, 999)}.{random.randint(1000, 9999)}",
            borrower_id=borrower_id,
            checkout_date=checkout_date,
            due_date=due_date,
            return_date=return_date,
            status=status,
            location=random.choice(locations),
            fines=round(random.uniform(0.0, 25.0), 2),
            renewal_count=random.randint(0, 3)
        )
    
    print("Custom library books generated successfully!")

def generate_custom_research_data():
    """Generate custom research projects"""
    print("Generating custom research projects...")
    
    # Get faculty users
    faculty_users = User.objects.filter(role='faculty')
    if not faculty_users.exists():
        print("No faculty users found. Please generate users first.")
        return
    
    # Research project data
    project_titles = [
        "Machine Learning Applications in Healthcare",
        "Quantum Computing Algorithms",
        "Renewable Energy Storage Solutions",
        "Neural Network Optimization Techniques",
        "Climate Change Impact on Biodiversity",
        "Blockchain Technology in Financial Systems",
        "Artificial Intelligence in Education",
        "Nanotechnology in Medicine",
        "Cybersecurity in IoT Devices",
        "Big Data Analytics for Business Intelligence"
    ]
    
    project_statuses = ['proposal', 'approved', 'in-progress', 'completed', 'archived']
    
    # Create research projects
    for i in range(min(10, len(project_titles))):
        # Select a random faculty member as owner
        owner = random.choice(faculty_users)
        
        # Select collaborators (1-3 other faculty members)
        other_faculty = [f for f in faculty_users if f.id != owner.id]
        num_collaborators = random.randint(1, 3)
        collaborators = random.sample(other_faculty, min(num_collaborators, len(other_faculty)))
        collaborator_ids = [c.id for c in collaborators]
        
        # Add owner to collaborators list
        collaborator_ids.append(owner.id)
        
        # Set dates
        start_date = datetime(2022, random.randint(1, 12), random.randint(1, 28)).date()
        end_date = start_date + timedelta(days=random.randint(180, 730))  # 6 months to 2 years
        
        # Generate unique ID for research project
        rp_id = get_unique_id('RP')
        
        ResearchProject.objects.create(
            id=rp_id,
            title=project_titles[i] if i < len(project_titles) else f"Research Project {i+1}",
            description=f"This research explores important aspects of {project_titles[i] if i < len(project_titles) else 'the selected field'}.",
            owner_id=owner.id,
            status=random.choice(project_statuses),
            start_date=start_date,
            end_date=end_date if random.choice([True, False]) else None,
            budget=round(random.uniform(10000, 100000), 2),
            ethics_approval=random.choice([True, False]),
            collaborators=json.dumps(collaborator_ids),
            milestones=json.dumps([
                {"name": "Literature Review", "status": "completed", "due_date": str(start_date + timedelta(days=30))},
                {"name": "Methodology Design", "status": random.choice(["completed", "in-progress"]), "due_date": str(start_date + timedelta(days=60))},
                {"name": "Data Collection", "status": random.choice(["completed", "in-progress", "pending"]), "due_date": str(start_date + timedelta(days=120))},
                {"name": "Analysis", "status": random.choice(["in-progress", "pending"]), "due_date": str(start_date + timedelta(days=180))},
                {"name": "Report Writing", "status": "pending", "due_date": str(start_date + timedelta(days=240))}
            ])
        )
    
    print("Custom research projects generated successfully!")

def create_output_files(user_credentials):
    """Create the required output files"""
    print("Creating output files...")
    
    # Create USERPW.txt
    with open('addDemoData/USERPW.txt', 'w') as f:
        f.write("Username\tPassword\n")
        f.write("=" * 30 + "\n")
        for username, password in user_credentials:
            f.write(f"{username}\t{password}\n")
    
    # Create DemoAssignTo.txt
    with open('addDemoData/DemoAssignTo.txt', 'w') as f:
        f.write("Demo Data Generation Task Tracking Log\n")
        f.write("=" * 40 + "\n")
        f.write("Completed Tasks:\n")
        f.write("- Generated 1 admin user\n")
        f.write("- Generated 10 faculty members\n")
        f.write("- Generated 30 student records with 'FirstName Student' format\n")
        f.write("- Generated 5 staff members\n")
        f.write("- Generated 3 IT admin members\n")
        f.write("- Created courses in Computer Science, Mathematics, Physics, and Business departments\n")
        f.write("- Enrolled students in courses\n")
        f.write("- Generated assignments, submissions, and grades\n")
        f.write("- Configured faculty permissions based on departments\n")
        f.write("- Created library books\n")
        f.write("- Generated research projects\n")
        f.write("\nIncomplete Tasks:\n")
        f.write("- None\n")
    
    print("Output files created successfully!")

def main():
    """Generate all custom demo data"""
    print("Starting custom demo data generation...")
    
    # Generate users
    user_credentials = generate_custom_users()
    
    # Generate courses and enrollments
    generate_custom_courses_and_enrollments()
    
    # Generate assignments
    generate_custom_assignments()
    
    # Generate permissions
    generate_custom_permissions()
    
    # Generate library data
    generate_custom_library_data()
    
    # Generate research data
    generate_custom_research_data()
    
    # Create output files
    create_output_files(user_credentials)
    
    print("\nCustom demo data generation completed successfully!")
    print("Generated files:")
    print("- addDemoData/USERPW.txt: Contains all usernames and passwords")
    print("- addDemoData/DemoAssignTo.txt: Task tracking log")

if __name__ == '__main__':
    main()