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

from django.test import Client
from users.models import User
import jwt
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

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
        print(f"Generated token: {token[:20]}...")
        return token
    except User.DoesNotExist:
        print("User with username '2221002' does not exist")
        return None
    except Exception as e:
        print(f"Error generating token: {e}")
        return None

def test_with_django_client():
    """Test the faculty dashboard using Django's test client"""
    try:
        # Generate a test token
        token = generate_test_token()
        if not token:
            return False
        
        # Create a test client
        client = Client()
        
        # Make a request to the faculty dashboard endpoint
        response = client.get('/api/v1/faculty/dashboard/overview/', 
                             HTTP_AUTHORIZATION=f'Bearer {token}')
        
        print(f"Response status code: {response.status_code}")
        print(f"Response content: {response.content.decode('utf-8')}")
        
        if response.status_code == 200:
            data = json.loads(response.content)
            print("Successfully fetched faculty dashboard data:")
            print(json.dumps(data, indent=2))
            print("\n✓ Faculty dashboard data fetch test passed!")
            return True
        else:
            print(f"Failed to fetch faculty dashboard data. Status code: {response.status_code}")
            print(f"Response content: {response.content.decode('utf-8')}")
            print("\n✗ Faculty dashboard data fetch test failed!")
            return False
            
    except Exception as e:
        print(f"Error testing faculty dashboard: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("Testing faculty dashboard data fetch with Django test client...")
    success = test_with_django_client()
    if not success:
        sys.exit(1)