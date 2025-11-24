import os
import django
import uuid
from datetime import datetime, timedelta
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from assignments.models import Assignment
from courses.models import Course
from users.models import User, Faculty

user = User.objects.get(username='testfaculty')
faculty = Faculty.objects.get(user=user)
courses = Course.objects.filter(instructor_id=faculty.employee_id)

# Create assignments for each course
for course in courses:
    # Create 2 assignments per course
    Assignment.objects.create(
        id=str(uuid.uuid4()),
        course_id=course.id,
        title=f'{course.code} - Assignment 1',
        description=f'First assignment for {course.name}',
        due_date=datetime.now() + timedelta(days=7),
        points=100,
        type='homework',
        start_date=datetime.now(),
        allow_late_submission=True,
        late_penalty=10.0,
        max_submissions=1,
        visible_to_students=True,
        category='homework',
        weight=1.0
    )
    
    Assignment.objects.create(
        id=str(uuid.uuid4()),
        course_id=course.id,
        title=f'{course.code} - Assignment 2',
        description=f'Second assignment for {course.name}',
        due_date=datetime.now() + timedelta(days=14),
        points=100,
        type='homework',
        start_date=datetime.now(),
        allow_late_submission=True,
        late_penalty=10.0,
        max_submissions=1,
        visible_to_students=True,
        category='homework',
        weight=1.0
    )

print('Assignments created successfully!')