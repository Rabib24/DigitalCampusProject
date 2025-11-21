import os
import django
import jwt
from django.conf import settings
from datetime import datetime, timedelta
from django.utils import timezone

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def generate_and_test_token():
    """Generate a token and test decoding it"""
    print("SECRET_KEY from settings:", settings.SECRET_KEY[:50])
    print("SECRET_KEY length:", len(settings.SECRET_KEY))
    
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
    
    # Generate token
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    print(f"Generated token: {token}")
    
    # Try to decode the token
    print("\n=== Decoding the generated token ===")
    try:
        decoded_payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        print(f"Decoded payload: {decoded_payload}")
        return token
    except Exception as e:
        print(f"Error decoding token: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    print("=== Token Generation and Decoding Test ===")
    token = generate_and_test_token()
    if token:
        print(f"\nFinal token: {token}")