import requests
import json
import time

def test_server():
    try:
        # Wait a moment for server to fully start
        time.sleep(2)
        
        # Test if the server is running
        response = requests.get('http://localhost:8000/', timeout=10)
        print('Server is running. Status code:', response.status_code)
        
        # Test faculty login endpoint
        response = requests.get('http://localhost:8000/api/v1/faculty/auth/login/', timeout=10)
        print('Faculty login endpoint status:', response.status_code)
        print('Response:', response.text[:200])  # First 200 chars
        
    except requests.exceptions.ConnectionError as e:
        print('Error connecting to server: Connection refused')
        print('Make sure the Django server is running on port 8000')
    except requests.exceptions.Timeout as e:
        print('Error: Request timed out')
    except Exception as e:
        print('Error:', str(e))

if __name__ == "__main__":
    test_server()