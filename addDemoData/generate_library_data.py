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

from library.models import LibraryBook
from users.models import User

def generate_library_data():
    """Generate demo library books"""
    print("Generating demo library books...")
    
    # Get student users for borrowers
    student_users = User.objects.filter(role='student')
    
    # Book data
    book_titles = [
        "Introduction to Algorithms", "Data Structures and Algorithms in Python", "Machine Learning: A Probabilistic Perspective",
        "Artificial Intelligence: A Modern Approach", "Computer Networking: A Top-Down Approach", "Operating System Concepts",
        "Database System Concepts", "Computer Organization and Design", "Software Engineering", "Design Patterns",
        "Clean Code: A Handbook of Agile Software Craftsmanship", "The Pragmatic Programmer", "Code Complete",
        "Refactoring: Improving the Design of Existing Code", "Head First Design Patterns", "Effective Java",
        "Python Crash Course", "Learning Python", "Automate the Boring Stuff with Python", "Fluent Python",
        "JavaScript: The Good Parts", "Eloquent JavaScript", "You Don't Know JS", "React: Up and Running",
        "Vue.js in Action", "Angular in Depth", "CSS Secrets", "Responsive Web Design", "HTML and CSS: Design and Build Websites",
        "Learning Web Design", "The Design of Everyday Things", "Don't Make Me Think", "About Face: The Essentials of Interaction Design",
        "Sprint: How to Solve Big Problems and Test New Ideas in Just Five Days", "Lean UX", "The Lean Startup",
        "Business Model Generation", "Blue Ocean Strategy", "Good to Great", "The Innovator's Dilemma",
        "Thinking, Fast and Slow", "Predictably Irrational", "Nudge", "The Power of Habit", "Drive: The Surprising Truth About What Motivates Us",
        "A Brief History of Time", "The Universe in a Nutshell", "Cosmos", "A Short History of Nearly Everything",
        "The Selfish Gene", "The Blind Watchmaker", "The Origin of Species", "Silent Spring", "The Double Helix"
    ]
    
    authors = [
        "Thomas H. Cormen", "Robert Sedgewick", "Kevin P. Murphy", "Stuart Russell", "James Kurose",
        "Abraham Silberschatz", "Henry Korth", "David Patterson", "Ian Sommerville", "Gang of Four",
        "Robert Martin", "Andrew Hunt", "Steve McConnell", "Martin Fowler", "Eric Freeman",
        "Joshua Bloch", "Eric Matthes", "Mark Lutz", "Al Sweigart", "Luciano Ramalho",
        "Douglas Crockford", "Marijn Haverbeke", "Kyle Simpson", "Stoyan Stefanov",
        "Evan You", "Igor Minar", "Lea Verou", "Ethan Marcotte", "Jon Duckett",
        "Jennifer Robbins", "Don Norman", "Steve Krug", "Alan Cooper",
        "Jake Knapp", "Jeff Gothelf", "Eric Ries",
        "Alexander Osterwalder", "W. Chan Kim", "Jim Collins", "Clayton Christensen",
        "Daniel Kahneman", "Dan Ariely", "Richard Thaler", "Charles Duhigg", "Daniel Pink",
        "Stephen Hawking", "Neil deGrasse Tyson", "Carl Sagan", "Bill Bryson",
        "Richard Dawkins", "Richard Dawkins", "Charles Darwin", "Rachel Carson", "James Watson"
    ]
    
    locations = [
        "Main Library - Floor 1 - Section A", "Main Library - Floor 1 - Section B", "Main Library - Floor 2 - Section C",
        "Main Library - Floor 2 - Section D", "Main Library - Floor 3 - Reference", "Science Library - Floor 1",
        "Science Library - Floor 2", "Engineering Library - Floor 1", "Engineering Library - Floor 2",
        "Business Library - Main Floor"
    ]
    
    statuses = ['available', 'checkedout', 'overdue', 'reserved']
    
    # Create library books
    for i in range(50):
        # Randomly decide if the book is checked out
        status = random.choice(statuses)
        borrower_id = ''
        checkout_date = None
        due_date = None
        return_date = None
        
        if status in ['checkedout', 'overdue']:
            if student_users.exists():
                borrower = random.choice(student_users)
                borrower_id = borrower.id
                checkout_date = datetime.now() - timedelta(days=random.randint(1, 30))
                due_date = checkout_date + timedelta(days=14)  # 2 weeks checkout period
                
                if status == 'overdue':
                    # Make the due date in the past
                    due_date = datetime.now() - timedelta(days=random.randint(1, 15))
                else:
                    return_date = None
        elif status == 'reserved':
            if student_users.exists():
                borrower = random.choice(student_users)
                borrower_id = borrower.id
        else:
            # Available book
            borrower_id = ''
        
        LibraryBook.objects.create(
            id=f'BOOK{random.randint(10000, 99999)}',
            title=random.choice(book_titles),
            author=random.choice(authors),
            isbn=f"978-{random.randint(0, 999999999):010d}",
            call_number=f"{chr(random.randint(65, 90))}{random.randint(100, 999)}.{random.randint(1000, 9999)}",
            borrower_id=borrower_id,
            checkout_date=checkout_date,
            due_date=due_date,
            return_date=return_date,
            status=status,
            location=random.choice(locations),
            fines=round(random.uniform(0.0, 25.0), 2),
            renewal_count=random.randint(0, 3)
        )
    
    print("Demo library books generated successfully!")

if __name__ == '__main__':
    generate_library_data()