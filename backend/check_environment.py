"""
Environment Check Script
Verifies Django setup and database connectivity
Run with: python check_environment.py
"""

import sys
import os

print("\n" + "="*80)
print("  ENVIRONMENT CHECK")
print("="*80 + "\n")

# Check 1: Django Installation
print("1. Checking Django installation...")
try:
    import django
    print(f"   ✓ Django installed: version {django.get_version()}")
except ImportError:
    print("   ❌ Django not installed!")
    print("      Run: pip install django")
    sys.exit(1)

# Check 2: Django Settings
print("\n2. Checking Django settings...")
try:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    django.setup()
    print("   ✓ Django settings configured")
except Exception as e:
    print(f"   ❌ Django setup failed: {e}")
    sys.exit(1)

# Check 3: Database Connection
print("\n3. Checking database connection...")
try:
    from django.db import connection
    connection.ensure_connection()
    print("   ✓ Database connected")
except Exception as e:
    print(f"   ❌ Database connection failed: {e}")
    sys.exit(1)

# Check 4: Check Models
print("\n4. Checking models...")
try:
    from users.models import User, Student
    from courses.models import Course, Enrollment
    from assignments.models import Assignment, Grade
    print("   ✓ All models imported successfully")
except Exception as e:
    print(f"   ❌ Model import failed: {e}")
    sys.exit(1)

# Check 5: Check Data
print("\n5. Checking existing data...")
try:
    user_count = User.objects.count()
    student_count = Student.objects.count()
    course_count = Course.objects.count()
    enrollment_count = Enrollment.objects.count()
    assignment_count = Assignment.objects.count()
    grade_count = Grade.objects.count()
    
    print(f"   • Users: {user_count}")
    print(f"   • Students: {student_count}")
    print(f"   • Courses: {course_count}")
    print(f"   • Enrollments: {enrollment_count}")
    print(f"   • Assignments: {assignment_count}")
    print(f"   • Grades: {grade_count}")
    
    # Check if we need to run data generation
    if student_count == 0:
        print("\n   ⚠️  No students found - need to run generate_user_data.py")
    elif course_count == 0:
        print("\n   ⚠️  No courses found - need to run generate_course_data.py")
    elif enrollment_count == 0:
        print("\n   ⚠️  No enrollments found - need to run generate_enrollment_data.py")
    elif grade_count == 0:
        print("\n   ⚠️  No grades found - need to run generate_grade_data.py")
    else:
        print("\n   ✓ Database has data!")
        
except Exception as e:
    print(f"   ❌ Data check failed: {e}")
    sys.exit(1)

print("\n" + "="*80)
print("  ENVIRONMENT CHECK COMPLETE")
print("="*80)
print("\n✅ Environment is set up correctly!")
print("\nNext steps:")
if enrollment_count == 0 or grade_count == 0:
    print("  1. Run: python manage.py shell")
    print("  2. Execute: exec(open('run_demo_data_generation.py').read())")
else:
    print("  1. Data already exists!")
    print("  2. Proceed to Phase 4: Frontend fixes")
print()
