import os
import sys
import django
from django.contrib.auth.hashers import make_password, check_password

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User

def test_password_hash():
    """Test password hashing and verification"""
    # Test with a known user
    try:
        user = User.objects.get(username='90001')
        print(f"User found: {user.username}")
        print(f"Stored password hash: {user.password}")
        
        # Test password verification
        is_valid = check_password('DigitalIUB123', user.password)
        print(f"Password 'DigitalIUB123' is valid: {is_valid}")
        
        # Test with wrong password
        is_invalid = check_password('wrongpassword', user.password)
        print(f"Password 'wrongpassword' is valid: {is_invalid}")
        
        # Show what the hash would look like
        test_hash = make_password('DigitalIUB123')
        print(f"New hash for 'DigitalIUB123': {test_hash}")
        
    except User.DoesNotExist:
        print("User 90001 not found")

if __name__ == '__main__':
    test_password_hash()