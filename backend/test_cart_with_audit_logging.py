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
from courses.models import Course
from student.course_views import add_to_cart_db, remove_from_cart_db
from student.audit_logger import EnrollmentAuditLogger

def test_cart_with_audit_logging():
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
        
        # Test adding to cart with audit logging
        print("Testing add to cart with audit logging...")
        try:
            # Add to cart
            success, message = add_to_cart_db(student, course)
            print(f"Add to cart result: {success} - {message}")
            
            # Log the add action
            EnrollmentAuditLogger.log_add_to_cart(
                student=student,
                course=course,
                course_data={
                    'course_id': course.id,
                    'course_name': course.name,
                    'course_code': course.code,
                    'credits': course.credits,
                    'department': course.department
                }
            )
            print("Add to cart audit log created successfully")
        except Exception as e:
            print(f"Error during add to cart: {e}")
            import traceback
            traceback.print_exc()
        
        # Test removing from cart with audit logging
        print("Testing remove from cart with audit logging...")
        try:
            # Remove from cart
            success, message = remove_from_cart_db(student, course.id)
            print(f"Remove from cart result: {success} - {message}")
            
            # Log the remove action
            EnrollmentAuditLogger.log_remove_from_cart(
                student=student,
                course=course
            )
            print("Remove from cart audit log created successfully")
        except Exception as e:
            print(f"Error during remove from cart: {e}")
            import traceback
            traceback.print_exc()
            
    except Exception as e:
        print(f"Error during test: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_cart_with_audit_logging()