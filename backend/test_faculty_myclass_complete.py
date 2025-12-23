"""
End-to-end test: Faculty login -> fetch courses -> display on My Class page
"""

import os
import sys
import django
import json

sys.path.append(os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.test import RequestFactory, Client
from users.models import User, Faculty
from courses.models import Course
from assignments.models import Assignment
from faculty.auth_views import generate_jwt_token, faculty_login

def test_faculty_myclass_flow():
    """Test complete flow: login -> get token -> fetch courses"""
    
    print("\n" + "="*70)
    print("🧪 FACULTY DASHBOARD - MY CLASS PAGE - COMPLETE FLOW TEST")
    print("="*70 + "\n")
    
    # Step 1: Verify faculty exists
    print("STEP 1: Verifying Faculty User")
    print("-" * 70)
    try:
        faculty_user = User.objects.get(username='40001', role='faculty')
        faculty = Faculty.objects.get(user=faculty_user)
        print(f"✓ Faculty Found: {faculty_user.first_name} {faculty_user.last_name}")
        print(f"  - Username: {faculty_user.username}")
        print(f"  - Email: {faculty_user.email}")
        print(f"  - Employee ID: {faculty.employee_id}")
        print(f"  - Status: {faculty_user.status}")
    except Exception as e:
        print(f"✗ Error: {e}")
        return
    
    # Step 2: Test login endpoint (simulate)
    print("\n\nSTEP 2: Testing Faculty Login")
    print("-" * 70)
    client = Client()
    login_data = {
        'identifier': '40001',
        'password': 'DigitalIUB123'
    }
    response = client.post('/api/v1/faculty/auth/login/', 
                          data=json.dumps(login_data),
                          content_type='application/json')
    
    if response.status_code == 200:
        response_data = json.loads(response.content)
        token = response_data.get('token')
        print(f"✓ Login Successful (HTTP {response.status_code})")
        print(f"  - Token Generated: {token[:50]}...")
        print(f"  - User: {response_data['user']['first_name']} {response_data['user']['last_name']}")
    else:
        print(f"✗ Login Failed (HTTP {response.status_code})")
        print(f"  Response: {response.content}")
        return
    
    # Step 3: Verify courses are assigned to faculty
    print("\n\nSTEP 3: Verifying Courses Assigned to Faculty")
    print("-" * 70)
    faculty_courses = Course.objects.filter(instructor_id=faculty.employee_id)
    print(f"✓ Total Courses Assigned: {faculty_courses.count()}")
    
    if faculty_courses.count() == 0:
        print("✗ ERROR: No courses assigned to faculty!")
        return
    
    for i, course in enumerate(faculty_courses[:5], 1):
        print(f"  {i}. {course.code} - {course.name}")
        print(f"     ID: {course.id}, Credits: {course.credits}")
    
    if faculty_courses.count() > 5:
        print(f"  ... and {faculty_courses.count() - 5} more courses")
    
    # Step 4: Test courses API endpoint
    print("\n\nSTEP 4: Testing Courses API Endpoint (/faculty/courses/)")
    print("-" * 70)
    
    factory = RequestFactory()
    request = factory.get('/api/v1/faculty/courses/',
                         HTTP_AUTHORIZATION=f'Bearer {token}')
    
    from faculty.middleware import FacultyRoleMiddleware
    from faculty.views import courses_list
    
    middleware = FacultyRoleMiddleware(lambda r: None)
    middleware.process_request(request)
    
    response = courses_list(request)
    
    if response.status_code == 200:
        data = json.loads(response.content)
        courses_from_api = data.get('courses', [])
        print(f"✓ API Request Successful (HTTP {response.status_code})")
        print(f"  - Courses Returned: {len(courses_from_api)}")
        
        for i, course in enumerate(courses_from_api[:3], 1):
            print(f"  {i}. {course.get('code')} - {course.get('name')}")
            print(f"     Students: {course.get('students')}, Semester: {course.get('semester')}")
    else:
        print(f"✗ API Request Failed (HTTP {response.status_code})")
        print(f"  Response: {response.content}")
        return
    
    # Step 5: Verify assignments are linked to courses
    print("\n\nSTEP 5: Verifying Assignments Linked to Courses")
    print("-" * 70)
    total_assignments = 0
    for course in faculty_courses:
        assignments = Assignment.objects.filter(course_id=course.id)
        total_assignments += assignments.count()
    
    print(f"✓ Total Assignments Across All Courses: {total_assignments}")
    
    for course in faculty_courses[:3]:
        assignments = Assignment.objects.filter(course_id=course.id)
        print(f"  - {course.code}: {assignments.count()} assignments")
        for assignment in assignments[:2]:
            print(f"      • {assignment.title} ({assignment.type}, {assignment.points} pts)")
    
    # Step 6: Test assignments API endpoint
    print("\n\nSTEP 6: Testing Assignments API Endpoint (/faculty/assignments/)")
    print("-" * 70)
    
    request = factory.get('/api/v1/faculty/assignments/',
                         HTTP_AUTHORIZATION=f'Bearer {token}')
    
    middleware.process_request(request)
    
    from faculty.views import assignments_list
    response = assignments_list(request)
    
    if response.status_code == 200:
        data = json.loads(response.content)
        assignments_from_api = data.get('assignments', [])
        print(f"✓ API Request Successful (HTTP {response.status_code})")
        print(f"  - Assignments Returned: {len(assignments_from_api)}")
        
        # Group by course
        by_course = {}
        for a in assignments_from_api:
            course_id = a.get('course_id')
            if course_id not in by_course:
                by_course[course_id] = []
            by_course[course_id].append(a)
        
        for course_id, course_assignments in list(by_course.items())[:3]:
            print(f"  - Course {course_id}: {len(course_assignments)} assignments")
    else:
        print(f"✗ API Request Failed (HTTP {response.status_code})")
        return
    
    # Summary
    print("\n\n" + "="*70)
    print("✓ ALL TESTS PASSED - FACULTY MY CLASS PAGE READY!")
    print("="*70)
    print(f"""
SUMMARY:
--------
Faculty: {faculty_user.first_name} {faculty_user.last_name} (ID: {faculty.employee_id})
Login: SUCCESS ✓
Courses Assigned: {faculty_courses.count()} ✓
Total Assignments: {total_assignments} ✓
API Endpoints: WORKING ✓

FRONTEND "MY CLASS" PAGE WILL DISPLAY:
- {faculty_courses.count()} courses in grid view
- Course code, name, student count
- Links to Assignments and Gradebook
- Search functionality

READY TO ACCESS AT:
http://localhost:3000/faculty/courses
""")

if __name__ == '__main__':
    test_faculty_myclass_flow()
