"""
Diagnose faculty authentication and decorator issues
"""

import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(__file__))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.test import RequestFactory
from users.models import User, Faculty
from faculty import views
from faculty.middleware import FacultyRoleMiddleware
import jwt
from django.conf import settings
from datetime import datetime, timedelta
from django.utils import timezone

def test_faculty_authentication():
    """Test faculty authentication flow"""
    
    print("\n=== Testing Faculty Authentication Flow ===\n")
    
    # Get a faculty user
    try:
        faculty_user = User.objects.filter(role='faculty').first()
        if not faculty_user:
            print("❌ No faculty users found in database")
            return
        
        faculty = Faculty.objects.get(user=faculty_user)
        print(f"✓ Using faculty: {faculty_user.first_name} {faculty_user.last_name}")
        print(f"  Username: {faculty_user.username}")
        print(f"  Role: {faculty_user.role}")
        print(f"  Employee ID: {faculty.employee_id}")
        
    except Exception as e:
        print(f"❌ Error getting faculty user: {e}")
        return
    
    # Generate a JWT token
    now = timezone.now()
    exp = now + timedelta(hours=24)
    payload = {
        'user_id': faculty_user.id,
        'username': faculty_user.username,
        'role': faculty_user.role,
        'exp': exp.timestamp(),
        'iat': now.timestamp()
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    print(f"\n✓ Generated JWT token: {token[:50]}...")
    
    # Create a request with the token
    factory = RequestFactory()
    request = factory.get('/api/v1/faculty/courses/', HTTP_AUTHORIZATION=f'Bearer {token}')
    
    print("\n--- Testing Middleware ---")
    middleware = FacultyRoleMiddleware(lambda r: None)
    result = middleware.process_request(request)
    
    if result is None:
        print("✓ Middleware passed - user and faculty should be attached")
        print(f"  hasattr(request, 'user'): {hasattr(request, 'user')}")
        print(f"  hasattr(request, 'faculty'): {hasattr(request, 'faculty')}")
        
        if hasattr(request, 'user'):
            print(f"  request.user: {request.user}")
            print(f"  request.user.username: {request.user.username}")
            print(f"  request.user.role: {request.user.role}")
            print(f"  hasattr(request.user, 'role'): {hasattr(request.user, 'role')}")
            
        if hasattr(request, 'faculty'):
            print(f"  request.faculty: {request.faculty}")
            print(f"  request.faculty.employee_id: {request.faculty.employee_id}")
    else:
        print(f"❌ Middleware returned error: Status {result.status_code}")
        import json
        print(f"   Response: {json.loads(result.content)}")
        return
    
    print("\n--- Testing Faculty Required Decorator ---")
    from faculty.decorators import faculty_required
    
    @faculty_required
    def test_view(request):
        from django.http import JsonResponse
        return JsonResponse({'success': True, 'message': 'Authorized!'})
    
    response = test_view(request)
    print(f"Response status: {response.status_code}")
    
    if response.status_code == 200:
        print("✓ Faculty required decorator passed!")
    else:
        import json
        data = json.loads(response.content)
        print(f"❌ Faculty required decorator failed: {data}")
    
    print("\n--- Testing Courses Endpoint ---")
    response = views.courses_list(request)
    print(f"Courses endpoint status: {response.status_code}")
    
    if response.status_code == 200:
        import json
        data = json.loads(response.content)
        courses = data.get('courses', [])
        print(f"✓ Courses endpoint working: Found {len(courses)} courses")
    else:
        import json
        data = json.loads(response.content)
        print(f"❌ Courses endpoint failed: {data}")
    
    print("\n=== Test Complete ===\n")


if __name__ == '__main__':
    test_faculty_authentication()
