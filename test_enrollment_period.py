#!/usr/bin/env python
import os
import sys
import django
import json
from datetime import datetime

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.backend.settings')
django.setup()

def test_enrollment_period_creation():
    """Test creating an enrollment period with the user's date format"""
    
    from student.models import EnrollmentPeriod
    import uuid
    
    # Test data matching the user's input
    name = "Test Enrollment Period"
    start_date_str = "12.9.2025 10.00AM"
    end_date_str = "12.11.2025 10.00AM"
    
    print("Testing enrollment period creation:")
    print("=" * 50)
    print(f"Name: {name}")
    print(f"Start Date: {start_date_str}")
    print(f"End Date: {end_date_str}")
    
    try:
        # Parse the dates using our improved function
        from student.admin_views import parse_datetime
        
        start_date = parse_datetime(start_date_str)
        end_date = parse_datetime(end_date_str)
        
        print(f"Parsed Start Date: {start_date}")
        print(f"Parsed End Date: {end_date}")
        
        # Create the enrollment period
        enrollment_period = EnrollmentPeriod(
            id=str(uuid.uuid4()),
            name=name,
            description="Test enrollment period for validation",
            start_date=start_date,
            end_date=end_date,
            student_group="",
            is_active=True
        )
        
        # Save to database
        enrollment_period.save()
        print("✓ Enrollment period created successfully!")
        print(f"ID: {enrollment_period.id}")
        
        # Verify it was saved correctly
        saved_period = EnrollmentPeriod.objects.get(id=enrollment_period.id)
        print(f"Retrieved from DB - Start: {saved_period.start_date}")
        print(f"Retrieved from DB - End: {saved_period.end_date}")
        
        # Clean up - delete the test record
        enrollment_period.delete()
        print("✓ Test record cleaned up")
        
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_enrollment_period_creation()