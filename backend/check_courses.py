import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from courses.models import Course
from users.models import User, Faculty

user = User.objects.get(username='testfaculty')
faculty = Faculty.objects.get(user=user)
courses = Course.objects.filter(instructor_id=faculty.employee_id)
print(f'Courses: {courses.count()}')
for course in courses:
    print(f'- {course.code}: {course.name}')