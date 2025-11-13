import os
import django
from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from users.models import User, Student, Faculty, Admin

class Command(BaseCommand):
    help = 'Create demo users for testing'

    def handle(self, *args, **options):
        # Create a superuser for development
        superuser_data = {
            'username': '2221005',
            'email': '2221005@iub.edu.bd',
            'password': 'DigitalCampus123',
            'first_name': 'Development',
            'last_name': 'User',
            'role': 'admin',
            'status': 'active'
        }

        # Create 6 users with different roles
        users_data = [
            {
                'username': '2221005',
                'email': '2221005@iub.edu.bd',
                'password': 'DigitalCampus123',
                'first_name': 'Development',
                'last_name': 'User',
                'role': 'admin',
                'status': 'active'
            },
            {
                'username': '2221001',
                'email': '2221001@iub.edu.bd',
                'password': 'DigitalCampus123',
                'first_name': 'John',
                'last_name': 'Student',
                'role': 'student',
                'status': 'active'
            },
            {
                'username': '2221002',
                'email': '2221002@iub.edu.bd',
                'password': 'DigitalCampus123',
                'first_name': 'Jane',
                'last_name': 'Faculty',
                'role': 'faculty',
                'status': 'active'
            },
            {
                'username': '2221003',
                'email': '2221003@iub.edu.bd',
                'password': 'DigitalCampus123',
                'first_name': 'Robert',
                'last_name': 'Admin',
                'role': 'admin',
                'status': 'active'
            },
            {
                'username': '2221004',
                'email': '2221004@iub.edu.bd',
                'password': 'DigitalCampus123',
                'first_name': 'Alice',
                'last_name': 'Staff',
                'role': 'staff',
                'status': 'active'
            },
            {
                'username': '2221006',
                'email': '2221006@iub.edu.bd',
                'password': 'DigitalCampus123',
                'first_name': 'Michael',
                'last_name': 'Advisor',
                'role': 'faculty',
                'status': 'active'
            }
        ]

        # Create users
        for user_data in users_data:
            # Check if user already exists
            if User.objects.filter(username=user_data['username']).exists():
                self.stdout.write(f"User {user_data['username']} already exists")
                continue

            # Create the user
            user = User.objects.create(
                username=user_data['username'],
                email=user_data['email'],
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                role=user_data['role'],
                status=user_data['status'],
                password=make_password(user_data['password']),
                mfa_enabled=False,
                failed_login_attempts=0
            )

            # Create role-specific profile
            if user_data['role'] == 'student':
                Student.objects.create(
                    user=user,
                    student_id=user_data['username']
                )
            elif user_data['role'] == 'faculty':
                Faculty.objects.create(
                    user=user,
                    employee_id=user_data['username']
                )
            elif user_data['role'] == 'admin':
                Admin.objects.create(
                    user=user,
                    employee_id=user_data['username']
                )

            self.stdout.write(f"Created user: {user_data['username']} ({user_data['role']})")

        self.stdout.write("Demo users created successfully!")