import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User

def fix_user_fields():
    """Fix user fields for existing users"""
    print("Fixing user fields...")
    
    # Get all users
    users = User.objects.all()
    print(f"Found {users.count()} users")
    
    # Update each user to ensure failed_login_attempts is set
    for user in users:
        if not hasattr(user, 'failed_login_attempts') or user.failed_login_attempts is None:
            user.failed_login_attempts = 0
            user.save()
            print(f"Fixed user: {user.username}")
    
    print("User fields fixed successfully!")

if __name__ == "__main__":
    fix_user_fields()