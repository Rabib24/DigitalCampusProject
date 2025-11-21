import requests
import json

# Base URL for the backend API
BASE_URL = "http://localhost:8000/api/v1"

def test_faculty_login():
    """
    Test faculty login
    """
    print("=== Faculty Login Test ===")
    
    # Test data for a faculty user
    login_data = {
        "identifier": "testfaculty",
        "password": "testpass123"
    }
    
    print("Attempting to login as faculty user...")
    
    try:
        # Try to login
        response = requests.post(f"{BASE_URL}/faculty/auth/login/", json=login_data, timeout=10)
        print(f"Login response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"Login success: {result['success']}")
            
            if result['success']:
                token = result['token']
                user = result['user']
                print(f"User: {user['first_name']} {user['last_name']} ({user['role']})")
                print(f"Token: {token[:20]}...")
            else:
                print(f"Login failed: {result['message']}")
        else:
            print(f"Login failed with status {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("ERROR: Could not connect to the backend server. Make sure it's running.")
    except requests.exceptions.Timeout:
        print("ERROR: Request timed out.")
    except Exception as e:
        print(f"ERROR: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_faculty_login()