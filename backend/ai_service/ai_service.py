import jwt
import os
import json
import joblib
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List

class AIService:
    """Basic AI Service for Digital Campus Project"""
    
    def __init__(self):
        """Initialize the AI service"""
        # Try to get Django settings, but have a fallback
        try:
            from django.conf import settings
            self.secret_key = getattr(settings, 'SECRET_KEY', 'fallback_secret_key')
        except:
            self.secret_key = os.environ.get('SECRET_KEY', 'fallback_secret_key')
        
        # Load trained models
        try:
            self.recommendation_model = joblib.load('models/recommendation_model.pkl')
        except FileNotFoundError:
            self.recommendation_model = None
            print("Warning: Recommendation model not found")
        
    def generate_mock_recommendations(self, user_id: str, user_role: str) -> Dict[str, Any]:
        """
        Generate mock course recommendations based on user role
        
        Args:
            user_id (str): The user ID
            user_role (str): The user role (student, faculty, admin)
            
        Returns:
            Dict[str, Any]: Mock recommendations data
        """
        recommendations = []
        
        if user_role == "student":
            recommendations = [
                {
                    "id": "rec_001",
                    "title": "Introduction to Machine Learning",
                    "code": "CS451",
                    "description": "Learn the fundamentals of machine learning algorithms",
                    "match_score": 0.92,
                    "reason": "Based on your interest in Computer Science and previous coursework"
                },
                {
                    "id": "rec_002",
                    "title": "Data Visualization",
                    "code": "DS301",
                    "description": "Techniques for effective data visualization",
                    "match_score": 0.87,
                    "reason": "Complements your Data Science major"
                },
                {
                    "id": "rec_003",
                    "title": "Ethics in Technology",
                    "code": "PHIL210",
                    "description": "Ethical considerations in modern technology",
                    "match_score": 0.78,
                    "reason": "Recommended for all technology-focused students"
                }
            ]
        elif user_role == "faculty":
            recommendations = [
                {
                    "id": "rec_004",
                    "title": "Advanced Pedagogy Workshop",
                    "code": "EDU501",
                    "description": "Advanced teaching methodologies for higher education",
                    "match_score": 0.89,
                    "reason": "Professional development opportunity for educators"
                },
                {
                    "id": "rec_005",
                    "title": "Research Collaboration Networks",
                    "code": "RES402",
                    "description": "Building interdisciplinary research partnerships",
                    "match_score": 0.85,
                    "reason": "Based on your research profile"
                }
            ]
        else:  # admin and other roles
            recommendations = [
                {
                    "id": "rec_006",
                    "title": "Leadership in Higher Education",
                    "code": "ADM601",
                    "description": "Strategic leadership for academic administrators",
                    "match_score": 0.88,
                    "reason": "Professional development for administrators"
                }
            ]
            
        return {
            "success": True,
            "user_id": user_id,
            "role": user_role,
            "recommendations": recommendations,
            "generated_at": datetime.now().isoformat()
        }
    
    def predict_academic_performance(self, student_id: str, course_id: str) -> Dict[str, Any]:
        """
        Generate a mock academic performance prediction
        
        Args:
            student_id (str): The student ID
            course_id (str): The course ID
            
        Returns:
            Dict[str, Any]: Mock performance prediction
        """
        # Simple mock prediction logic
        import random
        random.seed(student_id + course_id)
        
        predicted_grade = random.choice(["A", "B+", "B", "B-", "C+", "C"])
        confidence = round(random.uniform(0.7, 0.95), 2)
        risk_level = "Low" if confidence > 0.85 else "Medium" if confidence > 0.75 else "High"
        
        return {
            "success": True,
            "student_id": student_id,
            "course_id": course_id,
            "predicted_grade": predicted_grade,
            "confidence": confidence,
            "risk_level": risk_level,
            "factors": [
                "Attendance record",
                "Assignment submission pattern",
                "Previous course performance",
                "Engagement level"
            ],
            "generated_at": datetime.now().isoformat()
        }
    
    def basic_search(self, query: str, user_id: str, filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Perform a basic search operation with optional filtering
        
        Args:
            query (str): The search query
            user_id (str): The user ID
            filters (Dict[str, Any], optional): Filters to apply to search results
            
        Returns:
            Dict[str, Any]: Mock search results
        """
        # Mock search results
        base_results = [
            {
                "id": "res_001",
                "title": f"Resource related to '{query}'",
                "type": "course",
                "relevance": 0.95,
                "department": "Computer Science",
                "credits": 3
            },
            {
                "id": "res_002",
                "title": f"Document about '{query}'",
                "type": "document",
                "relevance": 0.87,
                "department": "Mathematics",
                "credits": 0
            },
            {
                "id": "res_003",
                "title": f"Discussion on '{query}'",
                "type": "forum",
                "relevance": 0.78,
                "department": "Physics",
                "credits": 0
            },
            {
                "id": "res_004",
                "title": f"Advanced '{query}' Techniques",
                "type": "course",
                "relevance": 0.82,
                "department": "Computer Science",
                "credits": 4
            },
            {
                "id": "res_005",
                "title": f"Introduction to '{query}'",
                "type": "course",
                "relevance": 0.75,
                "department": "Engineering",
                "credits": 3
            }
        ]
        
        # Apply filters if provided
        if filters:
            filtered_results = self._apply_filters(base_results, filters)
        else:
            filtered_results = base_results
        
        return {
            "success": True,
            "query": query,
            "user_id": user_id,
            "filters_applied": filters if filters else {},
            "results": filtered_results,
            "total_results": len(filtered_results),
            "generated_at": datetime.now().isoformat()
        }
    
    def _apply_filters(self, results: List[Dict[str, Any]], filters: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Apply filters to search results
        
        Args:
            results (List[Dict[str, Any]]): List of search results
            filters (Dict[str, Any]): Filters to apply
            
        Returns:
            List[Dict[str, Any]]: Filtered results
        """
        filtered_results = results.copy()
        
        # Filter by type
        if 'type' in filters:
            filter_type = filters['type']
            filtered_results = [r for r in filtered_results if r['type'] == filter_type]
        
        # Filter by department
        if 'department' in filters:
            filter_dept = filters['department']
            filtered_results = [r for r in filtered_results if r.get('department') == filter_dept]
        
        # Filter by minimum credits
        if 'min_credits' in filters:
            min_credits = filters['min_credits']
            filtered_results = [r for r in filtered_results if r.get('credits', 0) >= min_credits]
        
        # Filter by relevance threshold
        if 'min_relevance' in filters:
            min_relevance = filters['min_relevance']
            filtered_results = [r for r in filtered_results if r.get('relevance', 0) >= min_relevance]
        
        return filtered_results

# Initialize the AI service
ai_service = AIService()