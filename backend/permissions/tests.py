from django.test import TestCase
from django.utils import timezone
from users.models import User, Faculty
from .models import Permission, UserPermission, RolePermission
from .services import PermissionService

class PermissionTestCase(TestCase):
    def setUp(self):
        # Create test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            role='faculty'
        )
        
        # Create faculty profile
        self.faculty = Faculty.objects.create(
            user=self.user,
            employee_id='EMP001',
            department='Computer Science',
            title='Professor'
        )
        
        # Create test permissions
        self.view_course_perm = PermissionService.create_permission(
            id='perm_course_view',
            name='View Course',
            codename='course_view',
            description='Can view course details',
            category='course'
        )
        
        self.edit_course_perm = PermissionService.create_permission(
            id='perm_course_edit',
            name='Edit Course',
            codename='course_edit',
            description='Can edit course details',
            category='course'
        )
    
    def test_create_permission(self):
        """Test creating a permission"""
        permission = PermissionService.create_permission(
            id='perm_test',
            name='Test Permission',
            codename='test_permission',
            description='A test permission',
            category='test'
        )
        
        self.assertEqual(permission.name, 'Test Permission')
        self.assertEqual(permission.codename, 'test_permission')
        self.assertEqual(permission.category, 'test')
    
    def test_assign_user_permission(self):
        """Test assigning a permission to a user"""
        user_permission = PermissionService.assign_user_permission(
            self.user,
            self.view_course_perm,
            scope={'department': 'Computer Science'}
        )
        
        self.assertTrue(user_permission.is_active())
        self.assertEqual(user_permission.user, self.user)
        self.assertEqual(user_permission.permission, self.view_course_perm)
        self.assertEqual(user_permission.scope, {'department': 'Computer Science'})
    
    def test_remove_user_permission(self):
        """Test removing a permission from a user"""
        # First assign permission
        PermissionService.assign_user_permission(self.user, self.view_course_perm)
        
        # Then remove it
        result = PermissionService.remove_user_permission(self.user, self.view_course_perm)
        self.assertTrue(result)
        
        # Try to remove again (should fail)
        result = PermissionService.remove_user_permission(self.user, self.view_course_perm)
        self.assertFalse(result)
    
    def test_assign_role_permission(self):
        """Test assigning a permission to a role"""
        role_permission = PermissionService.assign_role_permission(
            'faculty',
            self.edit_course_perm,
            scope_template={'department': ['Computer Science', 'Electrical Engineering']}
        )
        
        self.assertEqual(role_permission.role, 'faculty')
        self.assertEqual(role_permission.permission, self.edit_course_perm)
        self.assertEqual(
            role_permission.scope_template,
            {'department': ['Computer Science', 'Electrical Engineering']}
        )
    
    def test_user_has_permission(self):
        """Test checking if user has a permission"""
        # Initially user should not have permission
        self.assertFalse(self.user.has_permission('course_view'))
        
        # Assign permission to user
        PermissionService.assign_user_permission(self.user, self.view_course_perm)
        
        # Now user should have permission
        self.assertTrue(self.user.has_permission('course_view'))
    
    def test_user_has_attribute_permission(self):
        """Test checking if user has a permission with specific attributes"""
        # Assign permission with scope
        PermissionService.assign_user_permission(
            self.user,
            self.view_course_perm,
            scope={'department': 'Computer Science'}
        )
        
        # User should have permission with matching attributes
        self.assertTrue(
            self.user.has_attribute_permission(
                'course_view',
                {'department': 'Computer Science'}
            )
        )
        
        # User should not have permission with non-matching attributes
        self.assertFalse(
            self.user.has_attribute_permission(
                'course_view',
                {'department': 'Mathematics'}
            )
        )
    
    def test_role_based_permissions(self):
        """Test role-based permissions"""
        # Assign permission to faculty role
        PermissionService.assign_role_permission(
            'faculty',
            self.edit_course_perm,
            scope_template={'department': []}
        )
        
        # Faculty user should have the permission
        self.assertTrue(self.user.has_permission('course_edit'))
        
        # Faculty user should have permission with matching scope
        self.assertTrue(
            self.user.has_attribute_permission(
                'course_edit',
                {'department': 'Computer Science'}
            )
        )
    
    def test_get_user_permissions(self):
        """Test getting all permissions for a user"""
        # Assign some permissions
        PermissionService.assign_user_permission(self.user, self.view_course_perm)
        PermissionService.assign_role_permission('faculty', self.edit_course_perm)
        
        # Get user permissions
        permissions = PermissionService.get_user_permissions(self.user)
        
        # Should have both permissions
        permission_codenames = [p.codename for p in permissions]
        self.assertIn('course_view', permission_codenames)
        self.assertIn('course_edit', permission_codenames)