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
from faculty.auth_views import generate_jwt_token
from faculty.views import (
    dashboard_overview, courses_list, assignments_list, 
    research_projects, analytics, recordings
)
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

def test_faculty_endpoints():
    """Test all faculty endpoints with proper permissions"""
    print("Testing all faculty endpoints...")
    
    # Get the test faculty user
    try:
        user = User.objects.get(username='testfaculty')
        print(f"Found test faculty user: {user.username}")
        
        # Generate a JWT token for the user
        token = generate_jwt_token(user)
        print(f"Generated JWT token: {token[:50]}...")
        
        # Test dashboard overview
        print("\n1. Testing dashboard overview...")
        request = create_mock_request('GET', user, token)
        response = dashboard_overview(request)
        data = json.loads(response.content.decode('utf-8'))
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Dashboard overview successful!")
        else:
            print(f"   ❌ Dashboard overview failed: {data.get('message', 'Unknown error')}")
        
        # Test courses list
        print("\n2. Testing courses list...")
        request = create_mock_request('GET', user, token)
        response = courses_list(request)
        data = json.loads(response.content.decode('utf-8'))
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Courses list successful!")
        else:
            print(f"   ❌ Courses list failed: {data.get('message', 'Unknown error')}")
        
        # Test assignments list
        print("\n3. Testing assignments list...")
        request = create_mock_request('GET', user, token)
        response = assignments_list(request)
        data = json.loads(response.content.decode('utf-8'))
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Assignments list successful!")
        else:
            print(f"   ❌ Assignments list failed: {data.get('message', 'Unknown error')}")
        
        # Test research projects
        print("\n4. Testing research projects...")
        request = create_mock_request('GET', user, token)
        response = research_projects(request)
        data = json.loads(response.content.decode('utf-8'))
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Research projects successful!")
        else:
            print(f"   ❌ Research projects failed: {data.get('message', 'Unknown error')}")
        
        # Test analytics
        print("\n5. Testing analytics...")
        request = create_mock_request('GET', user, token)
        response = analytics(request)
        data = json.loads(response.content.decode('utf-8'))
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Analytics successful!")
        else:
            print(f"   ❌ Analytics failed: {data.get('message', 'Unknown error')}")
        
        # Test recordings
        print("\n6. Testing recordings...")
        request = create_mock_request('GET', user, token)
        response = recordings(request)
        data = json.loads(response.content.decode('utf-8'))
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Recordings successful!")
        else:
            print(f"   ❌ Recordings failed: {data.get('message', 'Unknown error')}")
            
        print("\n🎉 All faculty endpoint tests completed!")
        
    except User.DoesNotExist:
        print("Test faculty user not found")
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_faculty_endpoints()