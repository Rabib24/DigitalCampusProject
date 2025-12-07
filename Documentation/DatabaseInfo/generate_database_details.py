#!/usr/bin/env python3
"""
Script to analyze the current database information and generate a comprehensive report
in a file named 'DatabaseDetails.txt' as specified in requiredInfo.txt.
"""

import os
import sys
import django
from django.conf import settings
from django.db import models

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Import models after Django setup
from users.models import User, Student, Faculty, Admin, Staff
from courses.models import Course, Enrollment
from assignments.models import Assignment, Submission, Grade
from research.models import ResearchProject
from finance.models import Payment, FinancialAid
from library.models import LibraryBook
from permissions.models import Permission, UserPermission, RolePermission
from appointments.models import Appointment

def get_faculty_details():
    """Get detailed information for each faculty member"""
    faculty_details = []
    
    for faculty in Faculty.objects.select_related('user').all():
        # Get courses assigned to this faculty
        courses = Course.objects.filter(instructor_id=faculty.employee_id)
        course_list = [f"{course.code}: {course.name}" for course in courses]
        
        # Get number of students enrolled in their courses
        total_students = 0
        for course in courses:
            total_students += course.get_student_count()
        
        # Get research projects led by this faculty
        research_projects = ResearchProject.objects.filter(owner_id=faculty.user.id)
        research_list = [project.title for project in research_projects]
        
        # Get permissions for this faculty
        permissions = faculty.user.get_permissions()
        permission_list = [perm.name for perm in permissions]
        
        faculty_info = {
            'employee_id': faculty.employee_id,
            'name': f"{faculty.user.first_name} {faculty.user.last_name}",
            'department': faculty.department,
            'courses_assigned': course_list,
            'number_of_courses': len(course_list),
            'students_enrolled': total_students,
            'research_projects': research_list,
            'permissions': permission_list
        }
        faculty_details.append(faculty_info)
    
    return faculty_details

def get_course_details():
    """Get detailed information for each course"""
    course_details = []
    
    for course in Course.objects.all():
        # Get assignments for this course
        assignments = Assignment.objects.filter(course_id=course.id)
        assignment_list = []
        for assignment in assignments:
            assignment_list.append({
                'title': assignment.title,
                'type': assignment.type,
                'due_date': str(assignment.due_date) if assignment.due_date else 'N/A'
            })
        
        # Get faculty teaching this course
        try:
            faculty = Faculty.objects.get(employee_id=course.instructor_id)
            faculty_name = f"{faculty.user.first_name} {faculty.user.last_name}"
        except Faculty.DoesNotExist:
            faculty_name = "Unknown"
        
        course_info = {
            'id': course.id,
            'code': course.code,
            'name': course.name,
            'students_enrolled': course.get_student_count(),
            'assignments': assignment_list,
            'faculty': faculty_name,
            'department': course.department,
            'syllabus': course.syllabus
        }
        course_details.append(course_info)
    
    return course_details

def get_assignment_details():
    """Get detailed information for each assignment"""
    assignment_details = []
    
    for assignment in Assignment.objects.all():
        # Get submissions for this assignment
        submissions = Submission.objects.filter(assignment_id=assignment.id)
        submission_list = []
        for submission in submissions:
            submission_list.append({
                'student_id': submission.student_id,
                'submitted_at': str(submission.submitted_at) if submission.submitted_at else 'N/A',
                'grade': str(submission.grade) if submission.grade else 'Not graded'
            })
        
        # Get course name
        try:
            course = Course.objects.get(id=assignment.course_id)
            course_name = f"{course.code}: {course.name}"
        except Course.DoesNotExist:
            course_name = "Unknown"
        
        assignment_info = {
            'id': assignment.id,
            'title': assignment.title,
            'course': course_name,
            'submissions': submission_list,
            'type': assignment.type,
            'weight': str(assignment.weight) if assignment.weight else 'N/A'
        }
        assignment_details.append(assignment_info)
    
    return assignment_details

def get_student_details():
    """Get detailed information for each student"""
    student_details = []
    
    for student in Student.objects.select_related('user').all():
        # Get courses this student is enrolled in
        enrollments = Enrollment.objects.filter(student_id=student.student_id)
        course_list = []
        for enrollment in enrollments:
            try:
                course = Course.objects.get(id=enrollment.course_id)
                course_list.append(f"{course.code}: {course.name}")
            except Course.DoesNotExist:
                course_list.append(f"Unknown course ({enrollment.course_id})")
        
        # Get financial information
        payments = Payment.objects.filter(user_id=student.user.id)
        financial_aids = FinancialAid.objects.filter(student_id=student.student_id)
        
        # Get library information
        borrowed_books = LibraryBook.objects.filter(borrower_id=student.user.id)
        book_list = [book.title for book in borrowed_books]
        
        # Get appointment history
        appointments = Appointment.objects.filter(student_id=student.user.id)
        appointment_list = []
        for appointment in appointments:
            try:
                faculty = Faculty.objects.get(user_id=appointment.faculty_id)
                faculty_name = f"{faculty.user.first_name} {faculty.user.last_name}"
            except Faculty.DoesNotExist:
                faculty_name = "Unknown"
            
            appointment_list.append({
                'title': appointment.title,
                'faculty': faculty_name,
                'date': str(appointment.start_datetime) if appointment.start_datetime else 'N/A',
                'status': appointment.status
            })
        
        student_info = {
            'student_id': student.student_id,
            'name': f"{student.user.first_name} {student.user.last_name}",
            'courses_enrolled': len(course_list),
            'courses': course_list,
            'current_gpa': str(student.cumulative_gpa) if student.cumulative_gpa else 'N/A',
            'library_books': book_list,
            'outstanding_balance': str(student.library_fines) if student.library_fines else '0',
            'appointments': appointment_list,
            'degree_program': student.degree_program
        }
        student_details.append(student_info)
    
    return student_details

def get_department_admin_details():
    """Get information for Department Admin users"""
    dept_admin_details = []
    
    # Get admins (assuming department admins are a subset)
    admins = Admin.objects.select_related('user').all()
    
    for admin in admins:
        # Get department information
        dept_courses = Course.objects.filter(department=admin.department)
        dept_faculty = Faculty.objects.filter(department=admin.department)
        
        dept_info = {
            'employee_id': admin.employee_id,
            'name': f"{admin.user.first_name} {admin.user.last_name}",
            'department': admin.department,
            'faculty_count': dept_faculty.count(),
            'course_count': dept_courses.count()
        }
        dept_admin_details.append(dept_info)
    
    return dept_admin_details

def get_finance_admin_details():
    """Get information for Finance Admin users"""
    finance_details = []
    
    # Get all payments and financial aids
    payments = Payment.objects.all()
    financial_aids = FinancialAid.objects.all()
    
    total_payments = sum(float(str(payment.amount)) for payment in payments if payment.amount)
    total_financial_aid = sum(float(str(aid.amount)) for aid in financial_aids if aid.amount)
    
    finance_info = {
        'total_payments': len(payments),
        'total_payment_amount': total_payments,
        'total_financial_aids': len(financial_aids),
        'total_financial_aid_amount': total_financial_aid,
        'students_with_aid': financial_aids.values('student_id').distinct().count()
    }
    finance_details.append(finance_info)
    
    return finance_details

def get_library_staff_details():
    """Get information for Library Staff users"""
    library_details = []
    
    # Get all books and their status
    books = LibraryBook.objects.all()
    available_books = books.filter(status='available')
    checked_out_books = books.filter(status='checkedout')
    overdue_books = books.filter(status='overdue')
    
    library_info = {
        'total_books': books.count(),
        'available_books': available_books.count(),
        'checked_out_books': checked_out_books.count(),
        'overdue_books': overdue_books.count()
    }
    library_details.append(library_info)
    
    return library_details

def get_it_admin_details():
    """Get information for IT Admin users"""
    it_details = []
    
    # Get all users and their roles
    users = User.objects.all()
    user_roles = {}
    for user in users:
        role = user.role
        if role in user_roles:
            user_roles[role] += 1
        else:
            user_roles[role] = 1
    
    it_info = {
        'total_users': users.count(),
        'user_roles_distribution': user_roles
    }
    it_details.append(it_info)
    
    return it_details

def get_research_admin_details():
    """Get information for Research Admin users"""
    research_details = []
    
    # Get all research projects
    projects = ResearchProject.objects.all()
    approved_projects = projects.filter(status='approved')
    in_progress_projects = projects.filter(status='in-progress')
    completed_projects = projects.filter(status='completed')
    
    total_budget = sum(float(str(project.budget)) for project in projects if project.budget)
    
    research_info = {
        'total_projects': projects.count(),
        'approved_projects': approved_projects.count(),
        'in_progress_projects': in_progress_projects.count(),
        'completed_projects': completed_projects.count(),
        'total_budget': total_budget
    }
    research_details.append(research_info)
    
    return research_details

def generate_database_report():
    """Generate the comprehensive database details report"""
    
    # Get all required information
    faculty_details = get_faculty_details()
    course_details = get_course_details()
    assignment_details = get_assignment_details()
    student_details = get_student_details()
    dept_admin_details = get_department_admin_details()
    finance_details = get_finance_admin_details()
    library_details = get_library_staff_details()
    it_details = get_it_admin_details()
    research_details = get_research_admin_details()
    
    # Write to DatabaseDetails.txt
    output_file = os.path.join(os.path.dirname(__file__), 'DatabaseDetails.txt')
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("=" * 80 + "\n")
        f.write("DIGITAL CAMPUS DATABASE DETAILS REPORT\n")
        f.write("=" * 80 + "\n\n")
        
        # 1. Faculty Member Details
        f.write("1. FACULTY MEMBER DETAILS\n")
        f.write("-" * 40 + "\n")
        for faculty in faculty_details:
            f.write(f"Employee ID: {faculty['employee_id']}\n")
            f.write(f"Name: {faculty['name']}\n")
            f.write(f"Department: {faculty['department']}\n")
            f.write(f"Courses Assigned ({faculty['number_of_courses']}):\n")
            for course in faculty['courses_assigned']:
                f.write(f"  - {course}\n")
            f.write(f"Total Students Enrolled: {faculty['students_enrolled']}\n")
            f.write(f"Research Projects ({len(faculty['research_projects'])}):\n")
            for project in faculty['research_projects']:
                f.write(f"  - {project}\n")
            f.write(f"Permissions ({len(faculty['permissions'])}):\n")
            for perm in faculty['permissions']:
                f.write(f"  - {perm}\n")
            f.write("\n")
        
        # 2. Course Details
        f.write("2. COURSE DETAILS\n")
        f.write("-" * 40 + "\n")
        for course in course_details:
            f.write(f"Course ID: {course['id']}\n")
            f.write(f"Code: {course['code']}\n")
            f.write(f"Name: {course['name']}\n")
            f.write(f"Department: {course['department']}\n")
            f.write(f"Faculty: {course['faculty']}\n")
            f.write(f"Students Enrolled: {course['students_enrolled']}\n")
            f.write(f"Syllabus: {course['syllabus']}\n")
            f.write(f"Assignments ({len(course['assignments'])}):\n")
            for assignment in course['assignments']:
                f.write(f"  - {assignment['title']} ({assignment['type']}) - Due: {assignment['due_date']}\n")
            f.write("\n")
        
        # 3. Assignment Details
        f.write("3. ASSIGNMENT DETAILS\n")
        f.write("-" * 40 + "\n")
        for assignment in assignment_details:
            f.write(f"Assignment ID: {assignment['id']}\n")
            f.write(f"Title: {assignment['title']}\n")
            f.write(f"Course: {assignment['course']}\n")
            f.write(f"Type: {assignment['type']}\n")
            f.write(f"Weight in Course Grade: {assignment['weight']}\n")
            f.write(f"Submissions ({len(assignment['submissions'])}):\n")
            for submission in assignment['submissions']:
                f.write(f"  - Student {submission['student_id']} submitted at {submission['submitted_at']} - Grade: {submission['grade']}\n")
            f.write("\n")
        
        # 4. Student Details
        f.write("4. STUDENT DETAILS\n")
        f.write("-" * 40 + "\n")
        for student in student_details:
            f.write(f"Student ID: {student['student_id']}\n")
            f.write(f"Name: {student['name']}\n")
            f.write(f"Degree Program: {student['degree_program']}\n")
            f.write(f"Courses Enrolled ({student['courses_enrolled']}):\n")
            for course in student['courses']:
                f.write(f"  - {course}\n")
            f.write(f"Current GPA: {student['current_gpa']}\n")
            f.write(f"Outstanding Library Balance: {student['outstanding_balance']}\n")
            f.write(f"Currently Borrowed Books ({len(student['library_books'])}):\n")
            for book in student['library_books']:
                f.write(f"  - {book}\n")
            f.write(f"Appointments ({len(student['appointments'])}):\n")
            for appointment in student['appointments']:
                f.write(f"  - {appointment['title']} with {appointment['faculty']} on {appointment['date']} (Status: {appointment['status']})\n")
            f.write("\n")
        
        # 5. Department Admin Details
        f.write("5. DEPARTMENT ADMIN DETAILS\n")
        f.write("-" * 40 + "\n")
        for admin in dept_admin_details:
            f.write(f"Employee ID: {admin['employee_id']}\n")
            f.write(f"Name: {admin['name']}\n")
            f.write(f"Department: {admin['department']}\n")
            f.write(f"Faculty Members: {admin['faculty_count']}\n")
            f.write(f"Courses Offered: {admin['course_count']}\n")
            f.write("\n")
        
        # 6. Finance Admin Details
        f.write("6. FINANCE ADMIN DETAILS\n")
        f.write("-" * 40 + "\n")
        for finance in finance_details:
            f.write(f"Total Payments Processed: {finance['total_payments']}\n")
            f.write(f"Total Payment Amount: ${finance['total_payment_amount']:,.2f}\n")
            f.write(f"Total Financial Aid Records: {finance['total_financial_aids']}\n")
            f.write(f"Total Financial Aid Amount: ${finance['total_financial_aid_amount']:,.2f}\n")
            f.write(f"Students with Financial Aid: {finance['students_with_aid']}\n")
            f.write("\n")
        
        # 7. Library Staff Details
        f.write("7. LIBRARY STAFF DETAILS\n")
        f.write("-" * 40 + "\n")
        for library in library_details:
            f.write(f"Total Books in Catalog: {library['total_books']}\n")
            f.write(f"Available Books: {library['available_books']}\n")
            f.write(f"Checked Out Books: {library['checked_out_books']}\n")
            f.write(f"Overdue Books: {library['overdue_books']}\n")
            f.write("\n")
        
        # 8. IT Admin Details
        f.write("8. IT ADMIN DETAILS\n")
        f.write("-" * 40 + "\n")
        for it in it_details:
            f.write(f"Total System Users: {it['total_users']}\n")
            f.write("User Roles Distribution:\n")
            for role, count in it['user_roles_distribution'].items():
                f.write(f"  - {role.capitalize()}: {count}\n")
            f.write("\n")
        
        # 9. Research Admin Details
        f.write("9. RESEARCH ADMIN DETAILS\n")
        f.write("-" * 40 + "\n")
        for research in research_details:
            f.write(f"Total Research Projects: {research['total_projects']}\n")
            f.write(f"Approved Projects: {research['approved_projects']}\n")
            f.write(f"In-Progress Projects: {research['in_progress_projects']}\n")
            f.write(f"Completed Projects: {research['completed_projects']}\n")
            f.write(f"Total Research Budget: ${research['total_budget']:,.2f}\n")
            f.write("\n")
        
        f.write("=" * 80 + "\n")
        f.write("END OF DATABASE DETAILS REPORT\n")
        f.write("=" * 80 + "\n")
    
    print(f"Database details report generated successfully at: {output_file}")

if __name__ == "__main__":
    generate_database_report()