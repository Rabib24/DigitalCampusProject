import json
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from users.models import User
from .services import PermissionService

class AttributeBasedPermissionMiddleware(MiddlewareMixin):
    """Middleware to enforce attribute-based permissions"""
    
    def process_request(self, request):
        # Define permission requirements for different endpoints
        permission_map = {
            # Faculty endpoints
            '/api/v1/faculty/courses/': {
                'permission': 'course_view',
                'attributes': self._get_faculty_attributes(request)
            },
            '/api/v1/faculty/courses/<int:course_id>/': {
                'permission': 'course_view',
                'attributes': self._get_faculty_attributes(request)
            },
            '/api/v1/faculty/assignments/': {
                'permission': 'assignment_view',
                'attributes': self._get_faculty_attributes(request)
            },
            '/api/v1/faculty/assignments/<int:assignment_id>/': {
                'permission': 'assignment_view',
                'attributes': self._get_faculty_attributes(request)
            },
            '/api/v1/faculty/courses/<int:course_id>/gradebook/': {
                'permission': 'grade_view',
                'attributes': self._get_faculty_attributes(request)
            },
            '/api/v1/faculty/grades/<int:grade_id>/': {
                'permission': 'grade_edit',
                'attributes': self._get_faculty_attributes(request)
            },
            '/api/v1/faculty/research/projects/': {
                'permission': 'research_view',
                'attributes': self._get_faculty_attributes(request)
            },
            
            # Student endpoints would go here
        }
        
        # Check if the current path requires specific permissions
        for path_pattern, requirements in permission_map.items():
            if self._matches_path(request.path, path_pattern):
                # Check if user is authenticated
                if not hasattr(request, 'user') or not request.user.is_authenticated:
                    return JsonResponse({
                        'success': False,
                        'message': 'Authentication required'
                    }, status=401)
                
                # Check permission
                permission = requirements['permission']
                attributes = requirements.get('attributes', {})
                
                if not PermissionService.check_user_permission(request.user, permission, attributes):
                    return JsonResponse({
                        'success': False,
                        'message': 'Insufficient permissions for this operation'
                    }, status=403)
                
                break  # Found matching path, no need to check others
        
        return None
    
    def _matches_path(self, request_path, pattern):
        """Check if request path matches pattern (simple implementation)"""
        # For now, do simple string matching
        # In a real implementation, you might want to use regex or Django's URL resolver
        if '<int:' in pattern:
            # Handle patterns with parameters
            base_pattern = pattern.split('<int:')[0]
            return request_path.startswith(base_pattern)
        return request_path == pattern
    
    def _get_faculty_attributes(self, request):
        """Get attributes for faculty user"""
        if hasattr(request, 'faculty') and request.faculty:
            return {
                'department': request.faculty.department,
                'employee_id': request.faculty.employee_id
            }
        return {}