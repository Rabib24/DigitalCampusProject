from functools import wraps
from django.http import JsonResponse
from users.models import User, Faculty

def faculty_required(view_func):
    """
    Decorator to ensure that only authenticated faculty users can access a view.
    This decorator checks:
    1. User is authenticated
    2. User has faculty role
    3. Faculty profile exists
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        # Debug logging
        print(f"[faculty_required] Checking request for {request.path}")
        print(f"[faculty_required] hasattr(request, 'user'): {hasattr(request, 'user')}")
        print(f"[faculty_required] hasattr(request, 'faculty'): {hasattr(request, 'faculty')}")
        
        # Check if user is attached to request (from middleware)
        if not hasattr(request, 'user') or not request.user:
            print(f"[faculty_required] User not authenticated or not found")
            return JsonResponse({
                'success': False,
                'message': 'Authentication required'
            }, status=401)
        
        print(f"[faculty_required] User found: {request.user.username}, role: {getattr(request.user, 'role', 'NO ROLE')}")
        
        # Check if user has faculty role
        if not hasattr(request.user, 'role') or request.user.role != 'faculty':
            print(f"[faculty_required] User does not have faculty role")
            return JsonResponse({
                'success': False,
                'message': 'Access denied. Faculty role required.'
            }, status=403)
        
        # Check if faculty profile exists
        if not hasattr(request, 'faculty') or not request.faculty:
            print(f"[faculty_required] Faculty profile not attached, trying to fetch...")
            try:
                faculty_profile = Faculty.objects.get(user=request.user)
                request.faculty = faculty_profile
                print(f"[faculty_required] Faculty profile found: {faculty_profile.employee_id}")
            except Faculty.DoesNotExist:
                print(f"[faculty_required] Faculty profile not found in database")
                return JsonResponse({
                    'success': False,
                    'message': 'Faculty profile not found.'
                }, status=403)
        else:
            print(f"[faculty_required] Faculty profile already attached: {request.faculty.employee_id}")
        
        print(f"[faculty_required] Authorization successful, calling view function")
        # User is authenticated and has faculty role, proceed to view
        return view_func(request, *args, **kwargs)
    
    return wrapper

def faculty_permission_required(permission_codename, check_attributes=True):
    """
    Decorator to ensure that faculty user has specific permissions.
    
    Args:
        permission_codename (str): The codename of the permission to check
        check_attributes (bool): Whether to check attribute-based permissions
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # First check basic faculty authentication
            if not hasattr(request, 'user') or not request.user:
                return JsonResponse({
                    'success': False,
                    'message': 'Authentication required'
                }, status=401)
            
            if request.user.role != 'faculty':
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied. Faculty role required.'
                }, status=403)
            
            # Check if faculty profile exists
            if not hasattr(request, 'faculty') or not request.faculty:
                try:
                    faculty_profile = Faculty.objects.get(user=request.user)
                    request.faculty = faculty_profile
                except Faculty.DoesNotExist:
                    return JsonResponse({
                        'success': False,
                        'message': 'Faculty profile not found.'
                    }, status=403)
            
            # Check permission
            if check_attributes:
                # Check with department attribute
                faculty_profile = request.faculty
                attributes = {'department': faculty_profile.department}
                if not request.user.has_attribute_permission(permission_codename, attributes):
                    return JsonResponse({
                        'success': False,
                        'message': 'Insufficient permissions'
                    }, status=403)
            else:
                # Check without attributes
                if not request.user.has_permission(permission_codename):
                    return JsonResponse({
                        'success': False,
                        'message': 'Insufficient permissions'
                    }, status=403)
            
            # User has required permission, proceed to view
            return view_func(request, *args, **kwargs)
        
        return wrapper
    return decorator