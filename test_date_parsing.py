#!/usr/bin/env python
import sys
import os
from datetime import datetime

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def parse_datetime(datetime_str):
    """Parse datetime string to datetime object"""
    if not datetime_str:
        return None
    
    # Clean up the datetime string
    cleaned_str = datetime_str.strip()
    
    # Handle various common formats
    formats_to_try = [
        '%Y-%m-%dT%H:%M:%S',  # ISO format
        '%Y-%m-%d %H:%M:%S',  # Standard format
        '%Y-%m-%d',           # Date only
        '%m.%d.%Y %H:%M%p',   # User format: 12.9.2025 10.00AM
        '%m.%d.%Y %H.%M%p',   # User format: 12.9.2025 10.00AM
        '%m.%d.%Y %H:%M %p',  # With space before AM/PM
        '%m.%d.%Y %H.%M %p',  # With space before AM/PM
        '%m/%d/%Y %H:%M%p',   # Alternative with slashes
        '%m/%d/%Y %H.%M%p',   # Alternative with slashes
        '%m/%d/%Y %H:%M %p',  # Alternative with slashes and space
        '%m/%d/%Y %H.%M %p',  # Alternative with slashes and space
    ]
    
    # Try ISO format first
    try:
        if 'T' in cleaned_str:
            return datetime.fromisoformat(cleaned_str.replace('Z', '+00:00'))
        else:
            # Try parsing date only format
            return datetime.fromisoformat(cleaned_str)
    except ValueError:
        pass
    
    # Try other formats
    for fmt in formats_to_try:
        try:
            # Handle lowercase am/pm
            test_str = cleaned_str.replace('am', 'AM').replace('pm', 'PM')
            # Handle case where minutes might be omitted
            if '%H:%M' in fmt and ':' not in test_str.split()[-1]:
                # If format expects : but input has ., convert it
                time_part = test_str.split()[-1]
                if '.' in time_part and ':' not in time_part:
                    time_part = time_part.replace('.', ':')
                    test_str = ' '.join(test_str.split()[:-1] + [time_part])
            return datetime.strptime(test_str, fmt)
        except ValueError:
            continue
    
    # If all else fails, raise an exception
    raise ValueError(f"Unable to parse datetime string: {datetime_str}")

def test_date_parsing():
    """Test the date parsing function with various formats"""
    
    # Test cases including the user's format
    test_cases = [
        "12.9.2025 10.00AM",
        "12.11.2025 10.00AM", 
        "2025-12-09T10:00:00",
        "2025-12-09 10:00:00",
        "2025-12-09",
        "12/9/2025 10:00AM",
        "12/9/2025 10.00AM"
    ]
    
    print("Testing date parsing function:")
    print("=" * 50)
    
    for test_case in test_cases:
        try:
            result = parse_datetime(test_case)
            print(f"✓ '{test_case}' -> {result}")
        except Exception as e:
            print(f"✗ '{test_case}' -> Error: {e}")
    
    print("=" * 50)
    
    # Test the specific case from the user
    print("\nTesting user's specific case:")
    try:
        start_date = parse_datetime("12.9.2025 10.00AM")
        end_date = parse_datetime("12.11.2025 10.00AM")
        print(f"Start date: {start_date}")
        print(f"End date: {end_date}")
        print(f"Valid date range: {start_date < end_date}")
    except Exception as e:
        print(f"Error with user's dates: {e}")

if __name__ == "__main__":
    test_date_parsing()