from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .course_views import get_authenticated_student
from courses.models import Enrollment
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