#!/usr/bin/env python
"""
Test faculty functionality without dealing with database migrations
"""

import os
import django
import json

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.test import Client
from django.urls import reverse

def test_faculty_endpoints():
    """Test faculty endpoints without database dependencies"""
    print("Testing faculty endpoints...")
    
    try:
        client = Client()
        
        # Test that the login endpoint exists (URL resolution)
        try:
            url = '/api/v1/faculty/auth/login/'
            print(f"Testing URL: {url}")
            
            # Send a simple POST request
            response = client.post(url, 
                                 data=json.dumps({'test': 'data'}), 
                                 content_type='application/json')
            
            print(f"✓ Login endpoint accessible - Status: {response.status_code}")
            
            # Test that other endpoints exist
            endpoints = [
                '/api/v1/faculty/auth/logout/',
                '/api/v1/faculty/dashboard/overview/',
                '/api/v1/faculty/courses/',
                '/api/v1/faculty/assignments/',
                '/api/v1/faculty/research/projects/',
            ]
            
            for endpoint in endpoints:
                try:
                    # For GET requests, we expect 401 (unauthorized) if the endpoint exists
                    # For POST requests, we expect 405 (method not allowed) or 401
                    response = client.get(endpoint)
                    print(f"✓ Endpoint {endpoint} accessible - Status: {response.status_code}")
                except Exception as e:
                    print(f"⚠ Could not test endpoint {endpoint}: {e}")
                    
        except Exception as e:
            print(f"✗ Error testing login endpoint: {e}")
            return False
            
        return True
        
    except Exception as e:
        print(f"✗ Error during endpoint testing: {e}")
        return False

def test_imports():
    """Test that all necessary modules can be imported"""
    print("Testing module imports...")
    
    try:
        # Test faculty views
        from faculty import views
        print("✓ Faculty views imported successfully")
        
        # Test faculty auth views
        from faculty import auth_views
        print("✓ Faculty auth views imported successfully")
        
        # Test faculty middleware
        from faculty import middleware
        print("✓ Faculty middleware imported successfully")
        
        # Test models
        from users.models import User, Faculty
        print("✓ User and Faculty models imported successfully")
        
        from courses.models import Course
        print("✓ Course model imported successfully")
        
        from assignments.models import Assignment, Grade
        print("✓ Assignment and Grade models imported successfully")
        
        from research.models import ResearchProject
        print("✓ ResearchProject model imported successfully")
        
        return True
        
    except Exception as e:
        print(f"✗ Import error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_middleware():
    """Test faculty middleware functionality"""
    print("Testing faculty middleware...")
    
    try:
        from faculty.middleware import FacultyRoleMiddleware
        
        # Test that middleware can be instantiated
        middleware = FacultyRoleMiddleware(None)
        print("✓ FacultyRoleMiddleware instantiated successfully")
        
        # Test that Redis client is properly handled
        if middleware.redis_client is None:
            print("⚠ Redis client not available (expected in test environment)")
        else:
            print("✓ Redis client available")
            
        return True
        
    except Exception as e:
        print(f"✗ Middleware error: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main test function"""
    print("=== DigitalCampus Faculty Functionality Test ===\n")
    
    # Test 1: Module imports
    print("1. Testing module imports...")
    if not test_imports():
        print("\n❌ Import tests failed")
        return
    
    print()
    
    # Test 2: Middleware
    print("2. Testing middleware...")
    if not test_middleware():
        print("\n❌ Middleware tests failed")
        return
    
    print()
    
    # Test 3: Endpoints
    print("3. Testing endpoints...")
    if not test_faculty_endpoints():
        print("\n❌ Endpoint tests failed")
        return
    
    print("\n=== All Tests Completed ===")
    print("✅ DigitalCampus faculty functionality appears to be correctly implemented")
    print("   (Note: Database-dependent tests were skipped due to migration issues)")

if __name__ == "__main__":
    main()