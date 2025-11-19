import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User

# Check if the faculty user exists and is active
try:
    user = User.objects.get(username='2221002')
    print(f"User: {user.username}")
    print(f"Name: {user.first_name} {user.last_name}")
    print(f"Role: {user.role}")
    print(f"Active: {user.is_active}")
    print(f"Status: {user.status}")
except Exception:
    print("User not found or error occurred")