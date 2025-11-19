import os
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.test import Client

# Test the login view using Django test client
def test_login_view():
    client = Client()
    
    # Test login
    response = client.post('/api/v1/auth/login/', {
        'identifier': '2221002',
        'password': 'DigitalCampus123'
    }, content_type='application/json')
    
    print(f"Response status: {response.status_code}")
    print(f"Response content: {response.content.decode()}")
    
    if response.status_code == 200:
        data = json.loads(response.content.decode())
        print(f"Success: {data.get('success')}")
        if data.get('success'):
            print(f"User role: {data['user']['role']}")
            print(f"Token: {data['token']}")

if __name__ == "__main__":
    test_login_view()