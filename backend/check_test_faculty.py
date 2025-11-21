import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from faculty.models import Faculty

def check_test_faculty():
    """Check if test faculty user exists"""
    try:
        user = User.objects.get(username='testfaculty')
        print(f"Test faculty user exists: {user.username}")
        print(f"User ID: {user.id}")
        print(f"Email: {user.email}")
        
        # Check faculty profile
        try:
            faculty = Faculty.objects.get(user=user)
            print(f"Faculty profile exists: {faculty.employee_id}")
            print(f"Department: {faculty.department}")
            print(f"Title: {faculty.title}")
        except Faculty.DoesNotExist:
            print("Faculty profile not found")
            
    except User.DoesNotExist:
        print("Test faculty user not found")

if __name__ == "__main__":
    check_test_faculty()