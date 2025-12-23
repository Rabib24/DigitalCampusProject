"""
Test faculty endpoints to verify courses and assignments are properly linked
"""

import os
import sys
import django
import json

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(__file__))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.test import RequestFactory
from faculty.auth_views import generate_jwt_token
from users.models import User, Faculty
from courses.models import Course
from assignments.models import Assignment
import jwt
from django.conf import settings

def test_faculty_endpoints():
    """Test faculty endpoints"""
    
    print("\n=== Testing Faculty Endpoints ===\n")
    
    # Get faculty user
    faculty_user = User.objects.get(username='40001', role='faculty')
    faculty = Faculty.objects.get(user=faculty_user)
    
    # Generate JWT token
    token = generate_jwt_token(faculty_user)
    print(f"✓ Generated JWT token for faculty: {faculty_user.username}")
    print(f"  Token (first 50 chars): {token[:50]}...\n")
    
    # Create request factory
    factory = RequestFactory()
    
    # Test 1: Get courses
    print("=== Test 1: Fetching Courses ===")
    request = factory.get(
        '/api/v1/faculty/courses/',
        HTTP_AUTHORIZATION=f'Bearer {token}'
    )
    
    from faculty.views import courses_list
    from faculty.middleware import FacultyRoleMiddleware
    
    # Apply middleware
    middleware = FacultyRoleMiddleware(lambda r: None)
    middleware.process_request(request)
    
    # Call view
    response = courses_list(request)
    
    if response.status_code == 200:
        data = json.loads(response.content)
        courses = data.get('courses', [])
        print(f"✓ Successfully fetched {len(courses)} courses")
        
        # Show first 3 courses
        for i, course in enumerate(courses[:3]):
            print(f"  {i+1}. {course.get('code')} - {course.get('name')}")
            print(f"     ID: {course.get('id')}")
    else:
        print(f"✗ Failed to fetch courses: {response.status_code}")
        print(f"  Response: {response.content}")
    
    # Test 2: Get assignments
    print("\n=== Test 2: Fetching Assignments ===")
    request = factory.get(
        '/api/v1/faculty/assignments/',
        HTTP_AUTHORIZATION=f'Bearer {token}'
    )
    
    # Apply middleware
    middleware.process_request(request)
    
    # Call view
    from faculty.views import assignments_list
    response = assignments_list(request)
    
    if response.status_code == 200:
        data = json.loads(response.content)
        assignments = data.get('assignments', [])
        print(f"✓ Successfully fetched {len(assignments)} assignments")
        
        # Show assignments by course
        courses_dict = {}
        for assignment in assignments:
            course_id = assignment.get('course_id')
            if course_id not in courses_dict:
                courses_dict[course_id] = []
            courses_dict[course_id].append(assignment)
        
        for course_id, course_assignments in list(courses_dict.items())[:3]:
            print(f"  Course {course_id}: {len(course_assignments)} assignments")
            for assignment in course_assignments[:2]:
                print(f"    - {assignment.get('title')} ({assignment.get('type')})")
    else:
        print(f"✗ Failed to fetch assignments: {response.status_code}")
        print(f"  Response: {response.content}")
    
    # Test 3: Verify database counts
    print("\n=== Test 3: Database Verification ===")
    faculty_courses = Course.objects.filter(instructor_id=faculty.employee_id)
    print(f"✓ Courses assigned to faculty {faculty.employee_id}: {faculty_courses.count()}")
    
    total_assignments = 0
    for course in faculty_courses:
        assignments = Assignment.objects.filter(course_id=course.id)
        total_assignments += assignments.count()
    
    print(f"✓ Total assignments across all courses: {total_assignments}")
    
    # Show sample data
    print("\n=== Sample Data ===")
    for course in faculty_courses[:3]:
        assignments = Assignment.objects.filter(course_id=course.id)
        print(f"\nCourse: {course.code} - {course.name}")
        print(f"  Assignments: {assignments.count()}")
        for assignment in assignments[:2]:
            print(f"    - {assignment.title}")
            print(f"      Due: {assignment.due_date}")
            print(f"      Type: {assignment.type}")
            print(f"      Points: {assignment.points}")

if __name__ == '__main__':
    test_faculty_endpoints()
