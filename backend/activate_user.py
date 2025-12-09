"""
Script to activate a user account by setting status to 'active'
Usage: python activate_user.py
"""

import os
import sys
import django

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'App.settings')
django.setup()

from users.models import User

def activate_user(identifier):
    """
    Activate a user account by email or username
    
    Args:
        identifier: Email or username of the user
    """
    try:
        # Try to find user by email or username
        user = None
        
        if '@' in identifier:
            try:
                user = User.objects.get(email=identifier)
            except User.DoesNotExist:
                pass
        
        if not user:
            try:
                user = User.objects.get(username=identifier)
            except User.DoesNotExist:
                pass
        
        if not user:
            print(f"❌ User not found: {identifier}")
            return False
        
        # Display current user status
        print(f"\n📋 User Information:")
        print(f"   Username: {user.username}")
        print(f"   Email: {user.email}")
        print(f"   Name: {user.get_full_name()}")
        print(f"   Role: {user.role}")
        print(f"   Current Status: {user.status}")
        print(f"   Django is_active: {user.is_active}")
        
        # Activate the user
        if user.status != 'active':
            user.status = 'active'
            user.save()
            print(f"\n✅ User account activated successfully!")
            print(f"   New Status: {user.status}")
        else:
            print(f"\n✅ User account is already active!")
        
        # Also ensure Django's is_active flag is True
        if not user.is_active:
            user.is_active = True
            user.save()
            print(f"   Django is_active flag set to True")
        
        return True
        
    except Exception as e:
        print(f"❌ Error activating user: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def list_all_users():
    """List all users in the system"""
    print("\n📋 All Users in System:")
    print("-" * 80)
    users = User.objects.all()
    
    if not users:
        print("No users found in the database.")
        return
    
    for user in users:
        status_icon = "✅" if user.status == 'active' else "❌"
        print(f"{status_icon} {user.username:20} | {user.email:30} | {user.role:10} | Status: {user.status}")
    print("-" * 80)

if __name__ == "__main__":
    print("=" * 80)
    print("🔧 User Account Activation Tool")
    print("=" * 80)
    
    # First, list all users
    list_all_users()
    
    # Ask for user identifier
    print("\n" + "=" * 80)
    identifier = input("\n👤 Enter email or username to activate (or 'all' to activate all users): ").strip()
    
    if identifier.lower() == 'all':
        # Activate all users
        users = User.objects.all()
        activated_count = 0
        
        for user in users:
            if user.status != 'active':
                user.status = 'active'
                user.is_active = True
                user.save()
                activated_count += 1
                print(f"✅ Activated: {user.username} ({user.email})")
        
        print(f"\n✅ Activated {activated_count} user(s)")
    else:
        # Activate specific user
        activate_user(identifier)
    
    print("\n" + "=" * 80)
    print("✅ Done!")
    print("=" * 80)
