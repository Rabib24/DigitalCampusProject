#!/usr/bin/env python3
"""
Script to train a simple recommendation model for the Digital Campus AI service.
This script trains a basic collaborative filtering model using the extracted training data.
"""

import os
import json
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib

def load_training_data():
    """
    Load training data from the training_data directory.
    Returns a dictionary with all the loaded data.
    """
    training_data_dir = os.path.join(os.path.dirname(__file__), 'training_data')
    
    data = {}
    
    # Load enrollment data
    enrollment_file = os.path.join(training_data_dir, 'enrollment_data.json')
    if os.path.exists(enrollment_file):
        with open(enrollment_file, 'r') as f:
            data['enrollments'] = json.load(f)
        print(f"Loaded {len(data['enrollments'])} enrollment records")
    else:
        print("Enrollment data file not found")
        data['enrollments'] = []
    
    # Load course data
    course_file = os.path.join(training_data_dir, 'course_data.json')
    if os.path.exists(course_file):
        with open(course_file, 'r') as f:
            data['courses'] = json.load(f)
        print(f"Loaded {len(data['courses'])} course records")
    else:
        print("Course data file not found")
        data['courses'] = []
    
    # Load performance data
    performance_file = os.path.join(training_data_dir, 'performance_data.json')
    if os.path.exists(performance_file):
        with open(performance_file, 'r') as f:
            data['performance'] = json.load(f)
        print(f"Loaded {len(data['performance'])} performance records")
    else:
        print("Performance data file not found")
        data['performance'] = []
    
    return data

def prepare_course_features(courses):
    """
    Prepare course features for similarity computation.
    
    Args:
        courses: List of course dictionaries
        
    Returns:
        DataFrame with course features
    """
    course_df = pd.DataFrame(courses)
    
    # Create a simple feature representation
    course_df['features'] = course_df['title'] + ' ' + course_df['description'] + ' ' + course_df['department']
    
    return course_df

def train_collaborative_filtering_model(enrollments, courses):
    """
    Train a simple collaborative filtering model.
    
    Args:
        enrollments: List of enrollment records
        courses: List of course records
        
    Returns:
        Trained model components
    """
    print("Training collaborative filtering model...")
    
    # Convert to DataFrame for easier manipulation
    enrollment_df = pd.DataFrame(enrollments)
    course_df = pd.DataFrame(courses)
    
    # Create user-course matrix
    user_course_matrix = pd.crosstab(enrollment_df['student_id'], enrollment_df['course_id'], values=enrollment_df.get('grade_points', 1), aggfunc='mean').fillna(0)
    
    # Compute item similarity matrix
    item_similarity = cosine_similarity(user_course_matrix.T)
    item_similarity_df = pd.DataFrame(item_similarity, index=user_course_matrix.columns, columns=user_course_matrix.columns)
    
    # Prepare course features for content-based filtering
    course_features_df = prepare_course_features(courses)
    
    # Vectorize course features
    tfidf = TfidfVectorizer(stop_words='english')
    course_features = tfidf.fit_transform(course_features_df['features'])
    
    # Compute content-based similarity
    content_similarity = cosine_similarity(course_features)
    content_similarity_df = pd.DataFrame(content_similarity, index=course_features_df['course_id'], columns=course_features_df['course_id'])
    
    # Combine collaborative and content-based similarities
    # This is a simple average, but could be weighted differently
    combined_similarity = (item_similarity_df + content_similarity_df) / 2
    
    model_components = {
        'user_course_matrix': user_course_matrix,
        'item_similarity': item_similarity_df,
        'content_similarity': content_similarity_df,
        'combined_similarity': combined_similarity,
        'tfidf_vectorizer': tfidf,
        'course_features': course_features_df
    }
    
    print("Collaborative filtering model training completed")
    return model_components

def train_performance_prediction_model(performance_data):
    """
    Train a simple performance prediction model.
    
    Args:
        performance_data: List of performance records
        
    Returns:
        Trained model components
    """
    print("Training performance prediction model...")
    
    # This is a placeholder for a more complex model
    # In practice, you would use regression techniques here
    
    # For now, we'll just compute some basic statistics
    performance_df = pd.DataFrame(performance_data)
    
    # Calculate average scores by student
    if 'assignment_scores' in performance_df.columns:
        performance_df['avg_assignment_score'] = performance_df['assignment_scores'].apply(lambda x: np.mean(x) if x else 0)
    
    if 'exam_scores' in performance_df.columns:
        performance_df['avg_exam_score'] = performance_df['exam_scores'].apply(lambda x: np.mean(x) if x else 0)
    
    # Basic statistics that could inform predictions
    model_components = {
        'student_avg_scores': performance_df.groupby('student_id')[['avg_assignment_score', 'avg_exam_score']].mean(),
        'overall_stats': {
            'avg_assignment_score': performance_df['avg_assignment_score'].mean() if 'avg_assignment_score' in performance_df.columns else 0,
            'avg_exam_score': performance_df['avg_exam_score'].mean() if 'avg_exam_score' in performance_df.columns else 0,
            'std_assignment_score': performance_df['avg_assignment_score'].std() if 'avg_assignment_score' in performance_df.columns else 0,
            'std_exam_score': performance_df['avg_exam_score'].std() if 'avg_exam_score' in performance_df.columns else 0
        }
    }
    
    print("Performance prediction model training completed")
    return model_components

def save_model(model_components, model_name):
    """
    Save trained model components to disk.
    
    Args:
        model_components: Dictionary of model components
        model_name: Name of the model
    """
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    model_path = os.path.join(models_dir, f'{model_name}.pkl')
    joblib.dump(model_components, model_path)
    print(f"Model saved to {model_path}")

def main():
    """
    Main function to train all AI models.
    """
    print("Starting AI model training...")
    
    # Load training data
    data = load_training_data()
    
    # Train recommendation model
    if data['enrollments'] and data['courses']:
        recommendation_model = train_collaborative_filtering_model(data['enrollments'], data['courses'])
        save_model(recommendation_model, 'recommendation_model')
    else:
        print("Insufficient data to train recommendation model")
    
    # Train performance prediction model
    if data['performance']:
        performance_model = train_performance_prediction_model(data['performance'])
        save_model(performance_model, 'performance_model')
    else:
        print("Insufficient data to train performance prediction model")
    
    print("AI model training completed!")

if __name__ == "__main__":
    main()