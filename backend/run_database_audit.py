"""
Simple Database Audit Script - Run with: python manage.py shell
Then: exec(open('run_database_audit.py').read())
"""

from users.models import User, Student, Faculty
from courses.models import Course, Enrollment
from assignments.models import Assignment, Submission, Grade
from datetime import datetime

print("\n" + "="*80)
print("  DIGITAL CAMPUS - DATABASE STATE AUDIT")
print("  Phase 1: Analysis & Data Audit")
print("  Date: " + datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
print("="*80)

# Users Audit
print("\n" + "="*80)
print("  USER ACCOUNTS AUDIT")
print("="*80)

total_users = User.objects.count()
print(f"\nTotal Users: {total_users}")

print("\nUsers by Role:")
for role in ['student', 'faculty', 'admin', 'staff']:
    count = User.objects.filter(role=role).count()
    print(f"  {role.capitalize()}: {count}")

total_students = Student.objects.count()
print(f"\nStudent Records: {total_students}")

total_faculty = Faculty.objects.count()
print(f"Faculty Records: {total_faculty}")

# Courses Audit
print("\n" + "="*80)
print("  COURSES AUDIT")
print("="*80)

total_courses = Course.objects.count()
print(f"\nTotal Courses: {total_courses}")

if total_courses > 0:
    print("\nCourses by Department:")
    departments = Course.objects.values_list('department', flat=True).distinct()
    for dept in departments:
        count = Course.objects.filter(department=dept).count()
        print(f"  {dept}: {count}")

# Enrollments Audit
print("\n" + "="*80)
print("  ENROLLMENTS AUDIT")
print("="*80)

total_enrollments = Enrollment.objects.count()
print(f"\nTotal Enrollments: {total_enrollments}")

if total_enrollments > 0:
    print("\nEnrollments by Status:")
    for status in ['active', 'completed', 'dropped']:
        count = Enrollment.objects.filter(status=status).count()
        pct = (count / total_enrollments * 100) if total_enrollments > 0 else 0
        print(f"  {status.capitalize()}: {count} ({pct:.1f}%)")
    
    students_with_enrollments = Enrollment.objects.values('student_id').distinct().count()
    print(f"\nStudents with Enrollments: {students_with_enrollments} / {total_students}")
    if total_students > 0:
        coverage = (students_with_enrollments / total_students * 100)
        print(f"Enrollment Coverage: {coverage:.1f}%")
else:
    print("\n❌ CRITICAL: No enrollments found!")

# Assignments Audit
print("\n" + "="*80)
print("  ASSIGNMENTS AUDIT")
print("="*80)

total_assignments = Assignment.objects.count()
print(f"\nTotal Assignments: {total_assignments}")

if total_assignments > 0:
    print("\nAssignments by Type:")
    for atype in ['homework', 'exam', 'project']:
        count = Assignment.objects.filter(type=atype).count()
        print(f"  {atype.capitalize()}: {count}")
else:
    print("\n⚠️  WARNING: No assignments found!")

# Grades Audit
print("\n" + "="*80)
print("  GRADES AUDIT")
print("="*80)

total_grades = Grade.objects.count()
print(f"\nTotal Grades: {total_grades}")

if total_grades > 0:
    students_with_grades = Grade.objects.values('student_id').distinct().count()
    print(f"Students with Grades: {students_with_grades} / {total_students}")
else:
    print("\n❌ CRITICAL: No grades found!")

# Submissions Audit
print("\n" + "="*80)
print("  SUBMISSIONS AUDIT")
print("="*80)

total_submissions = Submission.objects.count()
print(f"\nTotal Submissions: {total_submissions}")

# Missing Data Analysis
print("\n" + "="*80)
print("  MISSING DATA IDENTIFICATION")
print("="*80)

print("\n❌ CRITICAL DATA GAPS:")

students_without_enrollments = total_students - (Enrollment.objects.values('student_id').distinct().count() if total_enrollments > 0 else 0)
if students_without_enrollments > 0:
    print(f"\n1. Enrollments:")
    print(f"   • {students_without_enrollments} students have no enrollments")
    print(f"   Impact: HIGH - Students will see 'no course enrolled'")
    print(f"   Action: Create enrollment data")

if total_assignments == 0:
    print(f"\n2. Assignments:")
    print(f"   • No assignments in database")
    print(f"   Impact: HIGH - Assignment page empty")
    print(f"   Action: Create 5-10 assignments per course")

if total_grades == 0:
    print(f"\n3. Grades:")
    print(f"   • No grades in database")
    print(f"   Impact: HIGH - Grade page errors")
    print(f"   Action: Create grade records")

# Recommendations
print("\n" + "="*80)
print("  RECOMMENDATIONS")
print("="*80)

print("\n📋 Required Actions for Phase 2:")
print("\n1. CRITICAL: Create generate_enrollment_data.py")
print("   - Generate 4-6 enrollments per student")
print("   - Mix: 60% active, 30% completed, 10% dropped")
print("\n2. CRITICAL: Create generate_grade_data.py")
print("   - Create grades for assignments and enrollments")
print("   - Calculate realistic grade distribution")
print("\n3. HIGH: Enhance generate_assignment_data.py")
print("   - Create 5-10 assignments per course")
print("   - Mix types and due dates")
print("\n4. HIGH: Create generate_degree_progress_data.py")
print("   - Define degree requirements")
print("   - Track course completion")

print("\n" + "="*80)
print("  AUDIT COMPLETE")
print("="*80)
print("\nNext: Proceed to Phase 2 - Create demo data scripts\n")
