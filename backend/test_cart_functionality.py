import os
import sys
import django
from django.conf import settings

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import authenticate
from users.models import User, Student
from student.models import StudentEnrollmentCart
from courses.models import Course

def test_cart_functionality():
    try:
        # Get a student user
        student_user = User.objects.filter(role='student').first()
        if not student_user:
            print("No student users found in database")
            return
            
        print(f"Testing with user: {student_user.username}")
        
        # Get student profile
        try:
            student = Student.objects.get(user=student_user)
            print(f"Student ID: {student.student_id}")
        except Student.DoesNotExist:
            print("Student profile not found")
            return
            
        # Get a course
        course = Course.objects.first()
        if not course:
            print("No courses found in database")
            return
            
        print(f"Testing with course: {course.code} - {course.name}")
        
        # Test adding to cart
        print("Testing add to cart...")
        from student.course_views import add_to_cart_db
        success, message = add_to_cart_db(student, course)
        print(f"Add to cart result: {success} - {message}")
        
        # Check cart items
        cart_items = StudentEnrollmentCart.objects.filter(student=student)
        print(f"Cart items count: {cart_items.count()}")
        
        # Test removing from cart
        print("Testing remove from cart...")
        from student.course_views import remove_from_cart_db
        success, message = remove_from_cart_db(student, course.id)
        print(f"Remove from cart result: {success} - {message}")
        
        # Check cart items again
        cart_items = StudentEnrollmentCart.objects.filter(student=student)
        print(f"Cart items count after removal: {cart_items.count()}")
        
    except Exception as e:
        print(f"Error during test: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_cart_functionality()