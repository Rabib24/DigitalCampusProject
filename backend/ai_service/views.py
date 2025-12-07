import json
import jwt
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.cache import cache
from .ai_service import ai_service
import logging
import time

# Set up logging
logger = logging.getLogger('ai_service')

def verify_jwt_token(auth_header):
    """
    Verify JWT token from Authorization header
    
    Args:
        auth_header (str): The Authorization header value
        
    Returns:
        dict or None: Decoded token data or None if invalid
    """
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.split(' ')[1]
    
    try:
        # Use the secret key from the AI service
        decoded_token = jwt.decode(token, ai_service.secret_key, algorithms=['HS256'])
        return decoded_token
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

@csrf_exempt
def ai_recommendations(request):
    """
    AI Recommendations endpoint
    POST /api/v1/ai/recommendations/
    """
    if request.method == 'POST':
        start_time = time.time()
        
        try:
            # Check for authorization header
            auth_header = request.META.get('HTTP_AUTHORIZATION')
            if not auth_header:
                return JsonResponse({
                    'success': False,
                    'message': 'Authorization header is required'
                }, status=401)
            
            # Verify JWT token
            user_info = verify_jwt_token(auth_header)
            if not user_info:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid or expired token'
                }, status=401)
            
            # Parse request data
            data = json.loads(request.body)
            user_id = user_info.get('user_id')
            user_role = user_info.get('role', 'student')
            
            # Check cache first
            cache_key = f"recommendations_{user_id}_{user_role}"
            cached_result = cache.get(cache_key)
            if cached_result:
                logger.info(f"Recommendations served from cache for {user_id}")
                return JsonResponse(cached_result)
            
            # Generate mock recommendations
            result = ai_service.generate_mock_recommendations(user_id, user_role)
            
            # Cache the result
            cache.set(cache_key, result, timeout=3600)  # Cache for 1 hour
            
            duration = time.time() - start_time
            logger.info(f"Recommendations generated for {user_id} in {duration:.2f}s")
            
            return JsonResponse(result)
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            logger.error(f"Error in ai_recommendations: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': 'Internal server error'
            }, status=500)
    else:
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)

@csrf_exempt
def academic_performance_prediction(request):
    """
    Academic Performance Prediction endpoint
    POST /api/v1/ai/performance-prediction/
    """
    if request.method == 'POST':
        start_time = time.time()
        
        try:
            # Check for authorization header
            auth_header = request.META.get('HTTP_AUTHORIZATION')
            if not auth_header:
                return JsonResponse({
                    'success': False,
                    'message': 'Authorization header is required'
                }, status=401)
            
            # Verify JWT token
            user_info = verify_jwt_token(auth_header)
            if not user_info:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid or expired token'
                }, status=401)
            
            # Parse request data
            data = json.loads(request.body)
            student_id = data.get('student_id')
            course_id = data.get('course_id')
            
            if not student_id or not course_id:
                return JsonResponse({
                    'success': False,
                    'message': 'student_id and course_id are required'
                }, status=400)
            
            # Check cache first
            cache_key = f"performance_{student_id}_{course_id}"
            cached_result = cache.get(cache_key)
            if cached_result:
                logger.info(f"Performance prediction served from cache for {student_id}/{course_id}")
                return JsonResponse(cached_result)
            
            # Generate performance prediction
            result = ai_service.predict_academic_performance(student_id, course_id)
            
            # Cache the result
            cache.set(cache_key, result, timeout=1800)  # Cache for 30 minutes
            
            duration = time.time() - start_time
            logger.info(f"Performance prediction generated for {student_id}/{course_id} in {duration:.2f}s")
            
            return JsonResponse(result)
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            logger.error(f"Error in academic_performance_prediction: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': 'Internal server error'
            }, status=500)
    else:
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)

@csrf_exempt
def ai_search(request):
    """
    AI Search endpoint with filtering capabilities
    POST /api/v1/ai/search/
    """
    if request.method == 'POST':
        start_time = time.time()
        
        try:
            # Check for authorization header
            auth_header = request.META.get('HTTP_AUTHORIZATION')
            if not auth_header:
                return JsonResponse({
                    'success': False,
                    'message': 'Authorization header is required'
                }, status=401)
            
            # Verify JWT token
            user_info = verify_jwt_token(auth_header)
            if not user_info:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid or expired token'
                }, status=401)
            
            # Parse request data
            data = json.loads(request.body)
            query = data.get('query')
            user_id = user_info.get('user_id')
            filters = data.get('filters', {})  # Optional filters
            
            if not query:
                return JsonResponse({
                    'success': False,
                    'message': 'query is required'
                }, status=400)
            
            # Check cache first
            cache_key = f"search_{user_id}_{query}"
            # Include filters in cache key if present
            if filters:
                import hashlib
                filter_hash = hashlib.md5(json.dumps(filters, sort_keys=True).encode()).hexdigest()[:8]
                cache_key += f"_filters_{filter_hash}"
            
            cached_result = cache.get(cache_key)
            if cached_result:
                logger.info(f"Search results served from cache for {user_id}/{query}")
                return JsonResponse(cached_result)
            
            # Perform search with filters
            result = ai_service.basic_search(query, user_id, filters)
            
            # Cache the result
            cache.set(cache_key, result, timeout=600)  # Cache for 10 minutes
            
            duration = time.time() - start_time
            logger.info(f"Search completed for {user_id}/{query} in {duration:.2f}s")
            
            return JsonResponse(result)
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            logger.error(f"Error in ai_search: {str(e)}")
            return JsonResponse({
                'success': False,
                'message': 'Internal server error'
            }, status=500)
    else:
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)