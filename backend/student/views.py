from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .course_views import get_authenticated_student
from courses.models import Enrollment, Course
from assignments.models import Grade
from django.db.models import Sum
from django.utils import timezone


@csrf_exempt
def student_dashboard(request):
    """Get student dashboard data"""
    if request.method == 'GET':
        # Authenticate student
        student, error = get_authenticated_student(request)
        if not student:
            return JsonResponse({'success': False, 'message': error}, status=401)
        
        try:
            # Get student's current enrollments
            current_enrollments = Enrollment.objects.filter(
                student_id=student.student_id,
                status='active'
            )
            
            # Calculate dashboard metrics
            completed_courses = Enrollment.objects.filter(
                student_id=student.student_id,
                status='completed'
            ).count()
            
            # Calculate current credits
            current_credits = 0
            for enrollment in current_enrollments:
                try:
                    from courses.models import Course
                    course = Course.objects.get(id=enrollment.course_id)
                    current_credits += course.credits
                except Course.DoesNotExist:
                    pass
            
            # Get CGPA from student model
            cgpa = float(student.cumulative_gpa) if student.cumulative_gpa else 0.0
            
            # Estimate remaining courses (simplified calculation)
            total_degree_credits = 120  # Assuming a 120-credit degree
            remaining_credits = max(0, total_degree_credits - (completed_courses * 3))  # Simplified
            remaining_courses = remaining_credits // 3
            
            # Predicted graduation (simplified)
            semesters_remaining = remaining_credits / 12  # Assuming 12 credits per semester
            predicted_graduation = f"{int(semesters_remaining)} semesters"
            
            # Attendance rate (placeholder - would come from attendance system)
            attendance_rate = 85  # Placeholder value
            
            dashboard_data = {
                'cgpa': cgpa,
                'completedCourses': completed_courses,
                'remainingCourses': remaining_courses,
                'predictedGraduation': predicted_graduation,
                'attendanceRate': attendance_rate,
                'currentCredits': current_credits,
                'currentCourses': current_enrollments.count()
            }
            
            return JsonResponse(dashboard_data)
            
        except Exception as e:
            return JsonResponse({
                'success': False, 
                'message': f'Failed to fetch dashboard data: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def student_grades(request):
    """Get student grades for all courses"""
    if request.method == 'GET':
        # Authenticate student
        student, error = get_authenticated_student(request)
        if not student:
            return JsonResponse({'success': False, 'message': error}, status=401)
        
        try:
            # Get student's completed enrollments
            completed_enrollments = Enrollment.objects.filter(
                student_id=student.student_id,
                status='completed'
            )
            
            # Get student's active enrollments
            active_enrollments = Enrollment.objects.filter(
                student_id=student.student_id,
                status='active'
            )
            
            # Combine all enrollments
            all_enrollments = list(completed_enrollments) + list(active_enrollments)
            
            course_grades = []
            
            for enrollment in all_enrollments:
                try:
                    # Get course details
                    course = Course.objects.get(id=enrollment.course_id)
                    
                    # Get grades for this course
                    grades = Grade.objects.filter(
                        student_id=student.student_id,
                        course_id=course.id
                    )
                    
                    # Calculate overall grade for this course
                    total_points = 0
                    earned_points = 0
                    grade_count = 0
                    
                    for grade in grades:
                        if grade.value is not None and grade.max_points is not None:
                            total_points += float(str(grade.max_points))
                            earned_points += float(str(grade.value))
                            grade_count += 1
                    
                    if total_points > 0:
                        percentage = (earned_points / total_points) * 100
                        # Calculate letter grade
                        if percentage >= 90:
                            letter_grade = 'A'
                        elif percentage >= 80:
                            letter_grade = 'B'
                        elif percentage >= 70:
                            letter_grade = 'C'
                        elif percentage >= 60:
                            letter_grade = 'D'
                        else:
                            letter_grade = 'F'
                    else:
                        percentage = 0
                        letter_grade = 'N/A'
                    
                    course_grades.append({
                        'course': f"{course.code}",
                        'grade': letter_grade,
                        'points': course.credits,
                        'percentage': round(percentage, 2)
                    })
                except Course.DoesNotExist:
                    # Skip courses that don't exist
                    pass
            
            return JsonResponse(course_grades, safe=False)
            
        except Exception as e:
            return JsonResponse({
                'success': False, 
                'message': f'Failed to fetch grades: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def student_grade_stats(request):
    """Get student grade statistics"""
    if request.method == 'GET':
        # Authenticate student
        student, error = get_authenticated_student(request)
        if not student:
            return JsonResponse({'success': False, 'message': error}, status=401)
        
        try:
            # Get CGPA from student model
            cgpa = float(student.cumulative_gpa) if student.cumulative_gpa else 0.0
            
            # Calculate semester GPA (simplified)
            # Get current semester enrollments
            current_enrollments = Enrollment.objects.filter(
                student_id=student.student_id,
                status='active'
            )
            
            total_points = 0
            earned_points = 0
            
            for enrollment in current_enrollments:
                try:
                    # Get course details
                    course = Course.objects.get(id=enrollment.course_id)
                    
                    # Get grades for this course
                    grades = Grade.objects.filter(
                        student_id=student.student_id,
                        course_id=course.id
                    )
                    
                    # Calculate grade points for this course
                    course_total = 0
                    course_earned = 0
                    
                    for grade in grades:
                        if grade.value is not None and grade.max_points is not None:
                            course_total += float(str(grade.max_points))
                            course_earned += float(str(grade.value))
                    
                    if course_total > 0:
                        # Calculate grade point (4.0 scale)
                        percentage = (course_earned / course_total) * 100
                        if percentage >= 90:
                            grade_point = 4.0
                        elif percentage >= 80:
                            grade_point = 3.0
                        elif percentage >= 70:
                            grade_point = 2.0
                        elif percentage >= 60:
                            grade_point = 1.0
                        else:
                            grade_point = 0.0
                        
                        earned_points += grade_point * course.credits
                        total_points += course.credits
                except Course.DoesNotExist:
                    pass
            
            # Calculate semester GPA
            semester_gpa = earned_points / total_points if total_points > 0 else 0.0
            
            stats_data = {
                'cgpa': cgpa,
                'semesterGpa': round(semester_gpa, 2)
            }
            
            return JsonResponse(stats_data)
            
        except Exception as e:
            return JsonResponse({
                'success': False, 
                'message': f'Failed to fetch grade stats: {str(e)}'
            }, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)