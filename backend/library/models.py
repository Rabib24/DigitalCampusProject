from django.db import models
from django.utils import timezone

class LibraryBook(models.Model):
    """Library Book model"""
    id = models.CharField(max_length=50, primary_key=True)
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    isbn = models.CharField(max_length=20)
    call_number = models.CharField(max_length=50)
    borrower_id = models.CharField(max_length=50, blank=True)  # reference to Student User
    checkout_date = models.DateTimeField(null=True, blank=True)
    due_date = models.DateTimeField(null=True, blank=True)
    return_date = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, default='available')  # available, checkedout, overdue, reserved
    location = models.CharField(max_length=100, blank=True)  # library section
    fines = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # accumulated fines
    renewal_count = models.IntegerField()
    
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('checkedout', 'Checked Out'),
        ('overdue', 'Overdue'),
        ('reserved', 'Reserved'),
    ]
    
    def is_overdue(self):
        """Check if the book is overdue"""
        if self.due_date and self.status == 'checkedout':
            return timezone.now() > self.due_date
        return False
    
    def calculate_fines(self):
        """Calculate fines for overdue books"""
        if self.is_overdue() and self.due_date:
            # Calculate days overdue
            try:
                # Convert datetime fields to handle the subtraction properly
                due_date = self.due_date
                now = timezone.now()
                if due_date and now:
                    time_diff = now - due_date
                    days_overdue = time_diff.days
                    if days_overdue > 0:
                        # Assuming $0.25 per day overdue
                        return days_overdue * 0.25
            except:
                pass
        return 0
    
    def to_json(self):
        """Convert library book to JSON format"""
        # Convert datetime fields to string representations
        checkout_date_str = None
        due_date_str = None
        return_date_str = None
        
        try:
            if self.checkout_date:
                checkout_date_str = str(self.checkout_date)
        except:
            pass
            
        try:
            if self.due_date:
                due_date_str = str(self.due_date)
        except:
            pass
            
        try:
            if self.return_date:
                return_date_str = str(self.return_date)
        except:
            pass
        
        # Handle decimal fields
        fines_value = 0
        try:
            if self.fines:
                fines_value = float(str(self.fines))
        except:
            pass
        
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'isbn': self.isbn,
            'call_number': self.call_number,
            'borrower_id': self.borrower_id,
            'checkout_date': checkout_date_str,
            'due_date': due_date_str,
            'return_date': return_date_str,
            'status': self.status,
            'location': self.location,
            'fines': fines_value,
            'renewal_count': self.renewal_count,
        }
    
    def __str__(self):
        return f"Library Book: {self.title} by {self.author}"