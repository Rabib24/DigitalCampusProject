#!/usr/bin/env python
"""
Test script to verify faculty dashboard components can fetch data
"""
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

import json
import uuid
from django.test import RequestFactory
from faculty.views import dashboard_overview, courses_list, gradebook
from faculty.auth_views import faculty_login
from users.models import User, Faculty
from courses.models import Course

def test_faculty_component(view_func, url, component_name, course_id=None):
    """
    Test a faculty component
    """
    print(f"\n=== Testing {component_name} ===")
    
    # Create a request factory
    factory = RequestFactory()
    
    # Test faculty login first
    login_request = factory.post('/api/v1/faculty/auth/login/', 
                                data=json.dumps({'identifier': 'testfaculty', 'password': 'testpass123'}),
                                content_type='application/json')

    login_response = faculty_login(login_request)
    
    if login_response.status_code != 200:
        print(f"Login failed with status {login_response.status_code}")
        return
    
    # Parse the token from login response
    login_data = json.loads(login_response.content.decode())
    token = login_data.get('token')
    
    if not token:
        print("Failed to get token")
        return
    
    # Create request for the component
    if course_id:
        component_request = factory.get(url)
    else:
        component_request = factory.get(url)
        
    component_request.META['HTTP_AUTHORIZATION'] = f'Bearer {token}'
    
    # Attach user and faculty to request (simulate middleware)
    user = User.objects.get(username='testfaculty')
    faculty = Faculty.objects.get(user=user)
    component_request.user = user
    component_request.faculty = faculty
    
    # Call the view function
    if course_id:
        component_response = view_func(component_request, course_id)
    else:
        component_response = view_func(component_request)
    
    print(f"Response status: {component_response.status_code}")
    print(f"Response content: {component_response.content.decode()}")
    
    if component_response.status_code == 200:
        print(f"✓ {component_name} is working correctly")
    else:
        print(f"✗ {component_name} failed")

def main():
    """
    Test all faculty dashboard components
    """
    print("=== Testing Faculty Dashboard Components ===")
    
    # Get a course ID for testing
    user = User.objects.get(username='testfaculty')
    faculty = Faculty.objects.get(user=user)
    courses = Course.objects.filter(instructor_id=faculty.employee_id)
    
    if not courses.exists():
        print("No courses found for faculty. Please run setup_faculty_dashboard_test.py first.")
        return
    
    course_id = courses.first().id
    print(f"Using course ID: {course_id}")
    
    # Test each component
    test_faculty_component(dashboard_overview, '/api/v1/faculty/dashboard/overview/', 'Dashboard Overview')
    test_faculty_component(courses_list, '/api/v1/faculty/courses/', 'Courses List')
    test_faculty_component(gradebook, '/api/v1/faculty/courses/{}/gradebook/'.format(course_id), 'Gradebook', course_id)

if __name__ == "__main__":
    main()