import os
import sys
import django
from django.contrib.auth.hashers import make_password

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User

def reset_passwords_for_actual_users():
    """Reset passwords for the actual users in the database"""
    print("Resetting passwords for actual users...")
    
    # Hash the default password
    default_password = 'DigitalIUB123'
    hashed_password = make_password(default_password)
    
    # Get all users
    users = User.objects.all()
    print(f"Found {users.count()} users")
    
    if users.count() == 0:
        print("No users found!")
        return
    
    # Update all users with the new password
    updated_count = 0
    for user in users:
        user.password = hashed_password
        user.save()
        updated_count += 1
        print(f"Updated password for user: {user.username}")
    
    print(f"Successfully reset passwords for {updated_count} users.")
    print("All users can now log in with the password: DigitalIUB123")

if __name__ == '__main__':
    reset_passwords_for_actual_users()