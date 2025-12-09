from django.db import models
from django.utils import timezone


class EnrollmentPeriod(models.Model):
    """Model to track enrollment periods for different student groups"""
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    student_group = models.CharField(max_length=50, blank=True)  # e.g., 'freshmen', 'sophomores', etc.
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['start_date', 'end_date']
    
    def is_current(self):
        """Check if this enrollment period is currently active"""
        current_datetime = timezone.now()
        return self.is_active and self.start_date <= current_datetime <= self.end_date
    
    def to_json(self):
        """Convert enrollment period to JSON format"""
        # Convert datetime fields to string representations
        start_date_str = None
        end_date_str = None
        created_at_str = None
        updated_at_str = None
        
        try:
            if self.start_date:
                start_date_str = self.start_date.isoformat()
        except:
            pass
            
        try:
            if self.end_date:
                end_date_str = self.end_date.isoformat()
        except:
            pass
            
        try:
            if self.created_at:
                created_at_str = self.created_at.isoformat()
        except:
            pass
            
        try:
            if self.updated_at:
                updated_at_str = self.updated_at.isoformat()
        except:
            pass
        
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'start_date': start_date_str,
            'end_date': end_date_str,
            'student_group': self.student_group,
            'is_active': self.is_active,
            'created_at': created_at_str,
            'updated_at': updated_at_str,
        }
    
    def __str__(self):
        return f"{self.name} ({self.start_date} to {self.end_date})"


class StudentEnrollmentHistory(models.Model):
    """Model to track detailed student enrollment history"""
    id = models.CharField(max_length=50, primary_key=True)
    student = models.ForeignKey('users.Student', on_delete=models.CASCADE, related_name='enrollment_history')
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='student_enrollments')
    section = models.ForeignKey('courses.Section', on_delete=models.CASCADE, related_name='student_enrollments', null=True, blank=True)
    enrollment_period = models.ForeignKey('student.EnrollmentPeriod', on_delete=models.CASCADE, related_name='enrollments', null=True, blank=True)
    
    # Enrollment details
    enrollment_date = models.DateTimeField(default=timezone.now)
    drop_date = models.DateTimeField(null=True, blank=True)
    completion_date = models.DateTimeField(null=True, blank=True)
    
    # Status tracking
    status = models.CharField(max_length=20, default='enrolled')  # enrolled, dropped, completed, waitlisted
    grade = models.CharField(max_length=10, blank=True)
    
    # Additional information
    enrollment_type = models.CharField(max_length=20, default='regular')  # regular, waitlist, override, transfer
    waitlist_position = models.IntegerField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    # Audit fields
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    STATUS_CHOICES = [
        ('enrolled', 'Enrolled'),
        ('dropped', 'Dropped'),
        ('completed', 'Completed'),
        ('waitlisted', 'Waitlisted'),
    ]
    
    ENROLLMENT_TYPE_CHOICES = [
        ('regular', 'Regular'),
        ('waitlist', 'Waitlist'),
        ('override', 'Override'),
        ('transfer', 'Transfer'),
    ]
    
    class Meta:
        ordering = ['-enrollment_date']
        unique_together = ('student', 'course', 'section', 'enrollment_period')
    
    def drop_enrollment(self, drop_date=None):
        """Mark enrollment as dropped"""
        self.status = 'dropped'
        self.drop_date = drop_date or timezone.now()
        self.save()
    
    def complete_enrollment(self, grade='', completion_date=None):
        """Mark enrollment as completed"""
        self.status = 'completed'
        self.grade = grade
        self.completion_date = completion_date or timezone.now()
        self.save()
    
    def waitlist_enrollment(self, position=None):
        """Place enrollment on waitlist"""
        self.status = 'waitlisted'
        self.waitlist_position = position
        self.save()
    
    def to_json(self):
        """Convert enrollment history to JSON format"""
        # Convert datetime fields to string representations
        enrollment_date_str = None
        drop_date_str = None
        completion_date_str = None
        created_at_str = None
        updated_at_str = None
        
        try:
            if self.enrollment_date:
                enrollment_date_str = str(self.enrollment_date)
        except:
            pass
            
        try:
            if self.drop_date:
                drop_date_str = str(self.drop_date)
        except:
            pass
            
        try:
            if self.completion_date:
                completion_date_str = str(self.completion_date)
        except:
            pass
            
        try:
            if self.created_at:
                created_at_str = str(self.created_at)
        except:
            pass
            
        try:
            if self.updated_at:
                updated_at_str = str(self.updated_at)
        except:
            pass
        
        return {
            'id': self.id,
            'student_id': self.student.student_id,
            'course_id': self.course.id,
            'section_id': self.section.id if self.section else None,
            'enrollment_period_id': self.enrollment_period.id if self.enrollment_period else None,
            'enrollment_date': enrollment_date_str,
            'drop_date': drop_date_str,
            'completion_date': completion_date_str,
            'status': self.status,
            'grade': self.grade,
            'enrollment_type': self.enrollment_type,
            'waitlist_position': self.waitlist_position,
            'notes': self.notes,
            'created_at': created_at_str,
            'updated_at': updated_at_str,
        }
    
    def __str__(self):
        section_info = f" (Section {self.section.section_number})" if self.section else ""
        period_info = f" in {self.enrollment_period.name}" if self.enrollment_period else ""
        return f"Enrollment History: {self.student.student_id} in {self.course.code}{section_info}{period_info}"


class FacultyCourseAssignment(models.Model):
    """Model to track faculty course assignments with detailed information"""
    id = models.CharField(max_length=50, primary_key=True)
    faculty = models.ForeignKey('users.Faculty', on_delete=models.CASCADE, related_name='course_assignments')
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='faculty_assignments')
    section = models.ForeignKey('courses.Section', on_delete=models.CASCADE, related_name='faculty_assignments', null=True, blank=True)
    
    # Assignment details
    assignment_date = models.DateTimeField(default=timezone.now)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)  # For temporary assignments
    
    # Role and responsibilities
    role = models.CharField(max_length=50, default='instructor')  # instructor, teaching_assistant, guest_lecturer
    is_primary = models.BooleanField(default=True)  # Primary instructor vs secondary
    
    # Additional information
    workload_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=100.00)  # Percentage of workload
    notes = models.TextField(blank=True)
    
    # Audit fields
    assigned_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='faculty_assignments_made')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    ROLE_CHOICES = [
        ('instructor', 'Instructor'),
        ('teaching_assistant', 'Teaching Assistant'),
        ('guest_lecturer', 'Guest Lecturer'),
        ('course_coordinator', 'Course Coordinator'),
    ]
    
    class Meta:
        ordering = ['-assignment_date']
        unique_together = ('faculty', 'course', 'section', 'start_date')
    
    def is_active(self):
        """Check if this assignment is currently active"""
        current_date = timezone.now().date()
        return self.start_date <= current_date and (self.end_date is None or self.end_date >= current_date)
    
    def to_json(self):
        """Convert faculty course assignment to JSON format"""
        # Convert datetime fields to string representations
        assignment_date_str = None
        start_date_str = None
        end_date_str = None
        created_at_str = None
        updated_at_str = None
        
        try:
            if self.assignment_date:
                assignment_date_str = str(self.assignment_date)
        except:
            pass
            
        try:
            if self.start_date:
                start_date_str = str(self.start_date)
        except:
            pass
            
        try:
            if self.end_date:
                end_date_str = str(self.end_date)
        except:
            pass
            
        try:
            if self.created_at:
                created_at_str = str(self.created_at)
        except:
            pass
            
        try:
            if self.updated_at:
                updated_at_str = str(self.updated_at)
        except:
            pass
        
        return {
            'id': self.id,
            'faculty_id': self.faculty.employee_id,
            'course_id': self.course.id,
            'section_id': self.section.id if self.section else None,
            'assignment_date': assignment_date_str,
            'start_date': start_date_str,
            'end_date': end_date_str,
            'role': self.role,
            'is_primary': self.is_primary,
            'workload_percentage': float(self.workload_percentage),
            'notes': self.notes,
            'assigned_by_id': self.assigned_by.id if self.assigned_by else None,
            'created_at': created_at_str,
            'updated_at': updated_at_str,
        }
    
    def __str__(self):
        section_info = f" (Section {self.section.section_number})" if self.section else ""
        role_info = f" as {self.role}" if self.role != 'instructor' else ""
        return f"Faculty Assignment: {self.faculty.employee_id} to {self.course.code}{section_info}{role_info}"


class EnrollmentAuditLog(models.Model):
    """Model to track all enrollment-related actions for audit purposes"""
    id = models.CharField(max_length=50, primary_key=True)
    student = models.ForeignKey('users.Student', on_delete=models.CASCADE, related_name='enrollment_audit_logs')
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='enrollment_audit_logs', null=True, blank=True)
    section = models.ForeignKey('courses.Section', on_delete=models.CASCADE, related_name='enrollment_audit_logs', null=True, blank=True)
    action = models.CharField(max_length=50)  # enroll, drop, add_to_cart, remove_from_cart, etc.
    action_details = models.JSONField(null=True, blank=True)  # Additional details about the action
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    timestamp = models.DateTimeField(default=timezone.now)
    
    ACTION_CHOICES = [
        ('enroll', 'Enroll'),
        ('drop', 'Drop'),
        ('add_to_cart', 'Add to Cart'),
        ('remove_from_cart', 'Remove from Cart'),
        ('clear_cart', 'Clear Cart'),
        ('enroll_from_cart', 'Enroll from Cart'),
        ('view_courses', 'View Courses'),
        ('search_courses', 'Search Courses'),
        ('view_cart', 'View Cart'),
        ('view_waitlist', 'View Waitlist'),
    ]
    
    class Meta:
        ordering = ['-timestamp']
    
    def to_json(self):
        """Convert enrollment audit log to JSON format"""
        # Convert datetime fields to string representations
        timestamp_str = None
        
        try:
            if self.timestamp:
                timestamp_str = str(self.timestamp)
        except:
            pass
        
        return {
            'id': self.id,
            'student_id': self.student.student_id,
            'course_id': self.course.id if self.course else None,
            'section_id': self.section.id if self.section else None,
            'action': self.action,
            'action_details': self.action_details,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'timestamp': timestamp_str,
        }
    
    def __str__(self):
        course_info = f" in {self.course.code}" if self.course else ""
        return f"Enrollment Audit Log: {self.student.student_id} {self.action}{course_info} at {self.timestamp}"


class FacultyApprovalRequest(models.Model):
    """Model to track faculty/advisor approval requests for special enrollment cases"""
    APPROVAL_TYPES = [
        ('prerequisite_override', 'Prerequisite Override'),
        ('capacity_override', 'Capacity Override'),
        ('time_period_override', 'Time Period Override'),
        ('restricted_course', 'Restricted Course Access'),
        ('academic_plan_exception', 'Academic Plan Exception'),
        ('other', 'Other')
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('needs_revision', 'Needs Revision')
    ]
    
    id = models.CharField(max_length=50, primary_key=True)
    student = models.ForeignKey('users.Student', on_delete=models.CASCADE, related_name='faculty_approval_requests')
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='faculty_approval_requests')
    faculty = models.ForeignKey('users.Faculty', on_delete=models.CASCADE, related_name='approval_requests')
    
    # Request details
    approval_type = models.CharField(max_length=50, choices=APPROVAL_TYPES)
    reason = models.TextField()
    supporting_documents = models.JSONField(null=True, blank=True)  # URLs or file references
    
    # Status tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    submitted_at = models.DateTimeField(default=timezone.now)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewer_notes = models.TextField(blank=True)  # Notes from faculty during review
    
    # Approval details
    approved_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_requests')
    approval_conditions = models.TextField(blank=True)  # Any conditions for approval
    
    class Meta:
        ordering = ['-submitted_at']
    
    def approve(self, faculty_user, conditions=''):
        """Approve the faculty approval request"""
        self.status = 'approved'
        self.reviewed_at = timezone.now()
        self.approved_by = faculty_user
        self.approval_conditions = conditions
        self.save()
    
    def reject(self, faculty_user, notes=''):
        """Reject the faculty approval request"""
        self.status = 'rejected'
        self.reviewed_at = timezone.now()
        self.approved_by = faculty_user
        self.reviewer_notes = notes
        self.save()
    
    def request_revision(self, faculty_user, notes=''):
        """Request revision for the faculty approval request"""
        self.status = 'needs_revision'
        self.reviewed_at = timezone.now()
        self.approved_by = faculty_user
        self.reviewer_notes = notes
        self.save()
    
    def to_json(self):
        """Convert faculty approval request to JSON format"""
        # Convert datetime fields to string representations
        submitted_at_str = None
        reviewed_at_str = None
        
        try:
            if self.submitted_at:
                submitted_at_str = str(self.submitted_at)
        except:
            pass
            
        try:
            if self.reviewed_at:
                reviewed_at_str = str(self.reviewed_at)
        except:
            pass
        
        return {
            'id': self.id,
            'student_id': self.student.student_id,
            'student_name': f'{self.student.user.first_name} {self.student.user.last_name}',
            'course_id': self.course.id,
            'course_code': self.course.code,
            'course_name': self.course.name,
            'faculty_id': self.faculty.employee_id,
            'faculty_name': f'{self.faculty.user.first_name} {self.faculty.user.last_name}',
            'approval_type': self.approval_type,
            'reason': self.reason,
            'supporting_documents': self.supporting_documents,
            'status': self.status,
            'submitted_at': submitted_at_str,
            'reviewed_at': reviewed_at_str,
            'reviewer_notes': self.reviewer_notes,
            'approval_conditions': self.approval_conditions
        }
    
    def __str__(self):
        return f"Faculty Approval Request: {self.student.student_id} for {self.course.code} - {self.approval_type} ({self.status})"


class StudentEnrollmentCart(models.Model):
    """Model to track student enrollment cart items"""
    id = models.CharField(max_length=50, primary_key=True)
    student = models.ForeignKey('users.Student', on_delete=models.CASCADE, related_name='enrollment_carts')
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE, related_name='cart_items')
    added_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['added_at']
        unique_together = ('student', 'course')
    
    def to_json(self):
        """Convert cart item to JSON format"""
        # Convert datetime fields to string representations
        added_at_str = None
        
        try:
            if self.added_at:
                added_at_str = str(self.added_at)
        except:
            pass
        
        return {
            'id': self.id,
            'student_id': self.student.student_id,
            'course_id': self.course.id,
            'course_name': self.course.name,
            'course_code': self.course.code,
            'credits': self.course.credits,
            'department': self.course.department,
            'added_date': added_at_str,  # Changed from 'added_at' to 'added_date' to match frontend expectations
        }
    
    def __str__(self):
        return f"Cart Item: {self.student.student_id} - {self.course.code}"
