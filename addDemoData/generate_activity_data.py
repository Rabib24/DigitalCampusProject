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

from activities.models import CampusActivity
from users.models import User

def generate_activity_data():
    """Generate demo campus activities"""
    print("Generating demo campus activities...")
    
    # Get all users for organizers
    all_users = User.objects.all()
    if not all_users.exists():
        print("No users found. Please generate users first.")
        return
    
    # Activity types and statuses
    activity_types = ['club', 'competition', 'student-feature']
    activity_statuses = ['draft', 'open', 'closed', 'cancelled', 'completed']
    
    # Activity data
    activity_titles = [
        "Computer Science Club Monthly Meeting",
        "Hackathon 2023",
        "Debate Competition",
        "Robotics Club Showcase",
        "Entrepreneurship Workshop",
        "Art Exhibition",
        "Music Concert",
        "Sports Tournament",
        "Career Fair",
        "Research Symposium",
        "Cultural Festival",
        "Volunteer Drive",
        "Leadership Conference",
        "Science Fair",
        "Literary Reading"
    ]
    
    activity_descriptions = [
        "Monthly meeting for computer science enthusiasts to discuss projects and upcoming events.",
        "48-hour hackathon event for students to build innovative solutions to real-world problems.",
        "Inter-college debate competition on contemporary topics.",
        "Showcase of robotics projects developed by student club members.",
        "Workshop on entrepreneurship skills and startup creation.",
        "Exhibition of student artwork from various disciplines.",
        "Student music concert featuring various genres and talents.",
        "Inter-department sports tournament for students and faculty.",
        "Annual career fair with representatives from top companies.",
        "Symposium showcasing student and faculty research projects.",
        "Celebration of diverse cultures through food, music, and performances.",
        "Community service volunteer opportunity for students.",
        "Conference on leadership development and skills building.",
        "Annual science fair featuring experiments and projects.",
        "Student literary reading featuring poetry and prose."
    ]
    
    locations = [
        "Student Union Building - Main Hall",
        "Engineering Building - Room 101",
        "Library - Conference Room A",
        "Campus Quad",
        "Sports Complex",
        "Arts Center",
        "Science Building - Lab 205",
        "Business School - Auditorium",
        "Cafeteria",
        "Outdoor Amphitheater"
    ]
    
    tags = [
        ["technology", "programming", "networking"],
        ["competition", "innovation", "teamwork"],
        ["public speaking", "critical thinking", "debate"],
        ["engineering", "robotics", "STEM"],
        ["business", "entrepreneurship", "innovation"],
        ["art", "creativity", "culture"],
        ["music", "performance", "entertainment"],
        ["sports", "fitness", "teamwork"],
        ["career", "employment", "networking"],
        ["research", "academics", "science"],
        ["culture", "diversity", "community"],
        ["service", "community", "volunteer"],
        ["leadership", "personal development", "skills"],
        ["science", "experiment", "education"],
        ["literature", "writing", "reading"]
    ]
    
    # Create campus activities
    for i in range(15):
        # Select a random user as organizer
        organizer = random.choice(all_users)
        
        # Activity details
        activity_type = random.choice(activity_types)
        status = random.choice(activity_statuses)
        
        # Set dates
        start_date = datetime(2023, random.randint(1, 12), random.randint(1, 28))
        end_date = start_date + timedelta(hours=random.randint(1, 8))
        registration_deadline = start_date - timedelta(days=random.randint(1, 14))
        
        # Create participants list (5-20 participants)
        num_participants = random.randint(5, 20)
        participants = []
        if all_users.exists():
            participant_users = random.sample(list(all_users), min(num_participants, len(all_users)))
            participants = [user.id for user in participant_users]
        
        CampusActivity.objects.create(
            id=f'ACT{random.randint(1000, 9999)}',
            title=activity_titles[i],
            description=activity_descriptions[i],
            type=activity_type,
            organizer_id=organizer.id,
            participants=json.dumps(participants),
            start_date=start_date,
            end_date=end_date,
            location=random.choice(locations),
            registration_deadline=registration_deadline,
            max_participants=random.choice([25, 30, 50, 100, 200]),
            status=status,
            tags=json.dumps(random.choice(tags))
        )
    
    print("Demo campus activities generated successfully!")

if __name__ == '__main__':
    generate_activity_data()