"""
Test script to test the faculty login endpoint via HTTP request
"""
import requests
import json

def test_faculty_login_http():
    """Test faculty login via HTTP request"""
    url = "http://localhost:8000/api/v1/faculty/auth/login/"
    
    # Test data
    data = {
        "identifier": "2221002",
        "password": "DigitalCampus123"
    }
    
    print("Testing faculty login via HTTP request...")
    print(f"URL: {url}")
    print(f"Data: {data}")
    
    try:
        response = requests.post(
            url,
            json=data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Headers: {dict(response.headers)}")
        
        # Check content type
        content_type = response.headers.get('content-type', '')
        print(f"Content-Type: {content_type}")
        
        if 'application/json' in content_type:
            try:
                response_data = response.json()
                print(f"JSON Response: {response_data}")
            except Exception as e:
                print(f"Error parsing JSON: {e}")
                print(f"Raw response: {response.text[:200]}")
        else:
            print(f"Non-JSON response received:")
            print(f"Response (first 500 chars): {response.text[:500]}")
            
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the server. Is Django running?")
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_faculty_login_http()