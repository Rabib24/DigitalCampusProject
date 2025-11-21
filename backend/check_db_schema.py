import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.db import connection

# Check the database schema for the users_user table
with connection.cursor() as cursor:
    cursor.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users_user'")
    columns = cursor.fetchall()
    
    print("Columns in users_user table:")
    for column in columns:
        print(f"  {column[0]}: {column[1]}")
        
    # Check if failed_login_attempts column exists
    failed_login_attempts_exists = any(column[0] == 'failed_login_attempts' for column in columns)
    print(f"\nfailed_login_attempts column exists: {failed_login_attempts_exists}")