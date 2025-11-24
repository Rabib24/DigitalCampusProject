import os
import sys
import subprocess
import django

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def run_script(script_name):
    """Run a Python script and return the result"""
    try:
        print(f"Running {script_name}...")
        result = subprocess.run([
            sys.executable, 
            os.path.join(os.path.dirname(__file__), script_name)
        ], check=True, capture_output=True, text=True)
        print(f"{script_name} completed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error running {script_name}: {e}")
        print(f"Error output: {e.stderr}")
        return False

def main():
    """Generate all demo data"""
    print("Starting demo data generation...")
    
    # Run scripts in order (some depend on others)
    scripts = [
        'generate_user_data.py',           # Users must be created first
        'generate_course_data.py',         # Courses depend on users
        'generate_assignment_data.py',     # Assignments depend on courses
        'generate_research_data.py',       # Research depends on faculty users
        'generate_library_data.py',        # Library books
        'generate_finance_data.py',        # Finance data depends on users
        'generate_activity_data.py',       # Activities depend on users
        'generate_communication_data.py',  # Communications depend on users
        'generate_appointment_data.py',    # Appointments depend on faculty and student users
        'generate_emergency_data.py',      # Emergency contacts depend on users
    ]
    
    success_count = 0
    for script in scripts:
        if run_script(script):
            success_count += 1
        else:
            print(f"Failed to run {script}. Continuing with next script...")
    
    print(f"\nDemo data generation completed!")
    print(f"Successfully ran {success_count} out of {len(scripts)} scripts.")

if __name__ == '__main__':
    main()