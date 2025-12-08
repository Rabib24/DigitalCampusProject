import os
import sys
import django
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError
import json
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

def setup_demo_users():
    """Setup demo users with the specified IDs and set their passwords to DigitalIUB123"""
    print("Setting up demo users...")
    
    # Hash the default password
    default_password = 'DigitalIUB123'
    hashed_password = make_password(default_password)
    
    created_count = 0
    updated_count = 0
    
    for i, user_id in enumerate(DEMO_USER_IDS):
        try:
            # Try to get existing user
            user = User.objects.get(username=user_id)
            # Update password
            user.password = hashed_password
            user.save()
            print(f"Updated password for existing user: {user_id}")
            updated_count += 1
        except User.DoesNotExist:
            # Create new user
            role = 'student'  # Default role
            email = f'user{i}@digitalcampus.edu'
            
            # Determine role based on ID pattern
            if user_id.startswith('9'):
                role = 'admin'
                email = f'admin{i}@digitalcampus.edu'
            elif user_id.startswith('4'):
                role = 'faculty'
                email = f'faculty{i}@digitalcampus.edu'
            elif user_id.startswith('5'):
                role = 'staff'
                email = f'staff{i}@digitalcampus.edu'
            
            user = User.objects.create(
                username=user_id,
                email=email,
                first_name=f'User{i}',
                last_name='Demo',
                role=role,
                status='active',
                password=hashed_password
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
        except Exception as e:
            print(f"Error processing user {user_id}: {e}")
    
    print(f"Successfully created {created_count} users and updated {updated_count} users.")
    print("All specified users now have the password: DigitalIUB123")

if __name__ == '__main__':
    setup_demo_users()