import requests
import json

# Test the permission management endpoint
try:
    response = requests.get('http://localhost:8000/api/v1/admin/permission-management/')
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Permissions count: {len(data.get('permissions', []))}")
        print(f"User permissions count: {len(data.get('userPermissions', []))}")
        print("Permission management endpoint is working correctly!")
    else:
        print("Failed to fetch permission data")
        print("This might be due to authentication requirements or other issues.")
        
except Exception as e:
    print(f"Error: {e}")
    print("This might be due to the server not running or network issues.")