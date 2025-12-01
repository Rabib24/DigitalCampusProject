#!/usr/bin/env python
import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from faculty.models import Faculty

def check_faculty_user():
    """Check if faculty user 2221002 exists"""
    try:
        # Get the faculty user
        user = User.objects.get(username='2221002')
        print(f"Found user: {user.username} (ID: {user.id}, Role: {user.role})")
        
        # Check if faculty profile exists
        try:
            faculty = Faculty.objects.get(user=user)
            print(f"Faculty profile found: {faculty.employee_id}, Department: {faculty.department}")
        except Faculty.DoesNotExist:
            print("Faculty profile not found")
            return False
            
        return True
    except User.DoesNotExist:
        print("User with username '2221002' does not exist")
        return False
    except Exception as e:
        print(f"Error checking faculty user: {e}")
        return False

if __name__ == "__main__":
    print("Checking faculty user 2221002...")
    success = check_faculty_user()
    if success:
        print("\n✓ Faculty user check passed!")
    else:
        print("\n✗ Faculty user check failed!")