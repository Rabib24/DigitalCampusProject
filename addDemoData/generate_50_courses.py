import os
import sys
import django
import random
from datetime import datetime, timedelta
import json
from django.db import IntegrityError

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from courses.models import Course, Enrollment
from users.models import User

def generate_50_courses():
    """Generate 50 demo courses for specified departments"""
    print("Generating 50 demo courses...")
    
    # Define departments and their course data
    department_courses = {
        'Business': [
            {'code': 'BUS101', 'name': 'Principles of Management', 'credits': 3, 'description': 'Introduction to management functions including planning, organizing, leading, and controlling.'},
            {'code': 'BUS102', 'name': 'Business Communication', 'credits': 3, 'description': 'Effective written and oral communication skills in business contexts.'},
            {'code': 'BUS201', 'name': 'Financial Accounting', 'credits': 3, 'description': 'Fundamentals of financial accounting including recording transactions, preparing financial statements, and analysis.'},
            {'code': 'BUS202', 'name': 'Marketing Principles', 'credits': 3, 'description': 'Introduction to marketing concepts, consumer behavior, market research, and marketing strategies.'},
            {'code': 'BUS203', 'name': 'Business Statistics', 'credits': 3, 'description': 'Statistical methods for business decision making including probability, hypothesis testing, and regression analysis.'},
            {'code': 'BUS301', 'name': 'Organizational Behavior', 'credits': 3, 'description': 'Study of individual and group behavior in organizational settings.'},
            {'code': 'BUS302', 'name': 'Financial Management', 'credits': 3, 'description': 'Financial planning, investment decisions, capital structure, and dividend policy.'},
            {'code': 'BUS303', 'name': 'Operations Management', 'credits': 3, 'description': 'Management of production and service operations including quality control, inventory management, and supply chain.'},
            {'code': 'BUS304', 'name': 'Human Resource Management', 'credits': 3, 'description': 'Recruitment, training, performance evaluation, and employee relations.'},
            {'code': 'BUS401', 'name': 'Strategic Management', 'credits': 3, 'description': 'Formulation and implementation of business strategy at the corporate and competitive levels.'}
        ],
        'English': [
            {'code': 'ENG101', 'name': 'English Composition', 'credits': 3, 'description': 'Development of writing skills with emphasis on clarity, coherence, and critical thinking.'},
            {'code': 'ENG102', 'name': 'Introduction to Literature', 'credits': 3, 'description': 'Survey of major literary genres including fiction, poetry, and drama.'},
            {'code': 'ENG201', 'name': 'British Literature I', 'credits': 3, 'description': 'Study of British literature from the Anglo-Saxon period through the 18th century.'},
            {'code': 'ENG202', 'name': 'British Literature II', 'credits': 3, 'description': 'Study of British literature from the Romantic period to the present.'},
            {'code': 'ENG203', 'name': 'American Literature', 'credits': 3, 'description': 'Survey of American literature from colonial times to the present.'},
            {'code': 'ENG301', 'name': 'Shakespeare', 'credits': 3, 'description': 'Critical study of selected plays and sonnets by William Shakespeare.'},
            {'code': 'ENG302', 'name': 'Creative Writing', 'credits': 3, 'description': 'Workshop in creative writing including fiction, poetry, and creative nonfiction.'},
            {'code': 'ENG303', 'name': 'Literary Theory', 'credits': 3, 'description': 'Introduction to major schools of literary criticism and interpretation.'},
            {'code': 'ENG401', 'name': 'Modern Poetry', 'credits': 3, 'description': 'Study of 20th and 21st-century poetry including major movements and poets.'},
            {'code': 'ENG402', 'name': 'Contemporary Fiction', 'credits': 3, 'description': 'Analysis of contemporary novels and short stories from diverse authors.'}
        ],
        'Mathematics': [
            {'code': 'MATH101', 'name': 'Calculus I', 'credits': 4, 'description': 'Limits, continuity, differentiation, and integration of algebraic and transcendental functions.'},
            {'code': 'MATH102', 'name': 'Calculus II', 'credits': 4, 'description': 'Applications of integration, techniques of integration, infinite series, and parametric equations.'},
            {'code': 'MATH201', 'name': 'Linear Algebra', 'credits': 3, 'description': 'Vector spaces, linear transformations, matrices, determinants, and eigenvalues.'},
            {'code': 'MATH202', 'name': 'Differential Equations', 'credits': 3, 'description': 'First and second order differential equations, systems of differential equations, and applications.'},
            {'code': 'MATH203', 'name': 'Discrete Mathematics', 'credits': 3, 'description': 'Logic, set theory, combinatorics, graph theory, and discrete probability.'},
            {'code': 'MATH301', 'name': 'Calculus III', 'credits': 4, 'description': 'Vectors, partial derivatives, multiple integrals, and vector calculus.'},
            {'code': 'MATH302', 'name': 'Abstract Algebra', 'credits': 3, 'description': 'Groups, rings, fields, and homomorphisms.'},
            {'code': 'MATH303', 'name': 'Real Analysis', 'credits': 3, 'description': 'Rigorous treatment of limits, continuity, differentiation, and integration.'},
            {'code': 'MATH401', 'name': 'Numerical Analysis', 'credits': 3, 'description': 'Numerical methods for solving mathematical problems using computers.'},
            {'code': 'MATH402', 'name': 'Probability and Statistics', 'credits': 3, 'description': 'Probability theory, random variables, distributions, and statistical inference.'}
        ],
        'Psychology': [
            {'code': 'PSY101', 'name': 'Introduction to Psychology', 'credits': 3, 'description': 'Survey of major principles and theories in psychology.'},
            {'code': 'PSY201', 'name': 'Cognitive Psychology', 'credits': 3, 'description': 'Study of mental processes including perception, memory, thinking, and problem solving.'},
            {'code': 'PSY202', 'name': 'Developmental Psychology', 'credits': 3, 'description': 'Human development from conception through adulthood.'},
            {'code': 'PSY203', 'name': 'Social Psychology', 'credits': 3, 'description': 'Study of how individuals think, feel, and behave in social situations.'},
            {'code': 'PSY301', 'name': 'Abnormal Psychology', 'credits': 3, 'description': 'Study of psychological disorders including classification, causes, and treatments.'},
            {'code': 'PSY302', 'name': 'Research Methods', 'credits': 4, 'description': 'Introduction to research design and methodology in psychology.'},
            {'code': 'PSY303', 'name': 'Biological Psychology', 'credits': 3, 'description': 'Relationship between brain function and behavior.'},
            {'code': 'PSY401', 'name': 'Clinical Psychology', 'credits': 3, 'description': 'Theory and practice of clinical assessment and intervention.'},
            {'code': 'PSY402', 'name': 'Learning and Memory', 'credits': 3, 'description': 'Theories and research on how organisms learn and remember.'},
            {'code': 'PSY403', 'name': 'Psychological Testing', 'credits': 3, 'description': 'Principles of test construction, administration, and interpretation.'}
        ],
        'Computer Science': [
            {'code': 'CSE101', 'name': 'Introduction to Programming', 'credits': 3, 'description': 'Fundamentals of programming using Python. Introduction to variables, control structures, functions, and basic data structures.'},
            {'code': 'CSE102', 'name': 'Data Structures', 'credits': 4, 'description': 'Study of fundamental data structures including arrays, linked lists, stacks, queues, trees, and graphs. Implementation and analysis of algorithms.'},
            {'code': 'CSE201', 'name': 'Object-Oriented Programming', 'credits': 3, 'description': 'Principles of object-oriented programming including classes, inheritance, polymorphism, and encapsulation using Java.'},
            {'code': 'CSE202', 'name': 'Database Systems', 'credits': 3, 'description': 'Introduction to database design and SQL. Relational model, entity-relationship diagrams, normalization, and transaction management.'},
            {'code': 'CSE203', 'name': 'Computer Architecture', 'credits': 3, 'description': 'Digital logic design, processor organization, memory hierarchy, and input/output systems.'},
            {'code': 'CSE301', 'name': 'Algorithms', 'credits': 3, 'description': 'Design and analysis of algorithms. Complexity analysis, sorting, searching, graph algorithms, and dynamic programming.'},
            {'code': 'CSE302', 'name': 'Operating Systems', 'credits': 3, 'description': 'Process management, memory management, file systems, and concurrency in operating systems.'},
            {'code': 'CSE303', 'name': 'Software Engineering', 'credits': 3, 'description': 'Software development lifecycle, requirements engineering, design patterns, testing, and project management.'},
            {'code': 'CSE401', 'name': 'Artificial Intelligence', 'credits': 3, 'description': 'Introduction to AI concepts including search, knowledge representation, machine learning, and natural language processing.'},
            {'code': 'CSE402', 'name': 'Computer Networks', 'credits': 3, 'description': 'Network architecture, protocols, routing, congestion control, and network security.'}
        ]
    }
    
    # Get faculty users to be instructors
    faculty_users = User.objects.filter(role='faculty')
    if not faculty_users.exists():
        print("No faculty users found. Please generate users first.")
        return
    
    # Find the next available course ID to avoid conflicts
    existing_courses = Course.objects.all()
    if existing_courses.exists():
        # Get the highest existing course ID number
        max_id = 0
        for course in existing_courses:
            if course.id.startswith('COURSE'):
                try:
                    id_num = int(course.id.replace('COURSE', ''))
                    if id_num > max_id:
                        max_id = id_num
                except ValueError:
                    pass
        course_id_counter = max_id + 1
    else:
        course_id_counter = 1
    
    print(f"Starting course ID counter at: {course_id_counter}")
    
    # Create courses for each department
    courses = []
    
    for department, course_list in department_courses.items():
        print(f"Generating courses for {department}...")
        
        for data in course_list:
            # Check if course already exists by code
            if Course.objects.filter(code=data['code']).exists():
                print(f"Course {data['code']} already exists. Skipping...")
                continue
            
            # Get a random faculty member as instructor
            instructor = random.choice(faculty_users)
            
            # Try to create the course, skip if ID conflict occurs
            try:
                course = Course.objects.create(
                    id=f'COURSE{course_id_counter:03d}',
                    code=data['code'],
                    name=data['name'],
                    description=data['description'],
                    credits=data['credits'],
                    instructor_id=instructor.id,
                    department=department,
                    enrollment_limit=random.choice([25, 30, 35, 40]),
                    start_date=datetime(2023, 9, 1).date(),
                    end_date=datetime(2023, 12, 15).date(),
                    schedule=json.dumps([
                        {"day": random.choice(["Monday", "Tuesday"]), "start_time": "09:00", "end_time": "10:30", "location": f"Room {100+course_id_counter}"},
                        {"day": random.choice(["Wednesday", "Thursday"]), "start_time": "09:00", "end_time": "10:30", "location": f"Room {100+course_id_counter}"}
                    ]),
                    grading_scale=json.dumps({
                        "A": "90-100",
                        "B": "80-89",
                        "C": "70-79",
                        "D": "60-69",
                        "F": "0-59"
                    }),
                    categories=json.dumps(["homework", "quiz", "midterm", "final"]),
                    textbooks=json.dumps([
                        {"title": f"{data['name']} Textbook", "author": "John Author", "isbn": f"978-0-123456-{course_id_counter:04d}-{random.randint(1, 9)}"},
                        {"title": f"{data['name']} Workbook", "author": "Jane Editor", "isbn": f"978-0-123457-{course_id_counter:04d}-{random.randint(1, 9)}"}
                    ])
                )
                courses.append(course)
                course_id_counter += 1
                print(f"Created course: {data['code']} - {data['name']}")
            except IntegrityError as e:
                if "duplicate key value violates unique constraint" in str(e):
                    print(f"Course ID COURSE{course_id_counter:03d} already exists. Skipping and incrementing counter...")
                    course_id_counter += 1
                    continue
                else:
                    # Re-raise the exception if it's not a duplicate key error
                    raise e
    
    print(f"Successfully generated {len(courses)} courses!")
    return courses

if __name__ == '__main__':
    generate_50_courses()