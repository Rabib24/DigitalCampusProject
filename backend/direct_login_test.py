#!/usr/bin/env python
"""
Direct test of faculty login functionality
"""

import os
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.http import HttpRequest
from faculty.auth_views import faculty_login

def test_faculty_login_directly():
    """Test faculty login function directly"""
    print("Testing faculty login function directly...")
    
    # Create a mock request
    request = HttpRequest()
    request.method = 'POST'
    request.body = json.dumps({
        'identifier': 'testfaculty',
        'password': 'testpass123'
    }).encode('utf-8')
    request.META = {
        'CONTENT_TYPE': 'application/json'
    }
    
    try:
        # Call the faculty login function directly
        response = faculty_login(request)
        
        print(f"Response status: {response.status_code}")
        print(f"Response content: {response.content.decode()}")
        
        if response.status_code == 200:
            response_data = json.loads(response.content)
            if response_data.get('success'):
                print("✓ Faculty login successful")
                print(f"  User: {response_data.get('user', {}).get('username')}")
                print(f"  Token: {response_data.get('token', 'No token')[:20]}...")
                return True
            else:
                print(f"✗ Login failed: {response_data.get('message')}")
                return False
        else:
            print(f"✗ HTTP error: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"✗ Error during login test: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main test function"""
    print("=== Direct Faculty Login Test ===\n")
    
    if test_faculty_login_directly():
        print("\n✅ Faculty login function is working correctly")
    else:
        print("\n❌ Faculty login function has issues")

if __name__ == "__main__":
    main()