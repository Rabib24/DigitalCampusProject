import os
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Test importing the faculty auth views
try:
    print("Importing faculty auth views...")
    from faculty.auth_views import faculty_login
    print("Faculty auth views imported successfully")
    
    # Test importing the User model
    print("Importing User model...")
    from users.models import User
    print("User model imported successfully")
    
    # Test accessing a user
    print("Accessing user...")
    user = User.objects.get(username='2221002')
    print(f"User: {user.username}")
    print(f"Role: {user.role}")
    print(f"Has failed_login_attempts attribute: {hasattr(user, 'failed_login_attempts')}")
    print(f"Failed login attempts: {user.failed_login_attempts}")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()