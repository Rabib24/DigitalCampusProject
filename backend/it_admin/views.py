from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from users.models import User, Staff
from django.utils import timezone
from datetime import timedelta
import json

def check_it_admin_role(request):
    """Check if the authenticated user has IT admin role"""
    return hasattr(request, 'staff') and request.staff is not None

def check_it_admin_permission(request, permission_codename):
    """Check if the IT admin user has a specific permission"""
    if not check_it_admin_role(request):
        return False
    
    # Check if user has the required permission
    return request.user.has_permission(permission_codename)

# IT admin dashboard views
@csrf_exempt
def dashboard_overview(request):
    """Get IT admin dashboard overview"""
    # Check basic IT admin role
    if not check_it_admin_role(request):
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
        
        # Get security alerts (placeholder)
        security_alerts = [
            {'timestamp': '2023-10-15T08:20:00Z', 'alert': 'Multiple failed login attempts', 'severity': 'warning'},
            {'timestamp': '2023-10-15T06:45:00Z', 'alert': 'Unusual network activity detected', 'severity': 'medium'},
        ]
        
        data = {
            'systemStats': system_stats,
            'recentEvents': recent_events,
            'securityAlerts': security_alerts,
        }
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to fetch dashboard data'}, status=500)
    
    return JsonResponse(data)

@csrf_exempt
def system_management(request):
    """Get system management data"""
    # Check basic IT admin role
    if not check_it_admin_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    try:
        # Get system components status (placeholder data for now)
        components_status = [
            {'name': 'Database Server', 'status': 'online', 'uptime': '99.9%'},
            {'name': 'Web Server', 'status': 'online', 'uptime': '99.8%'},
            {'name': 'Cache Server', 'status': 'online', 'uptime': '99.95%'},
            {'name': 'Message Queue', 'status': 'online', 'uptime': '99.7%'},
        ]
        
        # Get recent system updates (placeholder)
        recent_updates = [
            {'timestamp': '2023-10-15T07:15:00Z', 'update': 'Security patch applied', 'version': 'v2.1.5'},
            {'timestamp': '2023-10-14T14:30:00Z', 'update': 'Performance optimization', 'version': 'v2.1.4'},
            {'timestamp': '2023-10-13T09:20:00Z', 'update': 'Bug fixes', 'version': 'v2.1.3'},
        ]
        
        data = {
            'componentsStatus': components_status,
            'recentUpdates': recent_updates,
        }
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to fetch system management data'}, status=500)
    
    return JsonResponse(data)

@csrf_exempt
def user_management(request):
    """Get user management data for IT admin"""
    # Check basic IT admin role
    if not check_it_admin_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    try:
        # Get user account statistics (placeholder data for now)
        account_stats = {
            'totalAccounts': 2156,
            'activeAccounts': 1847,
            'suspendedAccounts': 23,
            'lockedAccounts': 12,
            'newAccountsThisWeek': 34,
        }
        
        # Get recent account activities (placeholder)
        recent_activities = [
            {'timestamp': '2023-10-15T10:30:00Z', 'activity': 'Account unlocked', 'user': 'john.doe'},
            {'timestamp': '2023-10-15T09:45:00Z', 'activity': 'Password reset', 'user': 'jane.smith'},
            {'timestamp': '2023-10-15T08:20:00Z', 'activity': 'Account suspended', 'user': 'bob.johnson'},
            {'timestamp': '2023-10-15T07:15:00Z', 'activity': 'New account created', 'user': 'alice.brown'},
        ]
        
        data = {
            'accountStats': account_stats,
            'recentActivities': recent_activities,
        }
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to fetch user management data'}, status=500)
    
    return JsonResponse(data)