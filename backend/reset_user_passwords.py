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

def reset_all_user_passwords():
    """Reset all user passwords to the default value 'DigitalIUB123'"""
    print("Resetting all user passwords to 'DigitalIUB123'...")
    
    # Hash the default password
    default_password = 'DigitalIUB123'
    hashed_password = make_password(default_password)
    
    # Update all users with the new password
    updated_count = User.objects.update(password=hashed_password)
    
    print(f"Successfully reset passwords for {updated_count} users.")
    print("All users can now log in with the password: DigitalIUB123")

if __name__ == '__main__':
    reset_all_user_passwords()