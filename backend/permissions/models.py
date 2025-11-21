from django.db import models
from django.utils import timezone
from users.models import User

class Permission(models.Model):
    """Permission model for fine-grained access control"""
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)
    codename = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50)  # e.g., 'course', 'assignment', 'grade', 'research'
    created_at = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return f"{self.name} ({self.codename})"
    
    def to_json(self):
        """Convert permission to JSON format"""
        created_at_str = None
        try:
            if self.created_at:
                created_at_str = str(self.created_at)
        except:
            pass
            
        return {
            'id': self.id,
            'name': self.name,
            'codename': self.codename,
            'description': self.description,
            'category': self.category,
            'created_at': created_at_str,
        }

class UserPermission(models.Model):
    """User-specific permission assignments"""
    id = models.CharField(max_length=50, primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)
    granted_at = models.DateTimeField(default=timezone.now)
    granted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='granted_permissions')
    expires_at = models.DateTimeField(null=True, blank=True)
    scope = models.JSONField(null=True, blank=True)  # Attribute-based scope (e.g., specific course IDs, department filters)
    
    class Meta:
        unique_together = ('user', 'permission')
    
    def is_active(self):
        """Check if the permission is currently active"""
        if self.expires_at and self.expires_at < timezone.now():
            return False
        return True
    
    def to_json(self):
        """Convert user permission to JSON format"""
        granted_at_str = None
        expires_at_str = None
        
        try:
            if self.granted_at:
                granted_at_str = str(self.granted_at)
        except:
            pass
            
        try:
            if self.expires_at:
                expires_at_str = str(self.expires_at)
        except:
            pass
            
        return {
            'id': self.id,
            'user_id': str(self.user.id),
            'permission': self.permission.to_json(),
            'granted_at': granted_at_str,
            'granted_by': str(self.granted_by.id) if self.granted_by else None,
            'expires_at': expires_at_str,
            'scope': self.scope,
        }

class RolePermission(models.Model):
    """Role-based permission templates"""
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('faculty', 'Faculty'),
        ('admin', 'Admin'),
        ('staff', 'Staff'),
    ]
    
    id = models.CharField(max_length=50, primary_key=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)
    scope_template = models.JSONField(null=True, blank=True)  # Default scope for this role-permission combination
    
    class Meta:
        unique_together = ('role', 'permission')
    
    def to_json(self):
        """Convert role permission to JSON format"""
        return {
            'id': self.id,
            'role': self.role,
            'permission': self.permission.to_json(),
            'scope_template': self.scope_template,
        }