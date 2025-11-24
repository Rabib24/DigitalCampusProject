import requests
import json

# Test the admin login endpoint
try:
    # Test login with admin credentials
    login_data = {
        "identifier": "testadmin",
        "password": "DigitalCampus2025!"
    }
    
    response = requests.post('http://localhost:8000/api/v1/auth/login/', 
                           json=login_data,
                           headers={'Content-Type': 'application/json'})
    
    print(f"Login Status Code: {response.status_code}")
    print(f"Login Response: {response.text}")
    
    if response.status_code == 200:
        login_result = response.json()
        print(f"Login Success: {login_result.get('success')}")
        print(f"Token Present: {'token' in login_result}")
        print(f"User Role: {login_result.get('user', {}).get('role')}")
        
        # Test accessing the permission management endpoint with the token
        if 'token' in login_result:
            token = login_result['token']
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            
            perm_response = requests.get('http://localhost:8000/api/v1/admin/permission-management/', 
                                       headers=headers)
            
            print(f"\nPermission Management Status Code: {perm_response.status_code}")
            if perm_response.status_code == 200:
                perm_data = perm_response.json()
                print(f"Permissions Count: {len(perm_data.get('permissions', []))}")
                print(f"User Permissions Count: {len(perm_data.get('userPermissions', []))}")
            else:
                print(f"Permission Management Error: {perm_response.text}")
            
    else:
        print("Login failed")
        
except Exception as e:
    print(f"Error: {e}")