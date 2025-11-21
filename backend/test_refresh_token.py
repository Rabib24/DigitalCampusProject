"""
Test refresh token functionality to identify any issues
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User

def test_generate_refresh_token():
    """Test the generate_refresh_token function"""
    print("Testing generate_refresh_token function...")
    
    # Import the function directly
    from faculty.middleware import generate_refresh_token
    
    try:
        # Get a test user
        user = User.objects.get(username='2221002')
        print(f"User: {user.username}")
        
        # Test the generate_refresh_token function
        token = generate_refresh_token(user)
        print(f"Refresh token generated successfully: {token}")
        return True
    except Exception as e:
        print(f"Error in generate_refresh_token: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_generate_refresh_token()