#!/usr/bin/env python
"""
Script to initialize the permissions system with default permissions.
"""

import os
import sys
import django

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__)))

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

def initialize_permissions():
    """
    Initialize the permissions system with default permissions.
    This function should be called once during initial setup.
    """
    try:
        # Setup Django
        django.setup()
        
        print("Initializing permissions system...")
        
        # Import the permission service
        from permissions.services import PermissionService
        
        # Initialize default permissions
        print("Creating default permissions...")
        PermissionService.initialize_default_permissions()
        
        print("✓ Successfully initialized permissions system")
        print("\nDefault permissions created:")
        print("- Faculty permissions for course, assignment, grade, and research management")
        print("- Student permissions for viewing their own data")
        print("- Admin permissions for system management")
        print("\nTo verify the permissions, you can check the database or use the Django admin interface.")
        
    except Exception as e:
        print(f"Error initializing permissions: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    initialize_permissions()