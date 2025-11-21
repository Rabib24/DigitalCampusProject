#!/usr/bin/env python
"""
Simple test script to verify faculty dashboard access
"""

import requests
import json

# Base URL for the backend API
BASE_URL = "http://localhost:8000/api/v1"

def test_faculty_dashboard():
    """
    Test faculty login and dashboard access
    """
    print("=== Faculty Dashboard Access Test ===")
    
    # Test data for a faculty user
    login_data = {
        "identifier": "testfaculty",
        "password": "testpass123"
    }
    
    print("1. Attempting to login as faculty user...")
    
    try:
        # Try to login
        response = requests.post(f"{BASE_URL}/faculty/auth/login/", json=login_data)
        print(f"   Login response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"   Login success: {result['success']}")
            
            if result['success']:
                token = result['token']
                user = result['user']
                print(f"   User: {user['first_name']} {user['last_name']} ({user['role']})")
                print(f"   Token: {token[:20]}...")
                
                # Now try to access the faculty dashboard
                print("2. Attempting to access faculty dashboard...")
                headers = {
                    "Authorization": f"Bearer {token}"
                }
                
                dashboard_response = requests.get(f"{BASE_URL}/faculty/dashboard/overview/", headers=headers)
                print(f"   Dashboard response status: {dashboard_response.status_code}")
                
                if dashboard_response.status_code == 200:
                    print("   SUCCESS: Faculty dashboard access granted!")
                    dashboard_data = dashboard_response.json()
                    print(f"   Dashboard data keys: {list(dashboard_data.keys())}")
                    print(f"   Dashboard data: {json.dumps(dashboard_data, indent=2)}")
                elif dashboard_response.status_code == 403:
                    print("   ERROR: Access denied - Faculty role required")
                    print(f"   Response: {dashboard_response.text}")
                else:
                    print(f"   ERROR: Unexpected response status {dashboard_response.status_code}")
                    print(f"   Response: {dashboard_response.text}")
            else:
                print(f"   Login failed: {result['message']}")
        else:
            print(f"   Login failed with status {response.status_code}")
            print(f"   Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("   ERROR: Could not connect to the backend server. Make sure it's running.")
    except Exception as e:
        print(f"   ERROR: {str(e)}")

if __name__ == "__main__":
    test_faculty_dashboard()