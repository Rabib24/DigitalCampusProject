"""
Views for managing and testing Cloudinary CDN configuration.
"""

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .cdn_config import get_cdn_status, get_cdn_url, optimize_for_cdn, enable_cdn_for_folder

@csrf_exempt
def cdn_status(request):
    """
    Get the current CDN configuration status.
    """
    if request.method == 'GET':
        try:
            status = get_cdn_status()
            return JsonResponse({
                'success': True,
                'cdn_status': status
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error getting CDN status: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def generate_cdn_url(request):
    """
    Generate a CDN URL for a Cloudinary resource.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            public_id = data.get('public_id')
            transformation = data.get('transformation', {})
            
            if not public_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Public ID is required'
                }, status=400)
            
            cdn_url = get_cdn_url(public_id, transformation)
            
            if cdn_url:
                return JsonResponse({
                    'success': True,
                    'cdn_url': cdn_url,
                    'public_id': public_id
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Failed to generate CDN URL'
                }, status=500)
                
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error generating CDN URL: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def optimize_for_delivery(request):
    """
    Optimize a file for CDN delivery.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            file_path = data.get('file_path')
            optimizations = data.get('optimizations', {})
            
            if not file_path:
                return JsonResponse({
                    'success': False,
                    'message': 'File path is required'
                }, status=400)
            
            result = optimize_for_cdn(file_path, optimizations)
            
            if result['success']:
                return JsonResponse({
                    'success': True,
                    'optimized_url': result['optimized_url'],
                    'optimizations_applied': result['optimizations_applied']
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': result['error']
                }, status=500)
                
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error optimizing for delivery: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def enable_folder_cdn(request):
    """
    Enable CDN delivery for all resources in a folder.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            folder_path = data.get('folder_path')
            
            if not folder_path:
                return JsonResponse({
                    'success': False,
                    'message': 'Folder path is required'
                }, status=400)
            
            result = enable_cdn_for_folder(folder_path)
            
            if result['success']:
                return JsonResponse({
                    'success': True,
                    'message': result['message'],
                    'cdn_base_url': result.get('cdn_base_url', '')
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': result['error']
                }, status=500)
                
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error enabling folder CDN: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)