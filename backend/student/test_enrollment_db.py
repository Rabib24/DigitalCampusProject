"""
Test script for student course enrollment functionality with database interactions
This script demonstrates how to use the student course enrollment endpoints with actual database interactions
"""

import requests
import json
import uuid

# Base URL for the API
BASE_URL = "http://localhost:8000/api/v1"

def test_student_enrollment_with_db():
    """
    Test the student course enrollment functionality with database interactions
    """
    print("Testing Student Course Enrollment Functionality with Database")
    print("=" * 60)
    
    # Note: This would require a valid JWT token from authentication
    # For demonstration purposes, we'll show the expected API calls
    
    # Sample JWT token (this would be obtained through login)
    sample_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoidGVzdC11c2VyLTEyMyIsInJvbGUiOiJzdHVkZW50IiwiZXhwIjoxNzMzMTQ4ODAwfQ.sample_signature"
    
    headers = {
        "Authorization": f"Bearer {sample_token}",
        "Content-Type": "application/json"
    }
    
    # 1. Get available courses
    print("1. Getting available courses...")
    try:
        response = requests.get(f"{BASE_URL}/student/courses/available/", headers=headers)
        print(f"Response Status: {response.status_code}")
        if response.status_code == 200:
            courses = response.json()
            print(f"Available courses: {json.dumps(courses, indent=2)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")
    
    print("\n" + "-" * 40 + "\n")
    
    # 2. Search for courses
    print("2. Searching for courses...")
    try:
        response = requests.get(f"{BASE_URL}/student/courses/search/?query=Computer", headers=headers)
        print(f"Response Status: {response.status_code}")
        if response.status_code == 200:
            courses = response.json()
            print(f"Search results: {json.dumps(courses, indent=2)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")
    
    print("\n" + "-" * 40 + "\n")
    
    # 3. Enroll in a course
    print("3. Enrolling in a course...")
    course_id = "CS101"  # Example course ID
    try:
        response = requests.post(f"{BASE_URL}/student/courses/{course_id}/enroll/", headers=headers)
        print(f"Response Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Enrollment result: {json.dumps(result, indent=2)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")
    
    print("\n" + "-" * 40 + "\n")
    
    # 4. Get student enrollments
    print("4. Getting student enrollments...")
    try:
        response = requests.get(f"{BASE_URL}/student/enrollments/", headers=headers)
        print(f"Response Status: {response.status_code}")
        if response.status_code == 200:
            enrollments = response.json()
            print(f"Student enrollments: {json.dumps(enrollments, indent=2)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")
    
    print("\n" + "-" * 40 + "\n")
    
    # 5. Drop a course
    print("5. Dropping a course...")
    course_id = "CS101"  # Example course ID
    try:
        response = requests.post(f"{BASE_URL}/student/courses/{course_id}/drop/", headers=headers)
        print(f"Response Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Drop result: {json.dumps(result, indent=2)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")
    
    print("\n" + "=" * 60)
    print("Test completed. To run actual tests, you would need:")
    print("- A running Django server")
    print("- Valid authentication credentials")
    print("- Proper JWT token handling")

if __name__ == "__main__":
    test_student_enrollment_with_db()