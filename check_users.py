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

# Check if users exist
print("Existing users:")
users = User.objects.all()
for user in users:
    print(f"Username: {user.username}, Email: {user.email}, Role: {user.role}, Status: {user.status}")