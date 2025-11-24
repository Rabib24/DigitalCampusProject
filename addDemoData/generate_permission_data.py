import os
import sys
import django
import random
from datetime import datetime, timedelta
import json

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from permissions.models import Permission, UserPermission, RolePermission
from users.models import User

def generate_permission_data():
    """Generate demo permission data"""
    print("Generating demo permission data...")
    
    # Get all users
    all_users = User.objects.all()
    if not all_users.exists():
        print("No users found. Please generate users first.")
        return
    
    # Get faculty users for specific permissions
    faculty_users = User.objects.filter(role='faculty')
    
    # Define permissions
    permissions_data = [
        # Course permissions
        {"id": "course_view", "name": "View Course", "codename": "view_course", "description": "Can view course information", "category": "course"},
        {"id": "course_create", "name": "Create Course", "codename": "create_course", "description": "Can create new courses", "category": "course"},
        {"id": "course_edit", "name": "Edit Course", "codename": "edit_course", "description": "Can edit existing courses", "category": "course"},
        {"id": "course_delete", "name": "Delete Course", "codename": "delete_course", "description": "Can delete courses", "category": "course"},
        
        # Assignment permissions
        {"id": "assignment_view", "name": "View Assignment", "codename": "view_assignment", "description": "Can view assignments", "category": "assignment"},
        {"id": "assignment_create", "name": "Create Assignment", "codename": "create_assignment", "description": "Can create new assignments", "category": "assignment"},
        {"id": "assignment_edit", "name": "Edit Assignment", "codename": "edit_assignment", "description": "Can edit existing assignments", "category": "assignment"},
        {"id": "assignment_delete", "name": "Delete Assignment", "codename": "delete_assignment", "description": "Can delete assignments", "category": "assignment"},
        {"id": "assignment_grade", "name": "Grade Assignment", "codename": "grade_assignment", "description": "Can grade assignments", "category": "assignment"},
        
        # Grade permissions
        {"id": "grade_view", "name": "View Grade", "codename": "view_grade", "description": "Can view grades", "category": "grade"},
        {"id": "grade_edit", "name": "Edit Grade", "codename": "edit_grade", "description": "Can edit grades", "category": "grade"},
        
        # Student permissions
        {"id": "student_view", "name": "View Student", "codename": "view_student", "description": "Can view student information", "category": "student"},
        {"id": "student_edit", "name": "Edit Student", "codename": "edit_student", "description": "Can edit student information", "category": "student"},
        
        # Faculty permissions
        {"id": "faculty_view", "name": "View Faculty", "codename": "view_faculty", "description": "Can view faculty information", "category": "faculty"},
        {"id": "faculty_edit", "name": "Edit Faculty", "codename": "edit_faculty", "description": "Can edit faculty information", "category": "faculty"},
        
        # Research permissions
        {"id": "research_view", "name": "View Research", "codename": "view_research", "description": "Can view research projects", "category": "research"},
        {"id": "research_create", "name": "Create Research", "codename": "create_research", "description": "Can create research projects", "category": "research"},
        {"id": "research_edit", "name": "Edit Research", "codename": "edit_research", "description": "Can edit research projects", "category": "research"},
        
        # Publication permissions
        {"id": "publication_view", "name": "View Publication", "codename": "view_publication", "description": "Can view publications", "category": "publication"},
        {"id": "publication_create", "name": "Create Publication", "codename": "create_publication", "description": "Can create publications", "category": "publication"},
        {"id": "publication_edit", "name": "Edit Publication", "codename": "edit_publication", "description": "Can edit publications", "category": "publication"},
        
        # Financial permissions
        {"id": "finance_view", "name": "View Financial Information", "codename": "view_finance", "description": "Can view financial information", "category": "finance"},
        {"id": "finance_edit", "name": "Edit Financial Information", "codename": "edit_finance", "description": "Can edit financial information", "category": "finance"},
        
        # Library permissions
        {"id": "library_view", "name": "View Library", "codename": "view_library", "description": "Can view library information", "category": "library"},
        {"id": "library_checkout", "name": "Checkout Library Items", "codename": "checkout_library", "description": "Can checkout library items", "category": "library"},
        
        # Communication permissions
        {"id": "notification_view", "name": "View Notifications", "codename": "view_notification", "description": "Can view notifications", "category": "communication"},
        {"id": "notification_create", "name": "Create Notifications", "codename": "create_notification", "description": "Can create notifications", "category": "communication"},
        {"id": "alert_view", "name": "View Alerts", "codename": "view_alert", "description": "Can view alerts", "category": "communication"},
        {"id": "alert_create", "name": "Create Alerts", "codename": "create_alert", "description": "Can create alerts", "category": "communication"},
        
        # Appointment permissions
        {"id": "appointment_view", "name": "View Appointments", "codename": "view_appointment", "description": "Can view appointments", "category": "appointment"},
        {"id": "appointment_create", "name": "Create Appointments", "codename": "create_appointment", "description": "Can create appointments", "category": "appointment"},
        {"id": "appointment_edit", "name": "Edit Appointments", "codename": "edit_appointment", "description": "Can edit appointments", "category": "appointment"},
        
        # Admin permissions
        {"id": "admin_view", "name": "View Admin Panel", "codename": "view_admin", "description": "Can view admin panel", "category": "admin"},
        {"id": "admin_edit", "name": "Edit Admin Settings", "codename": "edit_admin", "description": "Can edit admin settings", "category": "admin"},
        {"id": "user_manage", "name": "Manage Users", "codename": "manage_user", "description": "Can manage users", "category": "admin"},
    ]
    
    # Create permissions
    permissions = []
    for perm_data in permissions_data:
        permission, created = Permission.objects.get_or_create(
            id=perm_data["id"],
            defaults={
                "name": perm_data["name"],
                "codename": perm_data["codename"],
                "description": perm_data["description"],
                "category": perm_data["category"]
            }
        )
        permissions.append(permission)
    
    # Create role-based permissions
    role_permissions_data = [
        # Student role permissions
        {"role": "student", "permission": "course_view", "scope_template": {"department": "*"}},
        {"role": "student", "permission": "assignment_view", "scope_template": {"course": "*"}},
        {"role": "student", "permission": "grade_view", "scope_template": {"student": "self"}},
        {"role": "student", "permission": "library_view", "scope_template": {}},
        {"role": "student", "permission": "library_checkout", "scope_template": {}},
        {"role": "student", "permission": "notification_view", "scope_template": {"user": "self"}},
        
        # Faculty role permissions
        {"role": "faculty", "permission": "course_view", "scope_template": {"department": "self"}},
        {"role": "faculty", "permission": "course_edit", "scope_template": {"course": "taught"}},
        {"role": "faculty", "permission": "assignment_view", "scope_template": {"course": "taught"}},
        {"role": "faculty", "permission": "assignment_create", "scope_template": {"course": "taught"}},
        {"role": "faculty", "permission": "assignment_edit", "scope_template": {"course": "taught"}},
        {"role": "faculty", "permission": "assignment_grade", "scope_template": {"course": "taught"}},
        {"role": "faculty", "permission": "grade_view", "scope_template": {"course": "taught"}},
        {"role": "faculty", "permission": "grade_edit", "scope_template": {"course": "taught"}},
        {"role": "faculty", "permission": "student_view", "scope_template": {"course": "taught"}},
        {"role": "faculty", "permission": "research_view", "scope_template": {"owner": "self"}},
        {"role": "faculty", "permission": "research_create", "scope_template": {}},
        {"role": "faculty", "permission": "publication_view", "scope_template": {"author": "self"}},
        {"role": "faculty", "permission": "publication_create", "scope_template": {}},
        {"role": "faculty", "permission": "appointment_view", "scope_template": {"faculty": "self"}},
        
        # Admin role permissions
        {"role": "admin", "permission": "admin_view", "scope_template": {}},
        {"role": "admin", "permission": "admin_edit", "scope_template": {}},
        {"role": "admin", "permission": "user_manage", "scope_template": {}},
        {"role": "admin", "permission": "course_view", "scope_template": {}},
        {"role": "admin", "permission": "course_create", "scope_template": {}},
        {"role": "admin", "permission": "course_edit", "scope_template": {}},
        {"role": "admin", "permission": "course_delete", "scope_template": {}},
        {"role": "admin", "permission": "finance_view", "scope_template": {}},
        {"role": "admin", "permission": "finance_edit", "scope_template": {}},
        {"role": "admin", "permission": "alert_create", "scope_template": {}},
    ]
    
    # Create role permissions
    for role_perm_data in role_permissions_data:
        try:
            permission = Permission.objects.get(codename=role_perm_data["permission"])
            RolePermission.objects.get_or_create(
                id=f"RP{random.randint(10000, 99999)}",
                role=role_perm_data["role"],
                permission=permission,
                defaults={
                    "scope_template": role_perm_data["scope_template"]
                }
            )
        except Permission.DoesNotExist:
            print(f"Permission {role_perm_data['permission']} not found")
    
    # Create user-specific permissions
    # Give some faculty members additional permissions
    if faculty_users.exists():
        for faculty in faculty_users[:5]:  # First 5 faculty members
            # Select 3-5 random permissions
            selected_permissions = random.sample(permissions, random.randint(3, 5))
            
            for permission in selected_permissions:
                # Check if this permission already exists for this user
                if not UserPermission.objects.filter(user=faculty, permission=permission).exists():
                    # Set expiration for some permissions
                    expires_at = None
                    if random.choice([True, False]):
                        expires_at = datetime.now() + timedelta(days=random.randint(30, 365))
                    
                    UserPermission.objects.create(
                        id=f"UP{random.randint(10000, 99999)}",
                        user=faculty,
                        permission=permission,
                        granted_by=random.choice(all_users),
                        expires_at=expires_at,
                        scope=json.dumps({"department": faculty.faculty.department}) if hasattr(faculty, 'faculty') else {}
                    )
    
    print("Demo permission data generated successfully!")

if __name__ == '__main__':
    generate_permission_data()