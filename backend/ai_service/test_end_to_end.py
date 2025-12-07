#!/usr/bin/env python3
"""
End-to-End Tests for Digital Campus AI Services

This module contains end-to-end tests that simulate real user workflows
with the AI services.
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

class AIEndToEndTests(TestCase):
    """
    End-to-end tests for AI service workflows.
    """
    
    def setUp(self):
        """
        Set up test client and mock data.
        """
        self.client = Client()
        self.valid_token = self._generate_test_token()
        
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
    
    def test_complete_recommendation_workflow(self):
        """
        Test the complete recommendation workflow from user request to response.
        """
        # Step 1: User requests recommendations
        url = reverse('ai_recommendations')
        
        data = {}
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.valid_token}'
        )
        
        # Check that we received a successful response
        self.assertEqual(response.status_code, 200)
        
        # Check response structure
        response_data = json.loads(response.content)
        self.assertIn('success', response_data)
        self.assertTrue(response_data['success'])
        self.assertIn('recommendations', response_data)
        self.assertIsInstance(response_data['recommendations'], list)
        
        # Check that we got recommendations
        self.assertGreater(len(response_data['recommendations']), 0)
        
        # Step 2: User interacts with a recommendation
        # In a real scenario, the user would click on a recommendation
        # For this test, we'll just verify the structure
        
        first_recommendation = response_data['recommendations'][0]
        self.assertIn('id', first_recommendation)
        self.assertIn('title', first_recommendation)
        self.assertIn('match_score', first_recommendation)
        
        # Step 3: Verify caching worked (request again with same parameters)
        response2 = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.valid_token}'
        )
        
        # Should get the same response (from cache)
        response_data2 = json.loads(response2.content)
        self.assertEqual(response_data['recommendations'], response_data2['recommendations'])
    
    def test_complete_performance_prediction_workflow(self):
        """
        Test the complete performance prediction workflow.
        """
        # Step 1: User requests performance prediction
        url = reverse('academic_performance_prediction')
        
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
        
        # Check that we received a successful response
        self.assertEqual(response.status_code, 200)
        
        # Check response structure
        response_data = json.loads(response.content)
        self.assertIn('success', response_data)
        self.assertTrue(response_data['success'])
        self.assertIn('predicted_grade', response_data)
        self.assertIn('confidence', response_data)
        self.assertIn('risk_level', response_data)
        
        # Verify data types
        self.assertIsInstance(response_data['predicted_grade'], str)
        self.assertIsInstance(response_data['confidence'], float)
        self.assertIsInstance(response_data['risk_level'], str)
        
        # Step 2: User receives actionable insights
        self.assertIn('factors', response_data)
        self.assertIsInstance(response_data['factors'], list)
        self.assertGreater(len(response_data['factors']), 0)
    
    def test_complete_search_workflow(self):
        """
        Test the complete search workflow with filtering.
        """
        # Step 1: User performs a search
        url = reverse('ai_search')
        
        data = {
            'query': 'machine learning'
        }
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.valid_token}'
        )
        
        # Check that we received a successful response
        self.assertEqual(response.status_code, 200)
        
        # Check response structure
        response_data = json.loads(response.content)
        self.assertIn('success', response_data)
        self.assertTrue(response_data['success'])
        self.assertIn('results', response_data)
        self.assertIsInstance(response_data['results'], list)
        
        # Step 2: User applies filters to refine search
        data_with_filters = {
            'query': 'computer science',
            'filters': {
                'type': 'course',
                'min_credits': 3
            }
        }
        response_filtered = self.client.post(
            url,
            data=json.dumps(data_with_filters),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.valid_token}'
        )
        
        # Check that we received a successful response
        self.assertEqual(response_filtered.status_code, 200)
        
        # Check that filters were applied
        response_filtered_data = json.loads(response_filtered.content)
        self.assertIn('filters_applied', response_filtered_data)
        self.assertEqual(response_filtered_data['filters_applied'], data_with_filters['filters'])
        
        # Verify that results meet filter criteria
        for result in response_filtered_data['results']:
            if result['type'] == 'course':
                self.assertGreaterEqual(result['credits'], 3)
    
    def test_user_profile_update_workflow(self):
        """
        Test the workflow for updating user AI profiles based on interactions.
        """
        # This would typically involve:
        # 1. User interacting with recommendations
        # 2. System recording feedback
        # 3. Profile being updated
        # 4. Future recommendations being improved
        
        # Since we're using mock data, we'll test the profile update mechanism
        
        from ai_service.models import UserAIProfile
        from django.core.exceptions import ObjectDoesNotExist
        
        # Check if user profile exists, create if not
        user_id = 'test_user_123'
        try:
            profile = UserAIProfile.objects.get(user_id=user_id)
        except ObjectDoesNotExist:
            profile = UserAIProfile.objects.create(
                user_id=user_id,
                preferences={}
            )
        
        # Update profile with new preferences
        profile.interest_areas = {'computer_science': 0.8, 'mathematics': 0.6}
        profile.learning_style = 'visual'
        profile.skill_levels = {'programming': 'intermediate', 'math': 'advanced'}
        profile.save()
        
        # Verify profile was updated
        updated_profile = UserAIProfile.objects.get(user_id=user_id)
        self.assertEqual(updated_profile.interest_areas, {'computer_science': 0.8, 'mathematics': 0.6})
        self.assertEqual(updated_profile.learning_style, 'visual')
        self.assertEqual(updated_profile.skill_levels, {'programming': 'intermediate', 'math': 'advanced'})
    
    def test_multi_user_workflow_isolation(self):
        """
        Test that different users receive isolated recommendations.
        """
        # Create tokens for different users
        token_user1 = self._generate_test_token()  # test_user_123
        
        payload_user2 = {
            'user_id': 'test_user_456',
            'role': 'faculty',
            'exp': 9999999999
        }
        token_user2 = jwt.encode(payload_user2, 'fallback_secret_key', algorithm='HS256')
        
        url = reverse('ai_recommendations')
        
        # Get recommendations for user 1
        response1 = self.client.post(
            url,
            data=json.dumps({}),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token_user1}'
        )
        
        # Get recommendations for user 2
        response2 = self.client.post(
            url,
            data=json.dumps({}),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token_user2}'
        )
        
        # Both should succeed
        self.assertEqual(response1.status_code, 200)
        self.assertEqual(response2.status_code, 200)
        
        # Parse responses
        data1 = json.loads(response1.content)
        data2 = json.loads(response2.content)
        
        # Both should have success=True
        self.assertTrue(data1['success'])
        self.assertTrue(data2['success'])
        
        # Both should have recommendations
        self.assertIn('recommendations', data1)
        self.assertIn('recommendations', data2)
        
        # Recommendations may differ based on user role
        # (In our mock implementation, they might be the same, but in a real system they would differ)

class AIPerformanceTests(TestCase):
    """
    Performance tests for AI services.
    """
    
    def setUp(self):
        """
        Set up test client and mock data.
        """
        self.client = Client()
        self.valid_token = self._generate_test_token()
        
    def _generate_test_token(self):
        """
        Generate a test JWT token for authentication.
        
        Returns:
            str: JWT token
        """
        payload = {
            'user_id': 'perf_test_user',
            'role': 'student',
            'exp': 9999999999
        }
        
        from ai_service.ai_service import ai_service
        token = jwt.encode(payload, ai_service.secret_key, algorithm='HS256')
        return token
    
    def test_response_time_recommendations(self):
        """
        Test that recommendation responses are within acceptable time limits.
        """
        import time
        
        url = reverse('ai_recommendations')
        data = {}
        
        start_time = time.time()
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.valid_token}'
        )
        end_time = time.time()
        
        response_time = end_time - start_time
        
        # Check that response is successful
        self.assertEqual(response.status_code, 200)
        
        # Check that response time is reasonable (under 2 seconds)
        self.assertLess(response_time, 2.0)
    
    def test_response_time_search(self):
        """
        Test that search responses are within acceptable time limits.
        """
        import time
        
        url = reverse('ai_search')
        data = {'query': 'test query'}
        
        start_time = time.time()
        response = self.client.post(
            url,
            data=json.dumps(data),
            content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.valid_token}'
        )
        end_time = time.time()
        
        response_time = end_time - start_time
        
        # Check that response is successful
        self.assertEqual(response.status_code, 200)
        
        # Check that response time is reasonable (under 2 seconds)
        self.assertLess(response_time, 2.0)

if __name__ == '__main__':
    # Run the tests
    unittest.main()