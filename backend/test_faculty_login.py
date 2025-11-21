import os
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.test import RequestFactory
from faculty.auth_views import faculty_login
from users.models import User

# Create a request factory
factory = RequestFactory()

# Test the faculty login function directly
try:
    # Get a user to test with
    user = User.objects.get(username='2221002')
    print(f"Testing with user: {user.username}")
    print(f"User has failed_login_attempts: {hasattr(user, 'failed_login_attempts')}")
    print(f"Failed login attempts value: {user.failed_login_attempts}")
    
    # Create a mock request
    request = factory.post('/api/v1/faculty/auth/login/', 
                          data=json.dumps({
                              'identifier': '2221002',
                              'password': 'DigitalCampus123'
                          }),
                          content_type='application/json')
    
    # Call the faculty_login function directly
    response = faculty_login(request)
    print(f"Response status code: {response.status_code}")
    print(f"Response content: {response.content.decode()}")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()