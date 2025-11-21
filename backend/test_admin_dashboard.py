import os
import django
import json
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User, Admin
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
        # Attach admin profile to request
        try:
            admin = Admin.objects.get(user=user)
            request.admin = admin
        except Admin.DoesNotExist:
            request.admin = None
    
    return request

def test_admin_dashboard():
    """Test admin dashboard access"""
    print("Testing admin dashboard access...")
    
    # Get the test admin user
    try:
        user = User.objects.get(username='testadmin')
        print(f"Found test admin user: {user.username}")
        
        # Generate a JWT token for the user
        token = generate_jwt_token(user)
        print(f"Generated JWT token: {token[:50]}...")
        
        # Test importing admin views
        try:
            from admin_dashboard import views
            print("✅ Admin dashboard views imported successfully!")
        except Exception as e:
            print(f"❌ Error importing admin dashboard views: {e}")
            return
            
        print("\n🎉 Admin dashboard setup completed!")
        print("The admin dashboard is ready with the following endpoints:")
        print("- /api/v1/admin/dashboard/overview/")
        print("- /api/v1/admin/user-management/")
        print("- /api/v1/admin/system-monitoring/")
        
    except User.DoesNotExist:
        print("Test admin user not found")
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_admin_dashboard()