#!/usr/bin/env python
"""
Simple demo of the permissions system concepts without database access.
"""

class Permission:
    """Permission model for fine-grained access control"""
    def __init__(self, id, name, codename, description="", category=""):
        self.id = id
        self.name = name
        self.codename = codename
        self.description = description
        self.category = category

class User:
    """Simplified user model"""
    def __init__(self, username, role):
        self.username = username
        self.role = role

class PermissionService:
    """Service class for managing permissions (simplified version)"""
    
    # Store permissions in memory for demo
    permissions = {}
    role_permissions = {}
    user_permissions = {}
    
    @staticmethod
    def create_permission(id, name, codename, description="", category=""):
        """Create a new permission"""
        permission = Permission(id, name, codename, description, category)
        PermissionService.permissions[codename] = permission
        return permission
    
    @staticmethod
    def assign_role_permission(role, permission, scope_template=None):
        """Assign a permission to a role"""
        if role not in PermissionService.role_permissions:
            PermissionService.role_permissions[role] = {}
        PermissionService.role_permissions[role][permission.codename] = {
            'permission': permission,
            'scope_template': scope_template or {}
        }
    
    @staticmethod
    def assign_user_permission(user, permission, scope=None):
        """Assign a permission to a user"""
        user_key = f"{user.username}_{user.role}"
        if user_key not in PermissionService.user_permissions:
            PermissionService.user_permissions[user_key] = {}
        PermissionService.user_permissions[user_key][permission.codename] = {
            'permission': permission,
            'scope': scope or {}
        }
    
    @staticmethod
    def check_user_permission(user, codename, attributes=None):
        """Check if a user has a specific permission with optional attributes"""
        user_key = f"{user.username}_{user.role}"
        
        # Check user-specific permissions first
        if user_key in PermissionService.user_permissions:
            if codename in PermissionService.user_permissions[user_key]:
                user_perm = PermissionService.user_permissions[user_key][codename]
                if PermissionService._matches_scope(user_perm['scope'], attributes):
                    return True
        
        # Check role-based permissions
        if user.role in PermissionService.role_permissions:
            if codename in PermissionService.role_permissions[user.role]:
                role_perm = PermissionService.role_permissions[user.role][codename]
                if PermissionService._matches_scope(role_perm['scope_template'], attributes):
                    return True
        
        return False
    
    @staticmethod
    def _matches_scope(scope, attributes):
        """Check if permission scope matches given attributes"""
        if not scope or not attributes:
            return True
        
        # Check each scope condition
        for key, value in scope.items():
            if key in attributes:
                attr_value = attributes[key]
                # Handle list values (e.g., department: ['CS', 'EE'])
                if isinstance(value, list):
                    if attr_value not in value:
                        return False
                # Handle single values
                else:
                    if attr_value != value:
                        return False
        
        return True

def demo_permissions():
    print("=== Permissions System Demo ===\n")
    
    # Create a user
    faculty_user = User("dr_smith", "faculty")
    
    print("1. Creating permissions...")
    # Create some permissions
    course_view_perm = PermissionService.create_permission(
        id='perm_course_view',
        name='View Course',
        codename='course_view',
        description='Can view course details',
        category='course'
    )
    
    course_edit_perm = PermissionService.create_permission(
        id='perm_course_edit',
        name='Edit Course',
        codename='course_edit',
        description='Can edit course details',
        category='course'
    )
    
    assignment_view_perm = PermissionService.create_permission(
        id='perm_assignment_view',
        name='View Assignment',
        codename='assignment_view',
        description='Can view assignments',
        category='assignment'
    )
    
    print(f"   Created permission: {course_view_perm.name}")
    print(f"   Created permission: {course_edit_perm.name}")
    print(f"   Created permission: {assignment_view_perm.name}\n")
    
    print("2. Assigning role permissions...")
    # Assign permissions to faculty role
    PermissionService.assign_role_permission(
        'faculty',
        course_view_perm,
        scope_template={'department': []}  # Any department
    )
    
    PermissionService.assign_role_permission(
        'faculty',
        course_edit_perm,
        scope_template={'department': ['Computer Science', 'Electrical Engineering']}
    )
    
    PermissionService.assign_role_permission(
        'faculty',
        assignment_view_perm
    )
    
    print("   Assigned course_view permission to faculty role (any department)")
    print("   Assigned course_edit permission to faculty role (CS/EE departments only)")
    print("   Assigned assignment_view permission to faculty role\n")
    
    print("3. Checking permissions...")
    # Check if faculty has permissions
    has_course_view = PermissionService.check_user_permission(faculty_user, 'course_view')
    has_course_edit = PermissionService.check_user_permission(faculty_user, 'course_edit')
    has_assignment_view = PermissionService.check_user_permission(faculty_user, 'assignment_view')
    
    print(f"   Faculty has 'course_view' permission: {has_course_view}")
    print(f"   Faculty has 'course_edit' permission: {has_course_edit}")
    print(f"   Faculty has 'assignment_view' permission: {has_assignment_view}\n")
    
    print("4. Attribute-based permissions...")
    # Check attribute-based permissions
    cs_attributes = {'department': 'Computer Science'}
    math_attributes = {'department': 'Mathematics'}
    
    has_course_view_cs = PermissionService.check_user_permission(faculty_user, 'course_view', cs_attributes)
    has_course_view_math = PermissionService.check_user_permission(faculty_user, 'course_view', math_attributes)
    has_course_edit_cs = PermissionService.check_user_permission(faculty_user, 'course_edit', cs_attributes)
    has_course_edit_math = PermissionService.check_user_permission(faculty_user, 'course_edit', math_attributes)
    
    print(f"   Faculty has 'course_view' permission for CS department: {has_course_view_cs}")
    print(f"   Faculty has 'course_view' permission for Math department: {has_course_view_math}")
    print(f"   Faculty has 'course_edit' permission for CS department: {has_course_edit_cs}")
    print(f"   Faculty has 'course_edit' permission for Math department: {has_course_edit_math}\n")
    
    print("5. User-specific permissions...")
    # Assign user-specific permission
    PermissionService.assign_user_permission(
        faculty_user,
        assignment_view_perm,
        scope={'course_id': 'CS101'}
    )
    
    print("   Assigned user-specific assignment_view permission for CS101 course\n")
    
    # Check user-specific permission with attributes
    cs101_attributes = {'course_id': 'CS101'}
    other_course_attributes = {'course_id': 'CS102'}
    
    has_assignment_cs101 = PermissionService.check_user_permission(faculty_user, 'assignment_view', cs101_attributes)
    has_assignment_other = PermissionService.check_user_permission(faculty_user, 'assignment_view', other_course_attributes)
    
    print(f"   Faculty has 'assignment_view' permission for CS101 course: {has_assignment_cs101}")
    print(f"   Faculty has 'assignment_view' permission for CS102 course: {has_assignment_other}\n")
    
    print("=== Demo Complete ===")
    print("\nKey Features Demonstrated:")
    print("- Role-based permissions")
    print("- Attribute-based access control")
    print("- User-specific permissions")
    print("- Permission scoping by attributes")
    print("- Permission categories")

if __name__ == "__main__":
    demo_permissions()