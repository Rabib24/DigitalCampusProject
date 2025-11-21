import requests
import json

# Base URL for the backend API
BASE_URL = "http://localhost:8000/api/v1"

def test_student_login():
    """
    Test student login with actual user from database
    """
    print("=== Student Login Test ===")
    
    # Test data for an actual student user
    login_data = {
        "identifier": "2221001@iub.edu.bd",
        "password": "DigitalCampus123"
    }
    
    print("Attempting to login as student user...")
    print(f"Using credentials: {login_data}")
    
    try:
        # Try to login
        response = requests.post(f"{BASE_URL}/auth/login/", json=login_data, timeout=10)
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

def test_faculty_login():
    """
    Test faculty login with actual user from database
    """
    print("\n=== Faculty Login Test ===")
    
    # Test data for an actual faculty user
    login_data = {
        "identifier": "2221002@iub.edu.bd",
        "password": "DigitalCampus123"
    }
    
    print("Attempting to login as faculty user...")
    print(f"Using credentials: {login_data}")
    
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
    test_student_login()
    test_faculty_login()