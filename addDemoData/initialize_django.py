import os
import sys
import django

def initialize_django():
    """Initialize Django environment"""
    # Add the backend directory to the Python path
    backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
    sys.path.append(backend_path)
    
    # Set up Django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    django.setup()
    
    print("Django environment initialized successfully!")

if __name__ == '__main__':
    initialize_django()