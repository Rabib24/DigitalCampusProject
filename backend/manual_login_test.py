import os
import django
import json
from django.test import Client

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def test_faculty_login():
    """Test faculty login functionality"""
    print("Testing faculty login...")
    
    # Create a test client
    client = Client()
    
    # Test data
    url = '/api/v1/faculty/auth/login/'
    data = {
        'identifier': 'testfaculty@example.com',
        'password': 'testpass123'
    }
    
    print(f"Sending POST request to {url}")
    print(f"Data: {data}")
    
    try:
        response = client.post(
            url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        print(f"Response status code: {response.status_code}")
        print(f"Response content: {response.content.decode('utf-8')}")
        
        if response.status_code == 200:
            print("Faculty login test PASSED")
        else:
            print("Faculty login test FAILED")
            
    except Exception as e:
        print(f"Error during test: {e}")

def test_student_login():
    """Test student login functionality"""
    print("\nTesting student login...")
    
    # Create a test client
    client = Client()
    
    # Test data
    url = '/api/v1/auth/login/'
    data = {
        'identifier': 'teststudent@example.com',
        'password': 'testpass123'
    }
    
    print(f"Sending POST request to {url}")
    print(f"Data: {data}")
    
    try:
        response = client.post(
            url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        print(f"Response status code: {response.status_code}")
        print(f"Response content: {response.content.decode('utf-8')}")
        
        if response.status_code == 200:
            print("Student login test PASSED")
        else:
            print("Student login test FAILED")
            
    except Exception as e:
        print(f"Error during test: {e}")

if __name__ == "__main__":
    test_faculty_login()
    test_student_login()