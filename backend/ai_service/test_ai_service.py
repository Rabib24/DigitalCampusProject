"""
Test script for AI Service
"""
import json
import sys
import os

# Add the current directory to the path so we can import the ai_service module
sys.path.append(os.path.dirname(__file__))

from ai_service import ai_service

def test_ai_service():
    """Test the AI service functionality"""
    print("Testing AI Service...")
    
    # Test mock recommendations
    print("\n1. Testing mock recommendations:")
    recommendations = ai_service.generate_mock_recommendations("user_123", "student")
    print(json.dumps(recommendations, indent=2))
    
    # Test academic performance prediction
    print("\n2. Testing academic performance prediction:")
    performance = ai_service.predict_academic_performance("student_456", "course_789")
    print(json.dumps(performance, indent=2))
    
    # Test basic search
    print("\n3. Testing basic search:")
    search_results = ai_service.basic_search("machine learning", "user_123")
    print(json.dumps(search_results, indent=2))
    
    print("\nAll tests completed successfully!")

if __name__ == "__main__":
    test_ai_service()