import os
import django
from django.contrib.auth.hashers import make_password

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User, Student, Faculty

def setup_test_data():
    """Set up test data for login testing"""
    print("Setting up test data...")
    
    # Delete existing test users if they exist
    User.objects.filter(username='teststudent').delete()
    User.objects.filter(username='testfaculty').delete()
    User.objects.filter(username='testadmin').delete()
    
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
    
    # Create faculty user
    faculty_user = User.objects.create(
        username='testfaculty',
        email='testfaculty@example.com',
        first_name='Test',
        last_name='Faculty',
        role='faculty',
        status='active',
        mfa_enabled=False,
        failed_login_attempts=0,
        password=make_password('testpass123')
    )
    
    faculty = Faculty.objects.create(
        user=faculty_user,
        employee_id='FAC001',
        department='Computer Science',
        title='Assistant Professor'
    )
    
    print(f"Created faculty user: {faculty_user.username}")
    
    # Create admin user
    admin_user = User.objects.create(
        username='testadmin',
        email='testadmin@example.com',
        first_name='Test',
        last_name='Admin',
        role='admin',
        status='active',
        mfa_enabled=False,
        failed_login_attempts=0,
        password=make_password('testpass123')
    )
    
    print(f"Created admin user: {admin_user.username}")
    
    print("Test data setup complete!")

if __name__ == "__main__":
    setup_test_data()