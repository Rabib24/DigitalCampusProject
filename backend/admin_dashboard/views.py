from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from users.models import User, Admin
from courses.models import Course
from assignments.models import Assignment
from finance.models import Payment
from library.models import LibraryBook
from django.db.models import Count
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