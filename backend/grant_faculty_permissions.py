#!/usr/bin/env python
import os
import sys
import django
from django.utils import timezone
import uuid

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from permissions.models import Permission, UserPermission

def grant_all_faculty_permissions(username):
    """Grant all faculty-related permissions to a user"""
    try:
        # Get the user
        user = User.objects.get(username=username)
        print(f"Found user: {user.username} (ID: {user.id}, Role: {user.role})")
        
        # Get all permissions that are relevant for faculty
        faculty_permissions = Permission.objects.filter(
            codename__in=[
                'course_view', 'course_edit', 'course_create',
                'assignment_view', 'assignment_create', 'assignment_edit', 'assignment_delete',
                'grade_view', 'grade_edit',
                'research_view', 'research_create', 'research_edit',
                'student_view', 'student_advisor_view',
                'course_view_enrolled', 'assignment_view_own', 'grade_view_own',
                'course_manage', 'assignment_manage', 'grade_manage',
                'view_course', 'create_course', 'edit_course', 'delete_course',
                'view_assignment', 'create_assignment', 'edit_assignment', 'delete_assignment',
                'grade_assignment', 'view_grade', 'edit_grade',
                'view_student', 'edit_student',
                'view_research', 'create_research', 'edit_research',
                'view_publication', 'create_publication', 'edit_publication',
                'view_appointment', 'create_appointment', 'edit_appointment'
            ]
        )
        
        print(f"Found {faculty_permissions.count()} faculty-related permissions")
        
        # Grant all faculty permissions to the user
        granted_count = 0
        for permission in faculty_permissions:
            # Check if the user already has this permission
            existing_permission = UserPermission.objects.filter(
                user=user, 
                permission=permission
            ).first()
            
            if not existing_permission:
                # Create a new user permission
                user_permission = UserPermission(
                    id=str(uuid.uuid4()),
                    user=user,
                    permission=permission,
                    granted_at=timezone.now()
                )
                user_permission.save()
                granted_count += 1
                print(f"Granted permission: {permission.codename}")
            else:
                print(f"User already has permission: {permission.codename}")
        
        print(f"Successfully granted {granted_count} new permissions to user {username}")
        print(f"User now has a total of {UserPermission.objects.filter(user=user).count()} permissions")
        
        # List all permissions the user now has
        user_permissions = UserPermission.objects.filter(user=user)
        print("\nAll permissions for user:")
        for up in user_permissions:
            print(f"- {up.permission.codename}: {up.permission.name}")
            
    except User.DoesNotExist:
        print(f"User with username '{username}' does not exist")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Grant permissions to the faculty user
    grant_all_faculty_permissions('2221002')