from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from users.models import User, Admin, Faculty, Student
from courses.models import Course, Enrollment
from assignments.models import Assignment, Grade
from finance.models import Payment
from library.models import LibraryBook
from permissions.models import Permission, UserPermission, RolePermission
from django.db.models import Count, Sum
from django.utils import timezone
from datetime import timedelta
import json

def check_admin_role(request):
    """Check if the authenticated user has admin role"""
    return hasattr(request, 'admin') and request.admin is not None

def check_admin_permission(request, permission_codename):
    """Check if the admin user has a specific permission"""
    if not check_admin_role(request):
        return False
    
    # Check if user has the required permission
    return request.user.has_permission(permission_codename)

# Admin dashboard views
@csrf_exempt
def dashboard_overview(request):
    """Get admin dashboard overview"""
    # Check basic admin role
    if not check_admin_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    try:
        # Get system statistics
        total_users = User.objects.count()
        total_students = User.objects.filter(role='student').count()
        total_faculty = User.objects.filter(role='faculty').count()
        total_admins = User.objects.filter(role='admin').count()
        
        # Get active courses
        active_courses = Course.objects.count()
        
        # Get recent payments
        recent_payments = Payment.objects.filter(
            created_at__gte=timezone.now() - timedelta(days=30)
        ).count()
        
        # Get library statistics
        total_books = LibraryBook.objects.count()
        borrowed_books = LibraryBook.objects.filter(status='borrowed').count()
        
        # Get recent assignments
        recent_assignments = Assignment.objects.filter(
            created_at__gte=timezone.now() - timedelta(days=7)
        ).count()
        
        data = {
            'totalUsers': total_users,
            'totalStudents': total_students,
            'totalFaculty': total_faculty,
            'totalAdmins': total_admins,
            'activeCourses': active_courses,
            'recentPayments': recent_payments,
            'totalBooks': total_books,
            'borrowedBooks': borrowed_books,
            'recentAssignments': recent_assignments,
        }
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to fetch dashboard data'}, status=500)
    
    return JsonResponse(data)

@csrf_exempt
def user_management(request):
    """Get user management data"""
    # Check basic admin role
    if not check_admin_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    try:
        # Get user statistics by role
        users_by_role = User.objects.values('role').annotate(count=Count('role'))
        
        # Get recent user registrations
        recent_users = User.objects.filter(
            created_at__gte=timezone.now() - timedelta(days=30)
        ).order_by('-created_at')[:10]
        
        # Convert to JSON format
        recent_users_data = []
        for user in recent_users:
            recent_users_data.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'status': user.status,
                'created_at': user.created_at.isoformat() if user.created_at else None,
            })
        
        data = {
            'usersByRole': list(users_by_role),
            'recentUsers': recent_users_data,
        }
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to fetch user management data'}, status=500)
    
    return JsonResponse(data)

@csrf_exempt
def system_monitoring(request):
    """Get system monitoring data"""
    # Check basic admin role
    if not check_admin_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    try:
        # Get system statistics (placeholder data for now)
        system_stats = {
            'cpuUsage': 45,
            'memoryUsage': 67,
            'diskUsage': 34,
            'networkTraffic': 120,
            'activeSessions': 142,
            'serverUptime': '5 days, 3 hours, 15 minutes',
        }
        
        # Get recent system events (placeholder)
        recent_events = [
            {'timestamp': '2023-10-15T10:30:00Z', 'event': 'User login', 'severity': 'info'},
            {'timestamp': '2023-10-15T09:45:00Z', 'event': 'Database backup completed', 'severity': 'info'},
            {'timestamp': '2023-10-15T08:20:00Z', 'event': 'Failed login attempt', 'severity': 'warning'},
            {'timestamp': '2023-10-15T07:15:00Z', 'event': 'System update applied', 'severity': 'info'},
        ]
        
        data = {
            'systemStats': system_stats,
            'recentEvents': recent_events,
        }
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to fetch system monitoring data'}, status=500)
    
    return JsonResponse(data)

# New views for the unified admin dashboard

@csrf_exempt
def permission_management(request):
    """Manage user permissions"""
    # Check basic admin role
    if not check_admin_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method == 'GET':
        try:
            # Get all permissions
            permissions = Permission.objects.all()
            permissions_data = [perm.to_json() for perm in permissions]
            
            # Get user permissions with user details
            user_permissions = UserPermission.objects.select_related('user', 'permission').all()
            user_permissions_data = []
            for up in user_permissions:
                user_permissions_data.append({
                    'id': up.id,
                    'user': {
                        'id': up.user.id,
                        'username': up.user.username,
                        'first_name': up.user.first_name,
                        'last_name': up.user.last_name,
                        'role': up.user.role
                    },
                    'permission': up.permission.to_json(),
                    'granted_at': up.granted_at.isoformat() if up.granted_at else None,
                    'granted_by': up.granted_by.id if up.granted_by else None,
                    'scope': up.scope
                })
            
            data = {
                'permissions': permissions_data,
                'userPermissions': user_permissions_data
            }
            return JsonResponse(data)
        
        except Exception as e:
            # Log the actual error for debugging
            import traceback
            error_details = traceback.format_exc()
            print(f"Permission management error: {str(e)}")
            print(f"Traceback: {error_details}")
            return JsonResponse({'success': False, 'message': f'Failed to fetch permissions data: {str(e)}'}, status=500)
    
    elif request.method == 'POST':
        try:
            # Parse request data
            data = json.loads(request.body)
            user_id = data.get('user_id')
            permission_id = data.get('permission_id')
            scope = data.get('scope', {})
            
            # Get user and permission
            user = User.objects.get(id=user_id)
            permission = Permission.objects.get(id=permission_id)
            
            # Create or update user permission
            user_permission, created = UserPermission.objects.get_or_create(
                user=user,
                permission=permission,
                defaults={
                    'scope': scope,
                    'granted_by': request.user
                }
            )
            
            if not created:
                user_permission.scope = scope
                user_permission.granted_by = request.user
                user_permission.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Permission assigned successfully',
                'data': user_permission.to_json()
            })
        
        except User.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User not found'}, status=404)
        except Permission.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'Permission not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to assign permission: {str(e)}'}, status=500)
    
    elif request.method == 'DELETE':
        try:
            # Parse request data
            data = json.loads(request.body)
            user_id = data.get('user_id')
            permission_id = data.get('permission_id')
            
            # Get user permission and delete it
            user_permission = UserPermission.objects.get(
                user_id=user_id,
                permission_id=permission_id
            )
            user_permission.delete()
            
            return JsonResponse({
                'success': True,
                'message': 'Permission removed successfully'
            })
        
        except UserPermission.DoesNotExist:
            return JsonResponse({'success': False, 'message': 'User permission not found'}, status=404)
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to remove permission: {str(e)}'}, status=500)

@csrf_exempt
def course_management(request):
    """Manage courses and enrollments"""
    # Check basic admin role
    if not check_admin_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method == 'GET':
        try:
            # Get all courses
            courses = Course.objects.all()
            courses_data = [course.to_json() for course in courses]
            
            # Get enrollment statistics
            total_enrollments = Enrollment.objects.count()
            active_enrollments = Enrollment.objects.filter(status='active').count()
            completed_enrollments = Enrollment.objects.filter(status='completed').count()
            dropped_enrollments = Enrollment.objects.filter(status='dropped').count()
            
            data = {
                'courses': courses_data,
                'enrollmentStats': {
                    'total': total_enrollments,
                    'active': active_enrollments,
                    'completed': completed_enrollments,
                    'dropped': dropped_enrollments
                }
            }
            return JsonResponse(data)
        
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to fetch course data: {str(e)}'}, status=500)
    
    elif request.method == 'POST':
        try:
            # Parse request data
            data = json.loads(request.body)
            
            # Create new course
            course = Course(
                id=data.get('id'),
                code=data.get('code'),
                name=data.get('name'),
                description=data.get('description', ''),
                credits=data.get('credits', 3),
                instructor_id=data.get('instructor_id', ''),
                department=data.get('department', ''),
                enrollment_limit=data.get('enrollment_limit', 30),
                start_date=data.get('start_date'),
                end_date=data.get('end_date')
            )
            course.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Course created successfully',
                'data': course.to_json()
            })
        
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to create course: {str(e)}'}, status=500)

@csrf_exempt
def faculty_management(request):
    """Manage faculty members"""
    # Check basic admin role
    if not check_admin_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method == 'GET':
        try:
            # Get all faculty members with user details
            faculty_members = Faculty.objects.select_related('user').all()
            faculty_data = []
            
            for faculty in faculty_members:
                faculty_data.append({
                    'employee_id': faculty.employee_id,
                    'user': {
                        'id': faculty.user.id,
                        'username': faculty.user.username,
                        'first_name': faculty.user.first_name,
                        'last_name': faculty.user.last_name,
                        'email': faculty.user.email
                    },
                    'department': faculty.department,
                    'title': faculty.title,
                    'office_location': faculty.office_location,
                    'hire_date': faculty.hire_date.isoformat() if faculty.hire_date else None
                })
            
            return JsonResponse({'faculty': faculty_data})
        
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to fetch faculty data: {str(e)}'}, status=500)

@csrf_exempt
def student_management(request):
    """Manage students"""
    # Check basic admin role
    if not check_admin_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method == 'GET':
        try:
            # Get all students with user details
            students = Student.objects.select_related('user').all()
            student_data = []
            
            for student in students:
                student_data.append({
                    'student_id': student.student_id,
                    'user': {
                        'id': student.user.id,
                        'username': student.user.username,
                        'first_name': student.user.first_name,
                        'last_name': student.user.last_name,
                        'email': student.user.email
                    },
                    'degree_program': student.degree_program,
                    'advisor_id': student.advisor_id,
                    'graduation_date': student.graduation_date.isoformat() if student.graduation_date else None,
                    'cumulative_gpa': float(student.cumulative_gpa) if student.cumulative_gpa else None
                })
            
            return JsonResponse({'students': student_data})
        
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to fetch student data: {str(e)}'}, status=500)

@csrf_exempt
def grade_management(request):
    """Manage grades"""
    # Check basic admin role
    if not check_admin_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method == 'GET':
        try:
            # Get recent grades
            recent_grades = Grade.objects.order_by('-created_at')[:50]
            grades_data = []
            
            for grade in recent_grades:
                grades_data.append({
                    'id': grade.id,
                    'student_id': grade.student_id,
                    'course_id': grade.course_id,
                    'assignment_id': grade.assignment_id,
                    'value': float(grade.value) if grade.value else None,
                    'max_points': float(grade.max_points) if grade.max_points else None,
                    'letter_grade': grade.letter_grade,
                    'grader_id': grade.grader_id,
                    'created_at': grade.created_at.isoformat() if grade.created_at else None
                })
            
            return JsonResponse({'grades': grades_data})
        
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to fetch grade data: {str(e)}'}, status=500)
    
    elif request.method == 'POST':
        try:
            # Parse request data
            data = json.loads(request.body)
            
            # Get or create grade
            grade, created = Grade.objects.get_or_create(
                id=data.get('id'),
                defaults={
                    'student_id': data.get('student_id'),
                    'course_id': data.get('course_id'),
                    'assignment_id': data.get('assignment_id'),
                    'value': data.get('value'),
                    'max_points': data.get('max_points'),
                    'letter_grade': data.get('letter_grade', ''),
                    'grader_id': request.user.id,
                    'comments': data.get('comments', '')
                }
            )
            
            if not created:
                # Update existing grade
                grade.value = data.get('value', grade.value)
                grade.letter_grade = data.get('letter_grade', grade.letter_grade)
                grade.comments = data.get('comments', grade.comments)
                grade.grader_id = request.user.id
                grade.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Grade saved successfully',
                'data': {
                    'id': grade.id,
                    'student_id': grade.student_id,
                    'course_id': grade.course_id,
                    'value': float(grade.value) if grade.value else None,
                    'letter_grade': grade.letter_grade
                }
            })
        
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to save grade: {str(e)}'}, status=500)

@csrf_exempt
def reporting(request):
    """Generate reports"""
    # Check basic admin role
    if not check_admin_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method == 'GET':
        try:
            # Get report type from query parameters
            report_type = request.GET.get('type', 'summary')
            
            if report_type == 'user_summary':
                # User statistics report
                total_users = User.objects.count()
                users_by_role = User.objects.values('role').annotate(count=Count('role'))
                recent_registrations = User.objects.filter(
                    created_at__gte=timezone.now() - timedelta(days=30)
                ).count()
                
                data = {
                    'report_type': 'user_summary',
                    'total_users': total_users,
                    'users_by_role': list(users_by_role),
                    'recent_registrations': recent_registrations
                }
            
            elif report_type == 'course_summary':
                # Course statistics report
                total_courses = Course.objects.count()
                courses_by_department = Course.objects.values('department').annotate(count=Count('department'))
                total_enrollments = Enrollment.objects.count()
                
                data = {
                    'report_type': 'course_summary',
                    'total_courses': total_courses,
                    'courses_by_department': list(courses_by_department),
                    'total_enrollments': total_enrollments
                }
            
            elif report_type == 'financial_summary':
                # Financial report
                total_payments = Payment.objects.count()
                total_payment_amount = Payment.objects.aggregate(Sum('amount'))['amount__sum'] or 0
                payments_by_type = Payment.objects.values('type').annotate(count=Count('type'), total=Sum('amount'))
                
                data = {
                    'report_type': 'financial_summary',
                    'total_payments': total_payments,
                    'total_payment_amount': float(total_payment_amount),
                    'payments_by_type': list(payments_by_type)
                }
            
            else:
                # Default summary report
                data = {
                    'report_type': 'summary',
                    'generated_at': timezone.now().isoformat(),
                    'summary': {
                        'total_users': User.objects.count(),
                        'total_courses': Course.objects.count(),
                        'total_payments': Payment.objects.count(),
                        'total_books': LibraryBook.objects.count()
                    }
                }
            
            return JsonResponse(data)
        
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to generate report: {str(e)}'}, status=500)