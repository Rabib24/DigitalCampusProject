"""
Test script to verify the fixed login functionality
"""
import requests
import json

def test_login_functionality():
    """Test login functionality for different user roles"""
    
    # Base URL for the API
    base_url = "http://localhost:8000"
    
    # Test data for different roles
    test_cases = [
        {
            "role": "faculty",
            "endpoint": "/api/v1/faculty/auth/login/",
            "credentials": {
                "identifier": "2221002",  # This should be a valid faculty account
                "password": "DigitalCampus123"
            }
        },
        {
            "role": "faculty",
            "endpoint": "/api/v1/faculty/auth/login/",
            "credentials": {
                "identifier": "2221002@iub.edu.bd",  # Email format for the same faculty account
                "password": "DigitalCampus123"
            }
        },
        {
            "role": "general",
            "endpoint": "/api/v1/auth/login/",
            "credentials": {
                "identifier": "2221002",  # Test general auth endpoint with faculty account
                "password": "DigitalCampus123"
            }
        }
    ]
    
    print("Testing login functionality for different user roles...\n")
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"Test {i}: {test_case['role']} login via {test_case['endpoint']}")
        print(f"Credentials: {test_case['credentials']}")
        
        try:
            # Make the login request
            response = requests.post(
                f"{base_url}{test_case['endpoint']}",
                data=json.dumps(test_case['credentials']),
                headers={'Content-Type': 'application/json'}
            )
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    print("✓ Login successful")
                    print(f"  User role: {data['user']['role']}")
                    print(f"  Token received: {'Yes' if 'token' in data else 'No'}")
                else:
                    print("✗ Login failed")
                    print(f"  Error message: {data.get('message', 'No message')}")
            else:
                print(f"✗ HTTP Error: {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"  Error message: {error_data.get('message', 'No message')}")
                except:
                    print(f"  Response text: {response.text}")
                    
        except requests.exceptions.ConnectionError:
            print("✗ Connection Error: Could not connect to the server")
            print("  Please make sure the Django server is running on localhost:8000")
        except Exception as e:
            print(f"✗ Unexpected error: {str(e)}")
            
        print("-" * 50)
    
    # Test invalid credentials
    print("\nTesting invalid credentials...")
    invalid_credentials_test = {
        "endpoint": "/api/v1/auth/login/",
        "credentials": {
            "identifier": "nonexistent@example.com",
            "password": "wrongpassword"
        }
    }
    
    try:
        response = requests.post(
            f"{base_url}{invalid_credentials_test['endpoint']}",
            data=json.dumps(invalid_credentials_test['credentials']),
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        if response.status_code == 401:
            data = response.json()
            if not data.get('success'):
                print("✓ Invalid credentials properly handled")
                print(f"  Error message: {data.get('message', 'No message')}")
            else:
                print("✗ Invalid credentials were accepted")
        else:
            print(f"✗ Unexpected status code: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("✗ Connection Error: Could not connect to the server")
    except Exception as e:
        print(f"✗ Unexpected error: {str(e)}")

if __name__ == "__main__":
    test_login_functionality()