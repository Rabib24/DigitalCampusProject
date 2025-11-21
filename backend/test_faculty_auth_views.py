"""
Test faculty auth views to identify any issues
"""
import os
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from faculty.auth_views import generate_jwt_token

def test_generate_jwt_token():
    """Test the generate_jwt_token function"""
    print("Testing generate_jwt_token function...")
    
    try:
        # Get a test user
        user = User.objects.get(username='2221002')
        print(f"User: {user.username}")
        
        # Test the generate_jwt_token function
        token = generate_jwt_token(user)
        print(f"Token generated successfully: {token}")
        return True
    except Exception as e:
        print(f"Error in generate_jwt_token: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_generate_jwt_token()