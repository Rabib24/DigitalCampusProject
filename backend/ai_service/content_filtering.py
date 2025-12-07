#!/usr/bin/env python3
"""
Content-Based Filtering Module for Digital Campus AI Services

This module implements content-based filtering for course recommendations.
"""

import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import Dict, List, Any, Tuple
from .text_processing import text_processor
from .feature_extraction import feature_extractor

class ContentBasedRecommender:
    """
    Content-based filtering recommender system.
    """
    
    def __init__(self):
        """
        Initialize the Content-Based Recommender.
        """
        self.course_profiles = {}
        self.student_profiles = {}
        self.tfidf_vectorizer = None
        self.course_similarity_matrix = None
        self.course_ids = []
    
    def build_course_profiles(self, course_data: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
        """
        Build content profiles for courses based on their descriptions and titles.
        
        Args:
            course_data: List of course dictionaries
            
        Returns:
            Dictionary mapping course IDs to their content profiles
        """
        course_profiles = {}
        
        for course in course_data:
            course_id = course.get('course_id', '')
            title = course.get('title', '')
            description = course.get('description', '')
            department = course.get('department', '')
            
            # Combine text fields for content profiling
            content_text = f"{title} {description} {department}"
            
            # Preprocess the content text
            processed_text = text_processor.preprocess_text(content_text)
            
            # Extract features
            features = {
                'text_content': processed_text,
                'credits': course.get('credits', 0),
                'department': department,
                'prerequisites_count': len(course.get('prerequisites', []))
            }
            
            course_profiles[course_id] = features
        
        self.course_profiles = course_profiles
        return course_profiles
    
    def build_student_profiles(self, student_data: List[Dict[str, Any]], 
                              enrollment_data: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
        """
        Build content profiles for students based on their enrollment history.
        
        Args:
            student_data: List of student dictionaries
            enrollment_data: List of enrollment dictionaries
            
        Returns:
            Dictionary mapping student IDs to their content profiles
        """
        student_profiles = {}
        
        # Group enrollments by student
        student_enrollments = {}
        for enrollment in enrollment_data:
            student_id = enrollment.get('student_id', '')
            if student_id not in student_enrollments:
                student_enrollments[student_id] = []
            student_enrollments[student_id].append(enrollment)
        
        # Build profile for each student
        for student_id, enrollments in student_enrollments.items():
            # Collect course content for enrolled courses
            enrolled_course_contents = []
            total_credits = 0
            departments = []
            
            for enrollment in enrollments:
                course_id = enrollment.get('course_id', '')
                credits = enrollment.get('credits', 0)
                
                # Get course profile if available
                if course_id in self.course_profiles:
                    course_profile = self.course_profiles[course_id]
                    enrolled_course_contents.append(course_profile['text_content'])
                    total_credits += credits
                    departments.append(course_profile['department'])
            
            # Create student profile
            if enrolled_course_contents:
                # Combine all course content
                combined_content = ' '.join(enrolled_course_contents)
                
                # Calculate department preferences
                dept_preferences = {}
                for dept in departments:
                    dept_preferences[dept] = dept_preferences.get(dept, 0) + 1
                
                student_profile = {
                    'preferred_content': combined_content,
                    'total_credits': total_credits,
                    'department_preferences': dept_preferences,
                    'enrolled_courses_count': len(enrollments)
                }
            else:
                # Default profile for students with no enrollment history
                student_profile = {
                    'preferred_content': '',
                    'total_credits': 0,
                    'department_preferences': {},
                    'enrolled_courses_count': 0
                }
            
            student_profiles[student_id] = student_profile
        
        self.student_profiles = student_profiles
        return student_profiles
    
    def compute_course_similarities(self):
        """
        Compute similarity matrix between all courses based on their content.
        """
        if not self.course_profiles:
            raise ValueError("Course profiles must be built before computing similarities")
        
        # Extract course content texts
        course_texts = []
        self.course_ids = []
        
        for course_id, profile in self.course_profiles.items():
            course_texts.append(profile['text_content'])
            self.course_ids.append(course_id)
        
        # Create TF-IDF vectors
        self.tfidf_vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2)
        )
        
        # Fit and transform course texts
        tfidf_matrix = self.tfidf_vectorizer.fit_transform(course_texts)
        
        # Compute cosine similarity matrix
        self.course_similarity_matrix = cosine_similarity(tfidf_matrix)
        
        print(f"Computed similarity matrix for {len(self.course_ids)} courses")
    
    def get_course_recommendations(self, student_id: str, num_recommendations: int = 5) -> List[Dict[str, Any]]:
        """
        Get content-based course recommendations for a student.
        
        Args:
            student_id: ID of the student
            num_recommendations: Number of recommendations to return
            
        Returns:
            List of recommended courses with similarity scores
        """
        if student_id not in self.student_profiles:
            return []  # No profile for this student
        
        if self.course_similarity_matrix is None:
            self.compute_course_similarities()
        
        student_profile = self.student_profiles[student_id]
        student_content = student_profile['preferred_content']
        
        if not student_content:
            # If student has no enrollment history, return popular courses
            return self._get_popular_courses(num_recommendations)
        
        # Transform student content to TF-IDF vector
        try:
            student_vector = self.tfidf_vectorizer.transform([student_content])
        except ValueError:
            # Handle case where student content has no known words
            return self._get_popular_courses(num_recommendations)
        
        # Compute similarity between student and all courses
        similarities = cosine_similarity(student_vector, self.course_similarity_matrix)[0]
        
        # Create list of (course_id, similarity) tuples
        course_similarities = list(zip(self.course_ids, similarities))
        
        # Sort by similarity (descending)
        course_similarities.sort(key=lambda x: x[1], reverse=True)
        
        # Filter out courses the student is already enrolled in
        enrolled_courses = set()
        # In a real implementation, this would check actual enrollments
        # For now, we'll just return top recommendations
        
        # Get top recommendations
        recommendations = []
        for course_id, similarity in course_similarities:
            if course_id not in enrolled_courses and similarity > 0:
                recommendations.append({
                    'course_id': course_id,
                    'similarity_score': float(similarity),
                    'match_reason': f"Content similar to previously enrolled courses"
                })
                
                if len(recommendations) >= num_recommendations:
                    break
        
        return recommendations
    
    def _get_popular_courses(self, num_recommendations: int) -> List[Dict[str, Any]]:
        """
        Get popular courses as fallback recommendations.
        
        Args:
            num_recommendations: Number of recommendations to return
            
        Returns:
            List of popular courses
        """
        if not self.course_profiles:
            return []
        
        # Simple popularity measure: courses with more prerequisites might be more advanced/popular
        course_popularity = []
        for course_id, profile in self.course_profiles.items():
            popularity_score = profile['prerequisites_count'] + (profile['credits'] / 10)
            course_popularity.append((course_id, popularity_score))
        
        # Sort by popularity
        course_popularity.sort(key=lambda x: x[1], reverse=True)
        
        # Return top courses
        recommendations = []
        for i, (course_id, score) in enumerate(course_popularity[:num_recommendations]):
            recommendations.append({
                'course_id': course_id,
                'similarity_score': float(score),
                'match_reason': "Popular course based on prerequisites and credit hours"
            })
        
        return recommendations
    
    def get_similar_courses(self, course_id: str, num_similar: int = 5) -> List[Dict[str, Any]]:
        """
        Get courses similar to a given course.
        
        Args:
            course_id: ID of the reference course
            num_similar: Number of similar courses to return
            
        Returns:
            List of similar courses with similarity scores
        """
        if self.course_similarity_matrix is None:
            self.compute_course_similarities()
        
        if course_id not in self.course_ids:
            return []
        
        # Find index of the reference course
        course_idx = self.course_ids.index(course_id)
        
        # Get similarities for this course
        similarities = self.course_similarity_matrix[course_idx]
        
        # Create list of (course_id, similarity) tuples
        course_similarities = list(zip(self.course_ids, similarities))
        
        # Sort by similarity (descending) and exclude the reference course
        course_similarities.sort(key=lambda x: x[1], reverse=True)
        course_similarities = [(cid, sim) for cid, sim in course_similarities if cid != course_id]
        
        # Get top similar courses
        similar_courses = []
        for i, (cid, similarity) in enumerate(course_similarities[:num_similar]):
            similar_courses.append({
                'course_id': cid,
                'similarity_score': float(similarity),
                'match_reason': f"Content similar to {course_id}"
            })
        
        return similar_courses

# Global instance of ContentBasedRecommender
content_recommender = ContentBasedRecommender()

def generate_content_based_recommendations(student_id: str, 
                                         course_data: List[Dict[str, Any]],
                                         enrollment_data: List[Dict[str, Any]],
                                         num_recommendations: int = 5) -> List[Dict[str, Any]]:
    """
    Generate content-based recommendations for a student.
    
    Args:
        student_id: ID of the student
        course_data: List of course dictionaries
        enrollment_data: List of enrollment dictionaries
        num_recommendations: Number of recommendations to generate
        
    Returns:
        List of recommended courses
    """
    # Build course profiles
    content_recommender.build_course_profiles(course_data)
    
    # Build student profiles
    # For simplicity, we'll create a minimal student dataset
    student_data = [{'student_id': student_id}]
    content_recommender.build_student_profiles(student_data, enrollment_data)
    
    # Get recommendations
    recommendations = content_recommender.get_course_recommendations(
        student_id, num_recommendations
    )
    
    return recommendations

if __name__ == "__main__":
    # Example usage
    sample_courses = [
        {
            'course_id': 'CS101',
            'title': 'Introduction to Computer Science',
            'department': 'Computer Science',
            'credits': 3,
            'prerequisites': [],
            'description': 'Fundamental concepts of computer science and programming'
        },
        {
            'course_id': 'CS201',
            'title': 'Data Structures and Algorithms',
            'department': 'Computer Science',
            'credits': 4,
            'prerequisites': ['CS101'],
            'description': 'Advanced programming concepts, data structures, and algorithm design'
        },
        {
            'course_id': 'MATH201',
            'title': 'Calculus II',
            'department': 'Mathematics',
            'credits': 4,
            'prerequisites': ['MATH101'],
            'description': 'Advanced calculus topics including integration techniques'
        },
        {
            'course_id': 'PHY101',
            'title': 'General Physics I',
            'department': 'Physics',
            'credits': 4,
            'prerequisites': ['MATH101'],
            'description': 'Introduction to classical mechanics and thermodynamics'
        }
    ]
    
    sample_enrollments = [
        {
            'student_id': 'STU001',
            'course_id': 'CS101',
            'credits': 3
        },
        {
            'student_id': 'STU001',
            'course_id': 'MATH201',
            'credits': 4
        }
    ]
    
    # Generate recommendations
    recommendations = generate_content_based_recommendations(
        'STU001', sample_courses, sample_enrollments, 3
    )
    
    print("Content-Based Recommendations:")
    for rec in recommendations:
        print(f"- {rec['course_id']}: {rec['similarity_score']:.3f} ({rec['match_reason']})")
    
    # Get similar courses to CS101
    similar_courses = content_recommender.get_similar_courses('CS101', 2)
    print("\nCourses similar to CS101:")
    for course in similar_courses:
        print(f"- {course['course_id']}: {course['similarity_score']:.3f}")