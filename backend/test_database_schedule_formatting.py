import os
import sys
import django
from django.conf import settings

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from courses.models import Course
from student.course_views import format_schedule_for_frontend

def test_database_schedule_formatting():
    """Test schedule formatting with actual course data from the database"""
    try:
        # Get a few courses from the database
        courses = Course.objects.all()[:5]
        
        if not courses:
            print("No courses found in database")
            return
            
        print(f"Testing schedule formatting with {len(courses)} courses from database:")
        print("=" * 60)
        
        for i, course in enumerate(courses):
            print(f"\nCourse {i+1}: {course.code} - {course.name}")
            print(f"Raw schedule data: {course.schedule}")
            
            # Format the schedule for frontend
            formatted_schedule = format_schedule_for_frontend(course.schedule)
            print(f"Formatted schedule: {formatted_schedule}")
            
            # Verify the formatting worked
            if formatted_schedule:
                print("✅ Schedule formatted successfully")
                if formatted_schedule.get('days'):
                    print(f"   Days: {formatted_schedule['days']}")
                if formatted_schedule.get('time'):
                    print(f"   Time: {formatted_schedule['time']}")
                if formatted_schedule.get('room'):
                    print(f"   Room: {formatted_schedule['room']}")
            else:
                print("⚠️  No schedule data or formatting failed")
                
        print("\n" + "=" * 60)
        print("Database schedule formatting test completed!")
        
    except Exception as e:
        print(f"Error during database test: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_database_schedule_formatting()