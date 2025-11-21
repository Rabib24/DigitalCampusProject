import os
import django
import json
import jwt
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from faculty.models import Faculty
from faculty.auth_views import generate_jwt_token, faculty_login
from faculty.views import dashboard_overview
from django.http import HttpRequest

def create_mock_request(method='GET', user=None, token=None):
    """Create a mock Django request object"""
    request = HttpRequest()
    request.method = method
    request.META = {}
    
    if token:
        request.META['HTTP_AUTHORIZATION'] = f'Bearer {token}'
    
    if user:
        request.user = user
        # Attach faculty profile to request
        try:
            faculty = Faculty.objects.get(user=user)
            request.faculty = faculty
        except Faculty.DoesNotExist:
            request.faculty = None
    
    return request

def test_faculty_dashboard_access():
    """Test faculty dashboard access with proper permissions"""
    print("Testing faculty dashboard access...")
    
    # Get the test faculty user
    try:
        user = User.objects.get(username='testfaculty')
        print(f"Found test faculty user: {user.username}")
        
        # Generate a JWT token for the user
        token = generate_jwt_token(user)
        print(f"Generated JWT token: {token[:50]}...")
        
        # Create a mock request for dashboard access
        request = create_mock_request('GET', user, token)
        
        # Test dashboard overview access
        print("\nTesting dashboard overview access...")
        response = dashboard_overview(request)
        
        # Parse the response
        content = response.content.decode('utf-8')
        data = json.loads(content)
        
        print(f"Response status: {response.status_code}")
        print(f"Response data: {data}")
        
        if response.status_code == 200:
            print("✅ Faculty dashboard access successful!")
            print(f"Active classes: {data.get('activeClasses', 'N/A')}")
            print(f"Total students: {data.get('totalStudents', 'N/A')}")
            print(f"Pending grades: {data.get('pendingGrades', 'N/A')}")
        else:
            print("❌ Faculty dashboard access failed!")
            print(f"Error message: {data.get('message', 'Unknown error')}")
            
    except User.DoesNotExist:
        print("Test faculty user not found")
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_faculty_dashboard_access()