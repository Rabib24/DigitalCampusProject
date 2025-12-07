import os
import django
import sys
from django.test import RequestFactory
from django.http import JsonResponse

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from faculty.models import Faculty
from faculty.views import dashboard_overview
from faculty.middleware import FacultyRoleMiddleware

def test_faculty_dashboard():
    """Test faculty dashboard data fetching"""
    try:
        # Get the faculty user
        user = User.objects.get(username='2221002')
        print(f"Found faculty user: {user.username}")
        
        # Get faculty profile
        faculty = Faculty.objects.get(user=user)
        print(f"Faculty profile: {faculty.employee_id}, Department: {faculty.department}")
        
        # Create a mock request
        factory = RequestFactory()
        request = factory.get('/api/v1/faculty/dashboard/')
        
        # Attach user and faculty to request (simulating middleware)
        request.user = user
        request.faculty = faculty
        
        # Call the dashboard overview function
        response = dashboard_overview(request)
        
        if isinstance(response, JsonResponse):
            print("Dashboard response received:")
            print(f"Status code: {response.status_code}")
            
            # Get the response data
            import json
            response_data = json.loads(response.content)
            print(f"Response data: {response_data}")
            
            if response.status_code == 200:
                print("✓ Faculty dashboard data fetched successfully!")
                print(f"Active classes: {response_data.get('activeClasses', 'N/A')}")
                print(f"Total students: {response_data.get('totalStudents', 'N/A')}")
                print(f"Pending grades: {response_data.get('pendingGrades', 'N/A')}")
                print(f"Advised students: {response_data.get('advisedStudents', 'N/A')}")
                print(f"Attendance rate: {response_data.get('attendanceRate', 'N/A')}%")
            else:
                print("✗ Failed to fetch faculty dashboard data")
                print(f"Error message: {response_data.get('message', 'Unknown error')}")
        else:
            print("Unexpected response type")
            
    except User.DoesNotExist:
        print("Faculty user 2221002 not found")
    except Faculty.DoesNotExist:
        print("Faculty profile not found")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("Testing faculty dashboard data fetching...")
    test_faculty_dashboard()