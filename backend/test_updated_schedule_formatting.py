import os
import sys
import django
from django.conf import settings

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from student.course_views import format_schedule_for_frontend

def test_updated_schedule_formatting():
    # Test cases with multiple schedule entries
    test_cases = [
        # Multiple days pattern
        ([{"day": "Monday", "start_time": "09:00", "end_time": "10:30", "location": "Room 101"},
          {"day": "Wednesday", "start_time": "09:00", "end_time": "10:30", "location": "Room 101"}], 
         "MW", "09:00 - 10:30", "Room 101"),
        
        # Multiple days with different times
        ([{"day": "Tuesday", "start_time": "11:00", "end_time": "12:30", "location": "Room 205"},
          {"day": "Thursday", "start_time": "11:00", "end_time": "12:30", "location": "Room 205"}], 
         "ST", "11:00 - 12:30", "Room 205"),
        
        # Friday pattern
        ([{"day": "Friday", "start_time": "14:00", "end_time": "15:30", "location": "Room 301"}], 
         "AR", "14:00 - 15:30", "Room 301"),
        
        # Multiple different times and rooms
        ([{"day": "Monday", "start_time": "09:00", "end_time": "10:30", "location": "Room 101"},
          {"day": "Wednesday", "start_time": "14:00", "end_time": "15:30", "location": "Room 102"}], 
         "MW", "09:00 - 10:30, 14:00 - 15:30", "Room 101, Room 102"),
         
        # Single day pattern
        ([{"day": "Monday", "start_time": "09:00", "end_time": "10:30", "location": "Room 101"}], 
         "M", "09:00 - 10:30", "Room 101"),
    ]
    
    print("Testing updated schedule formatting...")
    for i, (input_data, expected_days, expected_time, expected_room) in enumerate(test_cases):
        result = format_schedule_for_frontend(input_data)
        print(f"Test {i+1}:")
        print(f"  Input: {input_data}")
        print(f"  Output: {result}")
        
        if result:
            if (result.get('days') == expected_days and 
                result.get('time') == expected_time and 
                result.get('room') == expected_room):
                print(f"  ✅ PASS")
            else:
                print(f"  ❌ FAIL")
                print(f"    Expected: days='{expected_days}', time='{expected_time}', room='{expected_room}'")
                print(f"    Got: days='{result.get('days')}', time='{result.get('time')}', room='{result.get('room')}'")
        else:
            print(f"  ❌ FAIL - Expected result, got None")
        print()

if __name__ == "__main__":
    test_updated_schedule_formatting()