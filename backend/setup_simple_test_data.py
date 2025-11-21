import os
import django
from django.contrib.auth.hashers import make_password

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User, Student

def setup_simple_test_data():
    """Set up simple test data for login testing"""
    print("Setting up simple test data...")
    
    # Delete existing test users if they exist
    User.objects.filter(username='teststudent').delete()
    
    # Create student user
    student_user = User.objects.create(
        username='teststudent',
        email='teststudent@example.com',
        first_name='Test',
        last_name='Student',
        role='student',
        status='active',
        mfa_enabled=False,
        failed_login_attempts=0,
        password=make_password('testpass123')
    )
    
    student = Student.objects.create(
        user=student_user,
        student_id='STU001',
        degree_program='Computer Science'
    )
    
    print(f"Created student user: {student_user.username}")
    print("Simple test data setup complete!")

if __name__ == "__main__":
    setup_simple_test_data()