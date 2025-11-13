import requests
import json

# Test login with email
print("Testing login with email...")
try:
    response = requests.post('http://localhost:8000/api/auth/login/', 
                             data=json.dumps({
                                 'identifier': '2221001@iub.edu.bd',
                                 'password': 'DigitalCampus123'
                             }),
                             headers={'Content-Type': 'application/json'})

    print("Status code:", response.status_code)
    print("Response:", response.json())
except Exception as e:
    print("Error:", str(e))

print("\n" + "="*50 + "\n")

# Test login with ID
print("Testing login with ID...")
try:
    response = requests.post('http://localhost:8000/api/auth/login/', 
                             data=json.dumps({
                                 'identifier': '2221001',
                                 'password': 'DigitalCampus123'
                             }),
                             headers={'Content-Type': 'application/json'})

    print("Status code:", response.status_code)
    print("Response:", response.json())
except Exception as e:
    print("Error:", str(e))