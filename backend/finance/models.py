from django.db import models
from django.utils import timezone

class FinancialAid(models.Model):
    """Financial Aid model"""
    id = models.CharField(max_length=50, primary_key=True)
    student_id = models.CharField(max_length=50)
    type = models.CharField(max_length=20)  # scholarship, grant, loan, work-study
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, default='applied')  # applied, awarded, rejected, disbursed
    application_date = models.DateTimeField(default=timezone.now)
    award_date = models.DateTimeField(null=True, blank=True)
    disbursement_schedule = models.JSONField(null=True, blank=True)  # Array: disbursement dates and amounts
    requirements = models.JSONField(null=True, blank=True)  # Array: requirements for maintaining aid
    documents = models.JSONField(null=True, blank=True)  # Array: supporting document references
    comments = models.TextField(blank=True)
    academic_year = models.CharField(max_length=20)
    
    TYPE_CHOICES = [
        ('scholarship', 'Scholarship'),
        ('grant', 'Grant'),
        ('loan', 'Loan'),
        ('work-study', 'Work-Study'),
    ]
    
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('awarded', 'Awarded'),
        ('rejected', 'Rejected'),
        ('disbursed', 'Disbursed'),
    ]
    
    def to_json(self):
        """Convert financial aid to JSON format"""
        # Convert datetime fields to string representations
        application_date_str = None
        award_date_str = None
        
        try:
            if self.application_date:
                application_date_str = str(self.application_date)
        except:
            pass
            
        try:
            if self.award_date:
                award_date_str = str(self.award_date)
        except:
            pass
        
        # Handle decimal fields
        amount_value = 0
        try:
            if self.amount:
                amount_value = float(str(self.amount))
        except:
            pass
        
        return {
            'id': self.id,
            'student_id': self.student_id,
            'type': self.type,
            'amount': amount_value,
            'status': self.status,
            'application_date': application_date_str,
            'award_date': award_date_str,
            'disbursement_schedule': self.disbursement_schedule,
            'requirements': self.requirements,
            'documents': self.documents,
            'comments': self.comments,
            'academic_year': self.academic_year,
        }
    
    def __str__(self):
        return f"Financial Aid: {self.type} for {self.student_id}"


class Payment(models.Model):
    """Payment model"""
    id = models.CharField(max_length=50, primary_key=True)
    user_id = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default='USD')
    type = models.CharField(max_length=20)  # tuition, fee, scholarship, grant
    status = models.CharField(max_length=20, default='pending')  # pending, processing, completed, failed, refunded
    payment_method = models.CharField(max_length=50, blank=True)  # gateway reference
    transaction_id = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    paid_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    
    TYPE_CHOICES = [
        ('tuition', 'Tuition'),
        ('fee', 'Fee'),
        ('scholarship', 'Scholarship'),
        ('grant', 'Grant'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    def update_status(self, status):
        """Update the payment status"""
        self.status = status
        self.updated_at = timezone.now()
        self.save()
    
    def process_payment(self):
        """Process the payment"""
        self.status = 'processing'
        self.updated_at = timezone.now()
        self.save()
    
    def to_json(self):
        """Convert payment to JSON format"""
        # Convert datetime fields to string representations
        due_date_str = None
        paid_date_str = None
        created_at_str = None
        updated_at_str = None
        
        try:
            if self.due_date:
                due_date_str = str(self.due_date)
        except:
            pass
            
        try:
            if self.paid_date:
                paid_date_str = str(self.paid_date)
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
        amount_value = 0
        try:
            if self.amount:
                amount_value = float(str(self.amount))
        except:
            pass
        
        return {
            'id': self.id,
            'user_id': self.user_id,
            'amount': amount_value,
            'currency': self.currency,
            'type': self.type,
            'status': self.status,
            'payment_method': self.payment_method,
            'transaction_id': self.transaction_id,
            'description': self.description,
            'due_date': due_date_str,
            'paid_date': paid_date_str,
            'created_at': created_at_str,
            'updated_at': updated_at_str,
        }
    
    def __str__(self):
        return f"Payment: {self.type} for {self.user_id}"