import os
import sys
import django
import random
from datetime import datetime, timedelta

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from courses.models import Course, Enrollment
from users.models import User, Student

def generate_enrollment_data():
    """Generate comprehensive enrollment data for all students"""
    print("="*80)
    print("  GENERATING ENROLLMENT DATA")
    print("="*80)
    
    # Get all students
    students = Student.objects.all()
    if not students.exists():
        print("\n❌ Error: No students found in database!")
        print("   Please run generate_user_data.py first")
        return
    
    total_students = students.count()
    print(f"\n📊 Found {total_students} students")
    
    # Get all courses
    courses = Course.objects.all()
    if not courses.exists():
        print("\n❌ Error: No courses found in database!")
        print("   Please run generate_course_data.py first")
        return
    
    total_courses = courses.count()
    print(f"📚 Found {total_courses} courses")
    
    # Group courses by department
    courses_by_dept = {}
    for course in courses:
        dept = course.department
        if dept not in courses_by_dept:
            courses_by_dept[dept] = []
        courses_by_dept[dept].append(course)
    
    print(f"\n📂 Courses grouped into {len(courses_by_dept)} departments")
    
    # Define enrollment distribution
    STATUS_DISTRIBUTION = {
        'active': 0.60,      # 60% active enrollments
        'completed': 0.30,   # 30% completed
        'dropped': 0.10      # 10% dropped
    }
    
    # Define course level distribution by student year (based on student_id pattern)
    COURSE_LEVELS = {
        'freshman': ['100'],    # 100-level courses
        'sophomore': ['100', '200'],  # 100-200 level
        'junior': ['200', '300'],     # 200-300 level
        'senior': ['300', '400']      # 300-400 level
    }
    
    # Grade distribution for completed courses
    GRADE_DISTRIBUTION = ['A', 'A', 'A', 'B', 'B', 'B', 'B', 'C', 'C', 'C', 'D', 'F']
    
    enrollment_counter = 1
    total_enrollments = 0
    students_processed = 0
    
    print("\n🔄 Starting enrollment generation...\n")
    
    for student in students:
        students_processed += 1
        student_dept = student.degree_program or 'General Studies'
        
        # Determine student year based on student_id or random
        student_year = random.choice(['freshman', 'sophomore', 'junior', 'senior'])
        
        # Determine number of enrollments (4-6 per student)
        num_enrollments = random.randint(4, 6)
        
        # Get courses from student's department (80%) and other departments (20%)
        available_courses = []
        
        # Add courses from student's department
        if student_dept in courses_by_dept:
            dept_courses = courses_by_dept[student_dept]
            available_courses.extend(dept_courses)
        
        # Add some courses from other departments (electives)
        other_depts = [dept for dept in courses_by_dept.keys() if dept != student_dept]
        if other_depts:
            for other_dept in random.sample(other_depts, min(2, len(other_depts))):
                available_courses.extend(courses_by_dept[other_dept][:3])
        
        # If student department not found or no courses, use all courses
        if not available_courses:
            available_courses = list(courses)
        
        # Filter courses by appropriate level for student year
        level_courses = []
        for course in available_courses:
            # Extract course level from code (e.g., CSE101 -> 100-level)
            course_code = course.code
            # Find first digit in course code
            for i, char in enumerate(course_code):
                if char.isdigit():
                    level = char + '00'
                    if level in COURSE_LEVELS[student_year]:
                        level_courses.append(course)
                    break
        
        # If no level-appropriate courses, use any available
        if not level_courses:
            level_courses = available_courses
        
        # Select random courses for this student
        selected_courses = random.sample(
            level_courses,
            min(num_enrollments, len(level_courses))
        )
        
        # Check for existing enrollments to avoid duplicates
        existing_enrollment_ids = set(
            Enrollment.objects.filter(student_id=student.student_id)
            .values_list('course_id', flat=True)
        )
        
        # Filter out already enrolled courses
        selected_courses = [c for c in selected_courses if c.id not in existing_enrollment_ids]
        
        if not selected_courses:
            print(f"  ⚠️  Student {student.student_id} already has enrollments, skipping...")
            continue
        
        # Create enrollments with distributed status
        for i, course in enumerate(selected_courses):
            # Determine status based on distribution
            rand = random.random()
            if rand < STATUS_DISTRIBUTION['active']:
                status = 'active'
                grade = ''
                enrollment_date = datetime.now() - timedelta(days=random.randint(30, 90))
            elif rand < (STATUS_DISTRIBUTION['active'] + STATUS_DISTRIBUTION['completed']):
                status = 'completed'
                grade = random.choice(GRADE_DISTRIBUTION)
                # Completed courses are from previous semesters
                enrollment_date = datetime.now() - timedelta(days=random.randint(180, 540))
            else:
                status = 'dropped'
                grade = ''
                enrollment_date = datetime.now() - timedelta(days=random.randint(60, 150))
            
            # Create enrollment with unique ID
            enrollment_id = f'ENROLL{enrollment_counter:06d}'
            
            try:
                enrollment = Enrollment.objects.create(
                    id=enrollment_id,
                    student_id=student.student_id,
                    course_id=course.id,
                    status=status,
                    grade=grade,
                    enrollment_date=enrollment_date
                )
                
                # Add student to course's student list if active
                if status == 'active':
                    course.add_student(student.user.id)
                
                enrollment_counter += 1
                total_enrollments += 1
                
            except Exception as e:
                print(f"  ❌ Error creating enrollment: {e}")
                enrollment_counter += 1
                continue
        
        # Progress indicator
        if students_processed % 10 == 0:
            print(f"  ✓ Processed {students_processed}/{total_students} students ({total_enrollments} enrollments)")
    
    print(f"\n{'='*80}")
    print(f"  ENROLLMENT GENERATION COMPLETE")
    print(f"{'='*80}")
    print(f"\n📊 Summary:")
    print(f"  • Total Students Processed: {students_processed}")
    print(f"  • Total Enrollments Created: {total_enrollments}")
    print(f"  • Average per Student: {total_enrollments/students_processed:.2f}")
    
    # Show status distribution
    print(f"\n📈 Status Distribution:")
    for status in ['active', 'completed', 'dropped']:
        count = Enrollment.objects.filter(status=status).count()
        percentage = (count / total_enrollments * 100) if total_enrollments > 0 else 0
        print(f"  • {status.capitalize()}: {count} ({percentage:.1f}%)")
    
    # Show department coverage
    print(f"\n🎓 Department Coverage:")
    for dept in courses_by_dept.keys():
        dept_enrollments = Enrollment.objects.filter(
            course_id__in=[c.id for c in courses_by_dept[dept]]
        ).count()
        print(f"  • {dept}: {dept_enrollments} enrollments")
    
    print(f"\n✅ Enrollment data generation completed successfully!")
    print(f"   Students can now see their enrolled courses in the dashboard.\n")

if __name__ == '__main__':
    generate_enrollment_data()
