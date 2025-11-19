import os
import sys
import django

# Add the backend directory to the Python path
backend_path = os.path.join(os.path.dirname(__file__), 'backend')
if backend_path not in sys.path:
    sys.path.append(backend_path)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def main():
    """Display information for all models"""
    print("DATABASE TABLE STRUCTURE AND SAMPLE DATA")
    print("=" * 80)
    
    try:
        # Import all models dynamically after Django setup
        from backend.users.models import User, Student, Faculty, Admin, Staff
        from backend.courses.models import Course, Enrollment
        from backend.assignments.models import Assignment, Submission, Grade
        from backend.finance.models import FinancialAid, Payment
        from backend.library.models import LibraryBook
        from backend.emergency.models import EmergencyContact
        from backend.activities.models import CampusActivity
        from backend.research.models import ResearchProject
        from backend.communications.models import Notification, CalendarEvent, Alert
        
        # List of all models with their classes and names
        models_to_check = [
            (User, "User"),
            (Student, "Student"),
            (Faculty, "Faculty"),
            (Admin, "Admin"),
            (Staff, "Staff"),
            (Course, "Course"),
            (Enrollment, "Enrollment"),
            (Assignment, "Assignment"),
            (Submission, "Submission"),
            (Grade, "Grade"),
            (FinancialAid, "FinancialAid"),
            (Payment, "Payment"),
            (LibraryBook, "LibraryBook"),
            (EmergencyContact, "EmergencyContact"),
            (CampusActivity, "CampusActivity"),
            (ResearchProject, "ResearchProject"),
            (Notification, "Notification"),
            (CalendarEvent, "CalendarEvent"),
            (Alert, "Alert"),
        ]
        
        def print_field_info(model_class):
            """Print field information for a model"""
            print("Field Structure:")
            print("-" * 40)
            for field in model_class._meta.get_fields():
                if hasattr(field, 'name') and hasattr(field, 'get_internal_type'):
                    null_status = "NULL" if field.null else "NOT NULL"
                    print(f"  {field.name:<30} : {field.get_internal_type():<20} {null_status}")
                elif hasattr(field, 'name'):
                    # For related fields and other special field types
                    print(f"  {field.name:<30} : {type(field).__name__}")
            print()

        def print_sample_data(model_class):
            """Print sample data from the first record if available"""
            try:
                if model_class.objects.exists():
                    first_record = model_class.objects.first()
                    print("Sample Data (First Record):")
                    print("-" * 40)
                    for field in model_class._meta.fields:
                        if hasattr(first_record, field.name):
                            value = getattr(first_record, field.name)
                            # Truncate long values for better readability
                            if isinstance(value, str) and len(value) > 80:
                                value = value[:80] + "..."
                            print(f"  {field.name:<30} : {value}")
                    print()
                else:
                    print("No records found in this table.\n")
            except Exception as e:
                print(f"Could not retrieve sample data: {e}\n")

        def display_model_info(model_class, model_name):
            """Display complete information for a model"""
            print(f"Table: {model_class._meta.db_table}")
            print(f"Model: {model_name}")
            print("=" * 80)
            
            # Print field structure
            print_field_info(model_class)
            
            # Print sample data if records exist
            print_sample_data(model_class)

        # Print details for each model
        for model_class, model_name in models_to_check:
            try:
                display_model_info(model_class, model_name)
            except Exception as e:
                print(f"Error displaying info for {model_name}: {e}\n")
        
        print("=" * 80)
        print("END OF DATABASE INFORMATION")
        print("=" * 80)
        
    except Exception as e:
        print(f"Error importing models: {e}")
        print("Make sure Django is properly configured and the database is accessible.")

if __name__ == "__main__":
    main()