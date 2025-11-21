import os
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User

# Test accessing user attributes directly
try:
    print("Testing User model access...")
    user = User.objects.get(username='2221002')
    print(f"User: {user.username}")
    print(f"Role: {user.role}")
    print(f"Has failed_login_attempts attribute: {hasattr(user, 'failed_login_attempts')}")
    print(f"Failed login attempts: {user.failed_login_attempts}")
    
    # Try to increment the failed login attempts
    print("Incrementing failed login attempts...")
    user.failed_login_attempts += 1
    print(f"New failed login attempts: {user.failed_login_attempts}")
    
    # Try to save the user
    print("Saving user...")
    user.save()
    print("User saved successfully")
    
    # Reset the failed login attempts
    print("Resetting failed login attempts...")
    user.failed_login_attempts = 0
    user.save()
    print("Failed login attempts reset successfully")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()