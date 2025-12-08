import urllib.request
import urllib.parse
import json

# Test login with one of the actual users
login_data = {
    "identifier": "2221005",  # This is one of the admin users
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
    error_response = e.read().decode('utf-8')
    print(f"Response: {error_response}")
    
    # Try to parse the error response as JSON
    try:
        error_json = json.loads(error_response)
        print(f"Error message: {error_json.get('message', 'Unknown error')}")
    except:
        print("Could not parse error response as JSON")
        
except Exception as e:
    print(f"Error occurred: {e}")