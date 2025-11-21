import os
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.test import RequestFactory
from faculty.auth_views import faculty_login

# Create a request factory
factory = RequestFactory()

# Create a mock request
request = factory.post('/api/v1/faculty/auth/login/', 
                      data=json.dumps({
                          'identifier': '2221002',
                          'password': 'DigitalCampus123'
                      }),
                      content_type='application/json')

# Add META data to simulate a real request
request.META['REMOTE_ADDR'] = '127.0.0.1'

print("Testing faculty login function directly...")

try:
    # Call the faculty_login function directly
    response = faculty_login(request)
    print(f"Response status code: {response.status_code}")
    print(f"Response content: {response.content.decode()}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()