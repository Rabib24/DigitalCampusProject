#!/usr/bin/env python3
"""
Feature Extraction Module for Digital Campus AI Services

This module implements feature extraction from course and student data for AI models.
"""

import re
import nltk
import pandas as pd
import numpy as np
from typing import Dict, List, Any, Tuple
from collections import Counter

# Download required NLTK data (would be run once during setup)
# nltk.download('punkt')
# nltk.download('stopwords')
# nltk.download('wordnet')

try:
    from nltk.corpus import stopwords
    from nltk.tokenize import word_tokenize
    from nltk.stem import WordNetLemmatizer
    STOPWORDS = set(stopwords.words('english'))
    LEMMATIZER = WordNetLemmatizer()
except LookupError:
    # If NLTK data is not available, use basic preprocessing
    STOPWORDS = set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'])
    LEMMATIZER = None

class FeatureExtractor:
    """
    Extracts features from course and student data for AI models.
    """
    
    def __init__(self):
        """
        Initialize the Feature Extractor.
        """
        self.course_features_cache = {}
        self.student_features_cache = {}
    
    def extract_course_features(self, course_data: List[Dict[str, Any]]) -> pd.DataFrame:
        """
        Extract features from course data.
        
        Args:
            course_data: List of dictionaries containing course information
            
        Returns:
            DataFrame with extracted course features
        """
        features = []
        
        for course in course_data:
            course_id = course.get('course_id', '')
            
            # Check cache first
            if course_id in self.course_features_cache:
                features.append(self.course_features_cache[course_id])
                continue
            
            # Extract numerical features
            credits = float(course.get('credits', 0))
            department = course.get('department', '')
            prerequisites_count = len(course.get('prerequisites', []))
            
            # Extract text features
            title = course.get('title', '')
            description = course.get('description', '')
            
            # Process text features
            title_keywords = self._extract_keywords(title)
            desc_keywords = self._extract_keywords(description)
            
            # Combine all features
            course_features = {
                'course_id': course_id,
                'credits': credits,
                'department_' + department: 1,  # One-hot encoding for department
                'prerequisites_count': prerequisites_count,
                'title_length': len(title),
                'description_length': len(description),
                'title_keywords_count': len(title_keywords),
                'desc_keywords_count': len(desc_keywords),
                'common_keywords': len(set(title_keywords) & set(desc_keywords)),
            }
            
            # Add keyword features (top 20 most common)
            all_keywords = title_keywords + desc_keywords
            keyword_freq = Counter(all_keywords)
            top_keywords = keyword_freq.most_common(20)
            
            for i, (keyword, freq) in enumerate(top_keywords):
                course_features[f'keyword_{i}'] = keyword
                course_features[f'keyword_{i}_freq'] = freq
            
            # Cache the features
            self.course_features_cache[course_id] = course_features
            features.append(course_features)
        
        # Convert to DataFrame
        df = pd.DataFrame(features)
        
        # Handle one-hot encoding for departments
        dept_columns = [col for col in df.columns if col.startswith('department_')]
        if dept_columns:
            # Fill NaN values with 0
            df[dept_columns] = df[dept_columns].fillna(0)
        
        return df
    
    def extract_student_features(self, enrollment_data: List[Dict[str, Any]], 
                               performance_data: List[Dict[str, Any]]) -> pd.DataFrame:
        """
        Extract features from student data.
        
        Args:
            enrollment_data: List of dictionaries containing enrollment information
            performance_data: List of dictionaries containing performance information
            
        Returns:
            DataFrame with extracted student features
        """
        # Convert to DataFrames for easier processing
        enrollments_df = pd.DataFrame(enrollment_data)
        performance_df = pd.DataFrame(performance_data)
        
        # Group by student_id to calculate aggregate features
        student_features = []
        
        for student_id in set(enrollments_df['student_id']):
            # Check cache first
            if student_id in self.student_features_cache:
                student_features.append(self.student_features_cache[student_id])
                continue
            
            # Filter data for this student
            student_enrollments = enrollments_df[enrollments_df['student_id'] == student_id]
            student_performance = performance_df[performance_df['student_id'] == student_id]
            
            # Calculate enrollment features
            total_credits = student_enrollments['credits'].sum()
            courses_count = len(student_enrollments)
            departments = student_enrollments['course_id'].apply(
                lambda x: x[:2] if len(x) >= 2 else x  # Simple department extraction
            ).tolist()
            dept_diversity = len(set(departments))
            
            # Calculate performance features
            avg_grade_points = student_performance['grade_points'].mean() if not student_performance.empty else 0
            avg_assignment_score = student_performance['avg_assignment_score'].mean() if 'avg_assignment_score' in student_performance.columns and not student_performance.empty else 0
            avg_exam_score = student_performance['avg_exam_score'].mean() if 'avg_exam_score' in student_performance.columns and not student_performance.empty else 0
            attendance_rate = student_performance['attendance_rate'].mean() if not student_performance.empty else 0
            
            # Calculate trend features (improvement/decline)
            if len(student_performance) > 1:
                grade_points = student_performance['grade_points'].tolist()
                grade_trend = np.polyfit(range(len(grade_points)), grade_points, 1)[0] if len(grade_points) > 1 else 0
            else:
                grade_trend = 0
            
            # Compile features
            features = {
                'student_id': student_id,
                'total_credits': total_credits,
                'courses_count': courses_count,
                'dept_diversity': dept_diversity,
                'avg_grade_points': avg_grade_points,
                'avg_assignment_score': avg_assignment_score,
                'avg_exam_score': avg_exam_score,
                'attendance_rate': attendance_rate,
                'grade_trend': grade_trend,
            }
            
            # Cache the features
            self.student_features_cache[student_id] = features
            student_features.append(features)
        
        return pd.DataFrame(student_features)
    
    def _extract_keywords(self, text: str) -> List[str]:
        """
        Extract keywords from text using basic NLP preprocessing.
        
        Args:
            text: Input text
            
        Returns:
            List of extracted keywords
        """
        if not text:
            return []
        
        # Convert to lowercase
        text = text.lower()
        
        # Remove punctuation and special characters
        text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
        
        # Tokenize
        if 'word_tokenize' in globals():
            tokens = word_tokenize(text)
        else:
            tokens = text.split()
        
        # Remove stopwords
        tokens = [token for token in tokens if token not in STOPWORDS]
        
        # Lemmatize if available
        if LEMMATIZER:
            tokens = [LEMMATIZER.lemmatize(token) for token in tokens]
        
        # Filter out short tokens
        tokens = [token for token in tokens if len(token) > 2]
        
        return tokens
    
    def extract_text_features(self, texts: List[str], max_features: int = 100) -> Tuple[np.ndarray, List[str]]:
        """
        Extract TF-IDF features from a list of texts.
        
        Args:
            texts: List of text documents
            max_features: Maximum number of features to extract
            
        Returns:
            Tuple of (feature matrix, feature names)
        """
        from sklearn.feature_extraction.text import TfidfVectorizer
        
        # Initialize TF-IDF vectorizer
        vectorizer = TfidfVectorizer(
            max_features=max_features,
            stop_words='english',
            lowercase=True,
            ngram_range=(1, 2)  # Unigrams and bigrams
        )
        
        # Fit and transform texts
        try:
            features = vectorizer.fit_transform(texts)
            feature_names = vectorizer.get_feature_names_out()
            return features.toarray(), feature_names.tolist()
        except ValueError:
            # Handle case where there are no valid texts
            return np.zeros((len(texts), max_features)), [f"feature_{i}" for i in range(max_features)]
    
    def create_interaction_features(self, student_features: pd.DataFrame, 
                                  course_features: pd.DataFrame) -> pd.DataFrame:
        """
        Create interaction features between students and courses.
        
        Args:
            student_features: DataFrame with student features
            course_features: DataFrame with course features
            
        Returns:
            DataFrame with interaction features
        """
        interaction_features = []
        
        for _, student in student_features.iterrows():
            for _, course in course_features.iterrows():
                # Calculate compatibility score based on features
                compatibility_score = self._calculate_compatibility(student, course)
                
                # Create interaction feature record
                interaction = {
                    'student_id': student['student_id'],
                    'course_id': course['course_id'],
                    'compatibility_score': compatibility_score,
                    'credit_match': abs(student.get('total_credits', 0) - course.get('credits', 0)) < 2,
                }
                
                interaction_features.append(interaction)
        
        return pd.DataFrame(interaction_features)
    
    def _calculate_compatibility(self, student: pd.Series, course: pd.Series) -> float:
        """
        Calculate compatibility score between student and course.
        
        Args:
            student: Series with student features
            course: Series with course features
            
        Returns:
            Compatibility score between 0 and 1
        """
        # Simple heuristic: higher grade trends match with more challenging courses
        grade_trend = student.get('grade_trend', 0)
        credits = course.get('credits', 0)
        
        # Normalize credits to 0-1 range (assuming max 5 credits)
        normalized_credits = min(credits / 5.0, 1.0)
        
        # Calculate compatibility (simple formula)
        compatibility = 0.5 + 0.3 * grade_trend + 0.2 * normalized_credits
        
        # Ensure compatibility is between 0 and 1
        return max(0, min(1, compatibility))

# Global instance of FeatureExtractor
feature_extractor = FeatureExtractor()

def extract_all_features(enrollment_data: List[Dict[str, Any]], 
                        course_data: List[Dict[str, Any]],
                        performance_data: List[Dict[str, Any]]) -> Dict[str, pd.DataFrame]:
    """
    Extract all features from the provided data.
    
    Args:
        enrollment_data: List of enrollment records
        course_data: List of course records
        performance_data: List of performance records
        
    Returns:
        Dictionary containing all extracted features
    """
    # Extract course features
    course_features = feature_extractor.extract_course_features(course_data)
    
    # Extract student features
    student_features = feature_extractor.extract_student_features(enrollment_data, performance_data)
    
    # Create interaction features
    interaction_features = feature_extractor.create_interaction_features(student_features, course_features)
    
    return {
        'course_features': course_features,
        'student_features': student_features,
        'interaction_features': interaction_features
    }

if __name__ == "__main__":
    # Example usage
    sample_courses = [
        {
            'course_id': 'CS101',
            'title': 'Introduction to Computer Science',
            'department': 'CS',
            'credits': 3,
            'prerequisites': [],
            'description': 'Fundamental concepts of computer science and programming'
        },
        {
            'course_id': 'MATH201',
            'title': 'Calculus II',
            'department': 'MATH',
            'credits': 4,
            'prerequisites': ['MATH101'],
            'description': 'Advanced calculus topics including integration techniques'
        }
    ]
    
    sample_enrollments = [
        {
            'student_id': 'STU001',
            'course_id': 'CS101',
            'credits': 3,
            'grade_points': 4.0
        },
        {
            'student_id': 'STU001',
            'course_id': 'MATH201',
            'credits': 4,
            'grade_points': 3.7
        }
    ]
    
    sample_performance = [
        {
            'student_id': 'STU001',
            'course_id': 'CS101',
            'grade_points': 4.0,
            'avg_assignment_score': 92.5,
            'avg_exam_score': 88.0,
            'attendance_rate': 0.95
        },
        {
            'student_id': 'STU001',
            'course_id': 'MATH201',
            'grade_points': 3.7,
            'avg_assignment_score': 85.2,
            'avg_exam_score': 82.5,
            'attendance_rate': 0.87
        }
    ]
    
    # Extract features
    features = extract_all_features(sample_enrollments, sample_courses, sample_performance)
    
    print("Course Features:")
    print(features['course_features'])
    print("\nStudent Features:")
    print(features['student_features'])
    print("\nInteraction Features:")
    print(features['interaction_features'])