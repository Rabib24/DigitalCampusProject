"""
Test Faculty Dashboard Endpoints
Tests all faculty dashboard pages to ensure they are fetching data from the database correctly.
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
from django.contrib.auth.models import AnonymousUser
from users.models import User, Faculty
from courses.models import Course
from assignments.models import Assignment, Grade
from faculty import views


def test_faculty_dashboard_endpoints():
    """Test all faculty dashboard endpoints"""
    
    print("\n=== Testing Faculty Dashboard Endpoints ===\n")
    
    # Create a request factory
    factory = RequestFactory()
    
    # Get a faculty user
    try:
        faculty_user = User.objects.filter(role='faculty').first()
        if not faculty_user:
            print("❌ No faculty users found in database")
            return
        
        faculty = Faculty.objects.get(user=faculty_user)
        print(f"✓ Using faculty: {faculty_user.first_name} {faculty_user.last_name} (ID: {faculty.employee_id})")
        
    except Exception as e:
        print(f"❌ Error getting faculty user: {e}")
        return
    
    # Test 1: Courses Endpoint
    print("\n--- Test 1: Courses Endpoint ---")
    try:
        request = factory.get('/api/v1/faculty/courses/')
        request.user = faculty_user
        request.faculty = faculty
        
        response = views.courses_list(request)
        if response.status_code == 200:
            import json
            data = json.loads(response.content)
            courses = data.get('courses', [])
            print(f"✓ Courses endpoint working: Found {len(courses)} courses")
            if courses:
                print(f"  Sample course: {courses[0].get('name', 'N/A')} ({courses[0].get('code', 'N/A')})")
        else:
            print(f"❌ Courses endpoint failed with status {response.status_code}")
    except Exception as e:
        print(f"❌ Courses endpoint error: {e}")
    
    # Test 2: Assignments Endpoint
    print("\n--- Test 2: Assignments Endpoint ---")
    try:
        request = factory.get('/api/v1/faculty/assignments/')
        request.user = faculty_user
        request.faculty = faculty
        
        response = views.assignments_list(request)
        if response.status_code == 200:
            import json
            data = json.loads(response.content)
            assignments = data.get('assignments', [])
            print(f"✓ Assignments endpoint working: Found {len(assignments)} assignments")
            if assignments:
                print(f"  Sample assignment: {assignments[0].get('title', 'N/A')}")
        else:
            print(f"❌ Assignments endpoint failed with status {response.status_code}")
    except Exception as e:
        print(f"❌ Assignments endpoint error: {e}")
    
    # Test 3: Gradebook Endpoint
    print("\n--- Test 3: Gradebook Endpoint ---")
    try:
        # Get first course for this faculty
        courses = Course.objects.filter(instructor_id=faculty.employee_id)
        if courses.exists():
            course = courses.first()
            print(f"  Testing with course: {course.name} ({course.id})")
            
            request = factory.get(f'/api/v1/faculty/courses/{course.id}/gradebook/')
            request.user = faculty_user
            request.faculty = faculty
            
            response = views.gradebook(request, course.id)
            if response.status_code == 200:
                import json
                data = json.loads(response.content)
                students = data.get('students', [])
                assignments = data.get('assignments', [])
                print(f"✓ Gradebook endpoint working: Found {len(students)} students, {len(assignments)} assignments")
                if students:
                    print(f"  Sample student: {students[0].get('studentName', 'N/A')} - Grade: {students[0].get('letterGrade', 'N/A')}")
            else:
                print(f"❌ Gradebook endpoint failed with status {response.status_code}")
        else:
            print("⚠ No courses found for this faculty to test gradebook")
    except Exception as e:
        print(f"❌ Gradebook endpoint error: {e}")
        import traceback
        traceback.print_exc()
    
    # Test 4: Research Projects Endpoint
    print("\n--- Test 4: Research Projects Endpoint ---")
    try:
        request = factory.get('/api/v1/faculty/research/projects/')
        request.user = faculty_user
        request.faculty = faculty
        
        response = views.research_projects(request)
        if response.status_code == 200:
            import json
            data = json.loads(response.content)
            projects = data.get('projects', [])
            print(f"✓ Research projects endpoint working: Found {len(projects)} projects")
            if projects:
                print(f"  Sample project: {projects[0].get('title', 'N/A')}")
        else:
            print(f"❌ Research projects endpoint failed with status {response.status_code}")
    except Exception as e:
        print(f"❌ Research projects endpoint error: {e}")
    
    # Test 5: Analytics Endpoint
    print("\n--- Test 5: Analytics Endpoint ---")
    try:
        request = factory.get('/api/v1/faculty/analytics/')
        request.user = faculty_user
        request.faculty = faculty
        
        response = views.analytics(request)
        if response.status_code == 200:
            import json
            data = json.loads(response.content)
            print(f"✓ Analytics endpoint working")
            print(f"  Stats: {data.get('stats', {})}")
        else:
            print(f"❌ Analytics endpoint failed with status {response.status_code}")
    except Exception as e:
        print(f"❌ Analytics endpoint error: {e}")
    
    # Test 6: Dashboard Overview Endpoint
    print("\n--- Test 6: Dashboard Overview Endpoint ---")
    try:
        request = factory.get('/api/v1/faculty/dashboard/overview/')
        request.user = faculty_user
        request.faculty = faculty
        
        response = views.dashboard_overview(request)
        if response.status_code == 200:
            import json
            data = json.loads(response.content)
            print(f"✓ Dashboard overview endpoint working")
            print(f"  Total courses: {data.get('total_courses', 0)}")
            print(f"  Total assignments: {data.get('total_assignments', 0)}")
            print(f"  Total students: {data.get('total_students', 0)}")
        else:
            print(f"❌ Dashboard overview endpoint failed with status {response.status_code}")
    except Exception as e:
        print(f"❌ Dashboard overview endpoint error: {e}")
    
    print("\n=== Test Complete ===\n")


if __name__ == '__main__':
    test_faculty_dashboard_endpoints()
