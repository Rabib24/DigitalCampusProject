# AI Service for Digital Campus

## Overview
This is the basic AI service implementation for the Digital Campus project. It provides simple AI functionality including:
- Course recommendations
- Academic performance prediction
- Basic search capabilities
- Simple chatbot responses

## API Endpoints

### 1. AI Recommendations
**Endpoint:** `POST /api/v1/ai/recommendations/`
**Description:** Generates course recommendations based on user role
**Headers:** 
- Authorization: Bearer `<JWT_TOKEN>`
**Request Body:**
```json
{}
```

### 2. Academic Performance Prediction
**Endpoint:** `POST /api/v1/ai/performance-prediction/`
**Description:** Predicts academic performance for a student in a course
**Headers:** 
- Authorization: Bearer `<JWT_TOKEN>`
**Request Body:**
```json
{
  "student_id": "student_123",
  "course_id": "course_456"
}
```

### 3. AI Search
**Endpoint:** `POST /api/v1/ai/search/`
**Description:** Performs a basic search across campus resources
**Headers:** 
- Authorization: Bearer `<JWT_TOKEN>`
**Request Body:**
```json
{
  "query": "machine learning"
}
```

### 4. AI Chatbot
**Endpoint:** `POST /api/v1/ai/chatbot/`
**Description:** Provides simple chatbot responses
**Headers:** 
- Authorization: Bearer `<JWT_TOKEN>`
**Request Body:**
```json
{
  "message": "What courses are available in computer science?",
  "context": {}
}
```

## Installation
The AI service is automatically included when you run the Django backend. No additional installation is required.

## Development
To test the AI service functionality, run:
```bash
python test_ai_service.py
```

## Future Enhancements
This is a basic implementation that can be enhanced with:
- Real machine learning models
- More sophisticated recommendation algorithms
- Advanced natural language processing
- Integration with external AI services