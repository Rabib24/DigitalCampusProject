#!/usr/bin/env python
import os
import sys
import django
import json

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.test import RequestFactory
from users.models import User
from faculty.models import Faculty
from faculty.views import dashboard_overview
from faculty.middleware import FacultyRoleMiddleware

def test_dashboard_directly():
    """Test the faculty dashboard view directly"""
    try:
        # Get the faculty user
        user = User.objects.get(username='2221002')
        print(f"Found user: {user.username} (ID: {user.id}, Role: {user.role})")
        
        # Get faculty profile
        faculty = Faculty.objects.get(user=user)
        print(f"Faculty profile found: {faculty.employee_id}, Department: {faculty.department}")
        
        # Create a mock request
        factory = RequestFactory()
        request = factory.get('/api/v1/faculty/dashboard/overview/')
        
        # Attach user and faculty to request (simulating middleware)
        request.user = user
        request.faculty = faculty
        
        # Call the dashboard overview view directly
        response = dashboard_overview(request)
        
        print(f"Response status code: {response.status_code}")
        print(f"Response content: {response.content.decode('utf-8')}")
        
        if response.status_code == 200:
            print("\n✓ Faculty dashboard data fetch test passed!")
            return True
        else:
            print("\n✗ Faculty dashboard data fetch test failed!")
            return False
            
    except User.DoesNotExist:
        print("User with username '2221002' does not exist")
        return False
    except Faculty.DoesNotExist:
        print("Faculty profile not found")
        return False
    except Exception as e:
        print(f"Error testing faculty dashboard: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("Testing faculty dashboard data fetch directly...")
    success = test_dashboard_directly()
    if success:
        print("\n✓ Faculty dashboard data fetch test passed!")
    else:
        print("\n✗ Faculty dashboard data fetch test failed!")