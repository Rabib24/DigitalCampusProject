import os
import sys
import django
from django.conf import settings

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from student.course_views import format_schedule_for_frontend

def test_schedule_formatting():
    # Test cases
    test_cases = [
        # Monday pattern
        ([{"day": "Monday", "start_time": "09:00", "end_time": "10:30", "location": "Room 101"}], "M"),
        
        # Tuesday pattern
        ([{"day": "Tuesday", "start_time": "11:00", "end_time": "12:30", "location": "Room 205"}], "T"),
        
        # Friday pattern
        ([{"day": "Friday", "start_time": "14:00", "end_time": "15:30", "location": "Room 301"}], "AR"),
        
        # Monday/Wednesday pattern
        ([{"day": "Monday", "start_time": "09:00", "end_time": "10:30", "location": "Room 101"},
          {"day": "Wednesday", "start_time": "09:00", "end_time": "10:30", "location": "Room 101"}], "MW"),
        
        # Tuesday/Thursday pattern
        ([{"day": "Tuesday", "start_time": "11:00", "end_time": "12:30", "location": "Room 205"},
          {"day": "Thursday", "start_time": "11:00", "end_time": "12:30", "location": "Room 205"}], "ST"),
        
        # Empty schedule
        (None, None),
        
        # Already formatted schedule
        ({"days": "MW", "time": "09:00 - 10:30", "room": "Room 101"}, {"days": "MW", "time": "09:00 - 10:30", "room": "Room 101"}),
        
        # String schedule
        ("Mon/Wed/Fri 10:00-11:00 AM", {"days": "", "time": "Mon/Wed/Fri 10:00-11:00 AM", "room": ""}),
    ]
    
    print("Testing schedule formatting...")
    for i, (input_data, expected_days) in enumerate(test_cases):
        result = format_schedule_for_frontend(input_data)
        print(f"Test {i+1}:")
        print(f"  Input: {input_data}")
        print(f"  Output: {result}")
        
        if isinstance(expected_days, str):
            if result and result.get('days') == expected_days:
                print(f"  ✅ PASS")
            else:
                print(f"  ❌ FAIL - Expected days: {expected_days}, Got: {result.get('days') if result else 'None'}")
        elif isinstance(expected_days, dict):
            if result == expected_days:
                print(f"  ✅ PASS")
            else:
                print(f"  ❌ FAIL - Expected: {expected_days}, Got: {result}")
        elif expected_days is None:
            if result is None:
                print(f"  ✅ PASS")
            else:
                print(f"  ❌ FAIL - Expected: None, Got: {result}")
        print()

if __name__ == "__main__":
    test_schedule_formatting()