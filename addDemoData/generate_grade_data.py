import os
import sys
import django
import random
from datetime import datetime, timedelta
from decimal import Decimal

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from courses.models import Course, Enrollment
from assignments.models import Assignment, Submission, Grade
from users.models import Student

def calculate_letter_grade(percentage):
    """Calculate letter grade from percentage"""
    if percentage >= 90:
        return 'A'
    elif percentage >= 80:
        return 'B'
    elif percentage >= 70:
        return 'C'
    elif percentage >= 60:
        return 'D'
    else:
        return 'F'

def calculate_gpa_points(letter_grade):
    """Convert letter grade to GPA points"""
    grade_points = {
        'A': 4.0,
        'B': 3.0,
        'C': 2.0,
        'D': 1.0,
        'F': 0.0
    }
    return grade_points.get(letter_grade, 0.0)

def generate_grade_data():
    """Generate comprehensive grade data for enrolled students"""
    print("="*80)
    print("  GENERATING GRADE DATA")
    print("="*80)
    
    # Get all assignments
    assignments = Assignment.objects.all()
    if not assignments.exists():
        print("\n❌ Error: No assignments found in database!")
        print("   Please run generate_assignment_data.py first")
        return
    
    total_assignments = assignments.count()
    print(f"\n📋 Found {total_assignments} assignments")
    
    # Get all active and completed enrollments
    enrollments = Enrollment.objects.filter(status__in=['active', 'completed'])
    if not enrollments.exists():
        print("\n❌ Error: No enrollments found in database!")
        print("   Please run generate_enrollment_data.py first")
        return
    
    total_enrollments = enrollments.count()
    print(f"📝 Found {total_enrollments} enrollments (active + completed)")
    
    # Grade distribution configuration
    GRADE_DISTRIBUTION = {
        'A': 0.25,   # 25%
        'B': 0.40,   # 40%
        'C': 0.25,   # 25%
        'D': 0.07,   # 7%
        'F': 0.03    # 3%
    }
    
    grade_counter = 1
    submission_counter = 1
    total_grades = 0
    total_submissions = 0
    enrollments_processed = 0
    
    print("\n🔄 Starting grade generation...\n")
    
    # Group assignments by course
    assignments_by_course = {}
    for assignment in assignments:
        course_id = assignment.course_id
        if course_id not in assignments_by_course:
            assignments_by_course[course_id] = []
        assignments_by_course[course_id].append(assignment)
    
    print(f"📚 Assignments grouped into {len(assignments_by_course)} courses\n")
    
    # Process each enrollment
    for enrollment in enrollments:
        enrollments_processed += 1
        student_id = enrollment.student_id
        course_id = enrollment.course_id
        enrollment_status = enrollment.status
        
        # Get assignments for this course
        course_assignments = assignments_by_course.get(course_id, [])
        
        if not course_assignments:
            continue
        
        # Determine target grade for this enrollment
        if enrollment_status == 'completed' and enrollment.grade:
            # Use existing grade if already set
            target_letter = enrollment.grade
        else:
            # Generate grade based on distribution
            rand = random.random()
            cumulative = 0
            target_letter = 'C'
            for letter, prob in GRADE_DISTRIBUTION.items():
                cumulative += prob
                if rand <= cumulative:
                    target_letter = letter
                    break
        
        # Calculate target percentage for this grade
        if target_letter == 'A':
            target_percentage = random.uniform(90, 100)
        elif target_letter == 'B':
            target_percentage = random.uniform(80, 89)
        elif target_letter == 'C':
            target_percentage = random.uniform(70, 79)
        elif target_letter == 'D':
            target_percentage = random.uniform(60, 69)
        else:  # F
            target_percentage = random.uniform(0, 59)
        
        # Generate grades and submissions for each assignment
        assignment_grades = []
        
        for assignment in course_assignments:
            # For completed enrollments or past assignments, create submissions
            should_submit = True
            
            if enrollment_status == 'active':
                # For active enrollments, only submit if assignment is past due
                if assignment.due_date > datetime.now(assignment.due_date.tzinfo):
                    should_submit = False
            
            if should_submit:
                # Determine if late submission
                days_before_due = random.randint(-2, 10)
                submission_date = assignment.due_date - timedelta(days=days_before_due)
                is_late = days_before_due < 0
                
                # Calculate grade with some variance around target
                variance = random.uniform(-5, 5)
                assignment_percentage = max(0, min(100, target_percentage + variance))
                points_earned = (assignment_percentage / 100) * assignment.points
                
                # Apply late penalty if applicable
                if is_late and assignment.allow_late_submission:
                    penalty = float(assignment.late_penalty)
                    points_earned = points_earned * (1 - penalty / 100)
                    assignment_percentage = (points_earned / assignment.points) * 100
                
                # Create submission
                submission_id = f'SUBMIT{submission_counter:06d}'
                
                try:
                    submission = Submission.objects.create(
                        id=submission_id,
                        assignment_id=assignment.id,
                        student_id=student_id,
                        content=f"Submission for {assignment.title}",
                        submitted_at=submission_date,
                        grade=Decimal(str(round(points_earned, 2))),
                        feedback=f"Good work! Score: {assignment_percentage:.1f}%",
                        late_submission=is_late
                    )
                    submission_counter += 1
                    total_submissions += 1
                    
                except Exception as e:
                    print(f"  ❌ Error creating submission: {e}")
                    submission_counter += 1
                    continue
                
                # Create grade record
                grade_id = f'GRADE{grade_counter:06d}'
                
                try:
                    grade = Grade.objects.create(
                        id=grade_id,
                        student_id=student_id,
                        course_id=course_id,
                        assignment_id=assignment.id,
                        value=Decimal(str(round(points_earned, 2))),
                        max_points=Decimal(str(assignment.points)),
                        letter_grade=calculate_letter_grade(assignment_percentage),
                        weight=assignment.weight,
                        category=assignment.category or assignment.type,
                        grader_id='',
                        comments=f"Assignment grade: {assignment_percentage:.1f}%"
                    )
                    grade_counter += 1
                    total_grades += 1
                    assignment_grades.append(assignment_percentage)
                    
                except Exception as e:
                    print(f"  ❌ Error creating grade: {e}")
                    grade_counter += 1
                    continue
        
        # Calculate overall course grade if we have assignment grades
        if assignment_grades and enrollment_status == 'completed':
            overall_percentage = sum(assignment_grades) / len(assignment_grades)
            final_letter = calculate_letter_grade(overall_percentage)
            
            # Update enrollment with final grade if not set
            if not enrollment.grade:
                enrollment.grade = final_letter
                enrollment.save()
        
        # Progress indicator
        if enrollments_processed % 20 == 0:
            print(f"  ✓ Processed {enrollments_processed}/{total_enrollments} enrollments")
            print(f"    ({total_submissions} submissions, {total_grades} grades)")
    
    print(f"\n{'='*80}")
    print(f"  GRADE GENERATION COMPLETE")
    print(f"{'='*80}")
    print(f"\n📊 Summary:")
    print(f"  • Enrollments Processed: {enrollments_processed}")
    print(f"  • Total Submissions Created: {total_submissions}")
    print(f"  • Total Grades Created: {total_grades}")
    
    # Calculate and update student CGPAs
    print(f"\n🎓 Calculating Student CGPAs...")
    students_updated = 0
    
    students = Student.objects.all()
    for student in students:
        # Get all completed enrollments with grades
        completed_enrollments = Enrollment.objects.filter(
            student_id=student.student_id,
            status='completed'
        ).exclude(grade='')
        
        if completed_enrollments.exists():
            total_gpa_points = 0
            total_credits = 0
            
            for enrollment in completed_enrollments:
                try:
                    course = Course.objects.get(id=enrollment.course_id)
                    gpa_points = calculate_gpa_points(enrollment.grade)
                    total_gpa_points += gpa_points * course.credits
                    total_credits += course.credits
                except Course.DoesNotExist:
                    continue
            
            if total_credits > 0:
                cgpa = total_gpa_points / total_credits
                student.cumulative_gpa = Decimal(str(round(cgpa, 2)))
                student.save()
                students_updated += 1
    
    print(f"  • Students with Updated CGPA: {students_updated}")
    
    # Show grade distribution
    print(f"\n📈 Grade Distribution:")
    total_letter_grades = Grade.objects.exclude(letter_grade='').count()
    for letter in ['A', 'B', 'C', 'D', 'F']:
        count = Grade.objects.filter(letter_grade=letter).count()
        percentage = (count / total_letter_grades * 100) if total_letter_grades > 0 else 0
        print(f"  • {letter}: {count} ({percentage:.1f}%)")
    
    # Show submission stats
    print(f"\n✍️  Submission Statistics:")
    graded_submissions = Submission.objects.exclude(grade__isnull=True).count()
    late_submissions = Submission.objects.filter(late_submission=True).count()
    if total_submissions > 0:
        graded_pct = (graded_submissions / total_submissions * 100)
        late_pct = (late_submissions / total_submissions * 100)
        print(f"  • Graded: {graded_submissions} ({graded_pct:.1f}%)")
        print(f"  • Late Submissions: {late_submissions} ({late_pct:.1f}%)")
    
    print(f"\n✅ Grade data generation completed successfully!")
    print(f"   Students can now see their grades and CGPA in the dashboard.\n")

if __name__ == '__main__':
    generate_grade_data()
