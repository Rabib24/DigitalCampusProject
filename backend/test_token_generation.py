import os
import django
import jwt
from django.conf import settings
from datetime import datetime, timedelta
from django.utils import timezone

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def generate_test_token():
    """Generate a test JWT token"""
    # Use timezone.now() for timezone-aware datetime
    now = timezone.now()
    exp = now + timedelta(hours=24)  # Token expires in 24 hours
    print(f"Generating token - now: {now}, exp: {exp}")
    payload = {
        'user_id': 20,
        'username': 'testfaculty',
        'role': 'faculty',
        'exp': exp.timestamp(),  # Convert to timestamp
        'iat': now.timestamp()   # Convert to timestamp
    }
    print(f"Token payload: {payload}")
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    print(f"Generated token: {token}")
    return token

def decode_test_token(token):
    """Decode a test JWT token"""
    print("Attempting to decode token...")
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        print(f"Decoded payload: {payload}")
        
        # Check expiration
        exp = payload.get('exp')
        print(f"Token exp: {exp}")
        
        # Check if token is expired
        import time
        current_time = time.time()
        print(f"Current time: {current_time}")
        print(f"Token expired: {exp < current_time}")
        
        return payload
    except Exception as e:
        print(f"Error decoding token: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    print("=== Token Generation and Decoding Test ===")
    token = generate_test_token()
    print("\n=== Decoding the generated token ===")
    decoded_payload = decode_test_token(token)