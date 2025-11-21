# Permissions System

This module implements a flexible Role-Based Access Control (RBAC) system with attribute-based permissions for fine-grained access control.

## Features

1. **Role-Based Permissions**: Assign permissions to user roles (faculty, student, admin, staff)
2. **User-Specific Permissions**: Grant individual permissions to specific users
3. **Attribute-Based Access Control**: Permissions can be scoped to specific attributes (e.g., department, course)
4. **Permission Expiration**: User permissions can have expiration dates
5. **Permission Categories**: Organize permissions by category (course, assignment, grade, etc.)

## Models

### Permission
Represents a specific action or capability in the system.

- `id`: Unique identifier
- `name`: Human-readable name
- `codename`: Unique code name for programmatic access
- `description`: Description of what the permission allows
- `category`: Category for organizing permissions
- `created_at`: When the permission was created

### RolePermission
Associates permissions with user roles.

- `role`: User role (faculty, student, admin, staff)
- `permission`: The permission being granted
- `scope_template`: Default scope for this role-permission combination

### UserPermission
Associates permissions with specific users.

- `user`: The user being granted the permission
- `permission`: The permission being granted
- `granted_at`: When the permission was granted
- `granted_by`: Who granted the permission
- `expires_at`: When the permission expires (optional)
- `scope`: Attribute-based scope for this permission

## Services

### PermissionService
Provides methods for managing permissions:

```python
# Create a new permission
permission = PermissionService.create_permission(
    id="perm_course_view",
    name="View Course",
    codename="course_view",
    description="Can view course details",
    category="course"
)

# Assign permission to a role
PermissionService.assign_role_permission(
    "faculty", 
    permission,
    scope_template={"department": []}
)

# Assign permission to a user
PermissionService.assign_user_permission(
    user, 
    permission,
    scope={"department": "Computer Science"}
)

# Check if user has permission
has_perm = PermissionService.check_user_permission(user, "course_view")
```

## Usage in Views

To check permissions in views:

```python
from permissions.services import PermissionService

def my_view(request):
    # Check if user has permission
    if not PermissionService.check_user_permission(request.user, 'course_view'):
        return JsonResponse({'success': False, 'message': 'Insufficient permissions'}, status=403)
    
    # Check if user has permission with specific attributes
    attributes = {'department': 'Computer Science'}
    if not PermissionService.check_user_permission(request.user, 'course_view', attributes):
        return JsonResponse({'success': False, 'message': 'Insufficient permissions'}, status=403)
```

## Initialization

To initialize default permissions, run:

```bash
python manage.py init_permissions
```

## Middleware

The `AttributeBasedPermissionMiddleware` automatically enforces permissions for specific endpoints based on the permission map defined in the middleware.