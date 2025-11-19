import requests
import json

# Test faculty login and dashboard access
def test_faculty_access():
    base_url = "http://127.0.0.1:8000/api/v1"
    
    # Faculty user credentials
    login_data = {
        "identifier": "2221002",
        "password": "DigitalCampus123"
    }
    
    print("Testing faculty dashboard access...")
    
    # Login
    print("1. Logging in as faculty user...")
    response = requests.post(f"{base_url}/auth/login/", json=login_data)
    
    if response.status_code == 200:
        result = response.json()
        print(f"   Login successful: {result['success']}")
        
        if result['success']:
            token = result['token']
            user = result['user']
            print(f"   User: {user['first_name']} {user['last_name']} (Role: {user['role']})")
            
            # Access faculty dashboard
            print("2. Accessing faculty dashboard...")
            headers = {"Authorization": f"Bearer {token}"}
            dashboard_response = requests.get(f"{base_url}/faculty/dashboard/overview/", headers=headers)
            
            print(f"   Dashboard status: {dashboard_response.status_code}")
            
            if dashboard_response.status_code == 200:
                print("   SUCCESS: Faculty dashboard accessed successfully!")
                data = dashboard_response.json()
                print(f"   Dashboard data: {list(data.keys())}")
            elif dashboard_response.status_code == 403:
                print("   ERROR: Access denied - Faculty role required")
                print(f"   Response: {dashboard_response.text}")
            else:
                print(f"   ERROR: Unexpected status code {dashboard_response.status_code}")
                print(f"   Response: {dashboard_response.text}")
        else:
            print(f"   Login failed: {result['message']}")
    else:
        print(f"   Login failed with status {response.status_code}")
        print(f"   Response: {response.text}")

if __name__ == "__main__":
    test_faculty_access()