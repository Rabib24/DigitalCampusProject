import os
import sys
import django
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError
from datetime import datetime

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User, Student, Faculty, Admin, Staff

# List of user IDs from your request
DEMO_USER_IDS = [
    "90001", "40001", "40002", "40003", "40004", "40005", "40006", "40007", "40008", "40009", "40010",
    "190001", "190002", "190003", "190004", "190005", "190006", "190007", "190008", "190009", "190010",
    "190011", "190012", "190013", "190014", "190015", "190016", "190017", "190018", "190019", "190020",
    "190021", "190022", "190023", "190024", "190025", "190026", "190027", "190028", "190029", "190030",
    "50001", "50002", "50003", "50004", "50005",
    "90002", "90003", "90004"
]

def create_demo_users():
    """Create demo users with the specified IDs and set their passwords to DigitalIUB123"""
    print("Creating demo users...")
    
    # Hash the default password
    default_password = 'DigitalIUB123'
    hashed_password = make_password(default_password)
    
    created_count = 0
    
    for i, user_id in enumerate(DEMO_USER_IDS):
        try:
            # Determine role based on ID pattern
            role = 'student'  # Default role
            email = f'user{user_id}@digitalcampus.edu'
            first_name = f'User{user_id}'
            last_name = 'Demo'
            
            if user_id.startswith('9'):
                role = 'admin'
                email = f'admin{user_id}@digitalcampus.edu'
                first_name = f'Admin{user_id}'
            elif user_id.startswith('4'):
                role = 'faculty'
                email = f'faculty{user_id}@digitalcampus.edu'
                first_name = f'Faculty{user_id}'
            elif user_id.startswith('5'):
                role = 'staff'
                email = f'staff{user_id}@digitalcampus.edu'
                first_name = f'Staff{user_id}'
            elif user_id.startswith('19'):
                role = 'student'
                email = f'student{user_id}@digitalcampus.edu'
                first_name = f'Student{user_id}'
            
            # Create new user with all required fields
            user = User.objects.create(
                username=user_id,
                email=email,
                first_name=first_name,
                last_name=last_name,
                role=role,
                status='active',
                password=hashed_password,
                mfa_enabled=False,  # This was missing before
                phone_number=f'+1-555-{user_id[-4:]}',
                date_of_birth=datetime(1990, 1, 1).date()
            )
            
            # Create role-specific profile
            if role == 'student':
                Student.objects.create(
                    user=user,
                    student_id=user_id
                )
            elif role == 'faculty':
                Faculty.objects.create(
                    user=user,
                    employee_id=user_id,
                    department='Computer Science'
                )
            elif role == 'admin':
                Admin.objects.create(
                    user=user,
                    employee_id=user_id,
                    department='Administration'
                )
            elif role == 'staff':
                Staff.objects.create(
                    user=user,
                    employee_id=user_id,
                    department='Support'
                )
            
            print(f"Created new user: {user_id} with role {role}")
            created_count += 1
            
        except IntegrityError as e:
            print(f"User {user_id} already exists or there was a database integrity error: {e}")
        except Exception as e:
            print(f"Error creating user {user_id}: {e}")
    
    print(f"Successfully created {created_count} users.")
    print("All specified users now have the password: DigitalIUB123")

if __name__ == '__main__':
    create_demo_users()