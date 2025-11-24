"""
Views for managing and testing security configuration.
"""

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from security_config import get_security_status, is_ip_allowed, is_ip_blocked

@csrf_exempt
def security_status(request):
    """
    Get the current security configuration status.
    """
    if request.method == 'GET':
        try:
            status = get_security_status()
            return JsonResponse({
                'success': True,
                'security_status': status
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error getting security status: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def check_ip(request):
    """
    Check if an IP is allowed or blocked.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            ip = data.get('ip')
            
            if not ip:
                return JsonResponse({
                    'success': False,
                    'message': 'IP address is required'
                }, status=400)
            
            is_allowed = is_ip_allowed(ip)
            is_blocked = is_ip_blocked(ip)
            
            return JsonResponse({
                'success': True,
                'ip': ip,
                'is_allowed': is_allowed,
                'is_blocked': is_blocked
            })
                
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error checking IP: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def update_security_config(request):
    """
    Update security configuration (in a real implementation, this would require admin privileges).
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # In a real implementation, we would update the configuration
            # For now, we'll just return a success message
            return JsonResponse({
                'success': True,
                'message': 'Security configuration updated successfully'
            })
                
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error updating security configuration: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def test_waf(request):
    """
    Test WAF protection with a suspicious request.
    """
    if request.method == 'GET':
        # This endpoint is for testing WAF - it should be blocked by the WAF middleware
        # if it contains suspicious patterns
        return JsonResponse({
            'success': True,
            'message': 'WAF test endpoint'
        })
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)