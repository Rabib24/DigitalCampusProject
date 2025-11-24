from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    """Base User model extending Django's AbstractUser"""
    
    # Role choices
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('faculty', 'Faculty'),
        ('admin', 'Admin'),
        ('staff', 'Staff'),
    ]
    
    # Status choices
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('suspended', 'Suspended'),
    ]
    
    # Additional fields
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    phone_number = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    sso_id = models.CharField(max_length=100, blank=True)
    mfa_enabled = models.BooleanField()
    last_password_change = models.DateTimeField(null=True, blank=True)
    failed_login_attempts = models.IntegerField(default=0)
    locked_until = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(null=True, blank=True)
    
    # Address fields (as a JSON field to store object)
    address = models.JSONField(null=True, blank=True)
    
    # Profile fields (as a JSON field to store object)
    profile = models.JSONField(null=True, blank=True)
    
    # Preferences fields (as a JSON field to store array)
    preferences = models.JSONField(null=True, blank=True)
    
    # Emergency contact (as a JSON field to store object)
    emergency_contact = models.JSONField(null=True, blank=True)
    
    def get_full_name(self):
        """Return the full name of the user"""
        return f"{self.first_name} {self.last_name}"
    
    def update_last_login(self):
        """Update the last login time"""
        self.last_login = timezone.now()
        self.save()
    
    def update_preferences(self, preferences):
        """Update user preferences"""
        self.preferences = preferences
        self.save()
    
    def has_role(self, role):
        """Check if user has a specific role"""
        return self.role == role
    
    def is_admin(self):
        """Check if user is an admin"""
        return self.role == 'admin'
    
    def is_active_user(self):
        """Check if user is active"""
        return self.status == 'active'
    
    def deactivate(self):
        """Deactivate the user"""
        self.status = 'inactive'
        self.save()
    
    def suspend(self):
        """Suspend the user"""
        self.status = 'suspended'
        self.save()
    
    def get_dashboard_widgets(self):
        """Get user's dashboard widgets from preferences"""
        if self.preferences and isinstance(self.preferences, dict) and 'dashboard_widgets' in self.preferences:
            return self.preferences['dashboard_widgets']
        return []
    
    def get_permissions(self):
        """Get user permissions based on role and specific assignments"""
        from permissions.models import Permission, UserPermission, RolePermission
        
        # Get permissions from role templates
        role_permissions = RolePermission.objects.filter(role=self.role).select_related('permission')
        permissions = {rp.permission.codename: rp.permission for rp in role_permissions}
        
        # Get user-specific permissions
        user_permissions = UserPermission.objects.filter(user=self).select_related('permission')
        for up in user_permissions:
            if up.is_active():
                permissions[up.permission.codename] = up.permission
        
        return list(permissions.values())
    
    def has_permission(self, codename):
        """Check if user has a specific permission"""
        from permissions.models import Permission, UserPermission, RolePermission
        
        # Check role-based permissions
        role_perms = RolePermission.objects.filter(role=self.role).select_related('permission')
        if role_perms.filter(permission__codename=codename).exists():
            return True
        
        # Check user-specific permissions
        user_perms = UserPermission.objects.filter(user=self).select_related('permission')
        for up in user_perms:
            if up.is_active() and up.permission.codename == codename:
                return True
        
        return False
    
    def has_attribute_permission(self, codename, attributes=None):
        """Check if user has a specific permission with given attributes"""
        from permissions.models import Permission, UserPermission, RolePermission
        
        # Check role-based permissions with attribute scope
        role_perms = RolePermission.objects.filter(role=self.role).select_related('permission')
        for rp in role_perms:
            if rp.permission.codename == codename:
                # If no specific attributes required, role permission is sufficient
                if not attributes:
                    return True
                
                # Check if role permission scope matches attributes
                if self._matches_scope(rp.scope_template, attributes):
                    return True
        
        # Check user-specific permissions with attribute scope
        user_perms = UserPermission.objects.filter(user=self).select_related('permission')
        for up in user_perms:
            if up.is_active() and up.permission.codename == codename:
                # If no specific attributes required, user permission is sufficient
                if not attributes:
                    return True
                
                # Check if user permission scope matches attributes
                if self._matches_scope(up.scope, attributes):
                    return True
        
        return False
    
    def _matches_scope(self, scope, attributes):
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
    
    def to_json(self):
        """Convert user to JSON format"""
        # Convert datetime fields to string representations
        created_at_str = None
        last_login_str = None
        
        try:
            if self.created_at:
                created_at_str = str(self.created_at)
        except:
            pass
            
        try:
            if self.last_login:
                last_login_str = str(self.last_login)
        except:
            pass
        
        return {
            'id': str(self.pk),
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'role': self.role,
            'status': self.status,
            'created_at': created_at_str,
            'last_login': last_login_str,
        }
    
    def __str__(self):
        return f"{self.username} ({self.get_full_name()})"


class Student(models.Model):
    """Student model extending User"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    student_id = models.CharField(max_length=50, unique=True)
    degree_program = models.CharField(max_length=100, blank=True)
    advisor_id = models.CharField(max_length=50, blank=True)
    graduation_date = models.DateField(null=True, blank=True)
    cumulative_gpa = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    library_card_number = models.CharField(max_length=50, blank=True)
    library_fines = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # These fields will store references as JSON arrays
    enrollments = models.JSONField(null=True, blank=True)  # Array of enrollment references
    courses = models.JSONField(null=True, blank=True)  # Array of courses taken
    current_courses = models.JSONField(null=True, blank=True)  # Array of currently registered courses
    completed_courses = models.JSONField(null=True, blank=True)  # Array of completed courses with grades
    financial_aid = models.JSONField(null=True, blank=True)  # Array of financial aid records
    billing_info = models.JSONField(null=True, blank=True)  # Object: payment methods, billing history
    housing_application = models.JSONField(null=True, blank=True)  # Object: housing preferences, status
    meal_plan = models.JSONField(null=True, blank=True)  # Object: current plan, balance
    academic_records = models.JSONField(null=True, blank=True)  # Array: transcripts, degrees
    library_books = models.JSONField(null=True, blank=True)  # Array: borrowed library books
    
    def add_enrollment(self, enrollment):
        """Add an enrollment to the student's enrollments"""
        if self.enrollments is None:
            self.enrollments = []
        if isinstance(self.enrollments, list):
            self.enrollments.append(enrollment)
        self.save()
    
    def add_course(self, course):
        """Add a course to the student's courses"""
        if self.courses is None:
            if self.graduation_date:
                graduation_date_str = str(self.graduation_date)
        except:
            pass
        
        cumulative_gpa_value = None
        try:
            if self.cumulative_gpa is not None:
                cumulative_gpa_value = float(str(self.cumulative_gpa))
        except:
            pass
        
        return {
            'student_id': self.student_id,
            'user_id': str(getattr(self.user, 'pk', '')),
            'degree_program': self.degree_program,
            'advisor_id': self.advisor_id,
            'graduation_date': graduation_date_str,
            'cumulative_gpa': cumulative_gpa_value,
        }
    
    def __str__(self):
        user_first_name = getattr(self.user, 'first_name', '')
        user_last_name = getattr(self.user, 'last_name', '')
        return f"Student: {user_first_name} {user_last_name} ({self.student_id})"


class Faculty(models.Model):
    """Faculty model extending User"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    employee_id = models.CharField(max_length=50, unique=True)
    department = models.CharField(max_length=100, blank=True)
    office_location = models.CharField(max_length=100, blank=True)
    title = models.CharField(max_length=100, blank=True)
    hire_date = models.DateField(null=True, blank=True)
    
    # These fields will store references as JSON arrays
    courses = models.JSONField(null=True, blank=True)  # Array of courses taught
    research_projects = models.JSONField(null=True, blank=True)  # Array of research projects
    office_hours = models.JSONField(null=True, blank=True)  # Array of time slots
    publications = models.JSONField(null=True, blank=True)  # Array of publications
    
    def add_course(self, course):
        """Add a course to the faculty's courses"""
        if self.courses is None:
            self.courses = []
        if isinstance(self.courses, list):
            self.courses.append(course)
        self.save()
    
    def get_teaching_schedule(self):
        """Get the faculty's teaching schedule"""
        # This would return the faculty's teaching schedule
        return self.courses
    
    def to_json(self):
        """Convert faculty to JSON format"""
        # Convert date fields to string representations
        hire_date_str = None
        try:
            if self.hire_date:
                hire_date_str = str(self.hire_date)
        except:
            pass
        
        return {
            'employee_id': self.employee_id,
            'user_id': str(getattr(self.user, 'pk', '')),
            'department': self.department,
            'office_location': self.office_location,
            'title': self.title,
            'hire_date': hire_date_str,
        }
    
    def __str__(self):
        user_first_name = getattr(self.user, 'first_name', '')
        user_last_name = getattr(self.user, 'last_name', '')
        return f"Faculty: {user_first_name} {user_last_name} ({self.employee_id})"


class Admin(models.Model):
    """Admin model extending User"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    employee_id = models.CharField(max_length=50, unique=True)
    department = models.CharField(max_length=100, blank=True)
    hire_date = models.DateField(null=True, blank=True)
    
    # Permissions as JSON array
    permissions = models.JSONField(null=True, blank=True)  # Array of system permissions
    
    def to_json(self):
        """Convert admin to JSON format"""
        # Convert date fields to string representations
        hire_date_str = None
        try:
            if self.hire_date:
                hire_date_str = str(self.hire_date)
        except:
            pass
        
        return {
            'employee_id': self.employee_id,
            'user_id': str(getattr(self.user, 'pk', '')),
            'department': self.department,
            'hire_date': hire_date_str,
        }
    
    def __str__(self):
        user_first_name = getattr(self.user, 'first_name', '')
        user_last_name = getattr(self.user, 'last_name', '')
        return f"Admin: {user_first_name} {user_last_name} ({self.employee_id})"


class Staff(models.Model):
    """Staff model extending User"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    employee_id = models.CharField(max_length=50, unique=True)
    department = models.CharField(max_length=100, blank=True)
    hire_date = models.DateField(null=True, blank=True)
    supervisor_id = models.CharField(max_length=50, blank=True)
    
    def to_json(self):
        """Convert staff to JSON format"""
        # Convert date fields to string representations
        hire_date_str = None
        try:
            if self.hire_date:
                hire_date_str = str(self.hire_date)
        except:
            pass
        
        return {
            'employee_id': self.employee_id,
            'user_id': str(getattr(self.user, 'pk', '')),
            'department': self.department,
            'hire_date': hire_date_str,
            'supervisor_id': self.supervisor_id,
        }
    
    def __str__(self):
        user_first_name = getattr(self.user, 'first_name', '')
        user_last_name = getattr(self.user, 'last_name', '')
        return f"Staff: {user_first_name} {user_last_name} ({self.employee_id})"