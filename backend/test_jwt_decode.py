import os
import django
import jwt
from django.conf import settings
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Test token from our previous curl request
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMCwidXNlcm5hbWUiOiJ0ZXN0ZmFjdWx0eSIsInJvbGUiOiJmYWN1bHR5IiwiZXhwIjoxNzYzNzUxOTQ5LjE0OTI0MiwiaWF0IjoxNzYzNjY1NTQ5LjE0OTI0Mn0.sy7aq8d0wFMhX6KMLZS1W_Pf0VzosdFVSwP4zCFJKKl8"

print("Attempting to decode token...")
try:
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    print(f"Decoded payload: {json.dumps(payload, indent=2)}")
    
    # Check expiration
    exp = payload.get('exp')
    print(f"Token exp: {exp}")
    
    # Check if token is expired
    import time
    current_time = time.time()
    print(f"Current time: {current_time}")
    print(f"Token expired: {exp < current_time}")
    
except Exception as e:
    print(f"Error decoding token: {e}")
    import traceback
    traceback.print_exc()