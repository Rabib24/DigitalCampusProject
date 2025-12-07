#!/usr/bin/env python3
"""
Script to extract training data for AI models from the Digital Campus database.
This script extracts relevant data for training recommendation and performance prediction models.
"""

import os
import sys
import django
import pandas as pd
import numpy as np
from django.conf import settings

# Add the backend directory to the Python path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(backend_dir)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

try:
    django.setup()
    print("Django setup successful")
except Exception as e:
    print(f"Error setting up Django: {e}")
    sys.exit(1)

def anonymize_data(data, pii_columns):
    """
    Anonymize personally identifiable information in the data.
    
    Args:
        data: List of dictionaries containing data records
        pii_columns: List of column names that contain PII
        
    Returns:
        List of dictionaries with PII anonymized
    """
    import hashlib
    
    anonymized_data = []
    for record in data:
        anonymized_record = record.copy()
        for column in pii_columns:
            if column in anonymized_record:
                # Hash the PII data to anonymize it
                if anonymized_record[column]:
                    anonymized_record[column] = hashlib.sha256(
                        str(anonymized_record[column]).encode()
                    ).hexdigest()[:16]  # Use first 16 characters of hash
        anonymized_data.append(anonymized_record)
    
    return anonymized_data

def extract_student_enrollment_data():
    """
    Extract student enrollment data from the database.
    Returns a list of dictionaries with enrollment information.
    """
    # This is a mock implementation since we don't have access to the actual models
    print("Extracting student enrollment data...")
    # In a real implementation, this would query the database:
    # from courses.models import Enrollment
    # from users.models import User
    # enrollments = Enrollment.objects.select_related('student', 'course').all()
    
    # Mock data for demonstration
    mock_data = [
        {
            "student_id": "STU001",
            "student_name": "John Doe",  # PII - will be anonymized
            "course_id": "CS101",
            "grade": "A",
            "semester": "Fall 2023",
            "credits": 3,
            "enrollment_date": "2023-08-15"
        },
        {
            "student_id": "STU001",
            "student_name": "John Doe",  # PII - will be anonymized
            "course_id": "MATH201",
            "grade": "B+",
            "semester": "Spring 2024",
            "credits": 4,
            "enrollment_date": "2024-01-10"
        },
        {
            "student_id": "STU002",
            "student_name": "Jane Smith",  # PII - will be anonymized
            "course_id": "CS101",
            "grade": "A-",
            "semester": "Fall 2023",
            "credits": 3,
            "enrollment_date": "2023-08-15"
        },
        {
            "student_id": "STU003",
            "student_name": "Bob Johnson",  # PII - will be anonymized
            "course_id": "MATH201",
            "grade": "B",
            "semester": "Spring 2024",
            "credits": 4,
            "enrollment_date": "2024-01-10"
        },
        # More mock data would be extracted here
    ]
    
    # Anonymize PII data
    pii_columns = ['student_name']
    anonymized_data = anonymize_data(mock_data, pii_columns)
    
    print(f"Extracted {len(anonymized_data)} enrollment records")
    return anonymized_data

def extract_course_information():
    """
    Extract course information from the database.
    Returns a list of dictionaries with course details.
    """
    print("Extracting course information...")
    # In a real implementation, this would query the database:
    # from courses.models import Course
    
    # Mock data for demonstration
    mock_data = [
        {
            "course_id": "CS101",
            "title": "Introduction to Computer Science",
            "department": "Computer Science",
            "credits": 3,
            "prerequisites": [],
            "description": "Fundamental concepts of computer science",
            "instructor": "Dr. Smith"  # PII - will be anonymized
        },
        {
            "course_id": "MATH201",
            "title": "Calculus II",
            "department": "Mathematics",
            "credits": 4,
            "prerequisites": ["MATH101"],
            "description": "Advanced calculus topics",
            "instructor": "Prof. Johnson"  # PII - will be anonymized
        },
        {
            "course_id": "ENG101",
            "title": "English Composition",
            "department": "English",
            "credits": 3,
            "prerequisites": [],
            "description": "Writing and composition skills",
            "instructor": "Dr. Williams"  # PII - will be anonymized
        },
        # More mock data would be extracted here
    ]
    
    # Anonymize PII data
    pii_columns = ['instructor']
    anonymized_data = anonymize_data(mock_data, pii_columns)
    
    print(f"Extracted {len(anonymized_data)} course records")
    return anonymized_data

def extract_academic_performance_records():
    """
    Extract academic performance records from the database.
    Returns a list of dictionaries with performance data.
    """
    print("Extracting academic performance records...")
    # In a real implementation, this would query the database:
    # from grades.models import Grade
    # from assignments.models import AssignmentSubmission
    
    # Mock data for demonstration
    mock_data = [
        {
            "student_id": "STU001",
            "course_id": "CS101",
            "assignment_scores": [95, 87, 92],
            "exam_scores": [88, 91],
            "final_grade": "A",
            "attendance_rate": 0.95,
            "participation_score": 8.5
        },
        {
            "student_id": "STU001",
            "course_id": "MATH201",
            "assignment_scores": [85, 78, 82],
            "exam_scores": [80, 75],
            "final_grade": "B+",
            "attendance_rate": 0.87,
            "participation_score": 7.2
        },
        {
            "student_id": "STU002",
            "course_id": "CS101",
            "assignment_scores": [92, 89, 94],
            "exam_scores": [90, 88],
            "final_grade": "A-",
            "attendance_rate": 0.92,
            "participation_score": 8.8
        },
        {
            "student_id": "STU003",
            "course_id": "MATH201",
            "assignment_scores": [78, 82, 75],
            "exam_scores": [76, 79],
            "final_grade": "B",
            "attendance_rate": 0.85,
            "participation_score": 7.0
        },
        # More mock data would be extracted here
    ]
    
    print(f"Extracted {len(mock_data)} performance records")
    return mock_data

def clean_data(data, rules=None):
    """
    Clean data according to specified rules.
    
    Args:
        data: List of dictionaries containing data records
        rules: Dictionary of cleaning rules (optional)
        
    Returns:
        List of cleaned dictionaries
    """
    if rules is None:
        rules = {}
    
    cleaned_data = []
    
    for record in data:
        cleaned_record = record.copy()
        
        # Remove records with missing critical fields
        if 'student_id' in cleaned_record and not cleaned_record['student_id']:
            continue
        if 'course_id' in cleaned_record and not cleaned_record['course_id']:
            continue
            
        # Convert grade to numerical value for easier processing
        if 'grade' in cleaned_record:
            grade_mapping = {
                'A+': 4.0, 'A': 4.0, 'A-': 3.7,
                'B+': 3.3, 'B': 3.0, 'B-': 2.7,
                'C+': 2.3, 'C': 2.0, 'C-': 1.7,
                'D+': 1.3, 'D': 1.0, 'F': 0.0
            }
            if cleaned_record['grade'] in grade_mapping:
                cleaned_record['grade_points'] = grade_mapping[cleaned_record['grade']]
            else:
                cleaned_record['grade_points'] = None
        
        # Ensure numerical fields are properly formatted
        if 'credits' in cleaned_record:
            try:
                cleaned_record['credits'] = float(cleaned_record['credits'])
            except (ValueError, TypeError):
                cleaned_record['credits'] = 0
        
        if 'attendance_rate' in cleaned_record:
            try:
                cleaned_record['attendance_rate'] = float(cleaned_record['attendance_rate'])
                # Ensure attendance rate is between 0 and 1
                cleaned_record['attendance_rate'] = max(0, min(1, cleaned_record['attendance_rate']))
            except (ValueError, TypeError):
                cleaned_record['attendance_rate'] = 0
                
        # Calculate average assignment score if assignment_scores exist
        if 'assignment_scores' in cleaned_record and cleaned_record['assignment_scores']:
            try:
                cleaned_record['avg_assignment_score'] = np.mean(cleaned_record['assignment_scores'])
            except:
                cleaned_record['avg_assignment_score'] = None
        
        # Calculate average exam score if exam_scores exist
        if 'exam_scores' in cleaned_record and cleaned_record['exam_scores']:
            try:
                cleaned_record['avg_exam_score'] = np.mean(cleaned_record['exam_scores'])
            except:
                cleaned_record['avg_exam_score'] = None
        
        cleaned_data.append(cleaned_record)
    
    print(f"Cleaned data: {len(data)} records -> {len(cleaned_data)} records")
    return cleaned_data

def save_training_data(data, filename):
    """
    Save extracted data to a file for model training.
    
    Args:
        data: The data to save
        filename: The filename to save to
    """
    import json
    
    filepath = os.path.join(os.path.dirname(__file__), 'training_data', filename)
    
    # Ensure the training_data directory exists
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)
    
    print(f"Saved data to {filepath}")

def main():
    """
    Main function to extract all training data.
    """
    print("Starting data extraction for AI model training...")
    
    # Create training_data directory if it doesn't exist
    training_data_dir = os.path.join(os.path.dirname(__file__), 'training_data')
    os.makedirs(training_data_dir, exist_ok=True)
    
    # Extract all data
    raw_enrollment_data = extract_student_enrollment_data()
    raw_course_data = extract_course_information()
    raw_performance_data = extract_academic_performance_records()
    
    # Clean the data
    print("Cleaning data...")
    enrollment_data = clean_data(raw_enrollment_data)
    course_data = clean_data(raw_course_data)
    performance_data = clean_data(raw_performance_data)
    
    # Save data to files
    save_training_data(enrollment_data, 'enrollment_data.json')
    save_training_data(course_data, 'course_data.json')
    save_training_data(performance_data, 'performance_data.json')
    
    print("Data extraction completed successfully!")
    print(f"Training data saved to: {training_data_dir}")

if __name__ == "__main__":
    main()