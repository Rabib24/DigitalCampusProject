import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from faculty.models import Faculty
from permissions.models import Permission
from permissions.services import PermissionService

def assign_test_faculty_permissions():
    """Assign necessary permissions to test faculty user"""
    try:
        # Get the test faculty user
        user = User.objects.get(username='2221002')
        print(f"Found test faculty user: {user.username}")
        
        # Get faculty profile
        faculty = Faculty.objects.get(user=user)
        print(f"Faculty profile: {faculty.employee_id}, Department: {faculty.department}")
        
        # Assign course_view permission with department scope
        try:
            permission = Permission.objects.get(codename='course_view')
            scope = {'department': faculty.department}
            
            # Assign the permission to the user
            user_permission = PermissionService.assign_user_permission(
                user=user,
                permission=permission,
                scope=scope
            )
            
            print(f"Assigned 'course_view' permission with scope: {scope}")
            print(f"Permission ID: {user_permission.id}")
            
        except Permission.DoesNotExist:
            print("Permission 'course_view' not found")
            return
            
        # Also assign other necessary permissions
        permissions_to_assign = [
            'course_edit',
            'assignment_view',
            'assignment_create',
            'assignment_edit',
            'assignment_delete',
            'grade_view',
            'grade_edit',
            'research_view',
            'research_create',
            'research_edit',
            'student_view',
            'student_advisor_view'
        ]
        
        for codename in permissions_to_assign:
            try:
                permission = Permission.objects.get(codename=codename)
                scope = {'department': faculty.department} if 'course' in codename or 'student' in codename else None
                
                # Assign the permission to the user
                user_permission = PermissionService.assign_user_permission(
                    user=user,
                    permission=permission,
                    scope=scope
                )
                
                print(f"Assigned '{codename}' permission")
                
            except Permission.DoesNotExist:
                print(f"Permission '{codename}' not found")
                
        print("All permissions assigned successfully!")
        
        # Test the permissions
        print("\nTesting permissions:")
        has_course_view = user.has_attribute_permission('course_view', {'department': faculty.department})
        print(f"Has course_view permission with department scope: {has_course_view}")
        
        has_grade_edit = user.has_attribute_permission('grade_edit', {'department': faculty.department})
        print(f"Has grade_edit permission with department scope: {has_grade_edit}")
        
    except User.DoesNotExist:
        print("Test faculty user not found")
    except Faculty.DoesNotExist:
        print("Faculty profile not found")
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    assign_test_faculty_permissions()