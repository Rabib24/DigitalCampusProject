"""
Test JWT functionality to identify any issues
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

import jwt
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

def test_jwt():
    """Test JWT token generation"""
    print("Testing JWT token generation...")
    
    # Use timezone.now() for timezone-aware datetime
    now = timezone.now()
    print(f"Current time: {now}")
    
    payload = {
        'user_id': 1,
        'username': 'testuser',
        'role': 'faculty',
        'exp': now + timedelta(hours=24),  # Token expires in 24 hours
        'iat': now
    }
    
    print(f"Payload: {payload}")
    
    try:
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        print(f"Token generated successfully: {token}")
        return True
    except Exception as e:
        print(f"Error generating JWT token: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_jwt()