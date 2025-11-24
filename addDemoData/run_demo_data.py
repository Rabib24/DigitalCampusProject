#!/usr/bin/env python
"""
Convenience script to generate all demo data
"""
import os
import sys

# Add the current directory to the Python path
sys.path.append(os.path.dirname(__file__))

def main():
    """Main function to run the demo data generation"""
    try:
        # Import and run the main generation script
        from generate_all_data import main as generate_all
        generate_all()
    except ImportError as e:
        print(f"Error importing modules: {e}")
        print("Make sure you're running this script from the correct directory")
        sys.exit(1)
    except Exception as e:
        print(f"Error generating demo data: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()