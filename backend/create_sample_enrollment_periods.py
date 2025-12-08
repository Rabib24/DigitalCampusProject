import os
import sys
import django
from datetime import date, timedelta

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from student.models import EnrollmentPeriod
import uuid

def create_sample_enrollment_periods():
    """Create sample enrollment periods for testing"""
    
    # Clear existing periods
    EnrollmentPeriod.objects.all().delete()
    
    # Create a current enrollment period (active)
    current_period = EnrollmentPeriod(
        id=str(uuid.uuid4()),
        name="Fall 2025 Enrollment Period",
        description="Enrollment period for Fall 2025 semester",
        start_date=date.today() - timedelta(days=10),
        end_date=date.today() + timedelta(days=20),
        student_group="",
        is_active=True
    )
    current_period.save()
    print(f"Created current enrollment period: {current_period.name}")
    
    # Create a future enrollment period
    future_period = EnrollmentPeriod(
        id=str(uuid.uuid4()),
        name="Spring 2026 Enrollment Period",
        description="Enrollment period for Spring 2026 semester",
        start_date=date.today() + timedelta(days=60),
        end_date=date.today() + timedelta(days=90),
        student_group="",
        is_active=True
    )
    future_period.save()
    print(f"Created future enrollment period: {future_period.name}")
    
    # Create an inactive period
    inactive_period = EnrollmentPeriod(
        id=str(uuid.uuid4()),
        name="Summer 2025 Enrollment Period",
        description="Enrollment period for Summer 2025 semester (closed)",
        start_date=date.today() - timedelta(days=60),
        end_date=date.today() - timedelta(days=30),
        student_group="",
        is_active=False
    )
    inactive_period.save()
    print(f"Created inactive enrollment period: {inactive_period.name}")
    
    print("Sample enrollment periods created successfully!")

if __name__ == "__main__":
    create_sample_enrollment_periods()