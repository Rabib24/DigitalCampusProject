import os
import sys
import django
import json
import requests

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import authenticate
from users.models import User
import jwt
from django.conf import settings

def get_auth_token(username, password):
    """Get authentication token for a user"""
    # Try to authenticate with provided credentials
    user = authenticate(username=username, password=password)
    if user:
        # Create a JWT token
        payload = {
            'user_id': str(user.id),
            'username': user.username,
            'role': user.role
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        return token
    return None

def test_authenticated_endpoints():
    """Test the student endpoints with authentication"""
    
    # Try different password combinations
    passwords_to_try = ["DigitalIUB123", "teststudent"]
    token = None
    
    for password in passwords_to_try:
        print(f"Trying to authenticate with password: {password}")
        token = get_auth_token("teststudent", password)
        if token:
            print("Authentication successful!")
            break
    
    if not token:
        print("Failed to authenticate test user with any password")
        return
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    base_url = "http://127.0.0.1:8000/api/v1"
    
    # Test the dashboard endpoint
    print("Testing dashboard endpoint...")
    try:
        response = requests.get(f"{base_url}/student/dashboard/", headers=headers)
        print(f"Dashboard endpoint status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Dashboard data: {json.dumps(data, indent=2)}")
        else:
            print(f"Dashboard error: {response.text}")
    except Exception as e:
        print(f"Dashboard endpoint error: {e}")
    
    # Test the enrollment periods endpoint
    print("\nTesting enrollment periods endpoint...")
    try:
        response = requests.get(f"{base_url}/student/enrollment/periods/", headers=headers)
        print(f"Enrollment periods endpoint status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Enrollment periods data: {json.dumps(data, indent=2)}")
        else:
            print(f"Enrollment periods error: {response.text}")
    except Exception as e:
        print(f"Enrollment periods endpoint error: {e}")
    
    # Test the available courses endpoint
    print("\nTesting available courses endpoint...")
    try:
        response = requests.get(f"{base_url}/student/courses/available/", headers=headers)
        print(f"Available courses endpoint status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Available courses count: {len(data.get('courses', []))}")
            if 'courses' in data:
                for course in data['courses'][:3]:  # Show first 3 courses
                    print(f"  - {course['code']}: {course['name']}")
        else:
            print(f"Available courses error: {response.text}")
    except Exception as e:
        print(f"Available courses endpoint error: {e}")

if __name__ == "__main__":
    test_authenticated_endpoints()