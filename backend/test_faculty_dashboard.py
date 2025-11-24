import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

import json
import uuid
from django.test import RequestFactory
from faculty.views import dashboard_overview
from faculty.auth_views import faculty_login
from users.models import User, Faculty
from permissions.models import Permission, UserPermission

# Create a request factory
factory = RequestFactory()

# Test faculty login first
login_request = factory.post('/api/v1/faculty/auth/login/', 
                            data=json.dumps({'identifier': 'testfaculty', 'password': 'testpass123'}),
                            content_type='application/json')

login_response = faculty_login(login_request)
print("Login response status:", login_response.status_code)
print("Login response content:", login_response.content.decode())

# Parse the token from login response
login_data = json.loads(login_response.content.decode())
token = login_data.get('token')
print("Token:", token)

if token:
    # Test dashboard overview
    dashboard_request = factory.get('/api/v1/faculty/dashboard/overview/')
    dashboard_request.META['HTTP_AUTHORIZATION'] = f'Bearer {token}'
    
    # Attach user and faculty to request (simulate middleware)
    user = User.objects.get(username='testfaculty')
    faculty = Faculty.objects.get(user=user)
    dashboard_request.user = user
    dashboard_request.faculty = faculty
    
    # Grant the required permission to the user
    # The dashboard_overview view requires 'course_view' permission
    # Get the existing permission
    try:
        permission = Permission.objects.get(codename='course_view')
    except Permission.DoesNotExist:
        permission = Permission.objects.create(
            id=str(uuid.uuid4()),
            name='View Courses',
            codename='course_view',
            category='course'
        )
    
    # Grant permission to user
    try:
        user_permission = UserPermission.objects.get(user=user, permission=permission)
    except UserPermission.DoesNotExist:
        user_permission = UserPermission.objects.create(
            id=str(uuid.uuid4()),
            user=user,
            permission=permission,
            scope={'department': faculty.department}
        )
    
    dashboard_response = dashboard_overview(dashboard_request)
    print("\nDashboard response status:", dashboard_response.status_code)
    print("Dashboard response content:", dashboard_response.content.decode())
else:
    print("Failed to get token")