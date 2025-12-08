import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User

def check_users():
    """Check if users exist and their password status"""
    print("Checking users in the database...")
    
    users = User.objects.all()
    print(f"Total users found: {users.count()}")
    
    if users.count() == 0:
        print("No users found in the database!")
        return
    
    for user in users:
        print(f"Username: {user.username}")
        print(f"Email: {user.email}")
        print(f"Role: {user.role}")
        print(f"Status: {user.status}")
        print(f"Password hash starts with: {user.password[:20]}...")
        print("---")

if __name__ == '__main__':
    check_users()