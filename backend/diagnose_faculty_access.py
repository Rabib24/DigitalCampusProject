#!/usr/bin/env python
"""
Test script to diagnose and fix faculty dashboard login issues
"""

import os
import sys
import django
from django.conf import settings

# Add the backend directory to the Python path
backend_path = r'h:\Systemproject\DigitalCampus\backend'
sys.path.append(backend_path)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User, Faculty
from faculty.middleware import FacultyRoleMiddleware
from django.http import HttpRequest
import json

def test_faculty_users():
    """Check if there are faculty users in the database"""
    print("Checking for faculty users in the database...")
    total_users = User.objects.count()
    faculty_users = User.objects.filter(role='faculty')
    faculty_count = faculty_users.count()
    
    print(f"Total users: {total_users}")
    print(f"Faculty users: {faculty_count}")
    
    if faculty_count > 0:
        print("\nFaculty users found:")
        for user in faculty_users:
            print(f"  - {user.username} ({user.first_name} {user.last_name}) - {user.role}")
            
            # Check if faculty profile exists
            try:
                faculty_profile = Faculty.objects.get(user=user)
                print(f"    Faculty profile: {faculty_profile.employee_id}, {faculty_profile.department}")
            except Faculty.DoesNotExist:
                print(f"    No faculty profile found for this user")
    else:
        print("No faculty users found in the database.")
        print("Creating a test faculty user...")
        create_test_faculty_user()
        
def create_test_faculty_user():
    """Create a test faculty user for testing"""
    try:
        # Create a faculty user
        faculty_user = User.objects.create_user(
            username='faculty_test',
            email='faculty@test.edu',
            password='testpass123',
            first_name='Test',
            last_name='Faculty',
            role='faculty',
            status='active'
        )
        
        # Create faculty profile
        faculty_profile = Faculty.objects.create(
            user=faculty_user,
            employee_id='EMP001',
            department='Computer Science',
            title='Professor'
        )
        
        print(f"Created test faculty user: {faculty_user.username}")
        print(f"Faculty profile: {faculty_profile.employee_id}, {faculty_profile.department}")
        
    except Exception as e:
        print(f"Error creating test faculty user: {e}")

def test_faculty_middleware():
    """Test the faculty middleware functionality"""
    print("\nTesting faculty middleware...")
    
    # Create a mock request
    request = HttpRequest()
    request.path = '/api/v1/faculty/dashboard/overview/'
    request.META = {
        'HTTP_AUTHORIZATION': 'Bearer fake-jwt-token-for-faculty_test-role-faculty'
    }
    
    # Create middleware instance
    middleware = FacultyRoleMiddleware()
    
    # Test the middleware
    try:
        result = middleware.process_request(request)
        if result is None:
            print("Middleware check passed - faculty user can access faculty routes")
        else:
            print(f"Middleware check failed: {result.content.decode()}")
    except Exception as e:
        print(f"Error testing middleware: {e}")

def test_login_endpoint():
    """Test the login endpoint with a faculty user"""
    print("\nTesting login endpoint...")
    
    # This would normally be an HTTP request, but we'll simulate it
    from users.views import login_view
    from django.http import HttpRequest
    import json
    
    # Create a mock request
    request = HttpRequest()
    request.method = 'POST'
    request.body = json.dumps({
        'identifier': 'faculty_test',
        'password': 'testpass123'
    }).encode('utf-8')
    
    try:
        response = login_view(request)
        if response.status_code == 200:
            data = json.loads(response.content.decode())
            if data.get('success'):
                print("Login successful!")
                print(f"User role: {data['user']['role']}")
                print(f"Token: {data['token']}")
                
                # Check if faculty-specific data is included
                if 'department' in data['user']:
                    print(f"Faculty department: {data['user']['department']}")
                if 'employee_id' in data['user']:
                    print(f"Employee ID: {data['user']['employee_id']}")
            else:
                print(f"Login failed: {data.get('message')}")
        else:
            print(f"Login endpoint returned status {response.status_code}")
    except Exception as e:
        print(f"Error testing login endpoint: {e}")

if __name__ == "__main__":
    print("=== Faculty Dashboard Access Diagnostic ===")
    test_faculty_users()
    test_login_endpoint()
    test_faculty_middleware()
    print("\n=== Diagnostic Complete ===")