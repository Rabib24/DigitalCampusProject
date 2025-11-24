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

from finance.models import FinancialAid, Payment
from users.models import User

def generate_finance_data():
    """Generate demo financial aid and payment data"""
    print("Generating demo financial aid and payment data...")
    
    # Get student users
    student_users = User.objects.filter(role='student')
    if not student_users.exists():
        print("No student users found. Please generate users first.")
        return
    
    # Financial aid types and statuses
    aid_types = ['scholarship', 'grant', 'loan', 'work-study']
    aid_statuses = ['applied', 'awarded', 'rejected', 'disbursed']
    
    # Payment types and statuses
    payment_types = ['tuition', 'fee', 'scholarship', 'grant']
    payment_statuses = ['pending', 'processing', 'completed', 'failed', 'refunded']
    
    # Academic years
    academic_years = ['2023-2024', '2024-2025']
    
    # Create financial aid records for students
    for student in student_users:
        # Create 1-2 financial aid records per student
        num_aids = random.randint(1, 2)
        
        for i in range(num_aids):
            aid_type = random.choice(aid_types)
            status = random.choice(aid_statuses)
            academic_year = random.choice(academic_years)
            
            # Set dates
            application_date = datetime(2023, random.randint(1, 12), random.randint(1, 28))
            award_date = None
            if status in ['awarded', 'disbursed']:
                award_date = application_date + timedelta(days=random.randint(15, 45))
            
            # Disbursement schedule for disbursed aids
            disbursement_schedule = None
            if status == 'disbursed':
                disbursement_schedule = json.dumps([
                    {"date": str(award_date + timedelta(days=30)), "amount": round(random.uniform(1000, 5000), 2)},
                    {"date": str(award_date + timedelta(days=90)), "amount": round(random.uniform(1000, 5000), 2)}
                ])
            
            FinancialAid.objects.create(
                id=f'FAID{random.randint(10000, 99999)}',
                student_id=student.id,
                type=aid_type,
                amount=round(random.uniform(1000, 15000), 2),
                status=status,
                application_date=application_date,
                award_date=award_date,
                disbursement_schedule=disbursement_schedule,
                requirements=json.dumps([
                    "Maintain minimum 2.5 GPA",
                    "Complete 12 credit hours per semester",
                    "Submit progress report"
                ]) if status in ['awarded', 'disbursed'] else None,
                comments=f"Financial aid application for {academic_year}",
                academic_year=academic_year
            )
    
    # Create payment records for users
    all_users = User.objects.all()
    
    for user in all_users:
        # Create 2-4 payment records per user
        num_payments = random.randint(2, 4)
        
        for i in range(num_payments):
            payment_type = random.choice(payment_types)
            status = random.choice(payment_statuses)
            
            # Set dates
            created_at = datetime(2023, random.randint(1, 12), random.randint(1, 28))
            due_date = created_at + timedelta(days=random.randint(15, 60))
            paid_date = None
            updated_at = created_at
            
            if status in ['completed', 'refunded']:
                paid_date = due_date - timedelta(days=random.randint(1, 10))
                updated_at = paid_date
            elif status == 'failed':
                updated_at = due_date + timedelta(days=random.randint(1, 5))
            
            Payment.objects.create(
                id=f'PAY{random.randint(100000, 999999)}',
                user_id=user.id,
                amount=round(random.uniform(500, 10000), 2),
                currency='USD',
                type=payment_type,
                status=status,
                payment_method=random.choice(['Credit Card', 'Bank Transfer', 'Check', 'Financial Aid']) if status == 'completed' else '',
                transaction_id=f'TXN{random.randint(1000000, 9999999)}' if status == 'completed' else '',
                description=f"{payment_type.title()} payment for {user.get_full_name()}",
                due_date=due_date,
                paid_date=paid_date,
                created_at=created_at,
                updated_at=updated_at
            )
    
    print("Demo financial aid and payment data generated successfully!")

if __name__ == '__main__':
    generate_finance_data()