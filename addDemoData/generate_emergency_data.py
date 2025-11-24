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

from emergency.models import EmergencyContact
from users.models import User

def generate_emergency_data():
    """Generate demo emergency contact data"""
    print("Generating demo emergency contact data...")
    
    # Get all users
    all_users = User.objects.all()
    if not all_users.exists():
        print("No users found. Please generate users first.")
        return
    
    # Relationships
    relationships = [
        'Parent', 'Guardian', 'Spouse', 'Sibling', 'Child', 
        'Grandparent', 'Aunt', 'Uncle', 'Cousin', 'Friend',
        'Partner', 'Colleague', 'Neighbor', 'Doctor', 'Lawyer'
    ]
    
    # Create emergency contacts for users
    for user in all_users:
        # Create 1-3 emergency contacts per user
        num_contacts = random.randint(1, 3)
        
        for i in range(num_contacts):
            # Determine if this is the primary contact (first one created)
            is_primary = (i == 0)
            
            # Generate contact details
            first_names = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Christopher', 'Jessica', 'Matthew', 'Ashley',
                          'Daniel', 'Samantha', 'Andrew', 'Brittany', 'Joshua', 'Amanda', 'Ryan', 'Melissa', 'Jacob', 'Stephanie']
            
            last_names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                         'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin']
            
            first_name = random.choice(first_names)
            last_name = random.choice(last_names)
            
            EmergencyContact.objects.create(
                id=f'EMER{random.randint(10000, 99999)}',
                user_id=user.id,
                name=f"{first_name} {last_name}",
                relationship=random.choice(relationships),
                phone=f'+1-555-{random.randint(100, 999)}-{random.randint(1000, 9999)}',
                email=f"{first_name.lower()}.{last_name.lower()}@example.com" if random.choice([True, False]) else "",
                is_primary=is_primary
            )
    
    print("Demo emergency contact data generated successfully!")

if __name__ == '__main__':
    generate_emergency_data()