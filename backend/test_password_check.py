"""
Test password hashing and verification for faculty users
"""

import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(__file__))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.hashers import check_password, make_password
from users.models import User, Faculty

def test_password():
    """Test password hashing for a faculty user"""
    
    print("\n=== Testing Password for Faculty User ===\n")
    
    # Get a faculty user
    try:
        # Try to get user with employee ID 40001
        faculty_user = User.objects.filter(username='40001', role='faculty').first()
        
        if not faculty_user:
            print("❌ Faculty user with username '40001' not found")
            print("\nLet me check what faculty users exist...")
            faculty_users = User.objects.filter(role='faculty')[:5]
            for user in faculty_users:
                print(f"  - Username: {user.username}, Email: {user.email}, Status: {user.status}")
            return
        
        print(f"✓ Found faculty user: {faculty_user.first_name} {faculty_user.last_name}")
        print(f"  Username: {faculty_user.username}")
        print(f"  Email: {faculty_user.email}")
        print(f"  Status: {faculty_user.status}")
        print(f"  Role: {faculty_user.role}")
        print(f"  Password hash (first 50 chars): {faculty_user.password[:50]}...")
        
        # Test password
        test_passwords = ['password123', 'Password123', 'password', 'admin123', 'DigitalIUB123']
        
        print("\n=== Testing Common Passwords ===")
        for pwd in test_passwords:
            is_valid = check_password(pwd, faculty_user.password)
            print(f"  Password '{pwd}': {'✓ VALID' if is_valid else '✗ Invalid'}")
        
        # Show what the hash should look like for 'password123'
        print("\n=== Expected Hash for 'password123' ===")
        expected_hash = make_password('password123')
        print(f"  New hash: {expected_hash[:50]}...")
        print(f"  Current hash: {faculty_user.password[:50]}...")
        
        # Check if password is even hashed
        if not faculty_user.password.startswith('pbkdf2_'):
            print("\n❌ WARNING: Password doesn't appear to be properly hashed!")
            print(f"   Password field contains: {faculty_user.password}")
            print("\n  Fixing password...")
            faculty_user.password = make_password('password123')
            faculty_user.save()
            print("  ✓ Password has been reset to 'password123' with proper hashing")
        
    except Exception as e:
        import traceback
        print(f"❌ Error: {e}")
        traceback.print_exc()

if __name__ == '__main__':
    test_password()
