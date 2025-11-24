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

from research.models import ResearchProject
from publications.models import Publication
from users.models import User

def generate_research_data():
    """Generate demo research projects and publications"""
    print("Generating demo research projects and publications...")
    
    # Get faculty users
    faculty_users = User.objects.filter(role='faculty')
    if not faculty_users.exists():
        print("No faculty users found. Please generate users first.")
        return
    
    # Research project data
    project_titles = [
        "Machine Learning Applications in Healthcare",
        "Quantum Computing Algorithms",
        "Renewable Energy Storage Solutions",
        "Neural Network Optimization Techniques",
        "Climate Change Impact on Biodiversity",
        "Blockchain Technology in Financial Systems",
        "Artificial Intelligence in Education",
        "Nanotechnology in Medicine",
        "Cybersecurity in IoT Devices",
        "Big Data Analytics for Business Intelligence"
    ]
    
    project_descriptions = [
        "This research explores the application of machine learning algorithms in diagnosing medical conditions.",
        "An investigation into quantum computing algorithms and their potential to solve complex computational problems.",
        "Development of efficient energy storage systems using renewable energy sources.",
        "Optimization of neural network architectures for improved performance and reduced computational requirements.",
        "Analysis of climate change effects on global biodiversity patterns and ecosystem stability.",
        "Exploring the use of blockchain technology to enhance security and transparency in financial transactions.",
        "Application of artificial intelligence techniques to improve personalized learning experiences.",
        "Investigation of nanotechnology applications in targeted drug delivery and medical treatments.",
        "Security analysis of Internet of Things devices and development of protection mechanisms.",
        "Using big data analytics to extract meaningful insights for strategic business decision making."
    ]
    
    project_statuses = ['proposal', 'approved', 'in-progress', 'completed', 'archived']
    
    # Create research projects
    for i in range(10):
        # Select a random faculty member as owner
        owner = random.choice(faculty_users)
        
        # Select collaborators (2-4 other faculty members)
        other_faculty = [f for f in faculty_users if f.id != owner.id]
        num_collaborators = random.randint(2, 4)
        collaborators = random.sample(other_faculty, min(num_collaborators, len(other_faculty)))
        collaborator_ids = [c.id for c in collaborators]
        
        # Add owner to collaborators list
        collaborator_ids.append(owner.id)
        
        # Set dates
        start_date = datetime(2022, random.randint(1, 12), random.randint(1, 28)).date()
        end_date = start_date + timedelta(days=random.randint(180, 730))  # 6 months to 2 years
        
        project = ResearchProject.objects.create(
            id=f'RP{random.randint(1000, 9999)}',
            title=project_titles[i],
            description=project_descriptions[i],
            owner_id=owner.id,
            status=random.choice(project_statuses),
            start_date=start_date,
            end_date=end_date if random.choice([True, False]) else None,
            budget=round(random.uniform(10000, 100000), 2),
            ethics_approval=random.choice([True, False]),
            collaborators=json.dumps(collaborator_ids),
            milestones=json.dumps([
                {"name": "Literature Review", "status": "completed", "due_date": str(start_date + timedelta(days=30))},
                {"name": "Methodology Design", "status": random.choice(["completed", "in-progress"]), "due_date": str(start_date + timedelta(days=60))},
                {"name": "Data Collection", "status": random.choice(["completed", "in-progress", "pending"]), "due_date": str(start_date + timedelta(days=120))},
                {"name": "Analysis", "status": random.choice(["in-progress", "pending"]), "due_date": str(start_date + timedelta(days=180))},
                {"name": "Report Writing", "status": "pending", "due_date": str(start_date + timedelta(days=240))}
            ])
        )
        
        # Create 1-3 publications for each research project
        num_publications = random.randint(1, 3)
        for j in range(num_publications):
            # Select authors (from collaborators)
            author_ids = random.sample(collaborator_ids, min(random.randint(2, len(collaborator_ids)), 3))
            
            # Get author names
            authors = []
            for author_id in author_ids:
                try:
                    author = User.objects.get(id=author_id)
                    authors.append(f"{author.first_name} {author.last_name}")
                except User.DoesNotExist:
                    continue
            
            # Journal names
            journals = [
                "Journal of Advanced Research",
                "International Scientific Review",
                "Academic Excellence Quarterly",
                "Research Innovations Today",
                "Scholarly Works Archive"
            ]
            
            # Keywords
            keywords = [
                ["machine learning", "healthcare", "diagnosis"],
                ["quantum computing", "algorithms", "computational theory"],
                ["renewable energy", "storage", "sustainability"],
                ["neural networks", "optimization", "AI"],
                ["climate change", "biodiversity", "ecosystem"],
                ["blockchain", "financial systems", "security"],
                ["artificial intelligence", "education", "personalized learning"],
                ["nanotechnology", "medicine", "drug delivery"],
                ["cybersecurity", "IoT", "network security"],
                ["big data", "analytics", "business intelligence"]
            ]
            
            Publication.objects.create(
                id=f'PUB{random.randint(10000, 99999)}',
                title=f"Findings in {project.title}",
                abstract=f"This publication presents the findings of our research on {project.title.lower()}. The study reveals important insights into the field.",
                publication_date=datetime(2023, random.randint(1, 12), random.randint(1, 28)).date(),
                journal=random.choice(journals),
                volume=f"Vol. {random.randint(1, 20)}",
                issue=f"Issue {random.randint(1, 12)}",
                pages=f"{random.randint(1, 100)}-{random.randint(101, 200)}",
                doi=f"10.1234/{random.randint(1000, 9999)}.{random.randint(1000, 9999)}",
                publisher="Academic Press",
                research_project_id=project.id,
                faculty_ids=json.dumps(author_ids),
                authors=json.dumps(authors),
                keywords=json.dumps(keywords[i % len(keywords)]),
                citations=random.randint(0, 100),
                document_url=f"https://research.digitalcampus.edu/publications/pub{random.randint(10000, 99999)}.pdf"
            )
    
    print("Demo research projects and publications generated successfully!")

if __name__ == '__main__':
    generate_research_data()