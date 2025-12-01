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

from django.http import HttpRequest
from users.models import User
from faculty.models import Faculty
from courses.models import Course, Enrollment
from faculty.views import dashboard_overview

def create_mock_request(user, faculty):
    """Create a mock request object"""
    request = HttpRequest()
    request.method = 'GET'
    request.user = user
    request.faculty = faculty
    return request

def test_dashboard_function():
    """Test the faculty dashboard function directly"""
    try:
        # Get the faculty user
        user = User.objects.get(username='2221002')
        print(f"Found user: {user.username} (ID: {user.id}, Role: {user.role})")
        
        # Get faculty profile
        faculty = Faculty.objects.get(user=user)
        print(f"Faculty profile found: {faculty.employee_id}, Department: {faculty.department}")
        
        # Create a mock request
        request = create_mock_request(user, faculty)
        
        # Call the dashboard overview function directly
        response = dashboard_overview(request)
        
        print(f"Response status code: {response.status_code}")
        
        # Parse the response content
        content = response.content.decode('utf-8')
        print(f"Response content: {content}")
        
        # Try to parse as JSON
        try:
            data = json.loads(content)
            print("Successfully parsed JSON response:")
            print(json.dumps(data, indent=2))
            
            if response.status_code == 200:
                print("\n✓ Faculty dashboard function test passed!")
                return True
            else:
                print(f"\n✗ Faculty dashboard function test failed with status {response.status_code}")
                return False
        except json.JSONDecodeError as e:
            print(f"Failed to parse JSON response: {e}")
            return False
            
    except User.DoesNotExist:
        print("User with username '2221002' does not exist")
        return False
    except Faculty.DoesNotExist:
        print("Faculty profile not found")
        return False
    except Exception as e:
        print(f"Error testing faculty dashboard function: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("Testing faculty dashboard function directly...")
    success = test_dashboard_function()
    if success:
        print("\n✓ Faculty dashboard function test passed!")
    else:
        print("\n✗ Faculty dashboard function test failed!")