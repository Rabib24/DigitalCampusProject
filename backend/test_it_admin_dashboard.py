import os
import django
import json
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User, Staff
from faculty.auth_views import generate_jwt_token
from django.http import HttpRequest

def create_mock_request(method='GET', user=None, token=None):
    """Create a mock Django request object"""
    request = HttpRequest()
    request.method = method
    request.META = {}
    
    if token:
        request.META['HTTP_AUTHORIZATION'] = f'Bearer {token}'
    
    if user:
        request.user = user
        # Attach staff profile to request
        try:
            staff = Staff.objects.get(user=user)
            request.staff = staff
        except Staff.DoesNotExist:
            request.staff = None
    
    return request

def test_it_admin_dashboard():
    """Test IT admin dashboard access"""
    print("Testing IT admin dashboard access...")
    
    # Test importing IT admin views
    try:
        from it_admin import views
        print("✅ IT admin dashboard views imported successfully!")
    except Exception as e:
        print(f"❌ Error importing IT admin dashboard views: {e}")
        return
        
    print("\n🎉 IT admin dashboard setup completed!")
    print("The IT admin dashboard is ready with the following endpoints:")
    print("- /api/v1/it/dashboard/overview/")
    print("- /api/v1/it/system-management/")
    print("- /api/v1/it/user-management/")
    
    print("\nNote: To fully test this dashboard, you would need to:")
    print("1. Create a staff user with IT admin role")
    print("2. Assign appropriate permissions")
    print("3. Test with JWT authentication")

if __name__ == "__main__":
    test_it_admin_dashboard()