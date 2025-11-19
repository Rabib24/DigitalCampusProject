# Test script to verify faculty dashboard access
# This script simulates the login and faculty dashboard access flow

import json
import requests

# Base URL for the backend API
BASE_URL = "http://localhost:8000/api/v1"

def test_faculty_login_and_dashboard_access():
    """
    Test that a user with faculty role can access the faculty dashboard
    """
    print("Testing faculty login and dashboard access...")
    
    # Step 1: Login as a faculty user
    login_data = {
        "identifier": "faculty_user",  # This should be an actual faculty username
        "password": "faculty_password"  # This should be the actual faculty password
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
        print(f"Login response status: {response.status_code}")
        
        if response.status_code == 200:
            login_result = response.json()
            print(f"Login success: {login_result['success']}")
            
            if login_result['success']:
                token = login_result['token']
                user = login_result['user']
                print(f"User role: {user['role']}")
                
                # Step 2: Try to access faculty dashboard with the token
                headers = {
                    "Authorization": f"Bearer {token}"
                }
                
                dashboard_response = requests.get(f"{BASE_URL}/faculty/dashboard/overview/", headers=headers)
                print(f"Dashboard access status: {dashboard_response.status_code}")
                
                if dashboard_response.status_code == 200:
                    print("SUCCESS: Faculty user can access the dashboard!")
                    dashboard_data = dashboard_response.json()
                    print(f"Dashboard data: {json.dumps(dashboard_data, indent=2)}")
                else:
                    print(f"ERROR: Failed to access dashboard. Status code: {dashboard_response.status_code}")
                    print(f"Response: {dashboard_response.text}")
            else:
                print(f"Login failed: {login_result['message']}")
        else:
            print(f"Login request failed with status {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"Exception occurred: {str(e)}")

if __name__ == "__main__":
    test_faculty_login_and_dashboard_access()