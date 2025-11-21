import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User

# Test accessing user attributes
try:
    user = User.objects.get(username='2221002')
    print(f"User: {user.username}")
    print(f"Role: {user.role}")
    print(f"Failed login attempts: {user.failed_login_attempts}")
    print(f"Has failed_login_attempts attribute: {hasattr(user, 'failed_login_attempts')}")
    
    # Try to increment the failed login attempts
    user.failed_login_attempts += 1
    print(f"Incremented failed login attempts: {user.failed_login_attempts}")
    
    # Try to save the user
    user.save()
    print("User saved successfully")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()