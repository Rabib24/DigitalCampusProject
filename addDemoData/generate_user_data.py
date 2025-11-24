import os
import sys
import django
import random
from datetime import datetime, timedelta
import json
from django.db import IntegrityError

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.hashers import make_password
from users.models import User, Student, Faculty, Admin, Staff

def generate_users():
    """Generate demo users with different roles"""
    print("Generating demo users...")
    
    # Sample data
    first_names = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Christopher', 'Jessica', 'Matthew', 'Ashley',
                   'Daniel', 'Samantha', 'Andrew', 'Brittany', 'Joshua', 'Amanda', 'Ryan', 'Melissa', 'Jacob', 'Stephanie']
    
    last_names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin']
    
    departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Engineering', 'Business', 'Psychology', 'English', 'History']
    
    statuses = ['active', 'inactive', 'suspended']
    
    # Create admin user
    try:
        admin_user = User.objects.create(
            username='90001',
            email='admin@digitalcampus.edu',
            first_name='Admin',
            last_name='User',
            role='admin',
            status='active',
            phone_number='+1-555-000-0001',
            date_of_birth=datetime(1980, 1, 15).date(),
            sso_id='SSO001',
            mfa_enabled=True,
            password=make_password('admin123'),
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
        print("Created admin user with ID 90001")
    except IntegrityError:
        print("Admin user already exists. Skipping...")
    
    # Create 5 faculty members with 4**** IDs
    for i in range(1, 6):
        faculty_id = f'4{i:04d}'
        
        # Check if user already exists
        if User.objects.filter(username=faculty_id).exists():
            print(f"Faculty user {faculty_id} already exists. Skipping...")
            continue
            
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        email = f'faculty{i}@digitalcampus.edu'
        
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
                password=make_password(f'faculty{i}123'),
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
            
            Faculty.objects.create(
                user=user,
                employee_id=faculty_id,
                department=random.choice(departments),
                office_location=f'Building {chr(64+i)}, Room {100+i}',
                title=random.choice(['Assistant Professor', 'Associate Professor', 'Professor']),
                hire_date=datetime(2010 + random.randint(0, 10), random.randint(1, 12), random.randint(1, 28)).date()
            )
            print(f"Created faculty user {faculty_id}")
        except IntegrityError:
            print(f"Faculty user {faculty_id} already exists. Skipping...")
    
    # Create 50 students with 19***** to 26***** IDs
    for i in range(1, 51):
        # Generate student IDs in the range 190001 to 269999
        student_id_num = 190000 + i
        if i > 10000:  # If we exceed 10000, start from 200000
            student_id_num = 200000 + (i - 10001)
        if i > 20000:  # If we exceed 20000, start from 210000
            student_id_num = 210000 + (i - 20001)
        if i > 30000:  # If we exceed 30000, start from 220000
            student_id_num = 220000 + (i - 30001)
        if i > 40000:  # If we exceed 40000, start from 230000
            student_id_num = 230000 + (i - 40001)
        if i > 50000:  # If we exceed 50000, start from 240000
            student_id_num = 240000 + (i - 50001)
        if i > 60000:  # If we exceed 60000, start from 250000
            student_id_num = 250000 + (i - 60001)
        if i > 70000:  # If we exceed 70000, start from 260000
            student_id_num = 260000 + (i - 70001)
            
        student_id = str(student_id_num)
        
        # Check if user already exists
        if User.objects.filter(username=student_id).exists():
            print(f"Student user {student_id} already exists. Skipping...")
            continue
            
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        email = f'student{i}@digitalcampus.edu'
        
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
                password=make_password(f'student{i}123'),
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
            
            Student.objects.create(
                user=user,
                student_id=student_id,
                degree_program=random.choice([
                    'Computer Science', 'Mechanical Engineering', 'Business Administration', 
                    'Psychology', 'Mathematics', 'Physics', 'Biology', 'English Literature'
                ]),
                advisor_id=f'4{random.randint(1000, 9999)}',
                graduation_date=datetime(2024 + random.randint(0, 4), 5, random.randint(1, 30)).date(),
                cumulative_gpa=round(random.uniform(2.0, 4.0), 2),
                library_card_number=f'LIB{i:06d}'
            )
            print(f"Created student user {student_id}")
        except IntegrityError:
            print(f"Student user {student_id} already exists. Skipping...")
    
    # Create 5 staff members with 5**** IDs (library staff)
    for i in range(1, 6):
        staff_id = f'5{i:04d}'
        
        # Check if user already exists
        if User.objects.filter(username=staff_id).exists():
            print(f"Staff user {staff_id} already exists. Skipping...")
            continue
            
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        email = f'staff{i}@digitalcampus.edu'
        
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
                password=make_password(f'staff{i}123'),
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
            print(f"Created staff user {staff_id}")
        except IntegrityError:
            print(f"Staff user {staff_id} already exists. Skipping...")
    
    # Create 3 IT admin members with 9**** IDs (different from main admin)
    for i in range(2, 5):
        admin_id = f'9{i:04d}'
        
        # Check if user already exists
        if User.objects.filter(username=admin_id).exists():
            print(f"IT Admin user {admin_id} already exists. Skipping...")
            continue
            
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        email = f'itadmin{i}@digitalcampus.edu'
        
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
                password=make_password(f'admin{i}123'),
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
            print(f"Created IT admin user {admin_id}")
        except IntegrityError:
            print(f"IT Admin user {admin_id} already exists. Skipping...")
    
    print("Demo users generated successfully!")

if __name__ == '__main__':
    generate_users()