#!/usr/bin/env python
"""
Demo script to show how the permissions system works.
This script demonstrates the core functionality without requiring database migrations.
"""

import sys
import os
import django
from django.conf import settings

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__)))

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Setup Django
django.setup()

from permissions.services import PermissionService
from users.models import User

def demo_permissions():
    print("=== Permissions System Demo ===\n")
    
    # Create a mock user (without saving to database)
    class MockUser:
        def __init__(self, username, role):
            self.username = username
            self.role = role
            self.id = 1
        
        def has_permission(self, codename):
            # Mock implementation
            return True
            
        def has_attribute_permission(self, codename, attributes=None):
            # Mock implementation
            return True
    
    user = MockUser("test_faculty", "faculty")
    
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
        scope_template={'department': []}
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
    
    print("   Assigned course_view permission to faculty role")
    print("   Assigned course_edit permission to faculty role (CS/EE departments only)")
    print("   Assigned assignment_view permission to faculty role\n")
    
    print("3. Checking permissions...")
    # Check if faculty has permissions
    has_course_view = PermissionService.check_user_permission(user, 'course_view')
    has_course_edit = PermissionService.check_user_permission(user, 'course_edit')
    has_assignment_view = PermissionService.check_user_permission(user, 'assignment_view')
    
    print(f"   Faculty has 'course_view' permission: {has_course_view}")
    print(f"   Faculty has 'course_edit' permission: {has_course_edit}")
    print(f"   Faculty has 'assignment_view' permission: {has_assignment_view}\n")
    
    print("4. Attribute-based permissions...")
    # Check attribute-based permissions
    cs_attributes = {'department': 'Computer Science'}
    math_attributes = {'department': 'Mathematics'}
    
    has_course_view_cs = PermissionService.check_user_permission(user, 'course_view', cs_attributes)
    has_course_view_math = PermissionService.check_user_permission(user, 'course_view', math_attributes)
    has_course_edit_cs = PermissionService.check_user_permission(user, 'course_edit', cs_attributes)
    has_course_edit_math = PermissionService.check_user_permission(user, 'course_edit', math_attributes)
    
    print(f"   Faculty has 'course_view' permission for CS department: {has_course_view_cs}")
    print(f"   Faculty has 'course_view' permission for Math department: {has_course_view_math}")
    print(f"   Faculty has 'course_edit' permission for CS department: {has_course_edit_cs}")
    print(f"   Faculty has 'course_edit' permission for Math department: {has_course_edit_math}\n")
    
    print("5. User-specific permissions...")
    # Assign user-specific permission
    PermissionService.assign_user_permission(
        user,
        assignment_view_perm,
        scope={'course_id': 'CS101'}
    )
    
    print("   Assigned user-specific assignment_view permission for CS101 course\n")
    
    print("=== Demo Complete ===")
    print("\nKey Features Demonstrated:")
    print("- Role-based permissions")
    print("- Attribute-based access control")
    print("- User-specific permissions")
    print("- Permission scoping by attributes")
    print("- Permission categories")

if __name__ == "__main__":
    demo_permissions()