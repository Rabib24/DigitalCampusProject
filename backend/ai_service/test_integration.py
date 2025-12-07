#!/usr/bin/env python3
"""
Integration Tests for Digital Campus AI Services

This module contains integration tests for the AI service endpoints.
"""

import os
import sys
import json
import unittest
from unittest.mock import patch, MagicMock
import django
from django.test import TestCase, Client
from django.urls import reverse
import jwt

# Add the backend directory to the Python path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(backend_dir)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

try:
    django.setup()
except Exception as e:
    print(f"Error setting up Django: {e}")

class AIIntegrationTests(TestCase):
    """
    Integration tests for AI service endpoints.
    """
    
    def setUp(self):
        """
        Set up test client and mock data.
        """
        self.client = Client()
        self.valid_token = self._generate_test_token()
        self.invalid_token = "invalid.token.here"
        
    def _generate_test_token(self):
        """
        Generate a test JWT token for authentication.
        
        Returns:
            str: JWT token
        """
        payload = {
            'user_id': 'test_user_123',
            'role': 'student',
            'exp': 9999999999  # Far future expiration
        }
        
        # Import the secret key from the AI service
        from ai_service.ai_service import ai_service
        token = jwt.encode(payload, ai_service.secret_key, algorithm='HS256')
        return token
    
    def test_ai_recommendations_endpoint(self):
        """
        Test the AI recommendations endpoint.
        """
        url = reverse('ai_recommendations')
        
        # Test with valid token and data
        data = {}
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.valid_token}'
        )
        
        # Check response status
        self.assertEqual(response.status_code, 200)
        
        # Check response structure
        response_data = json.loads(response.content)
        self.assertIn('success', response_data)
        self.assertTrue(response_data['success'])
        self.assertIn('recommendations', response_data)
        self.assertIsInstance(response_data['recommendations'], list)
        
        # Check that we got recommendations
        self.assertGreater(len(response_data['recommendations']), 0)
        
        # Test with invalid token
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.invalid_token}'
        )
        
        self.assertEqual(response.status_code, 401)
        
        # Test without authorization header
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 401)
    
    def test_academic_performance_prediction_endpoint(self):
        """
        Test the academic performance prediction endpoint.
        """
        url = reverse('academic_performance_prediction')
        
        # Test with valid token and data
        data = {
            'student_id': 'STU001',
            'course_id': 'CS101'
        }
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.valid_token}'
        )
        
        # Check response status
        self.assertEqual(response.status_code, 200)
        
        # Check response structure
        response_data = json.loads(response.content)
        self.assertIn('success', response_data)
        self.assertTrue(response_data['success'])
        self.assertIn('predicted_grade', response_data)
        self.assertIn('confidence', response_data)
        self.assertIn('risk_level', response_data)
        
        # Test with missing required fields
        data = {
            'student_id': 'STU001'
            # Missing course_id
        }
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.valid_token}'
        )
        
        self.assertEqual(response.status_code, 400)
        
        # Test with invalid token
        data = {
            'student_id': 'STU001',
            'course_id': 'CS101'
        }
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.invalid_token}'
        )
        
        self.assertEqual(response.status_code, 401)
    
    def test_ai_search_endpoint(self):
        """
        Test the AI search endpoint.
        """
        url = reverse('ai_search')
        
        # Test with valid token and data
        data = {
            'query': 'machine learning'
        }
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.valid_token}'
        )
        
        # Check response status
        self.assertEqual(response.status_code, 200)
        
        # Check response structure
        response_data = json.loads(response.content)
        self.assertIn('success', response_data)
        self.assertTrue(response_data['success'])
        self.assertIn('results', response_data)
        self.assertIsInstance(response_data['results'], list)
        self.assertIn('total_results', response_data)
        
        # Test with filters
        data = {
            'query': 'computer science',
            'filters': {
                'type': 'course',
                'min_credits': 3
            }
        }
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.valid_token}'
        )
        
        self.assertEqual(response.status_code, 200)
        
        # Test with missing query
        data = {}
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.valid_token}'
        )
        
        self.assertEqual(response.status_code, 400)
        
        # Test with invalid token
        data = {
            'query': 'test query'
        }
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.invalid_token}'
        )
        
        self.assertEqual(response.status_code, 401)
    
    def test_unsupported_methods(self):
        """
        Test that endpoints reject unsupported HTTP methods.
        """
        endpoints = [
            reverse('ai_recommendations'),
            reverse('academic_performance_prediction'),
            reverse('ai_search')
        ]
        
        for url in endpoints:
            # Test GET request (should be rejected)
            response = self.client.get(url)
            self.assertEqual(response.status_code, 405)
            
            # Test PUT request (should be rejected)
            response = self.client.put(url)
            self.assertEqual(response.status_code, 405)
            
            # Test DELETE request (should be rejected)
            response = self.client.delete(url)
            self.assertEqual(response.status_code, 405)

class AIComponentTests(TestCase):
    """
    Tests for individual AI components.
    """
    
    def setUp(self):
        """
        Set up test data.
        """
        self.sample_courses = [
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
            }
        ]
        
        self.sample_enrollments = [
            {
                'student_id': 'STU001',
                'course_id': 'CS101',
                'credits': 3
            }
        ]
        
        self.sample_performance = [
            {
                'student_id': 'STU001',
                'course_id': 'CS101',
                'grade_points': 4.0
            }
        ]
    
    def test_content_filtering(self):
        """
        Test content-based filtering functionality.
        """
        from ai_service.content_filtering import content_recommender
        
        # Build course profiles
        profiles = content_recommender.build_course_profiles(self.sample_courses)
        self.assertIsInstance(profiles, dict)
        self.assertIn('CS101', profiles)
        self.assertIn('CS201', profiles)
        
        # Build student profiles
        student_data = [{'student_id': 'STU001'}]
        student_profiles = content_recommender.build_student_profiles(student_data, self.sample_enrollments)
        self.assertIsInstance(student_profiles, dict)
        self.assertIn('STU001', student_profiles)
        
        # Get recommendations
        recommendations = content_recommender.get_course_recommendations('STU001', 2)
        self.assertIsInstance(recommendations, list)
    
    def test_feature_extraction(self):
        """
        Test feature extraction functionality.
        """
        from ai_service.feature_extraction import extract_all_features
        
        features = extract_all_features(
            self.sample_enrollments,
            self.sample_courses,
            self.sample_performance
        )
        
        self.assertIsInstance(features, dict)
        self.assertIn('course_features', features)
        self.assertIn('student_features', features)
        self.assertIn('interaction_features', features)
        
        # Check that we got DataFrames
        self.assertIsInstance(features['course_features'], type(pd.DataFrame()))
        self.assertIsInstance(features['student_features'], type(pd.DataFrame()))
        self.assertIsInstance(features['interaction_features'], type(pd.DataFrame()))
    
    def test_text_processing(self):
        """
        Test text processing functionality.
        """
        from ai_service.text_processing import text_processor, analyze_course_content
        
        # Test text cleaning
        dirty_text = "Hello, World! This is a <test> with URLs: http://example.com and emails: test@example.com"
        clean_text = text_processor.clean_text(dirty_text)
        self.assertNotIn('<', clean_text)
        self.assertNotIn('http://', clean_text)
        self.assertNotIn('@', clean_text)
        
        # Test content analysis
        analysis = analyze_course_content(self.sample_courses)
        self.assertIsInstance(analysis, dict)
        self.assertIn('vocabulary', analysis)
        self.assertIn('title_analysis', analysis)
        self.assertIn('description_analysis', analysis)
    
    def test_recommendation_engine(self):
        """
        Test the recommendation engine.
        """
        from ai_service.recommendation_engine import recommendation_engine
        
        # Test weight setting
        original_weights = recommendation_engine.weights.copy()
        new_weights = {
            'content_based': 0.5,
            'collaborative': 0.3,
            'popularity': 0.15,
            'diversity': 0.05
        }
        
        recommendation_engine.set_weights(new_weights)
        self.assertEqual(recommendation_engine.weights, new_weights)
        
        # Reset weights
        recommendation_engine.set_weights(original_weights)
        
        # Test hybrid recommendations
        recommendations = recommendation_engine.generate_hybrid_recommendations(
            'STU001',
            self.sample_courses,
            self.sample_enrollments,
            self.sample_performance,
            2
        )
        
        self.assertIsInstance(recommendations, list)

if __name__ == '__main__':
    # Run the tests
    unittest.main()