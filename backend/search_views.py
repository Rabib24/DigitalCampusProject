import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from search_service import search_service

@csrf_exempt
def search_library_books(request):
    """Search library books endpoint"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            query = data.get('query', '')
            filters = data.get('filters', {})
            
            if not query:
                return JsonResponse({
                    'success': False,
                    'message': 'Query parameter is required'
                }, status=400)
            
            results = search_service.search_library_books(query, filters)
            
            return JsonResponse({
                'success': True,
                'results': results,
                'count': len(results)
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Search failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def search_transcripts(request):
    """Search transcripts endpoint"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            query = data.get('query', '')
            filters = data.get('filters', {})
            
            if not query:
                return JsonResponse({
                    'success': False,
                    'message': 'Query parameter is required'
                }, status=400)
            
            results = search_service.search_transcripts(query, filters)
            
            return JsonResponse({
                'success': True,
                'results': results,
                'count': len(results)
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Search failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def index_library_book(request):
    """Index a library book endpoint"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            if not data.get('id') or not data.get('title'):
                return JsonResponse({
                    'success': False,
                    'message': 'Book ID and title are required'
                }, status=400)
            
            success = search_service.index_library_book(data)
            
            if success:
                return JsonResponse({
                    'success': True,
                    'message': 'Book indexed successfully'
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Failed to index book'
                }, status=500)
                
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Indexing failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def index_transcript(request):
    """Index a transcript endpoint"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            if not data.get('id') or not data.get('student_id'):
                return JsonResponse({
                    'success': False,
                    'message': 'Transcript ID and student ID are required'
                }, status=400)
            
            success = search_service.index_transcript(data)
            
            if success:
                return JsonResponse({
                    'success': True,
                    'message': 'Transcript indexed successfully'
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Failed to index transcript'
                }, status=500)
                
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Indexing failed: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)