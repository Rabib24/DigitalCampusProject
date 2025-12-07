from django.db import models
from django.utils import timezone

class Course(models.Model):
    """Course model"""
    id = models.CharField(max_length=50, primary_key=True)
    code = models.CharField(max_length=20)
    name = models.CharField(max_length=100)
    description = models.TextField()
    credits = models.IntegerField()
    instructor_id = models.CharField(max_length=50)
    schedule = models.JSONField(null=True, blank=True)  # Array: time slots, locations
    students = models.JSONField(null=True, blank=True)  # Array: student IDs
    assignments = models.JSONField(null=True, blank=True)  # Array: assignment references
    created_at = models.DateTimeField(default=timezone.now)
    department = models.CharField(max_length=100)
    prerequisites = models.JSONField(null=True, blank=True)  # Array: course codes (DEPRECATED - use CoursePrerequisite model)
    syllabus = models.CharField(max_length=200, blank=True)  # URL or file reference
    textbooks = models.JSONField(null=True, blank=True)  # Array: book references
    enrollment_limit = models.IntegerField()
    waitlist = models.JSONField(null=True, blank=True)  # Array: student IDs
    start_date = models.DateField()
    end_date = models.DateField()
    grading_scale = models.JSONField(null=True, blank=True)  # Object: grade thresholds
    categories = models.JSONField(null=True, blank=True)  # Array: assignment categories
    materials = models.JSONField(null=True, blank=True)  # Array: URLs or file references
    announcements = models.JSONField(null=True, blank=True)  # Array: course announcements
    
    def add_student(self, student_id):
        """Add a student to the course"""
        if self.students is None:
            self.students = []
        if isinstance(self.students, list) and student_id not in self.students:
            self.students.append(student_id)
            self.save()
    
    def add_to_waitlist(self, student_id):
        """Add a student to the course waitlist"""
        if self.waitlist is None:
            self.waitlist = []
        if isinstance(self.waitlist, list) and student_id not in self.waitlist:
            self.waitlist.append(student_id)
            self.save()
    
    def remove_from_waitlist(self, student_id):
        """Remove a student from the course waitlist"""
        if self.waitlist is not None and isinstance(self.waitlist, list) and student_id in self.waitlist:
            self.waitlist.remove(student_id)
            self.save()
    
    def get_waitlist_position(self, student_id):
        """Get a student's position in the waitlist (0 if not on waitlist)"""
        if self.waitlist is not None and isinstance(self.waitlist, list):
            try:
                return self.waitlist.index(student_id) + 1
            except ValueError:
                return 0
        return 0
    
    def remove_student(self, student_id):
        """Remove a student from the course"""
        if self.students is not None and isinstance(self.students, list) and student_id in self.students:
            self.students.remove(student_id)
            self.save()
    
    def add_assignment(self, assignment):
        """Add an assignment to the course"""
        if self.assignments is None:
            self.assignments = []
        if isinstance(self.assignments, list):
            self.assignments.append(assignment)
        self.save()
    
    def get_student_count(self):
        """Get the number of students enrolled in the course"""
        if self.students is not None and isinstance(self.students, list):
            return len(self.students)
        return 0
    
    def to_json(self):
        """Convert course to JSON format"""
        # Convert date fields to string representations
        start_date_str = None
        end_date_str = None
        created_at_str = None
        
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
        
        return {
            'id': self.id,
            'code': self.code,
            'name': self.name,
            'description': self.description,
            'credits': self.credits,
            'instructor_id': self.instructor_id,
            'schedule': self.schedule,
            'students': self.students,
            'assignments': self.assignments,
            'created_at': created_at_str,
            'department': self.department,
            'prerequisites': self.prerequisites,
            'syllabus': self.syllabus,
            'textbooks': self.textbooks,
            'enrollment_limit': self.enrollment_limit,
            'waitlist': self.waitlist,
            'start_date': start_date_str,
            'end_date': end_date_str,
            'grading_scale': self.grading_scale,
            'categories': self.categories,
            'materials': self.materials,
            'announcements': self.announcements,
        }
    
    def __str__(self):
        return f"{self.code}: {self.name}"


class CoursePrerequisite(models.Model):
    """Model to represent course prerequisite relationships"""
    id = models.CharField(max_length=50, primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='prerequisite_for')
    prerequisite_course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='required_for')
    is_corequisite = models.BooleanField(default=False)  # If True, course can be taken concurrently
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        unique_together = ('course', 'prerequisite_course')
        verbose_name = "Course Prerequisite"
        verbose_name_plural = "Course Prerequisites"
    
    def to_json(self):
        """Convert course prerequisite to JSON format"""
        created_at_str = None
        try:
            if self.created_at:
                created_at_str = str(self.created_at)
        except:
            pass
        
        return {
            'id': self.id,
            'course_id': self.course.id,
            'prerequisite_course_id': self.prerequisite_course.id,
            'is_corequisite': self.is_corequisite,
            'created_at': created_at_str,
        }
    
    def __str__(self):
        return f"{self.prerequisite_course.code} is prerequisite for {self.course.code}"


class Section(models.Model):
    """Section model for courses with multiple sections"""
    id = models.CharField(max_length=50, primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='sections')
    section_number = models.IntegerField()
    instructor_id = models.CharField(max_length=50, blank=True)
    schedule = models.JSONField(null=True, blank=True)  # Array: time slots, locations
    students = models.JSONField(null=True, blank=True)  # Array: student IDs
    enrollment_limit = models.IntegerField()
    waitlist = models.JSONField(null=True, blank=True)  # Array: student IDs
    created_at = models.DateTimeField(default=timezone.now)
    
    def add_student(self, student_id):
        """Add a student to the section"""
        if self.students is None:
            self.students = []
        if isinstance(self.students, list) and student_id not in self.students:
            self.students.append(student_id)
            self.save()
    
    def add_to_waitlist(self, student_id):
        """Add a student to the section waitlist"""
        if self.waitlist is None:
            self.waitlist = []
        if isinstance(self.waitlist, list) and student_id not in self.waitlist:
            self.waitlist.append(student_id)
            self.save()
    
    def remove_from_waitlist(self, student_id):
        """Remove a student from the section waitlist"""
        if self.waitlist is not None and isinstance(self.waitlist, list) and student_id in self.waitlist:
            self.waitlist.remove(student_id)
            self.save()
    
    def get_waitlist_position(self, student_id):
        """Get a student's position in the section waitlist (0 if not on waitlist)"""
        if self.waitlist is not None and isinstance(self.waitlist, list):
            try:
                return self.waitlist.index(student_id) + 1
            except ValueError:
                return 0
        return 0
    
    def remove_student(self, student_id):
        """Remove a student from the section"""
        if self.students is not None and isinstance(self.students, list) and student_id in self.students:
            self.students.remove(student_id)
            self.save()
    
    def get_student_count(self):
        """Get the number of students enrolled in the section"""
        if self.students is not None and isinstance(self.students, list):
            return len(self.students)
        return 0
    
    def is_full(self):
        """Check if the section is at capacity"""
        return self.get_student_count() >= self.enrollment_limit
    
    def to_json(self):
        """Convert section to JSON format"""
        created_at_str = None
        try:
            if self.created_at:
                created_at_str = str(self.created_at)
        except:
            pass
        
        return {
            'id': self.id,
            'course_id': self.course.id,
            'section_number': self.section_number,
            'instructor_id': self.instructor_id,
            'schedule': self.schedule,
            'students': self.students,
            'enrollment_limit': self.enrollment_limit,
            'waitlist': self.waitlist,
            'created_at': created_at_str,
        }
    
    def __str__(self):
        return f"{self.course.code}-{self.section_number:03d}"


class Enrollment(models.Model):
    """Enrollment model"""
    id = models.CharField(max_length=50, primary_key=True)
    student_id = models.CharField(max_length=50)
    course_id = models.CharField(max_length=50)
    section_id = models.CharField(max_length=50, blank=True)  # Reference to section if applicable
    enrollment_date = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, default='active')  # active, dropped, completed
    grade = models.CharField(max_length=10, blank=True)
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('dropped', 'Dropped'),
        ('completed', 'Completed'),
    ]
    
    def assign_grade(self, grade):
        """Assign a grade to the enrollment"""
        self.grade = grade
        self.save()
    
    def drop(self):
        """Drop the enrollment"""
        self.status = 'dropped'
        self.save()
    
    def complete(self):
        """Complete the enrollment"""
        self.status = 'completed'
        self.save()
    
    def to_json(self):
        """Convert enrollment to JSON format"""
        # Convert datetime fields to string representations
        enrollment_date_str = None
        
        try:
            if self.enrollment_date:
                enrollment_date_str = str(self.enrollment_date)
        except:
            pass
        
        return {
            'id': self.id,
            'student_id': self.student_id,
            'course_id': self.course_id,
            'section_id': self.section_id,
            'enrollment_date': enrollment_date_str,
            'status': self.status,
            'grade': self.grade,
        }
    
    def __str__(self):
        section_info = f" (Section {self.section_id})" if self.section_id else ""
        return f"Enrollment: {self.student_id} in {self.course_id}{section_info}"