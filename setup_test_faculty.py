"""
Script to set up a test faculty user for login testing
"""
import os
import django
from django.contrib.auth.hashers import make_password

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User, Faculty

def setup_test_faculty():
    """Set up a test faculty user for login testing"""
    print("Setting up test faculty user...")
    
    # Faculty credentials
    username = "2221002"
    email = "2221002@iub.edu.bd"
    password = "DigitalCampus123"
    
    try:
        # Check if user already exists
        if User.objects.filter(username=username).exists():
            print(f"User with username '{username}' already exists")
            user = User.objects.get(username=username)
        else:
            # Create faculty user
            user = User.objects.create(
                username=username,
                email=email,
                first_name="Test",
                last_name="Faculty",
                role='faculty',
                status='active',
                password=make_password(password)
            )
            print(f"Created faculty user: {user.username}")
        
        # Check if faculty profile exists
        if Faculty.objects.filter(user=user).exists():
            print(f"Faculty profile for '{username}' already exists")
        else:
            # Create faculty profile
            faculty = Faculty.objects.create(
                user=user,
                employee_id=username,
                department="Computer Science",
                title="Assistant Professor"
            )
            print(f"Created faculty profile: {faculty.employee_id}")
            
        print("Test faculty user setup complete!")
        print(f"Username: {username}")
        print(f"Email: {email}")
        print(f"Password: {password}")
        
    except Exception as e:
        print(f"Error setting up test faculty user: {e}")

if __name__ == "__main__":
    setup_test_faculty()