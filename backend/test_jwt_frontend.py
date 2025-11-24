import requests
import json

def test_jwt_frontend_integration():
    """Test JWT authentication from frontend perspective"""
    print("=== Testing JWT Frontend Integration ===")
    
    # Test data for faculty login
    login_data = {
        "identifier": "testfaculty",
        "password": "testpass123"
    }
    
    print("Attempting faculty login...")
    print(f"Using credentials: {login_data}")
    
    try:
        # Try to login
        response = requests.post(
            "http://localhost:8000/api/v1/faculty/auth/login/", 
            json=login_data, 
            headers={
                "Content-Type": "application/json",
                "Origin": "http://localhost:3000"
            },
            timeout=10
        )
        print(f"Login response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"Login success: {result['success']}")
            
            if result['success']:
                token = result['token']
                user = result['user']
                print(f"User: {user['first_name']} {user['last_name']} ({user['role']})")
                print(f"Token: {token[:20]}...")
                
                # Test accessing a protected endpoint with the token
                print("\nTesting access to protected endpoint...")
                protected_response = requests.get(
                    "http://localhost:8000/api/v1/faculty/dashboard/overview/",
                    headers={
                        "Authorization": f"Bearer {token}",
                        "Content-Type": "application/json",
                        "Origin": "http://localhost:3000"
                    },
                    timeout=10
                )
                print(f"Protected endpoint response status: {protected_response.status_code}")
                if protected_response.status_code == 200:
                    print("Successfully accessed protected endpoint!")
                    print(f"Response: {protected_response.json()}")
                else:
                    print(f"Failed to access protected endpoint: {protected_response.status_code}")
                    print(f"Response: {protected_response.text}")
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
    test_jwt_frontend_integration()