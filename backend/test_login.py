import urllib.request
import urllib.parse
import json

# Test login with the admin user
login_data = {
    "identifier": "90001",
    "password": "DigitalIUB123"
}

try:
    # Convert data to JSON
    data = json.dumps(login_data).encode('utf-8')
    
    # Create request
    req = urllib.request.Request(
        "http://localhost:8000/api/users/login/",
        data=data,
        headers={"Content-Type": "application/json"}
    )
    
    # Send request
    response = urllib.request.urlopen(req)
    
    print(f"Status Code: {response.getcode()}")
    response_data = response.read().decode('utf-8')
    print(f"Response: {response_data}")
    
    if response.getcode() == 200:
        print("Login successful!")
        json_response = json.loads(response_data)
        print(f"User: {json_response.get('user')}")
        print(f"Token: {json_response.get('token')}")
    else:
        print("Login failed!")
        
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(f"Response: {e.read().decode('utf-8')}")
except Exception as e:
    print(f"Error occurred: {e}")