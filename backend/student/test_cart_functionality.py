"""
Test script for student course cart functionality
This script demonstrates how to use the student course cart endpoints with actual database interactions
"""

import requests
import json
import uuid

# Base URL for the API
BASE_URL = "http://localhost:8000/api/v1"

def test_student_cart_functionality():
    """
    Test the student course cart functionality with database interactions
    """
    print("Testing Student Course Cart Functionality with Database")
    print("=" * 60)
    
    # Note: This would require a valid JWT token from authentication
    # For demonstration purposes, we'll show the expected API calls
    
    # Sample JWT token (this would be obtained through login)
    sample_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoidGVzdC11c2VyLTEyMyIsInJvbGUiOiJzdHVkZW50IiwiZXhwIjoxNzMzMTQ4ODAwfQ.sample_signature"
    
    headers = {
        "Authorization": f"Bearer {sample_token}",
        "Content-Type": "application/json"
    }
    
    # 1. Add course to cart
    print("1. Adding course to cart...")
    course_id = "CS101"  # Example course ID
    try:
        response = requests.post(f"{BASE_URL}/student/enrollment/cart/add/{course_id}/", headers=headers)
        print(f"Response Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Add to cart result: {json.dumps(result, indent=2)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")
    
    print("\n" + "-" * 40 + "\n")
    
    # 2. Get cart
    print("2. Getting cart...")
    try:
        response = requests.get(f"{BASE_URL}/student/enrollment/cart/", headers=headers)
        print(f"Response Status: {response.status_code}")
        if response.status_code == 200:
            cart = response.json()
            print(f"Cart contents: {json.dumps(cart, indent=2)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")
    
    print("\n" + "-" * 40 + "\n")
    
    # 3. Remove course from cart
    print("3. Removing course from cart...")
    course_id = "CS101"  # Example course ID
    try:
        response = requests.post(f"{BASE_URL}/student/enrollment/cart/remove/{course_id}/", headers=headers)
        print(f"Response Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Remove from cart result: {json.dumps(result, indent=2)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")
    
    print("\n" + "-" * 40 + "\n")
    
    # 4. Clear cart
    print("4. Clearing cart...")
    try:
        response = requests.post(f"{BASE_URL}/student/enrollment/cart/clear/", headers=headers)
        print(f"Response Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Clear cart result: {json.dumps(result, indent=2)}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Request failed: {e}")
    
    print("\n" + "-" * 40 + "\n")
    
    # 5. Enroll from cart (empty cart test)
    print("5. Enrolling from cart (empty cart)...")
    try:
        response = requests.post(f"{BASE_URL}/student/enrollment/cart/enroll/", headers=headers)
        print(f"Response Status: {response.status_code}")
        if response.status_code == 200:
            result = response.json()
            print(f"Enroll from cart result: {json.dumps(result, indent=2)}")
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
    test_student_cart_functionality()