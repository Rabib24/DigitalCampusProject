from django.db import models
from django.utils import timezone

class Assignment(models.Model):
    """Assignment model"""
    id = models.CharField(max_length=50, primary_key=True)
    course_id = models.CharField(max_length=50)
    title = models.CharField(max_length=100)
    description = models.TextField()
    due_date = models.DateTimeField()
    points = models.IntegerField()
    type = models.CharField(max_length=20)  # homework, exam, project
    submissions = models.JSONField(null=True, blank=True)  # Array: submission references
    created_at = models.DateTimeField(default=timezone.now)
    start_date = models.DateTimeField()
    allow_late_submission = models.BooleanField()
    late_penalty = models.DecimalField(max_digits=5, decimal_places=2)  # percentage penalty
    max_submissions = models.IntegerField()
    attachments = models.JSONField(null=True, blank=True)  # Array: file references
    rubric = models.JSONField(null=True, blank=True)  # Object: grading criteria
    visible_to_students = models.BooleanField()
    category = models.CharField(max_length=50, blank=True)  # for grouping
    weight = models.DecimalField(max_digits=5, decimal_places=2)  # for grade calculation
    
    TYPE_CHOICES = [
        ('homework', 'Homework'),
        ('exam', 'Exam'),
        ('project', 'Project'),
    ]
    
    def add_submission(self, submission):
        """Add a submission to the assignment"""
        if self.submissions is None:
            self.submissions = []
        if isinstance(self.submissions, list):
            self.submissions.append(submission)
        self.save()
    
    def is_overdue(self):
        """Check if the assignment is overdue"""
        return timezone.now() > self.due_date
    
    def to_json(self):
        """Convert assignment to JSON format"""
        # Convert datetime fields to string representations
        due_date_str = None
        created_at_str = None
        start_date_str = None
        
        try:
            if self.due_date:
                due_date_str = str(self.due_date)
        except:
            pass
            
        try:
            if self.created_at:
                created_at_str = str(self.created_at)
        except:
            pass
            
        try:
            if self.start_date:
                start_date_str = str(self.start_date)
        except:
            pass
        
        # Handle decimal fields
        late_penalty_value = 0
        weight_value = 0
        
        try:
            if self.late_penalty:
                late_penalty_value = float(str(self.late_penalty))
        except:
            pass
            
        try:
            if self.weight:
                weight_value = float(str(self.weight))
        except:
            pass
        
        return {
            'id': self.id,
            'course_id': self.course_id,
            'title': self.title,
            'description': self.description,
            'due_date': due_date_str,
            'points': self.points,
            'type': self.type,
            'submissions': self.submissions,
            'created_at': created_at_str,
            'start_date': start_date_str,
            'allow_late_submission': self.allow_late_submission,
            'late_penalty': late_penalty_value,
            'max_submissions': self.max_submissions,
            'attachments': self.attachments,
            'rubric': self.rubric,
            'visible_to_students': self.visible_to_students,
            'category': self.category,
            'weight': weight_value,
        }
    
    def __str__(self):
        return f"Assignment: {self.title} ({self.course_id})"


class Submission(models.Model):
    """Submission model"""
    id = models.CharField(max_length=50, primary_key=True)
    assignment_id = models.CharField(max_length=50)
    student_id = models.CharField(max_length=50)
    content = models.TextField(blank=True)  # or file reference
    submitted_at = models.DateTimeField(default=timezone.now)
    grade = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    feedback = models.TextField(blank=True)
    attachments = models.JSONField(null=True, blank=True)  # Array: file references
    late_submission = models.BooleanField()
    revision_history = models.JSONField(null=True, blank=True)  # Array: previous submissions
    
    def assign_grade(self, grade, feedback=""):
        """Assign a grade and feedback to the submission"""
        self.grade = grade
        self.feedback = feedback
        self.save()
    
    def to_json(self):
        """Convert submission to JSON format"""
        # Convert datetime fields to string representations
        submitted_at_str = None
        
        try:
            if self.submitted_at:
                submitted_at_str = str(self.submitted_at)
        except:
            pass
        
        # Handle decimal fields
        grade_value = None
        try:
            if self.grade is not None:
                grade_value = float(str(self.grade))
        except:
            pass
        
        return {
            'id': self.id,
            'assignment_id': self.assignment_id,
            'student_id': self.student_id,
            'content': self.content,
            'submitted_at': submitted_at_str,
            'grade': grade_value,
            'feedback': self.feedback,
            'attachments': self.attachments,
            'late_submission': self.late_submission,
            'revision_history': self.revision_history,
        }
    
    def __str__(self):
        return f"Submission: {self.student_id} for {self.assignment_id}"


class Grade(models.Model):
    """Grade model"""
    id = models.CharField(max_length=50, primary_key=True)
    student_id = models.CharField(max_length=50)
    course_id = models.CharField(max_length=50)
    assignment_id = models.CharField(max_length=50, blank=True)
    value = models.DecimalField(max_digits=10, decimal_places=2)  # points earned
    max_points = models.DecimalField(max_digits=10, decimal_places=2)  # maximum possible points
    letter_grade = models.CharField(max_length=5, blank=True)  # A, B, C, etc.
    weight = models.DecimalField(max_digits=5, decimal_places=2)  # for GPA calculation
    category = models.CharField(max_length=50, blank=True)  # assignment, exam, participation
    grader_id = models.CharField(max_length=50, blank=True)  # reference to User - instructor
    comments = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    def calculate_percentage(self):
        """Calculate the percentage score"""
        try:
            if self.max_points and float(str(self.max_points)) > 0:
                return (float(str(self.value)) / float(str(self.max_points))) * 100
        except:
            pass
        return 0
    
    def to_json(self):
        """Convert grade to JSON format"""
        # Convert datetime fields to string representations
        created_at_str = None
        
        try:
            if self.created_at:
                created_at_str = str(self.created_at)
        except:
            pass
        
        # Handle decimal fields
        value_value = 0
        max_points_value = 0
        weight_value = 0
        
        try:
            if self.value:
                value_value = float(str(self.value))
        except:
            pass
            
        try:
            if self.max_points:
                max_points_value = float(str(self.max_points))
        except:
            pass
            
        try:
            if self.weight:
                weight_value = float(str(self.weight))
        except:
            pass
        
        return {
            'id': self.id,
            'student_id': self.student_id,
            'course_id': self.course_id,
            'assignment_id': self.assignment_id,
            'value': value_value,
            'max_points': max_points_value,
            'letter_grade': self.letter_grade,
            'weight': weight_value,
            'category': self.category,
            'grader_id': self.grader_id,
            'comments': self.comments,
            'created_at': created_at_str,
            'percentage': self.calculate_percentage(),
        }
    
    def __str__(self):
        return f"Grade: {self.student_id} in {self.course_id} - {self.letter_grade}"