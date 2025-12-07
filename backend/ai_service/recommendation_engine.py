#!/usr/bin/env python3
"""
Recommendation Engine for Digital Campus AI Services

This module implements a hybrid recommendation engine combining multiple approaches.
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Any, Tuple, Optional
from datetime import datetime
from .content_filtering import content_recommender
from .feature_extraction import feature_extractor

class RecommendationEngine:
    """
    Hybrid recommendation engine combining multiple filtering approaches.
    """
    
    def __init__(self):
        """
        Initialize the Recommendation Engine.
        """
        self.weights = {
            'content_based': 0.4,
            'collaborative': 0.3,
            'popularity': 0.2,
            'diversity': 0.1
        }
        self.user_feedback = {}  # Store user feedback for reinforcement learning
        self.recommendation_history = {}  # Track recommendation history
    
    def set_weights(self, weights: Dict[str, float]):
        """
        Set the weights for different recommendation approaches.
        
        Args:
            weights: Dictionary mapping approach names to weights
        """
        # Validate that weights sum to approximately 1.0
        total_weight = sum(weights.values())
        if abs(total_weight - 1.0) > 0.01:
            raise ValueError("Weights must sum to 1.0")
        
        self.weights = weights
    
    def generate_hybrid_recommendations(self, 
                                      student_id: str,
                                      course_data: List[Dict[str, Any]],
                                      enrollment_data: List[Dict[str, Any]],
                                      performance_data: List[Dict[str, Any]],
                                      num_recommendations: int = 5) -> List[Dict[str, Any]]:
        """
        Generate hybrid recommendations using multiple approaches.
        
        Args:
            student_id: ID of the student
            course_data: List of course dictionaries
            enrollment_data: List of enrollment dictionaries
            performance_data: List of performance dictionaries
            num_recommendations: Number of recommendations to generate
            
        Returns:
            List of recommended courses with scores and reasons
        """
        # Get recommendations from different approaches
        content_recs = self._get_content_based_recommendations(
            student_id, course_data, enrollment_data, min(num_recommendations * 2, 20)
        )
        
        collaborative_recs = self._get_collaborative_recommendations(
            student_id, course_data, enrollment_data, min(num_recommendations * 2, 20)
        )
        
        popularity_recs = self._get_popularity_based_recommendations(
            course_data, min(num_recommendations * 2, 20)
        )
        
        # Combine recommendations using weighted scoring
        combined_scores = self._combine_recommendations(
            content_recs, collaborative_recs, popularity_recs
        )
        
        # Apply diversity enhancement
        diverse_scores = self._enhance_diversity(combined_scores, course_data)
        
        # Sort by final score and return top recommendations
        sorted_recommendations = sorted(diverse_scores.items(), key=lambda x: x[1], reverse=True)
        
        # Format recommendations with additional information
        final_recommendations = []
        for course_id, score in sorted_recommendations[:num_recommendations]:
            # Find course details
            course_details = next((c for c in course_data if c['course_id'] == course_id), None)
            
            if course_details:
                recommendation = {
                    'course_id': course_id,
                    'course_title': course_details.get('title', ''),
                    'course_description': course_details.get('description', ''),
                    'department': course_details.get('department', ''),
                    'credits': course_details.get('credits', 0),
                    'recommendation_score': float(score),
                    'match_reasons': self._generate_match_reasons(
                        course_id, content_recs, collaborative_recs, popularity_recs
                    ),
                    'recommended_at': datetime.now().isoformat()
                }
                final_recommendations.append(recommendation)
        
        # Record recommendation history
        self._record_recommendation_history(student_id, final_recommendations)
        
        return final_recommendations
    
    def _get_content_based_recommendations(self, 
                                         student_id: str,
                                         course_data: List[Dict[str, Any]],
                                         enrollment_data: List[Dict[str, Any]],
                                         limit: int) -> List[Dict[str, Any]]:
        """
        Get content-based recommendations.
        
        Args:
            student_id: ID of the student
            course_data: List of course dictionaries
            enrollment_data: List of enrollment dictionaries
            limit: Maximum number of recommendations
            
        Returns:
            List of content-based recommendations
        """
        try:
            # Build course profiles
            content_recommender.build_course_profiles(course_data)
            
            # Build student profiles
            student_data = [{'student_id': student_id}]
            content_recommender.build_student_profiles(student_data, enrollment_data)
            
            # Get recommendations
            recommendations = content_recommender.get_course_recommendations(student_id, limit)
            return recommendations
        except Exception as e:
            print(f"Error in content-based filtering: {e}")
            return []
    
    def _get_collaborative_recommendations(self,
                                         student_id: str,
                                         course_data: List[Dict[str, Any]],
                                         enrollment_data: List[Dict[str, Any]],
                                         limit: int) -> List[Dict[str, Any]]:
        """
        Get collaborative filtering recommendations based on similar students.
        
        Args:
            student_id: ID of the student
            course_data: List of course dictionaries
            enrollment_data: List of enrollment dictionaries
            limit: Maximum number of recommendations
            
        Returns:
            List of collaborative recommendations
        """
        # Simple collaborative filtering: find students with similar enrollment patterns
        # In a real implementation, this would use matrix factorization or neural networks
        
        # Group enrollments by student
        student_courses = {}
        for enrollment in enrollment_data:
            sid = enrollment.get('student_id', '')
            cid = enrollment.get('course_id', '')
            if sid not in student_courses:
                student_courses[sid] = set()
            student_courses[sid].add(cid)
        
        if student_id not in student_courses:
            return []
        
        # Find similar students (students with overlapping enrollments)
        target_courses = student_courses[student_id]
        similarities = []
        
        for sid, courses in student_courses.items():
            if sid != student_id:
                # Jaccard similarity
                intersection = len(target_courses.intersection(courses))
                union = len(target_courses.union(courses))
                similarity = intersection / union if union > 0 else 0
                similarities.append((sid, similarity))
        
        # Sort by similarity
        similarities.sort(key=lambda x: x[1], reverse=True)
        
        # Get courses from similar students that target student hasn't taken
        recommended_courses = {}
        for sid, similarity in similarities[:5]:  # Top 5 similar students
            if sid in student_courses:
                for cid in student_courses[sid]:
                    if cid not in target_courses:
                        if cid not in recommended_courses:
                            recommended_courses[cid] = 0
                        recommended_courses[cid] += similarity
        
        # Convert to recommendation format
        recommendations = []
        for cid, score in sorted(recommended_courses.items(), key=lambda x: x[1], reverse=True)[:limit]:
            recommendations.append({
                'course_id': cid,
                'similarity_score': score,
                'match_reason': f"Taken by similar students (similarity: {score:.2f})"
            })
        
        return recommendations
    
    def _get_popularity_based_recommendations(self,
                                            course_data: List[Dict[str, Any]],
                                            limit: int) -> List[Dict[str, Any]]:
        """
        Get popularity-based recommendations.
        
        Args:
            course_data: List of course dictionaries
            limit: Maximum number of recommendations
            
        Returns:
            List of popularity-based recommendations
        """
        # Simple popularity measure: courses with more prerequisites or higher credits
        course_popularity = []
        
        for course in course_data:
            course_id = course.get('course_id', '')
            prerequisites_count = len(course.get('prerequisites', []))
            credits = course.get('credits', 0)
            
            # Popularity score based on prerequisites and credits
            popularity_score = prerequisites_count * 0.7 + credits * 0.3
            course_popularity.append((course_id, popularity_score))
        
        # Sort by popularity
        course_popularity.sort(key=lambda x: x[1], reverse=True)
        
        # Convert to recommendation format
        recommendations = []
        for cid, score in course_popularity[:limit]:
            recommendations.append({
                'course_id': cid,
                'popularity_score': score,
                'match_reason': f"Popular course (score: {score:.2f})"
            })
        
        return recommendations
    
    def _combine_recommendations(self,
                               content_recs: List[Dict[str, Any]],
                               collaborative_recs: List[Dict[str, Any]],
                               popularity_recs: List[Dict[str, Any]]) -> Dict[str, float]:
        """
        Combine recommendations from different approaches using weighted scoring.
        
        Args:
            content_recs: Content-based recommendations
            collaborative_recs: Collaborative filtering recommendations
            popularity_recs: Popularity-based recommendations
            
        Returns:
            Dictionary mapping course IDs to combined scores
        """
        combined_scores = {}
        
        # Process content-based recommendations
        for rec in content_recs:
            course_id = rec['course_id']
            score = rec.get('similarity_score', 0)
            if course_id not in combined_scores:
                combined_scores[course_id] = 0
            combined_scores[course_id] += score * self.weights['content_based']
        
        # Process collaborative recommendations
        for rec in collaborative_recs:
            course_id = rec['course_id']
            score = rec.get('similarity_score', 0)
            if course_id not in combined_scores:
                combined_scores[course_id] = 0
            combined_scores[course_id] += score * self.weights['collaborative']
        
        # Process popularity recommendations
        for rec in popularity_recs:
            course_id = rec['course_id']
            # Normalize popularity score (assuming max score is 10)
            score = rec.get('popularity_score', 0) / 10.0
            if course_id not in combined_scores:
                combined_scores[course_id] = 0
            combined_scores[course_id] += score * self.weights['popularity']
        
        return combined_scores
    
    def _enhance_diversity(self, 
                          scores: Dict[str, float],
                          course_data: List[Dict[str, Any]]) -> Dict[str, float]:
        """
        Enhance diversity in recommendations by penalizing similar departments.
        
        Args:
            scores: Dictionary of course scores
            course_data: List of course dictionaries
            
        Returns:
            Dictionary of diversity-enhanced scores
        """
        # Create course department mapping
        course_departments = {}
        for course in course_data:
            course_id = course.get('course_id', '')
            department = course.get('department', '')
            course_departments[course_id] = department
        
        # Count departments in current recommendations
        department_counts = {}
        for course_id in scores.keys():
            dept = course_departments.get(course_id, '')
            department_counts[dept] = department_counts.get(dept, 0) + 1
        
        # Apply diversity penalty
        enhanced_scores = {}
        for course_id, score in scores.items():
            dept = course_departments.get(course_id, '')
            dept_count = department_counts.get(dept, 0)
            
            # Penalty increases with department frequency
            diversity_penalty = 0.1 * (dept_count - 1)
            enhanced_scores[course_id] = max(0, score - diversity_penalty)
        
        return enhanced_scores
    
    def _generate_match_reasons(self,
                              course_id: str,
                              content_recs: List[Dict[str, Any]],
                              collaborative_recs: List[Dict[str, Any]],
                              popularity_recs: List[Dict[str, Any]]) -> List[str]:
        """
        Generate match reasons for a course based on different recommendation sources.
        
        Args:
            course_id: ID of the course
            content_recs: Content-based recommendations
            collaborative_recs: Collaborative filtering recommendations
            popularity_recs: Popularity-based recommendations
            
        Returns:
            List of match reasons
        """
        reasons = []
        
        # Check content-based reasons
        for rec in content_recs:
            if rec['course_id'] == course_id:
                reasons.append(rec.get('match_reason', 'Content matches your interests'))
        
        # Check collaborative reasons
        for rec in collaborative_recs:
            if rec['course_id'] == course_id:
                reasons.append(rec.get('match_reason', 'Taken by similar students'))
        
        # Check popularity reasons
        for rec in popularity_recs:
            if rec['course_id'] == course_id:
                reasons.append(rec.get('match_reason', 'Popular course'))
        
        return reasons if reasons else ['Recommended for you']
    
    def _record_recommendation_history(self, 
                                     student_id: str, 
                                     recommendations: List[Dict[str, Any]]):
        """
        Record recommendation history for a student.
        
        Args:
            student_id: ID of the student
            recommendations: List of recommendations
        """
        if student_id not in self.recommendation_history:
            self.recommendation_history[student_id] = []
        
        # Add timestamp to each recommendation
        timestamped_recs = []
        for rec in recommendations:
            rec_copy = rec.copy()
            rec_copy['recommended_at'] = datetime.now().isoformat()
            timestamped_recs.append(rec_copy)
        
        self.recommendation_history[student_id].extend(timestamped_recs)
    
    def record_user_feedback(self, 
                           student_id: str, 
                           course_id: str, 
                           rating: float,
                           feedback: str = ""):
        """
        Record user feedback on a recommendation.
        
        Args:
            student_id: ID of the student
            course_id: ID of the course
            rating: Rating (0-5 scale)
            feedback: Optional textual feedback
        """
        if student_id not in self.user_feedback:
            self.user_feedback[student_id] = []
        
        feedback_record = {
            'course_id': course_id,
            'rating': rating,
            'feedback': feedback,
            'timestamp': datetime.now().isoformat()
        }
        
        self.user_feedback[student_id].append(feedback_record)
        print(f"Recorded feedback for student {student_id} on course {course_id}: {rating}/5")

# Global instance of RecommendationEngine
recommendation_engine = RecommendationEngine()

def generate_recommendations(student_id: str,
                           course_data: List[Dict[str, Any]],
                           enrollment_data: List[Dict[str, Any]],
                           performance_data: List[Dict[str, Any]],
                           num_recommendations: int = 5) -> List[Dict[str, Any]]:
    """
    Generate recommendations for a student using the hybrid engine.
    
    Args:
        student_id: ID of the student
        course_data: List of course dictionaries
        enrollment_data: List of enrollment dictionaries
        performance_data: List of performance dictionaries
        num_recommendations: Number of recommendations to generate
        
    Returns:
        List of recommended courses
    """
    return recommendation_engine.generate_hybrid_recommendations(
        student_id, course_data, enrollment_data, performance_data, num_recommendations
    )

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
        },
        {
            'student_id': 'STU002',
            'course_id': 'CS101',
            'credits': 3
        },
        {
            'student_id': 'STU002',
            'course_id': 'PHY101',
            'credits': 4
        },
        {
            'student_id': 'STU003',
            'course_id': 'MATH201',
            'credits': 4
        }
    ]
    
    sample_performance = [
        {
            'student_id': 'STU001',
            'course_id': 'CS101',
            'grade_points': 4.0
        },
        {
            'student_id': 'STU001',
            'course_id': 'MATH201',
            'grade_points': 3.7
        }
    ]
    
    # Generate recommendations
    recommendations = generate_recommendations(
        'STU001', sample_courses, sample_enrollments, sample_performance, 3
    )
    
    print("Hybrid Recommendations:")
    for rec in recommendations:
        print(f"- {rec['course_title']} ({rec['course_id']})")
        print(f"  Score: {rec['recommendation_score']:.3f}")
        print(f"  Reasons: {', '.join(rec['match_reasons'])}")
        print()
    
    # Record user feedback
    recommendation_engine.record_user_feedback('STU001', 'CS201', 4.5, "Very relevant to my interests")