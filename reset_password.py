import os
import sys
import django

# Add the backend directory to the Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_path)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from django.contrib.auth.hashers import make_password

# Reset password for user
try:
    user = User.objects.get(username="2221001")
    print(f"User found: {user.username}, Email: {user.email}, Role: {user.role}")
    
    # Reset password
    new_password = "DigitalCampus123"
    user.password = make_password(new_password)
    user.save()
    
    print(f"Password reset successfully for user {user.username}")
    
except User.DoesNotExist:
    print("User not found")
except Exception as e:
    print(f"Error: {e}")