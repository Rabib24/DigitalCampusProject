import os
import django

os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings'
django.setup()

from users.models import User
import json

print("=" * 80)
print("🔍 User Data Verification Tool")
print("=" * 80)

# Get all student users
students = User.objects.filter(role='student')

print(f"\nFound {students.count()} student(s) in the database\n")

for user in students:
    print(f"{'='*80}")
    print(f"Username: {user.username}")
    print(f"Email: {user.email}")
    print(f"First Name: '{user.first_name}' (length: {len(user.first_name)})")
    print(f"Last Name: '{user.last_name}' (length: {len(user.last_name)})")
    print(f"Role: {user.role}")
    print(f"Status: {user.status}")
    print(f"Is Active: {user.is_active}")
    
    # Show what the login API would return
    user_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'role': user.role,
        'status': user.status
    }
    
    print(f"\n📤 Login API Response for this user:")
    print(json.dumps(user_data, indent=2))
    
    # Check if first_name is empty or same as username
    if not user.first_name:
        print(f"\n⚠️  WARNING: first_name is EMPTY!")
    elif user.first_name == user.username:
        print(f"\n⚠️  WARNING: first_name is same as username!")
    else:
        print(f"\n✅ first_name looks correct")
    
    print()

print("=" * 80)
print("✅ Verification Complete")
print("=" * 80)
