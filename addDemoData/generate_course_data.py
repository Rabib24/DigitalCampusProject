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

def generate_courses():
    """Generate demo courses and enrollments"""
    print("Generating demo courses and enrollments...")
    
    # Define departments and their course data
    department_courses = {
        'Computer Science & Engineering': [
            {'code': 'CSE101', 'name': 'Introduction to Programming', 'credits': 3, 'description': 'Fundamentals of programming using Python. Introduction to variables, control structures, functions, and basic data structures.'},
            {'code': 'CSE102', 'name': 'Data Structures', 'credits': 4, 'description': 'Study of fundamental data structures including arrays, linked lists, stacks, queues, trees, and graphs. Implementation and analysis of algorithms.'},
            {'code': 'CSE201', 'name': 'Object-Oriented Programming', 'credits': 3, 'description': 'Principles of object-oriented programming including classes, inheritance, polymorphism, and encapsulation using Java.'},
            {'code': 'CSE202', 'name': 'Database Systems', 'credits': 3, 'description': 'Introduction to database design and SQL. Relational model, entity-relationship diagrams, normalization, and transaction management.'},
            {'code': 'CSE203', 'name': 'Computer Architecture', 'credits': 3, 'description': 'Digital logic design, processor organization, memory hierarchy, and input/output systems.'},
            {'code': 'CSE301', 'name': 'Algorithms', 'credits': 3, 'description': 'Design and analysis of algorithms. Complexity analysis, sorting, searching, graph algorithms, and dynamic programming.'},
            {'code': 'CSE302', 'name': 'Operating Systems', 'credits': 3, 'description': 'Process management, memory management, file systems, and concurrency in operating systems.'},
            {'code': 'CSE303', 'name': 'Software Engineering', 'credits': 3, 'description': 'Software development lifecycle, requirements engineering, design patterns, testing, and project management.'},
            {'code': 'CSE304', 'name': 'Computer Networks', 'credits': 3, 'description': 'Network architecture, protocols, routing, congestion control, and network security.'},
            {'code': 'CSE305', 'name': 'Web Development', 'credits': 3, 'description': 'Full-stack web development including HTML, CSS, JavaScript, Node.js, and database integration.'},
            {'code': 'CSE401', 'name': 'Artificial Intelligence', 'credits': 3, 'description': 'Introduction to AI concepts including search, knowledge representation, machine learning, and natural language processing.'},
            {'code': 'CSE402', 'name': 'Machine Learning', 'credits': 3, 'description': 'Supervised and unsupervised learning, neural networks, deep learning, and reinforcement learning.'},
            {'code': 'CSE403', 'name': 'Cybersecurity', 'credits': 3, 'description': 'Principles of cybersecurity including cryptography, network security, and secure software development.'},
            {'code': 'CSE404', 'name': 'Mobile Application Development', 'credits': 3, 'description': 'Development of mobile applications for Android and iOS platforms.'},
            {'code': 'CSE405', 'name': 'Capstone Project', 'credits': 4, 'description': 'Team-based project to design and implement a complete software system.'},
            {'code': 'CSE406', 'name': 'Data Science', 'credits': 3, 'description': 'Data analysis, visualization, and mining techniques for large datasets.'},
            {'code': 'CSE407', 'name': 'Cloud Computing', 'credits': 3, 'description': 'Cloud infrastructure, services, deployment models, and distributed computing concepts.'}
        ],
        'Business Administration': [
            {'code': 'BBA101', 'name': 'Principles of Management', 'credits': 3, 'description': 'Introduction to management functions including planning, organizing, leading, and controlling.'},
            {'code': 'BBA102', 'name': 'Business Communication', 'credits': 3, 'description': 'Effective written and oral communication skills in business contexts.'},
            {'code': 'BBA201', 'name': 'Financial Accounting', 'credits': 3, 'description': 'Fundamentals of financial accounting including recording transactions, preparing financial statements, and analysis.'},
            {'code': 'BBA202', 'name': 'Marketing Principles', 'credits': 3, 'description': 'Introduction to marketing concepts, consumer behavior, market research, and marketing strategies.'},
            {'code': 'BBA203', 'name': 'Business Statistics', 'credits': 3, 'description': 'Statistical methods for business decision making including probability, hypothesis testing, and regression analysis.'},
            {'code': 'BBA301', 'name': 'Organizational Behavior', 'credits': 3, 'description': 'Study of individual and group behavior in organizational settings.'},
            {'code': 'BBA302', 'name': 'Financial Management', 'credits': 3, 'description': 'Financial planning, investment decisions, capital structure, and dividend policy.'},
            {'code': 'BBA303', 'name': 'Operations Management', 'credits': 3, 'description': 'Management of production and service operations including quality control, inventory management, and supply chain.'},
            {'code': 'BBA304', 'name': 'Human Resource Management', 'credits': 3, 'description': 'Recruitment, training, performance evaluation, and employee relations.'},
            {'code': 'BBA305', 'name': 'Business Ethics', 'credits': 3, 'description': 'Ethical issues in business and corporate social responsibility.'},
            {'code': 'BBA401', 'name': 'Strategic Management', 'credits': 3, 'description': 'Formulation and implementation of business strategy at the corporate and competitive levels.'},
            {'code': 'BBA402', 'name': 'International Business', 'credits': 3, 'description': 'Global business environment, international trade, and cross-cultural management.'},
            {'code': 'BBA403', 'name': 'Entrepreneurship', 'credits': 3, 'description': 'Starting and managing new ventures including business planning and venture financing.'},
            {'code': 'BBA404', 'name': 'E-Business', 'credits': 3, 'description': 'Electronic commerce strategies, technologies, and digital marketing.'},
            {'code': 'BBA405', 'name': 'Business Analytics', 'credits': 3, 'description': 'Data-driven decision making using business intelligence tools and techniques.'},
            {'code': 'BBA406', 'name': 'Project Management', 'credits': 3, 'description': 'Project planning, scheduling, resource allocation, and risk management.'},
            {'code': 'BBA407', 'name': 'Business Law', 'credits': 3, 'description': 'Legal environment of business including contracts, torts, and regulatory compliance.'}
        ],
        'Microbiology': [
            {'code': 'MICO101', 'name': 'Introduction to Microbiology', 'credits': 3, 'description': 'Fundamentals of microbiology including history, scope, and importance of microorganisms.'},
            {'code': 'MICO102', 'name': 'Microbial Diversity', 'credits': 4, 'description': 'Survey of microbial diversity including bacteria, archaea, fungi, algae, and protozoa.'},
            {'code': 'MICO201', 'name': 'Microbial Genetics', 'credits': 3, 'description': 'Genetic principles as applied to microorganisms including mutation, recombination, and gene regulation.'},
            {'code': 'MICO202', 'name': 'Microbial Physiology', 'credits': 3, 'description': 'Physiological processes of microorganisms including metabolism, growth, and environmental responses.'},
            {'code': 'MICO203', 'name': 'Microbial Ecology', 'credits': 3, 'description': 'Interactions between microorganisms and their environment including biogeochemical cycles.'},
            {'code': 'MICO301', 'name': 'Medical Microbiology', 'credits': 4, 'description': 'Pathogenic microorganisms, host-parasite relationships, and principles of infectious diseases.'},
            {'code': 'MICO302', 'name': 'Immunology', 'credits': 3, 'description': 'Principles of immunology including innate and adaptive immunity, antibodies, and immune responses.'},
            {'code': 'MICO303', 'name': 'Virology', 'credits': 3, 'description': 'Study of viruses including structure, replication, and viral diseases.'},
            {'code': 'MICO304', 'name': 'Microbial Biochemistry', 'credits': 3, 'description': 'Biochemical processes in microorganisms including enzyme function and metabolic pathways.'},
            {'code': 'MICO305', 'name': 'Environmental Microbiology', 'credits': 3, 'description': 'Role of microorganisms in environmental processes including bioremediation and wastewater treatment.'},
            {'code': 'MICO401', 'name': 'Molecular Microbiology', 'credits': 4, 'description': 'Advanced molecular techniques in microbiology including genomics and proteomics.'},
            {'code': 'MICO402', 'name': 'Industrial Microbiology', 'credits': 3, 'description': 'Application of microorganisms in industrial processes including fermentation and biotechnology.'},
            {'code': 'MICO403', 'name': 'Food Microbiology', 'credits': 3, 'description': 'Microorganisms in food including foodborne pathogens, spoilage, and preservation.'},
            {'code': 'MICO404', 'name': 'Microbial Biotechnology', 'credits': 3, 'description': 'Use of microorganisms in biotechnology including recombinant DNA technology and bioengineering.'},
            {'code': 'MICO405', 'name': 'Advanced Immunology', 'credits': 3, 'description': 'Advanced topics in immunology including autoimmunity, immunodeficiency, and immunotherapy.'},
            {'code': 'MICO406', 'name': 'Microbial Pathogenesis', 'credits': 3, 'description': 'Mechanisms of microbial pathogenesis including virulence factors and host defense evasion.'},
            {'code': 'MICO407', 'name': 'Research Methods in Microbiology', 'credits': 4, 'description': 'Laboratory techniques and experimental design in microbiological research.'}
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
            {'code': 'ENG304', 'name': 'World Literature', 'credits': 3, 'description': 'Study of significant works of literature from various cultures and time periods.'},
            {'code': 'ENG305', 'name': 'Technical Writing', 'credits': 3, 'description': 'Principles and practices of technical communication including documentation and user manuals.'},
            {'code': 'ENG401', 'name': 'Modern Poetry', 'credits': 3, 'description': 'Study of 20th and 21st-century poetry including major movements and poets.'},
            {'code': 'ENG402', 'name': 'Contemporary Fiction', 'credits': 3, 'description': 'Analysis of contemporary novels and short stories from diverse authors.'},
            {'code': 'ENG403', 'name': 'Literature and Film', 'credits': 3, 'description': 'Comparative study of literature and its film adaptations.'},
            {'code': 'ENG404', 'name': 'Postcolonial Literature', 'credits': 3, 'description': 'Study of literature from formerly colonized nations and its cultural contexts.'},
            {'code': 'ENG405', 'name': 'Gender and Literature', 'credits': 3, 'description': 'Examination of gender roles and representations in literature.'},
            {'code': 'ENG406', 'name': 'Advanced Composition', 'credits': 3, 'description': 'Advanced writing workshop focusing on research and argumentative writing.'},
            {'code': 'ENG407', 'name': 'Senior Seminar', 'credits': 3, 'description': 'Capstone research project on a selected topic in English literature.'}
        ],
        'Social Sciences': [
            {'code': 'SOC101', 'name': 'Introduction to Sociology', 'credits': 3, 'description': 'Study of society, social institutions, and social relationships.'},
            {'code': 'SOC102', 'name': 'Introduction to Psychology', 'credits': 3, 'description': 'Survey of major principles and theories in psychology.'},
            {'code': 'SOC201', 'name': 'Social Problems', 'credits': 3, 'description': 'Analysis of contemporary social problems and their potential solutions.'},
            {'code': 'SOC202', 'name': 'Research Methods', 'credits': 4, 'description': 'Introduction to research design and methodology in social sciences.'},
            {'code': 'SOC203', 'name': 'Statistics for Social Sciences', 'credits': 3, 'description': 'Statistical analysis techniques used in social science research.'},
            {'code': 'SOC301', 'name': 'Cultural Anthropology', 'credits': 3, 'description': 'Study of human cultures, diversity, and cultural change.'},
            {'code': 'SOC302', 'name': 'Political Science', 'credits': 3, 'description': 'Introduction to political systems, institutions, and processes.'},
            {'code': 'SOC303', 'name': 'Economics', 'credits': 3, 'description': 'Principles of microeconomics and macroeconomics.'},
            {'code': 'SOC304', 'name': 'Social Theory', 'credits': 3, 'description': 'Major theoretical perspectives in social sciences.'},
            {'code': 'SOC305', 'name': 'Urban Sociology', 'credits': 3, 'description': 'Study of urban communities, structure, and social processes.'},
            {'code': 'SOC401', 'name': 'Social Inequality', 'credits': 3, 'description': 'Analysis of social stratification and systems of inequality.'},
            {'code': 'SOC402', 'name': 'Globalization', 'credits': 3, 'description': 'Examination of global interconnectedness and its social implications.'},
            {'code': 'SOC403', 'name': 'Environmental Sociology', 'credits': 3, 'description': 'Study of the relationship between society and the environment.'},
            {'code': 'SOC404', 'name': 'Race and Ethnicity', 'credits': 3, 'description': 'Analysis of racial and ethnic relations in society.'},
            {'code': 'SOC405', 'name': 'Social Movements', 'credits': 3, 'description': 'Study of collective behavior and social change movements.'},
            {'code': 'SOC406', 'name': 'Qualitative Research Methods', 'credits': 3, 'description': 'Advanced techniques in qualitative data collection and analysis.'},
            {'code': 'SOC407', 'name': 'Senior Thesis', 'credits': 4, 'description': 'Independent research project on a topic in social sciences.'}
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
    
    # Get student users for enrollments
    student_users = User.objects.filter(role='student')
    if not student_users.exists():
        print("No student users found. Please generate users first.")
        return
    
    # Create enrollments
    enrollment_status_choices = ['active', 'dropped', 'completed']
    
    for course in courses:
        # Enroll 10-20 random students in each course
        num_students = random.randint(10, 20)
        enrolled_students = random.sample(list(student_users), min(num_students, len(student_users)))
        
        for student in enrolled_students:
            # Randomly assign a grade to some completed enrollments
            status = random.choice(enrollment_status_choices)
            grade = ''
            if status == 'completed':
                grade = random.choice(['A', 'B', 'C', 'D', 'F'])
            
            Enrollment.objects.create(
                id=f'ENROLL{random.randint(1000, 9999)}',
                student_id=student.id,
                course_id=course.id,
                status=status,
                grade=grade
            )
    
    print("Demo courses and enrollments generated successfully!")

if __name__ == '__main__':
    generate_courses()