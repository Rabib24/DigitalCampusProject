import requests
import json

# First, let's try to authenticate with a student account
login_data = {
    "identifier": "2221001",  # John Student
    "password": "DigitalCampus123"
}

try:
    # Try to login
    login_response = requests.post(
        'http://127.0.0.1:8000/api/v1/auth/login/',
        json=login_data,  # Send as JSON instead of form data
        headers={'Content-Type': 'application/json'}
    )
    print(f"Login status: {login_response.status_code}")
    
    if login_response.status_code == 200:
        login_result = login_response.json()
        print("Login successful!")
        token = login_result.get('token')
        
        # Set up headers with authentication token
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        # Test the student dashboard endpoint
        try:
            response = requests.get('http://127.0.0.1:8000/api/v1/student/dashboard/', headers=headers)
            print(f"\nDashboard endpoint status: {response.status_code}")
            if response.status_code == 200:
                print("Dashboard data:", json.dumps(response.json(), indent=2))
            else:
                print("Error response:", response.text)
        except Exception as e:
            print(f"Error accessing dashboard endpoint: {e}")

        # Test the available courses endpoint
        try:
            response = requests.get('http://127.0.0.1:8000/api/v1/student/courses/available/', headers=headers)
            print(f"\nAvailable courses endpoint status: {response.status_code}")
            if response.status_code == 200:
                print("Courses data:", json.dumps(response.json(), indent=2))
            else:
                print("Error response:", response.text)
        except Exception as e:
            print(f"Error accessing available courses endpoint: {e}")
            
    else:
        print("Login failed:", login_response.text)
        
except Exception as e:
    print(f"Error during login: {e}")