"""
Quick script to activate all user accounts
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

print("=" * 80)
print("🔧 Activating All User Accounts")
print("=" * 80)

# Get all users
users = User.objects.all()

print(f"\nFound {users.count()} user(s) in the database\n")

activated_count = 0
already_active_count = 0

for user in users:
    print(f"Processing: {user.username} ({user.email})")
    print(f"  Current status: {user.status}")
    print(f"  Django is_active: {user.is_active}")
    
    needs_update = False
    
    if user.status != 'active':
        user.status = 'active'
        needs_update = True
        activated_count += 1
        print(f"  ✅ Set status to 'active'")
    else:
        already_active_count += 1
        print(f"  ✅ Already active")
    
    if not user.is_active:
        user.is_active = True
        needs_update = True
        print(f"  ✅ Set is_active to True")
    
    if needs_update:
        user.save()
        print(f"  💾 Saved changes")
    
    print()

print("=" * 80)
print(f"✅ Summary:")
print(f"   Total users: {users.count()}")
print(f"   Activated: {activated_count}")
print(f"   Already active: {already_active_count}")
print("=" * 80)
print("\n🎉 All user accounts are now active! You can login now.")
