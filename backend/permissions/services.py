from django.utils import timezone
from .models import Permission, UserPermission, RolePermission
from users.models import User

class PermissionService:
    """Service class for managing permissions"""
    
    @staticmethod
    def create_permission(id, name, codename, description="", category=""):
        """Create a new permission"""
        permission = Permission.objects.create(
            id=id,
            name=name,
            codename=codename,
            description=description,
            category=category
        )
        return permission
    
    @staticmethod
    def assign_user_permission(user, permission, granted_by=None, expires_at=None, scope=None):
        """Assign a permission to a user"""
        user_permission, created = UserPermission.objects.get_or_create(
            user=user,
            permission=permission,
            defaults={
                'id': f"up_{user.id}_{permission.id}_{int(timezone.now().timestamp())}",
                'granted_by': granted_by,
                'expires_at': expires_at,
                'scope': scope
            }
        )
        return user_permission
    
    @staticmethod
    def remove_user_permission(user, permission):
        """Remove a permission from a user"""
        try:
            user_permission = UserPermission.objects.get(user=user, permission=permission)
            user_permission.delete()
            return True
        except UserPermission.DoesNotExist:
            return False
    
    @staticmethod
    def assign_role_permission(role, permission, scope_template=None):
        """Assign a permission to a role"""
        role_permission, created = RolePermission.objects.get_or_create(
            role=role,
            permission=permission,
            defaults={
                'id': f"rp_{role}_{permission.id}_{int(timezone.now().timestamp())}",
                'scope_template': scope_template
            }
        )
        return role_permission
    
    @staticmethod
    def remove_role_permission(role, permission):
        """Remove a permission from a role"""
        try:
            role_permission = RolePermission.objects.get(role=role, permission=permission)
            role_permission.delete()
            return True
        except RolePermission.DoesNotExist:
            return False
    
    @staticmethod
    def get_user_permissions(user):
        """Get all active permissions for a user"""
        # Get role-based permissions
        role_permissions = RolePermission.objects.filter(role=user.role).select_related('permission')
        
        # Get user-specific permissions
        user_permissions = UserPermission.objects.filter(user=user).select_related('permission')
        
        # Combine permissions, with user permissions taking precedence
        permissions = {}
        
        # Add role permissions
        for rp in role_permissions:
            permissions[rp.permission.codename] = rp.permission
            
        # Add user permissions (override role permissions if they exist)
        for up in user_permissions:
            if up.is_active():
                permissions[up.permission.codename] = up.permission
                
        return list(permissions.values())
    
    @staticmethod
    def check_user_permission(user, codename, attributes=None):
        """Check if a user has a specific permission with optional attributes"""
        # Check role-based permissions
        role_perms = RolePermission.objects.filter(role=user.role).select_related('permission')
        for rp in role_perms:
            if rp.permission.codename == codename:
                # If no specific attributes required, role permission is sufficient
                if not attributes:
                    return True
                
                # Check if role permission scope matches attributes
                if user._matches_scope(rp.scope_template, attributes):
                    return True
        
        # Check user-specific permissions
        user_perms = UserPermission.objects.filter(user=user).select_related('permission')
        for up in user_perms:
            if up.is_active() and up.permission.codename == codename:
                # If no specific attributes required, user permission is sufficient
                if not attributes:
                    return True
                
                # Check if user permission scope matches attributes
                if user._matches_scope(up.scope, attributes):
                    return True
        
        return False
    
    @staticmethod
    def initialize_default_permissions():
        """Initialize default permissions for the system"""
        # Faculty permissions
        faculty_permissions = [
            # Course management
            ("course_view", "View Course", "faculty can view course details", "course"),
            ("course_edit", "Edit Course", "faculty can edit course details", "course"),
            ("course_create", "Create Course", "faculty can create new courses", "course"),
            
            # Assignment management
            ("assignment_view", "View Assignment", "faculty can view assignments", "assignment"),
            ("assignment_create", "Create Assignment", "faculty can create assignments", "assignment"),
            ("assignment_edit", "Edit Assignment", "faculty can edit assignments", "assignment"),
            ("assignment_delete", "Delete Assignment", "faculty can delete assignments", "assignment"),
            
            # Grade management
            ("grade_view", "View Grades", "faculty can view student grades", "grade"),
            ("grade_edit", "Edit Grades", "faculty can edit student grades", "grade"),
            
            # Research management
            ("research_view", "View Research", "faculty can view research projects", "research"),
            ("research_create", "Create Research", "faculty can create research projects", "research"),
            ("research_edit", "Edit Research", "faculty can edit research projects", "research"),
            
            # Student management
            ("student_view", "View Students", "faculty can view student information", "student"),
            ("student_advisor_view", "View Advisees", "faculty can view their advisees", "student"),
        ]
        
        # Create faculty permissions
        for codename, name, description, category in faculty_permissions:
            PermissionService.create_permission(
                id=f"perm_{codename}",
                name=name,
                codename=codename,
                description=description,
                category=category
            )
        
        # Student permissions
        student_permissions = [
            ("course_view_enrolled", "View Enrolled Courses", "student can view their enrolled courses", "course"),
            ("assignment_view_own", "View Own Assignments", "student can view assignments for their courses", "assignment"),
            ("grade_view_own", "View Own Grades", "student can view their own grades", "grade"),
        ]
        
        # Create student permissions
        for codename, name, description, category in student_permissions:
            PermissionService.create_permission(
                id=f"perm_{codename}",
                name=name,
                codename=codename,
                description=description,
                category=category
            )
        
        # Admin permissions
        admin_permissions = [
            ("user_manage", "Manage Users", "admin can manage user accounts", "user"),
            ("course_manage", "Manage Courses", "admin can manage all courses", "course"),
            ("assignment_manage", "Manage Assignments", "admin can manage all assignments", "assignment"),
            ("grade_manage", "Manage Grades", "admin can manage all grades", "grade"),
        ]
        
        # Create admin permissions
        for codename, name, description, category in admin_permissions:
            PermissionService.create_permission(
                id=f"perm_{codename}",
                name=name,
                codename=codename,
                description=description,
                category=category
            )
        
        # Assign role permissions
        # Faculty role permissions
        faculty_role_permissions = [
            "course_view", "course_edit",
            "assignment_view", "assignment_create", "assignment_edit", "assignment_delete",
            "grade_view", "grade_edit",
            "research_view", "research_create", "research_edit",
            "student_view", "student_advisor_view"
        ]
        
        for codename in faculty_role_permissions:
            try:
                permission = Permission.objects.get(codename=codename)
                # Faculty can only access courses in their department
                scope_template = {"department": []} if codename.startswith("course") else None
                PermissionService.assign_role_permission("faculty", permission, scope_template)
            except Permission.DoesNotExist:
                pass
        
        # Student role permissions
        student_role_permissions = [
            "course_view_enrolled",
            "assignment_view_own",
            "grade_view_own"
        ]
        
        for codename in student_role_permissions:
            try:
                permission = Permission.objects.get(codename=codename)
                PermissionService.assign_role_permission("student", permission)
            except Permission.DoesNotExist:
                pass
        
        # Admin role permissions
        admin_role_permissions = [
            "user_manage",
            "course_manage",
            "assignment_manage",
            "grade_manage"
        ]
        
        for codename in admin_role_permissions:
            try:
                permission = Permission.objects.get(codename=codename)
                PermissionService.assign_role_permission("admin", permission)
            except Permission.DoesNotExist:
                pass