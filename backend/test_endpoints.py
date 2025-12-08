import os
import sys
import django
import json
from django.test import Client
from django.conf import settings

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Create a test client
client = Client()

def test_endpoints():
    """Test the student endpoints to verify they're working"""
    
    # Test the dashboard endpoint
    print("Testing dashboard endpoint...")
    try:
        response = client.get('/student/dashboard/')
        print(f"Dashboard endpoint status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Dashboard data: {json.dumps(data, indent=2)}")
        else:
            print(f"Dashboard error: {response.content}")
    except Exception as e:
        print(f"Dashboard endpoint error: {e}")
    
    # Test the enrollment periods endpoint
    print("\nTesting enrollment periods endpoint...")
    try:
        response = client.get('/student/enrollment/periods/')
        print(f"Enrollment periods endpoint status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Enrollment periods data: {json.dumps(data, indent=2)}")
        else:
            print(f"Enrollment periods error: {response.content}")
    except Exception as e:
        print(f"Enrollment periods endpoint error: {e}")
    
    # Test the available courses endpoint
    print("\nTesting available courses endpoint...")
    try:
        response = client.get('/student/courses/available/')
        print(f"Available courses endpoint status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Available courses count: {len(data.get('courses', []))}")
        else:
            print(f"Available courses error: {response.content}")
    except Exception as e:
        print(f"Available courses endpoint error: {e}")

if __name__ == "__main__":
    test_endpoints()