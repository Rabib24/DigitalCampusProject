"""
Database State Audit Script
============================
Phase 1: Analysis & Data Audit

This script reviews the current database state and identifies missing demo data
for Students, Faculty, and Admin users.

Usage: python audit_database_state.py
"""

import os
import sys
import django
from datetime import datetime

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(__file__))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User, Student, Faculty
from courses.models import Course, Enrollment
from assignments.models import Assignment, Submission, Grade

def print_header(title):
    """Print a formatted header"""
    print("\n" + "="*80)
    print(f"  {title}")
    print("="*80)

def print_section(title):
    """Print a formatted section"""
    print(f"\n{title}")
    print("-"*80)

def audit_users():
    """Audit user accounts"""
    print_header("USER ACCOUNTS AUDIT")
    
    # Total users
    total_users = User.objects.count()
    print(f"\n📊 Total Users: {total_users}")
    
    # Users by role
    print_section("Users by Role:")
    roles = User.objects.values('role').distinct()
    for role_dict in roles:
        role = role_dict['role']
        count = User.objects.filter(role=role).count()
        print(f"  • {role.capitalize()}: {count}")
    
    # Students
    print_section("Student Details:")
    total_students = Student.objects.count()
    students_with_users = User.objects.filter(role='student').count()
    print(f"  Total Student Records: {total_students}")
    print(f"  Total Student Users: {students_with_users}")
    
    if total_students > 0:
        # Sample student data
        sample_students = Student.objects.all()[:5]
        print(f"\n  Sample Students (first 5):")
        for student in sample_students:
            print(f"    - {student.student_id}: {student.user.get_full_name()}")
            print(f"      Department: {student.degree_program or 'Not Set'}")
            print(f"      CGPA: {student.cumulative_gpa or 'Not Set'}")
    
    # Faculty
    print_section("Faculty Details:")
    total_faculty = Faculty.objects.count()
    faculty_with_users = User.objects.filter(role='faculty').count()
    print(f"  Total Faculty Records: {total_faculty}")
    print(f"  Total Faculty Users: {faculty_with_users}")
    
    if total_faculty > 0:
        # Sample faculty data
        sample_faculty = Faculty.objects.all()[:5]
        print(f"\n  Sample Faculty (first 5):")
        for faculty in sample_faculty:
            print(f"    - {faculty.employee_id}: {faculty.user.get_full_name()}")
            print(f"      Department: {faculty.department or 'Not Set'}")
            print(f"      Title: {faculty.title or 'Not Set'}")
    
    # Admin users
    print_section("Admin Users:")
    admin_count = User.objects.filter(role='admin').count()
    print(f"  Total Admin Users: {admin_count}")

def audit_courses():
    """Audit courses"""
    print_header("COURSES AUDIT")
    
    total_courses = Course.objects.count()
    print(f"\n📚 Total Courses: {total_courses}")
    
    if total_courses > 0:
        # Courses by department
        print_section("Courses by Department:")
        departments = Course.objects.values('department').distinct()
        for dept_dict in departments:
            dept = dept_dict['department']
            count = Course.objects.filter(department=dept).count()
            print(f"  • {dept}: {count} courses")
        
        # Sample courses
        print_section("Sample Courses (first 10):")
        sample_courses = Course.objects.all()[:10]
        for course in sample_courses:
            enrolled_count = course.get_student_count()
            print(f"  • {course.code}: {course.name}")
            print(f"    Department: {course.department}")
            print(f"    Credits: {course.credits}")
            print(f"    Enrolled: {enrolled_count}/{course.enrollment_limit}")
    else:
        print("\n⚠️  WARNING: No courses found in database!")

def audit_enrollments():
    """Audit enrollments"""
    print_header("ENROLLMENTS AUDIT")
    
    total_enrollments = Enrollment.objects.count()
    print(f"\n📝 Total Enrollments: {total_enrollments}")
    
    if total_enrollments > 0:
        # Enrollments by status
        print_section("Enrollments by Status:")
        for status_code, status_name in Enrollment.STATUS_CHOICES:
            count = Enrollment.objects.filter(status=status_code).count()
            percentage = (count / total_enrollments * 100) if total_enrollments > 0 else 0
            print(f"  • {status_name}: {count} ({percentage:.1f}%)")
        
        # Students with enrollments
        print_section("Student Enrollment Statistics:")
        students_with_enrollments = Enrollment.objects.values('student_id').distinct().count()
        total_students = Student.objects.count()
        print(f"  Students with Enrollments: {students_with_enrollments} / {total_students}")
        
        if total_students > 0:
            percentage = (students_with_enrollments / total_students * 100)
            print(f"  Enrollment Coverage: {percentage:.1f}%")
            
            if percentage < 50:
                print(f"\n  ⚠️  WARNING: Less than 50% of students have enrollments!")
        
        # Average enrollments per student
        if students_with_enrollments > 0:
            avg_enrollments = total_enrollments / students_with_enrollments
            print(f"  Average Enrollments per Student: {avg_enrollments:.2f}")
        
        # Sample enrollments
        print_section("Sample Enrollments (first 10):")
        sample_enrollments = Enrollment.objects.all()[:10]
        for enrollment in sample_enrollments:
            try:
                course = Course.objects.get(id=enrollment.course_id)
                course_name = f"{course.code} - {course.name}"
            except Course.DoesNotExist:
                course_name = f"Course {enrollment.course_id} (Not Found)"
            
            print(f"  • Student {enrollment.student_id}: {course_name}")
            print(f"    Status: {enrollment.status}, Grade: {enrollment.grade or 'N/A'}")
    else:
        print("\n❌ CRITICAL: No enrollments found in database!")
        print("   Students will see 'no course enrolled' message")

def audit_assignments():
    """Audit assignments"""
    print_header("ASSIGNMENTS AUDIT")
    
    total_assignments = Assignment.objects.count()
    print(f"\n📋 Total Assignments: {total_assignments}")
    
    if total_assignments > 0:
        # Assignments by type
        print_section("Assignments by Type:")
        for type_code, type_name in Assignment.TYPE_CHOICES:
            count = Assignment.objects.filter(type=type_code).count()
            print(f"  • {type_name}: {count}")
        
        # Assignments by course
        print_section("Assignments per Course:")
        courses_with_assignments = Assignment.objects.values('course_id').distinct().count()
        total_courses = Course.objects.count()
        print(f"  Courses with Assignments: {courses_with_assignments} / {total_courses}")
        
        if courses_with_assignments > 0:
            avg_assignments = total_assignments / courses_with_assignments
            print(f"  Average Assignments per Course: {avg_assignments:.2f}")
        
        # Sample assignments
        print_section("Sample Assignments (first 5):")
        sample_assignments = Assignment.objects.all()[:5]
        for assignment in sample_assignments:
            try:
                course = Course.objects.get(id=assignment.course_id)
                course_name = f"{course.code}"
            except Course.DoesNotExist:
                course_name = f"Course {assignment.course_id}"
            
            print(f"  • {assignment.title} ({course_name})")
            print(f"    Type: {assignment.type}, Points: {assignment.points}")
            print(f"    Due: {assignment.due_date.strftime('%Y-%m-%d')}")
    else:
        print("\n⚠️  WARNING: No assignments found in database!")
        print("   Assignment page will show no data")

def audit_submissions():
    """Audit submissions"""
    print_header("SUBMISSIONS AUDIT")
    
    total_submissions = Submission.objects.count()
    print(f"\n✍️  Total Submissions: {total_submissions}")
    
    if total_submissions > 0:
        # Submissions with grades
        graded_submissions = Submission.objects.exclude(grade__isnull=True).count()
        print_section("Submission Statistics:")
        print(f"  Graded Submissions: {graded_submissions}")
        print(f"  Pending Grading: {total_submissions - graded_submissions}")
        
        if total_submissions > 0:
            graded_percentage = (graded_submissions / total_submissions * 100)
            print(f"  Grading Completion: {graded_percentage:.1f}%")
        
        # Late submissions
        late_submissions = Submission.objects.filter(late_submission=True).count()
        if total_submissions > 0:
            late_percentage = (late_submissions / total_submissions * 100)
            print(f"  Late Submissions: {late_submissions} ({late_percentage:.1f}%)")
    else:
        print("\n⚠️  WARNING: No submissions found in database!")

def audit_grades():
    """Audit grades"""
    print_header("GRADES AUDIT")
    
    total_grades = Grade.objects.count()
    print(f"\n📊 Total Grades: {total_grades}")
    
    if total_grades > 0:
        # Grades by letter grade
        print_section("Grade Distribution:")
        letter_grades = ['A', 'B', 'C', 'D', 'F']
        for letter in letter_grades:
            count = Grade.objects.filter(letter_grade=letter).count()
            if total_grades > 0:
                percentage = (count / total_grades * 100)
                print(f"  • {letter}: {count} ({percentage:.1f}%)")
        
        # Grades without letter grade
        no_letter = Grade.objects.filter(letter_grade='').count()
        if no_letter > 0:
            print(f"  • No Letter Grade: {no_letter}")
        
        # Students with grades
        print_section("Student Grade Statistics:")
        students_with_grades = Grade.objects.values('student_id').distinct().count()
        total_students = Student.objects.count()
        print(f"  Students with Grades: {students_with_grades} / {total_students}")
        
        if total_students > 0:
            percentage = (students_with_grades / total_students * 100)
            print(f"  Grade Coverage: {percentage:.1f}%")
    else:
        print("\n❌ CRITICAL: No grades found in database!")
        print("   Grade page will show errors or no data")

def identify_missing_data():
    """Identify what data is missing"""
    print_header("MISSING DATA IDENTIFICATION")
    
    missing_items = []
    
    # Check for students without enrollments
    students_without_enrollments = Student.objects.exclude(
        student_id__in=Enrollment.objects.values_list('student_id', flat=True)
    ).count()
    total_students = Student.objects.count()
    
    if students_without_enrollments > 0:
        missing_items.append({
            'category': 'Enrollments',
            'issue': f'{students_without_enrollments} students have no enrollments',
            'impact': 'HIGH - Students will see "no course enrolled" message',
            'action': 'Create enrollment data for all students'
        })
    
    # Check for courses without enrollments
    total_courses = Course.objects.count()
    courses_with_enrollments = Enrollment.objects.values('course_id').distinct().count()
    courses_without_enrollments = total_courses - courses_with_enrollments
    
    if courses_without_enrollments > 0:
        missing_items.append({
            'category': 'Enrollments',
            'issue': f'{courses_without_enrollments} courses have no enrolled students',
            'impact': 'MEDIUM - Some courses appear empty',
            'action': 'Distribute student enrollments across courses'
        })
    
    # Check for assignments
    total_assignments = Assignment.objects.count()
    if total_assignments == 0:
        missing_items.append({
            'category': 'Assignments',
            'issue': 'No assignments in database',
            'impact': 'HIGH - Assignment page will be empty',
            'action': 'Create assignments for each course (5-10 per course)'
        })
    
    # Check for grades
    total_grades = Grade.objects.count()
    if total_grades == 0:
        missing_items.append({
            'category': 'Grades',
            'issue': 'No grades in database',
            'impact': 'HIGH - Grade page will show errors',
            'action': 'Create grade records for assignments and enrollments'
        })
    
    # Check for submissions
    total_submissions = Submission.objects.count()
    if total_submissions == 0:
        missing_items.append({
            'category': 'Submissions',
            'issue': 'No submissions in database',
            'impact': 'MEDIUM - Cannot track assignment completion',
            'action': 'Create submissions for enrolled students'
        })
    
    # Print findings
    if missing_items:
        print("\n❌ MISSING DATA IDENTIFIED:")
        print(f"\n  Found {len(missing_items)} critical data gaps:\n")
        
        for i, item in enumerate(missing_items, 1):
            print(f"  {i}. {item['category']}")
            print(f"     Issue: {item['issue']}")
            print(f"     Impact: {item['impact']}")
            print(f"     Action Required: {item['action']}")
            print()
    else:
        print("\n✅ No critical data gaps identified!")

def generate_recommendations():
    """Generate recommendations based on audit"""
    print_header("RECOMMENDATIONS FOR PHASE 2")
    
    print("\n📋 Required Demo Data Scripts:\n")
    
    recommendations = [
        {
            'script': 'generate_enrollment_data.py',
            'priority': 'CRITICAL',
            'reason': 'Students need enrollments to see courses',
            'data': [
                'Create 4-6 enrollments per student',
                'Mix of active (60%), completed (30%), dropped (10%)',
                'Match to student degree program/department',
                'Distribute across different course levels'
            ]
        },
        {
            'script': 'generate_assignment_data.py (enhance)',
            'priority': 'HIGH',
            'reason': 'Assignments needed for student tracking',
            'data': [
                'Create 5-10 assignments per course',
                'Mix of types: homework, quiz, midterm, final',
                'Set realistic due dates (past, current, future)',
                'Assign proper weights for grade calculation'
            ]
        },
        {
            'script': 'generate_grade_data.py',
            'priority': 'CRITICAL',
            'reason': 'Grade page requires grade records',
            'data': [
                'Create grades for all assignments',
                'Match grades to enrolled students only',
                'Calculate realistic grade distribution',
                'Set letter grades based on percentage'
            ]
        },
        {
            'script': 'generate_degree_progress_data.py',
            'priority': 'HIGH',
            'reason': 'Degree planning needs completion tracking',
            'data': [
                'Define degree requirements by program',
                'Track course completion status',
                'Calculate credits by category',
                'Generate graduation projections'
            ]
        }
    ]
    
    for i, rec in enumerate(recommendations, 1):
        print(f"  {i}. {rec['script']}")
        print(f"     Priority: {rec['priority']}")
        print(f"     Reason: {rec['reason']}")
        print(f"     Data to Generate:")
        for data_item in rec['data']:
            print(f"       • {data_item}")
        print()

def main():
    """Main audit function"""
    print("\n" + "="*80)
    print("  DIGITAL CAMPUS - DATABASE STATE AUDIT")
    print("  Phase 1: Analysis & Data Audit")
    print("  Date: " + datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    print("="*80)
    
    try:
        # Run all audits
        audit_users()
        audit_courses()
        audit_enrollments()
        audit_assignments()
        audit_submissions()
        audit_grades()
        identify_missing_data()
        generate_recommendations()
        
        # Summary
        print_header("AUDIT SUMMARY")
        print("\n✅ Database audit completed successfully!")
        print("\n📝 Next Steps:")
        print("  1. Review the findings above")
        print("  2. Proceed to Phase 2: Create demo data generation scripts")
        print("  3. Focus on CRITICAL priority items first")
        print("  4. Run generate_all_data.py after creating scripts")
        print("\n" + "="*80 + "\n")
        
    except Exception as e:
        print(f"\n❌ Error during audit: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == '__main__':
    main()
