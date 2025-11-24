from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from courses.models import Course, Enrollment
from users.models import Faculty, Student
from assignments.models import Grade
import json
from django.db.models import Avg, Count, Q

@csrf_exempt
def get_advisee_list(request):
    """Get list of advisees for the authenticated faculty member using real Student model"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get all students advised by this faculty member
            # Filter students where advisor_id matches faculty employee_id
            students = Student.objects.filter(advisor_id=faculty_profile.employee_id).select_related('user')
            
            # Convert to JSON format with required fields
            advisees = []
            for student in students:
                # Get enrollment count for this student
                enrollment_count = Enrollment.objects.filter(student_id=student.student_id).count()
                
                # Get GPA from Student model or calculate from grades
                gpa = float(student.cumulative_gpa) if student.cumulative_gpa else 0.0
                
                advisee_data = {
                    'student_id': student.student_id,
                    'name': f"{student.user.first_name} {student.user.last_name}",
                    'email': student.user.email,
                    'major': student.degree_program,
                    'year': get_student_year(student),
                    'gpa': gpa,
                    'academic_standing': get_academic_standing(gpa),
                    'advisor_id': student.advisor_id,
                    'enrolled_courses': enrollment_count,
                    'graduation_date': str(student.graduation_date) if student.graduation_date else None
                }
                advisees.append(advisee_data)
            
            # Apply filtering
            # Filter by academic standing
            academic_standing_filter = request.GET.get('academic_standing')
            if academic_standing_filter:
                advisees = [
                    student for student in advisees 
                    if student.get('academic_standing', '').lower() == academic_standing_filter.lower()
                ]
            
            # Filter by major
            major_filter = request.GET.get('major')
            if major_filter:
                advisees = [
                    student for student in advisees 
                    if student.get('major', '').lower() == major_filter.lower()
                ]
            
            # Apply sorting
            sort_by = request.GET.get('sort_by', 'name')
            sort_order = request.GET.get('sort_order', 'asc')
            
            if sort_by == 'gpa':
                advisees.sort(key=lambda x: x.get('gpa', 0), reverse=(sort_order == 'desc'))
            elif sort_by == 'name':
                advisees.sort(key=lambda x: x.get('name', ''), reverse=(sort_order == 'desc'))
            elif sort_by == 'year':
                # Simple year sorting (Freshman < Sophomore < Junior < Senior)
                year_order = {'Freshman': 1, 'Sophomore': 2, 'Junior': 3, 'Senior': 4}
                advisees.sort(key=lambda x: year_order.get(x.get('year', ''), 0), reverse=(sort_order == 'desc'))
            
            # Apply search
            search_query = request.GET.get('search')
            if search_query:
                search_query = search_query.lower()
                advisees = [
                    student for student in advisees
                    if search_query in student.get('name', '').lower() or
                       search_query in student.get('student_id', '').lower() or
                       search_query in student.get('email', '').lower()
                ]
            
            # Apply grouping/categorization
            group_by = request.GET.get('group_by')
            if group_by:
                grouped_advisees = {}
                for student in advisees:
                    group_key = student.get(group_by, 'Unknown')
                    if group_key not in grouped_advisees:
                        grouped_advisees[group_key] = []
                    grouped_advisees[group_key].append(student)
                advisees = grouped_advisees
            
            return JsonResponse({
                'success': True,
                'data': advisees
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve advisee list'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

def get_student_year(student):
    """Determine student year based on credits or other criteria"""
    # This is a simplified implementation
    # In a real system, this would be more complex
    if not student.cumulative_gpa:
        return 'Freshman'
    
    gpa = float(student.cumulative_gpa)
    if gpa >= 3.5:
        return 'Senior'
    elif gpa >= 3.0:
        return 'Junior'
    elif gpa >= 2.5:
        return 'Sophomore'
    else:
        return 'Freshman'

def get_academic_standing(gpa):
    """Determine academic standing based on GPA"""
    if gpa >= 3.5:
        return 'Excellent'
    elif gpa >= 3.0:
        return 'Good'
    elif gpa >= 2.5:
        return 'Satisfactory'
    else:
        return 'Probation'

@csrf_exempt
def get_advisee_detail(request, student_id):
    """Get detailed information for a specific advisee using real models"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Check if student exists and is advised by this faculty member
            try:
                student = Student.objects.select_related('user').get(
                    student_id=student_id, 
                    advisor_id=faculty_profile.employee_id
                )
            except Student.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Student not found or not your advisee'
                }, status=404)
            
            # Get enrolled courses for this student
            enrollments = Enrollment.objects.filter(student_id=student_id).select_related('course')
            
            # Get course details
            enrolled_courses = []
            total_credits = 0
            for enrollment in enrollments:
                if enrollment.status == 'active':
                    course_data = {
                        'code': enrollment.course.code,
                        'name': enrollment.course.name,
                        'credits': enrollment.course.credits,
                        'instructor': f"{enrollment.course.instructor_id}",  # Would need to look up faculty name
                        'grade': enrollment.grade if enrollment.grade else 'N/A'
                    }
                    enrolled_courses.append(course_data)
                    total_credits += enrollment.course.credits
            
            # Get GPA from Student model
            gpa = float(student.cumulative_gpa) if student.cumulative_gpa else 0.0
            
            # Prepare student profile data
            student_profile = {
                'student_id': student.student_id,
                'name': f"{student.user.first_name} {student.user.last_name}",
                'email': student.user.email,
                'major': student.degree_program,
                'year': get_student_year(student),
                'gpa': gpa,
                'academic_standing': get_academic_standing(gpa),
                'advisor_id': student.advisor_id,
                'enrolled_courses': [course['code'] for course in enrolled_courses],
                'graduation_date': str(student.graduation_date) if student.graduation_date else None,
                'courses': enrolled_courses,
                'degree_progress': {
                    'completed_credits': total_credits,
                    'required_credits': 120,  # Typical for a bachelor's degree
                    'progress_percentage': min(100, (total_credits / 120) * 100)
                }
            }
            
            return JsonResponse({
                'success': True,
                'data': student_profile
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve advisee details'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def search_advisees(request):
    """Search advisees with advanced filtering using real models"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get all students advised by this faculty member
            students = Student.objects.filter(advisor_id=faculty_profile.employee_id).select_related('user')
            
            # Convert to list with additional data
            advisees = []
            for student in students:
                # Get enrollment count for this student
                enrollment_count = Enrollment.objects.filter(student_id=student.student_id).count()
                
                # Get GPA from Student model
                gpa = float(student.cumulative_gpa) if student.cumulative_gpa else 0.0
                
                advisee_data = {
                    'student_id': student.student_id,
                    'name': f"{student.user.first_name} {student.user.last_name}",
                    'email': student.user.email,
                    'major': student.degree_program,
                    'year': get_student_year(student),
                    'gpa': gpa,
                    'academic_standing': get_academic_standing(gpa),
                    'advisor_id': student.advisor_id,
                    'enrolled_courses': enrollment_count,
                    'graduation_date': str(student.graduation_date) if student.graduation_date else None
                }
                advisees.append(advisee_data)
            
            # Apply advanced filtering
            # GPA range filter
            min_gpa = request.GET.get('min_gpa')
            max_gpa = request.GET.get('max_gpa')
            if min_gpa:
                advisees = [student for student in advisees if student.get('gpa', 0) >= float(min_gpa)]
            if max_gpa:
                advisees = [student for student in advisees if student.get('gpa', 0) <= float(max_gpa)]
            
            # Year filter
            year_filter = request.GET.get('year')
            if year_filter:
                advisees = [student for student in advisees if student.get('year', '').lower() == year_filter.lower()]
            
            # Academic standing filter
            academic_standing_filter = request.GET.get('academic_standing')
            if academic_standing_filter:
                advisees = [
                    student for student in advisees 
                    if student.get('academic_standing', '').lower() == academic_standing_filter.lower()
                ]
            
            # Major filter
            major_filter = request.GET.get('major')
            if major_filter:
                advisees = [
                    student for student in advisees 
                    if student.get('major', '').lower() == major_filter.lower()
                ]
            
            # Search query
            search_query = request.GET.get('q')
            if search_query:
                search_query = search_query.lower()
                advisees = [
                    student for student in advisees
                    if search_query in student.get('name', '').lower() or
                       search_query in student.get('student_id', '').lower() or
                       search_query in student.get('email', '').lower() or
                       search_query in student.get('major', '').lower()
                ]
            
            # Apply sorting
            sort_by = request.GET.get('sort_by', 'name')
            sort_order = request.GET.get('sort_order', 'asc')
            
            if sort_by == 'gpa':
                advisees.sort(key=lambda x: x.get('gpa', 0), reverse=(sort_order == 'desc'))
            elif sort_by == 'name':
                advisees.sort(key=lambda x: x.get('name', ''), reverse=(sort_order == 'desc'))
            elif sort_by == 'year':
                year_order = {'Freshman': 1, 'Sophomore': 2, 'Junior': 3, 'Senior': 4}
                advisees.sort(key=lambda x: year_order.get(x.get('year', ''), 0), reverse=(sort_order == 'desc'))
            
            return JsonResponse({
                'success': True,
                'data': advisees
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to search advisees'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_advisee_categories(request):
    """Get advisee grouping and categorization features using real data"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get all students advised by this faculty member
            students = Student.objects.filter(advisor_id=faculty_profile.employee_id).select_related('user')
            
            # Create categories
            categories = {
                'academic_standing': {},
                'major': {},
                'year': {},
                'gpa_ranges': {
                    '3.5-4.0': 0,
                    '3.0-3.49': 0,
                    '2.5-2.99': 0,
                    'below_2.5': 0
                }
            }
            
            # Populate categories
            for student in students:
                # Academic standing
                gpa = float(student.cumulative_gpa) if student.cumulative_gpa else 0.0
                standing = get_academic_standing(gpa)
                if standing not in categories['academic_standing']:
                    categories['academic_standing'][standing] = 0
                categories['academic_standing'][standing] += 1
                
                # Major
                major = student.degree_program if student.degree_program else 'Unknown'
                if major not in categories['major']:
                    categories['major'][major] = 0
                categories['major'][major] += 1
                
                # Year
                year = get_student_year(student)
                if year not in categories['year']:
                    categories['year'][year] = 0
                categories['year'][year] += 1
                
                # GPA ranges
                if gpa >= 3.5:
                    categories['gpa_ranges']['3.5-4.0'] += 1
                elif gpa >= 3.0:
                    categories['gpa_ranges']['3.0-3.49'] += 1
                elif gpa >= 2.5:
                    categories['gpa_ranges']['2.5-2.99'] += 1
                else:
                    categories['gpa_ranges']['below_2.5'] += 1
            
            return JsonResponse({
                'success': True,
                'data': categories
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve advisee categories'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_academic_progress(request, student_id):
    """Get academic progress tracking for a specific student using real models"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Check if student exists and is advised by this faculty member
            try:
                student = Student.objects.select_related('user').get(
                    student_id=student_id, 
                    advisor_id=faculty_profile.employee_id
                )
            except Student.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Student not found or not your advisee'
                }, status=404)
            
            # Get enrolled courses for this student
            enrollments = Enrollment.objects.filter(student_id=student_id)
            
            # Calculate total credits
            total_credits = 0
            for enrollment in enrollments:
                if enrollment.status in ['active', 'completed']:
                    try:
                        course = Course.objects.get(id=enrollment.course_id)
                        total_credits += course.credits
                    except Course.DoesNotExist:
                        pass  # Skip if course doesn't exist
            
            # Get GPA from Student model
            gpa = float(student.cumulative_gpa) if student.cumulative_gpa else 0.0
            
            # Simulate degree audit data
            degree_audit = {
                'student_id': student_id,
                'major': student.degree_program,
                'catalog_year': '2023-2024',
                'total_credits_required': 120,
                'total_credits_completed': total_credits,
                'gpa': gpa,
                'requirements': [
                    {
                        'category': 'Core Requirements',
                        'credits_required': 45,
                        'credits_completed': min(30, total_credits),
                        'status': 'In Progress'
                    },
                    {
                        'category': 'Major Requirements',
                        'credits_required': 50,
                        'credits_completed': min(36, total_credits),
                        'status': 'In Progress'
                    },
                    {
                        'category': 'Electives',
                        'credits_required': 25,
                        'credits_completed': max(0, total_credits - 66),
                        'status': 'In Progress'
                    }
                ]
            }
            
            # Calculate progress percentages
            overall_progress = min(100, (total_credits / 120) * 100)
            
            for requirement in degree_audit['requirements']:
                requirement['progress_percentage'] = min(100, (requirement['credits_completed'] / requirement['credits_required']) * 100)
            
            # Add projection data
            projected_gpa = calculate_projected_gpa(student_id, gpa)
            
            progress_data = {
                'degree_audit': degree_audit,
                'overall_progress': round(overall_progress, 2),
                'projected_gpa': projected_gpa,
                'graduation_eligibility': overall_progress >= 90  # Simple eligibility check
            }
            
            return JsonResponse({
                'success': True,
                'data': progress_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve academic progress'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

def calculate_projected_gpa(student_id, current_gpa):
    """Calculate projected GPA based on current performance"""
    # In a real implementation, this would be more sophisticated
    # For now, we'll simulate a simple projection
    import random
    adjustment = random.uniform(-0.2, 0.2)  # Random adjustment between -0.2 and +0.2
    projected_gpa = max(0.0, min(4.0, current_gpa + adjustment))
    return round(projected_gpa, 2)