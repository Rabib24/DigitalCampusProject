#!/usr/bin/env python
import os
import sys
import django
import json
import requests

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from faculty.models import Faculty
import jwt
from django.conf import settings
from datetime import datetime, timedelta
from django.utils import timezone

def generate_test_token():
    """Generate a test JWT token for faculty user 2221002"""
    try:
        # Get the faculty user
        user = User.objects.get(username='2221002')
        print(f"Found user: {user.username} (ID: {user.id}, Role: {user.role})")
        
        # Generate JWT token
        now = timezone.now()
        exp = now + timedelta(hours=24)  # Token expires in 24 hours
        payload = {
            'user_id': user.id,
            'username': user.username,
            'role': user.role,
            'exp': exp.timestamp(),  # Convert to timestamp
            'iat': now.timestamp()   # Convert to timestamp
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        print(f"Generated token: {token}")
        return token
    except User.DoesNotExist:
        print("User with username '2221002' does not exist")
        return None
    except Exception as e:
        print(f"Error generating token: {e}")
        return None

def test_faculty_dashboard(token):
    """Test fetching faculty dashboard data"""
    try:
        # Make a request to the faculty dashboard endpoint
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.get('http://localhost:8000/api/v1/faculty/dashboard/overview/', headers=headers)
        print(f"Response status code: {response.status_code}")
        print(f"Response headers: {response.headers}")
        
        if response.status_code == 200:
            data = response.json()
            print("Successfully fetched faculty dashboard data:")
            print(json.dumps(data, indent=2))
            return True
        else:
            print(f"Failed to fetch faculty dashboard data. Status code: {response.status_code}")
            print(f"Response content: {response.text}")
            return False
    except Exception as e:
        print(f"Error testing faculty dashboard: {e}")
        return False

if __name__ == "__main__":
    print("Testing faculty dashboard data fetch...")
    
    # Generate a test token
    token = generate_test_token()
    if not token:
        sys.exit(1)
    
    # Test the faculty dashboard
    success = test_faculty_dashboard(token)
    if success:
        print("\n✓ Faculty dashboard data fetch test passed!")
    else:
        print("\n✗ Faculty dashboard data fetch test failed!")
        sys.exit(1)