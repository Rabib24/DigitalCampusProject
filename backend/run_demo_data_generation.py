"""
Demo Data Generation Runner
Run with: python manage.py shell
Then: exec(open('run_demo_data_generation.py').read())
"""

print("\n" + "="*80)
print("  DEMO DATA GENERATION - PHASE 3")
print("  Running: Enrollment, Grade, and Degree Progress Data Generation")
print("="*80 + "\n")

import sys
import os

# Add addDemoData to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'addDemoData'))

# Step 1: Generate Enrollment Data
print("\n" + "="*80)
print("STEP 1: GENERATING ENROLLMENT DATA")
print("="*80)

try:
    from generate_enrollment_data import generate_enrollment_data
    generate_enrollment_data()
    print("\n✅ Enrollment data generation completed!")
except Exception as e:
    print(f"\n❌ Error generating enrollment data: {e}")
    import traceback
    traceback.print_exc()

# Step 2: Generate Grade Data
print("\n" + "="*80)
print("STEP 2: GENERATING GRADE DATA")
print("="*80)

try:
    from generate_grade_data import generate_grade_data
    generate_grade_data()
    print("\n✅ Grade data generation completed!")
except Exception as e:
    print(f"\n❌ Error generating grade data: {e}")
    import traceback
    traceback.print_exc()

# Step 3: Generate Degree Progress Data
print("\n" + "="*80)
print("STEP 3: GENERATING DEGREE PROGRESS DATA")
print("="*80)

try:
    from generate_degree_progress_data import generate_degree_progress_data
    generate_degree_progress_data()
    print("\n✅ Degree progress data generation completed!")
except Exception as e:
    print(f"\n❌ Error generating degree progress data: {e}")
    import traceback
    traceback.print_exc()

# Final Summary
print("\n" + "="*80)
print("  DEMO DATA GENERATION COMPLETE")
print("="*80)
print("\nAll demo data scripts executed successfully!")
print("\nNext steps:")
print("  1. Run database audit to verify data: exec(open('run_database_audit.py').read())")
print("  2. Test student dashboard endpoints")
print("  3. Proceed to Phase 4: Frontend fixes\n")
