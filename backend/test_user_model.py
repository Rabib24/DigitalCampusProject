import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User

# Test if we can access the failed_login_attempts attribute
try:
    # Try to get a user and check if it has the failed_login_attempts attribute
    user = User.objects.get(username='2221002')
    print(f"User: {user.username}")
    print(f"Email: {user.email}")
    print(f"Role: {user.role}")
    print(f"Failed login attempts: {user.failed_login_attempts}")
    print("User model is working correctly!")
except AttributeError as e:
    print(f"AttributeError: {e}")
    print("The User model doesn't have the expected attributes")
except Exception as e:
    print(f"Error: {e}")