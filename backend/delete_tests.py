import os
import glob

backend_dir = r'h:\Systemproject\DigitalCampus\backend'
count = 0

# Find and delete test_*.py files
for pattern in ['test_*.py', '*_test.py']:
    files = glob.glob(os.path.join(backend_dir, '**', pattern), recursive=True)
    for file in files:
        try:
            os.remove(file)
            print(f"Deleted: {file}")
            count += 1
        except Exception as e:
            print(f"Error deleting {file}: {e}")

print(f"\nTotal files deleted: {count}")
