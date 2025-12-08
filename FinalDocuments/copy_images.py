import os
import shutil

# Create Imgs directory
imgs_dir = r'h:\Systemproject\DigitalCampus\FinalDocuments\Imgs'
os.makedirs(imgs_dir, exist_ok=True)

# Source directory
src_dir = r'C:\Users\rabib\.gemini\antigravity\brain\c015a3f8-f037-4042-addf-ddfbc407b921'

# Files to copy with their new names
files_to_copy = {
    'system_architecture_overview_1765216642456.png': 'system_architecture_overview.png',
    'student_dashboard_mockup_1765216665664.png': 'student_dashboard_mockup.png',
    'faculty_dashboard_mockup_1765216686027.png': 'faculty_dashboard_mockup.png',
    'enrollment_workflow_diagram_1765216711374.png': 'enrollment_workflow_diagram.png',
    'analytics_dashboard_charts_1765216728935.png': 'analytics_dashboard_charts.png',
    'mobile_responsive_design_1765216745716.png': 'mobile_responsive_design.png'
}

# Copy files
copied_count = 0
for src_name, dst_name in files_to_copy.items():
    src_path = os.path.join(src_dir, src_name)
    dst_path = os.path.join(imgs_dir, dst_name)
    
    if os.path.exists(src_path):
        shutil.copy2(src_path, dst_path)
        print(f'✓ Copied: {dst_name}')
        copied_count += 1
    else:
        print(f'✗ Not found: {src_name}')

print(f'\n{copied_count}/{len(files_to_copy)} images copied successfully!')
print(f'\nImages location: {imgs_dir}')
print('\nFiles in Imgs folder:')
for f in sorted(os.listdir(imgs_dir)):
    size = os.path.getsize(os.path.join(imgs_dir, f)) / 1024
    print(f'  - {f} ({size:.1f} KB)')
