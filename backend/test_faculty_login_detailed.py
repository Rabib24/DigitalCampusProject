"""
Detailed test of faculty login function to identify any issues
"""
import os
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.test import RequestFactory
from faculty.auth_views import faculty_login
from users.models import User, Faculty

def test_faculty_login_detailed():
    """Test the faculty login function with detailed error checking"""
    print("Testing faculty login function with detailed error checking...")
    
    # Create a request factory
    factory = RequestFactory()
    
    # Test data
    test_data = {
        'identifier': '2221002',
        'password': 'DigitalCampus123'
    }
    
    print(f"Test data: {test_data}")
    
    # Check if user exists
    try:
        user = User.objects.get(username='2221002')
        print(f"User found: {user.username}, role: {user.role}, status: {user.status}")
        
        # Check if faculty profile exists
        try:
            faculty_profile = Faculty.objects.get(user=user)
            print(f"Faculty profile found: {faculty_profile.employee_id}, {faculty_profile.department}")
        except Faculty.DoesNotExist:
            print("Faculty profile not found")
    except User.DoesNotExist:
        print("User not found")
    
    # Create a mock request
    request = factory.post('/api/v1/faculty/auth/login/', 
                          data=json.dumps(test_data),
                          content_type='application/json')
    
    # Add META data to simulate a real request
    request.META['REMOTE_ADDR'] = '127.0.0.1'
    
    print("Calling faculty_login function...")
    
    try:
        # Call the faculty_login function directly
        response = faculty_login(request)
        print(f"Response status code: {response.status_code}")
        print(f"Response content: {response.content.decode()}")
    except Exception as e:
        print(f"Error calling faculty_login: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_faculty_login_detailed()