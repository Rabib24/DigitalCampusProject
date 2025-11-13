from django.db import models
from django.utils import timezone


class ResearchProject(models.Model):
    """Research Project model"""
    id = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    owner_id = models.CharField(max_length=50)  # reference to Faculty User
    collaborators = models.JSONField(null=True, blank=True)  # array: user IDs
    status = models.CharField(max_length=20)  # proposal, approved, in-progress, completed, archived
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    budget = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)
    ethics_approval = models.BooleanField()
    publications = models.JSONField(null=True, blank=True)  # array: publication references
    documents = models.JSONField(null=True, blank=True)  # array: file references
    milestones = models.JSONField(null=True, blank=True)  # array: project milestones
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    
    STATUS_CHOICES = [
        ('proposal', 'Proposal'),
        ('approved', 'Approved'),
        ('in-progress', 'In Progress'),
        ('completed', 'Completed'),
        ('archived', 'Archived'),
    ]
    
    def add_collaborator(self, user_id):
        """Add a collaborator to the research project"""
        if self.collaborators is None:
            self.collaborators = []
        if isinstance(self.collaborators, list) and user_id not in self.collaborators:
            self.collaborators.append(user_id)
            self.save()
    
    def update_status(self, status):
        """Update the research project status"""
        self.status = status
        self.updated_at = timezone.now()
        self.save()
    
    def add_milestone(self, milestone):
        """Add a milestone to the research project"""
        if self.milestones is None:
            self.milestones = []
        if isinstance(self.milestones, list):
            self.milestones.append(milestone)
            self.save()
    
    def to_json(self):
        """Convert research project to JSON format"""
        # Convert date and datetime fields to string representations
        start_date_str = None
        end_date_str = None
        created_at_str = None
        updated_at_str = None
        
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
        
        # Handle decimal fields
        budget_value = None
        try:
            if self.budget is not None:
                budget_value = float(str(self.budget))
        except:
            pass
        
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'owner_id': self.owner_id,
            'collaborators': self.collaborators,
            'status': self.status,
            'start_date': start_date_str,
            'end_date': end_date_str,
            'budget': budget_value,
            'ethics_approval': self.ethics_approval,
            'publications': self.publications,
            'documents': self.documents,
            'milestones': self.milestones,
            'created_at': created_at_str,
            'updated_at': updated_at_str,
        }
    
    def __str__(self):
        return f"Research Project: {self.title}"
