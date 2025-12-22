"""
Verify Student Dashboard APIs
Run with: python manage.py shell
Then: exec(open('verify_student_apis.py').read())
"""

from users.models import User, Student
from courses.models import Course, Enrollment
from assignments.models import Assignment, Grade
from datetime import datetime

print("\n" + "="*80)
print("  STUDENT DASHBOARD API VERIFICATION")
print("="*80)

# Get a sample student
print("\n📋 Finding a sample student...")
students = Student.objects.all()[:1]

if not students.exists():
    print("❌ No students found! Please run demo data generation first.")
else:
    student = students[0]
    print(f"✓ Found student: {student.student_id} - {student.user.get_full_name()}")
    
    # Check enrollments
    print("\n📚 Checking enrollments...")
    enrollments = Enrollment.objects.filter(student_id=student.student_id)
    print(f"  Total enrollments: {enrollments.count()}")
    
    if enrollments.exists():
        print(f"\n  Status breakdown:")
        for status in ['active', 'completed', 'dropped']:
            count = enrollments.filter(status=status).count()
            print(f"    • {status.capitalize()}: {count}")
        
        print(f"\n  Sample enrollments:")
        for enrollment in enrollments[:5]:
            try:
                course = Course.objects.get(id=enrollment.course_id)
                print(f"    • {course.code}: {course.name} - Status: {enrollment.status}")
                if enrollment.grade:
                    print(f"      Grade: {enrollment.grade}")
            except Course.DoesNotExist:
                print(f"    • Course {enrollment.course_id} (not found)")
    else:
        print("  ❌ No enrollments found!")
    
    # Check grades
    print("\n📊 Checking grades...")
    grades = Grade.objects.filter(student_id=student.student_id)
    print(f"  Total grades: {grades.count()}")
    
    if grades.exists():
        print(f"\n  Grade distribution:")
        for letter in ['A', 'B', 'C', 'D', 'F']:
            count = grades.filter(letter_grade=letter).count()
            if count > 0:
                print(f"    • {letter}: {count}")
        
        # Show CGPA
        if student.cumulative_gpa:
            print(f"\n  CGPA: {student.cumulative_gpa}")
        else:
            print(f"\n  CGPA: Not calculated")
    else:
        print("  ⚠️  No grades found!")
    
    # Check assignments
    print("\n📝 Checking assignments...")
    if enrollments.exists():
        course_ids = [e.course_id for e in enrollments]
        assignments = Assignment.objects.filter(course_id__in=course_ids)
        print(f"  Assignments for enrolled courses: {assignments.count()}")
        
        if assignments.exists():
            print(f"\n  Sample assignments:")
            for assignment in assignments[:3]:
                print(f"    • {assignment.title} (Due: {assignment.due_date.strftime('%Y-%m-%d')})")
        else:
            print("  ⚠️  No assignments found for enrolled courses!")
    
    # API Endpoint Simulation
    print("\n" + "="*80)
    print("  API ENDPOINT SIMULATION")
    print("="*80)
    
    # Simulate /student/courses/ endpoint
    print("\n🔗 GET /student/courses/")
    active_enrollments = Enrollment.objects.filter(
        student_id=student.student_id,
        status='active'
    )
    
    courses_data = []
    for enrollment in active_enrollments:
        try:
            course = Course.objects.get(id=enrollment.course_id)
            courses_data.append({
                'id': course.id,
                'code': course.code,
                'name': course.name,
                'credits': course.credits,
                'status': 'Active',
                'instructor': course.instructor_id
            })
        except Course.DoesNotExist:
            pass
    
    print(f"  Response: {len(courses_data)} active courses")
    for course_data in courses_data[:3]:
        print(f"    • {course_data['code']}: {course_data['name']}")
    
    # Simulate /student/dashboard/ endpoint
    print("\n🔗 GET /student/dashboard/")
    completed_count = Enrollment.objects.filter(
        student_id=student.student_id,
        status='completed'
    ).count()
    
    dashboard_data = {
        'cgpa': float(student.cumulative_gpa) if student.cumulative_gpa else 0.0,
        'completedCourses': completed_count,
        'currentCourses': active_enrollments.count(),
    }
    
    print(f"  Response:")
    print(f"    • CGPA: {dashboard_data['cgpa']}")
    print(f"    • Completed Courses: {dashboard_data['completedCourses']}")
    print(f"    • Current Courses: {dashboard_data['currentCourses']}")
    
    # Simulate /student/grades/ endpoint
    print("\n🔗 GET /student/grades/")
    grade_count = grades.count()
    print(f"  Response: {grade_count} grade records")
    
    if grade_count > 0:
        print(f"  Sample grades:")
        for grade in grades[:3]:
            try:
                course = Course.objects.get(id=grade.course_id)
                print(f"    • {course.code}: {grade.letter_grade} ({grade.calculate_percentage():.1f}%)")
            except Course.DoesNotExist:
                pass

print("\n" + "="*80)
print("  VERIFICATION COMPLETE")
print("="*80)
print("\nIf all checks passed, the student dashboard should work correctly!")
print("Ready to proceed to Phase 4: Frontend fixes\n")
