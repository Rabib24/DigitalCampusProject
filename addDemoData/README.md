# Demo Data Generation Scripts

This directory contains scripts to generate realistic demo data for all database models in the Digital Campus system.

## Overview

The scripts generate demo data for the following entities:
- Users (Students, Faculty, Admins, Staff)
- Courses and Enrollments
- Assignments, Submissions, and Grades
- Research Projects and Publications
- Library Books
- Financial Aid and Payments
- Campus Activities
- Communications (Notifications, Calendar Events, Alerts)
- Appointments
- Emergency Contacts
- Permissions

## Prerequisites

1. Ensure the Django application is properly configured
2. Make sure all required database migrations have been applied
3. The scripts should be run from the project root directory

## Usage

### Generate All Demo Data

To generate all demo data in the correct order, run:

```bash
python addDemoData/generate_all_data.py
```

This will execute all data generation scripts in the proper sequence to ensure dependencies are met.

### Generate Specific Data Types

You can also run individual scripts to generate specific types of data:

```bash
# Generate users only
python addDemoData/generate_user_data.py

# Generate courses and enrollments
python addDemoData/generate_course_data.py

# Generate assignments, submissions, and grades
python addDemoData/generate_assignment_data.py

# Generate research projects and publications
python addDemoData/generate_research_data.py

# Generate library books
python addDemoData/generate_library_data.py

# Generate financial data
python addDemoData/generate_finance_data.py

# Generate campus activities
python addDemoData/generate_activity_data.py

# Generate communications data
python addDemoData/generate_communication_data.py

# Generate appointments
python addDemoData/generate_appointment_data.py

# Generate emergency contacts
python addDemoData/generate_emergency_data.py

# Generate permissions
python addDemoData/generate_permission_data.py
```

## Data Generation Order

The scripts are designed to be run in a specific order due to dependencies:

1. `generate_user_data.py` - Creates all users first
2. `generate_course_data.py` - Depends on faculty users
3. `generate_assignment_data.py` - Depends on courses and students
4. `generate_research_data.py` - Depends on faculty users
5. `generate_library_data.py` - Independent
6. `generate_finance_data.py` - Depends on users
7. `generate_activity_data.py` - Depends on users
8. `generate_communication_data.py` - Depends on users
9. `generate_appointment_data.py` - Depends on faculty and student users
10. `generate_emergency_data.py` - Depends on users
11. `generate_permission_data.py` - Depends on users and other entities

## Customization

Each script contains sample data that can be customized:
- Names, titles, and descriptions can be modified
- Date ranges can be adjusted
- The number of records generated can be changed
- Additional fields can be added to match specific requirements

## Notes

- All generated data uses realistic but fictional information
- Passwords for all users are set to predictable values for testing:
  - Admin: `admin123`
  - Faculty: `faculty{number}123`
  - Students: `student{number}123`
  - Staff: `staff{number}123`
- Dates are generally set in 2023 for consistency
- All scripts are idempotent and can be run multiple times without creating duplicates