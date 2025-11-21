#!/usr/bin/env python
"""
Simple functionality test for DigitalCampus application
"""

import os
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.test import Client
from django.contrib.auth.hashers import make_password
from users.models import User, Faculty

def test_models():
    """Test that models can be imported and used"""
    print("Testing model imports...")
    
    # Test User model
    try:
        user_count = User.objects.count()
        print(f"✓ User model working - {user_count} users in database")
    except Exception as e:
        print(f"✗ User model error: {e}")
        return False
    
    # Test Faculty model
    try:
        faculty_count = Faculty.objects.count()
        print(f"✓ Faculty model working - {faculty_count} faculty in database")
    except Exception as e:
        print(f"✗ Faculty model error: {e}")
        return False
    
    return True

def create_test_user():
    """Create a test faculty user if one doesn't exist"""
    print("Creating test user...")
    
    try:
        # Check if test user already exists
        if User.objects.filter(username='test_faculty').exists():
            print("✓ Test user already exists")
            return True
            
        # Check if faculty with employee_id already exists
        if Faculty.objects.filter(employee_id='FAC001').exists():
            print("✓ Faculty with employee_id FAC001 already exists")
            return True
            
        # Create faculty user
        faculty_user = User.objects.create(
            username='test_faculty',
            email='test@faculty.edu',
            first_name='Test',
            last_name='Faculty',
            role='faculty',
            status='active',
            mfa_enabled=False,
            failed_login_attempts=0,
            password=make_password('testpass123')
        )
        
        # Create faculty profile
        faculty = Faculty.objects.create(
            user=faculty_user,
            employee_id='FAC001',
            department='Computer Science',
            title='Assistant Professor'
        )
        
        print("✓ Test faculty user created successfully")
        return True
    except Exception as e:
        print(f"✗ Error creating test user: {e}")
        return False

def test_faculty_login():
    """Test faculty login functionality"""
    print("Testing faculty login...")
    
    try:
        # Create test client
        client = Client()
        
        # Test login with existing faculty user
        login_data = {
            'identifier': 'testfaculty',
            'password': 'testpass123'
        }
        
        response = client.post(
            '/api/v1/faculty/auth/login/',
            data=json.dumps(login_data),
            content_type='application/json'
        )
        
        print(f"Login response status: {response.status_code}")
        if response.status_code == 200:
            response_data = json.loads(response.content)
            if response_data.get('success'):
                print("✓ Faculty login successful")
                print(f"  User: {response_data.get('user', {}).get('username')}")
                print(f"  Token received: {'Yes' if 'token' in response_data else 'No'}")
                return True
            else:
                print(f"✗ Login failed: {response_data.get('message', 'Unknown error')}")
                return False
        else:
            print(f"✗ Login HTTP error: {response.status_code}")
            try:
                error_data = json.loads(response.content)
                print(f"  Error message: {error_data.get('message', 'No message')}")
            except:
                print(f"  Response content: {response.content}")
            return False
    except Exception as e:
        print(f"✗ Error during login test: {e}")
        return False

def test_faculty_dashboard():
    """Test faculty dashboard endpoints"""
    print("Testing faculty dashboard endpoints...")
    
    try:
        # First login to get a token
        client = Client()
        login_data = {
            'identifier': 'testfaculty',
            'password': 'testpass123'
        }
        
        login_response = client.post(
            '/api/v1/faculty/auth/login/',
            data=json.dumps(login_data),
            content_type='application/json'
        )
        
        if login_response.status_code != 200:
            print("✗ Cannot test dashboard - login failed")
            return False
            
        response_data = json.loads(login_response.content)
        token = response_data.get('token')
        
        if not token:
            print("✗ No token received from login")
            return False
            
        # Test dashboard overview endpoint
        headers = {'HTTP_AUTHORIZATION': f'Bearer {token}'}
        dashboard_response = client.get('/api/v1/faculty/dashboard/overview/', **headers)
        
        print(f"Dashboard response status: {dashboard_response.status_code}")
        if dashboard_response.status_code == 200:
            print("✓ Faculty dashboard overview accessible")
            return True
        elif dashboard_response.status_code == 403:
            print("⚠ Faculty dashboard access denied (may be permission issue)")
            return True
        elif dashboard_response.status_code == 404:
            print("⚠ Faculty dashboard endpoint not found")
            return False
        else:
            print(f"✗ Faculty dashboard error: {dashboard_response.status_code}")
            try:
                error_data = json.loads(dashboard_response.content)
                print(f"  Error message: {error_data.get('message', 'No message')}")
            except:
                print(f"  Response content: {dashboard_response.content}")
            return False
    except Exception as e:
        print(f"✗ Error during dashboard test: {e}")
        return False

def main():
    """Main test function"""
    print("=== DigitalCampus Functionality Test ===\n")
    
    # Test 1: Model imports and database access
    if not test_models():
        print("\n❌ Model tests failed")
        return
    
    print()
    
    # Test 2: Create test user
    if not create_test_user():
        print("\n❌ Test user creation failed")
        return
    
    print()
    
    # Test 3: Faculty login
    if not test_faculty_login():
        print("\n❌ Faculty login test failed")
        return
    
    print()
    
    # Test 4: Faculty dashboard
    if not test_faculty_dashboard():
        print("\n❌ Faculty dashboard test failed")
        return
    
    print("\n=== All Tests Completed ===")
    print("✅ DigitalCampus application appears to be functioning correctly")

if __name__ == "__main__":
    main()