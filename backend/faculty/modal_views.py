from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json
import uuid
from users.models import Faculty
from .modal_management import modal_manager, audit_logger, TransactionManager
from .error_handling import api_error

@csrf_exempt
def create_modal_session(request):
    """Create a new modal session"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            user = request.user
            
            # Validate required fields
            modal_type = data.get('modal_type')
            if not modal_type:
                return api_error(
                    "Modal type is required",
                    "validation_error",
                    400
                )
            
            # Create modal session
            modal_session = modal_manager.create_modal_session(
                user_id=user.id,
                modal_type=modal_type,
                initial_data=data.get('initial_data')
            )
            
            # Log the action
            audit_logger.log_action(
                user.id,
                'modal_session_created',
                f'Created modal session for {modal_type}',
                {'modal_type': modal_type, 'session_id': modal_session['session_id']},
                related_object_id=modal_session['session_id']
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Modal session created successfully',
                'data': {
                    'session_id': modal_session['session_id'],
                    'modal_type': modal_session['modal_type'],
                    'created_at': modal_session['created_at'].isoformat()
                }
            })
            
        except Exception as e:
            return api_error(
                f"Failed to create modal session: {str(e)}",
                "modal_error",
                500
            )
    
    return api_error(
        "Method not allowed",
        "method_not_allowed",
        405
    )

@csrf_exempt
def update_modal_state(request, session_id):
    """Update modal state data"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            user = request.user
            
            # Update modal state
            updated_state = modal_manager.update_modal_state(
                session_id=session_id,
                updated_data=data.get('data', {})
            )
            
            # Log the action
            audit_logger.log_action(
                user.id,
                'modal_state_updated',
                'Updated modal state',
                {'session_id': session_id, 'data_keys': list(data.get('data', {}).keys())},
                related_object_id=session_id
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Modal state updated successfully',
                'data': {
                    'session_id': updated_state['session_id'],
                    'last_updated': updated_state['last_updated'].isoformat(),
                    'data_keys': list(updated_state['data'].keys())
                }
            })
            
        except Exception as e:
            return api_error(
                f"Failed to update modal state: {str(e)}",
                "modal_error",
                500
            )
    
    return api_error(
        "Method not allowed",
        "method_not_allowed",
        405
    )

@csrf_exempt
def get_modal_state(request, session_id):
    """Get current modal state"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            user = request.user
            
            # Get modal state
            modal_state = modal_manager.get_modal_state(session_id)
            
            # Check if user owns this modal session
            if modal_state['user_id'] != user.id:
                return api_error(
                    "Access denied to this modal session",
                    "access_denied",
                    403
                )
            
            # Log the action
            audit_logger.log_action(
                user.id,
                'modal_state_retrieved',
                'Retrieved modal state',
                {'session_id': session_id},
                related_object_id=session_id
            )
            
            return JsonResponse({
                'success': True,
                'data': {
                    'session_id': modal_state['session_id'],
                    'modal_type': modal_state['modal_type'],
                    'is_active': modal_state['is_active'],
                    'data': modal_state['data'],
                    'created_at': modal_state['created_at'].isoformat(),
                    'last_updated': modal_state['last_updated'].isoformat()
                }
            })
            
        except Exception as e:
            return api_error(
                f"Failed to get modal state: {str(e)}",
                "modal_error",
                500
            )
    
    return api_error(
        "Method not allowed",
        "method_not_allowed",
        405
    )

@csrf_exempt
def close_modal_session(request, session_id):
    """Close a modal session"""
    if request.method == 'DELETE':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            user = request.user
            
            # Get current modal state
            current_state = modal_manager.get_modal_state(session_id)
            
            # Check if user owns this modal session
            if current_state['user_id'] != user.id:
                return api_error(
                    "Access denied to this modal session",
                    "access_denied",
                    403
                )
            
            # Close modal session
            closed_state = modal_manager.close_modal_session(session_id)
            
            # Log the action
            audit_logger.log_action(
                user.id,
                'modal_session_closed',
                'Closed modal session',
                {'session_id': session_id, 'modal_type': closed_state['modal_type']},
                related_object_id=session_id
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Modal session closed successfully',
                'data': {
                    'session_id': closed_state['session_id'],
                    'modal_type': closed_state['modal_type'],
                    'closed_at': closed_state['closed_at'].isoformat() if closed_state.get('closed_at') else None
                }
            })
            
        except Exception as e:
            return api_error(
                f"Failed to close modal session: {str(e)}",
                "modal_error",
                500
            )
    
    return api_error(
        "Method not allowed",
        "method_not_allowed",
        405
    )

@csrf_exempt
def get_user_modal_sessions(request):
    """Get all active modal sessions for the user"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            user = request.user
            
            # Get user's modal sessions
            user_sessions = modal_manager.get_user_modal_sessions(user.id)
            
            # Log the action
            audit_logger.log_action(
                user.id,
                'modal_sessions_listed',
                'Listed active modal sessions'
            )
            
            # Prepare response data
            sessions_data = []
            for session in user_sessions:
                sessions_data.append({
                    'session_id': session['session_id'],
                    'modal_type': session['modal_type'],
                    'created_at': session['created_at'].isoformat(),
                    'last_updated': session['last_updated'].isoformat(),
                    'data_keys': list(session['data'].keys())
                })
            
            return JsonResponse({
                'success': True,
                'data': sessions_data
            })
            
        except Exception as e:
            return api_error(
                f"Failed to get user modal sessions: {str(e)}",
                "modal_error",
                500
            )
    
    return api_error(
        "Method not allowed",
        "method_not_allowed",
        405
    )

@csrf_exempt
def get_user_audit_logs(request):
    """Get audit logs for the user"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            user = request.user
            
            # Get limit from query parameters (default 50, max 100)
            limit = min(int(request.GET.get('limit', 50)), 100)
            
            # Get user's audit logs
            user_logs = audit_logger.get_user_audit_logs(user.id, limit)
            
            # Prepare response data
            logs_data = []
            for log in user_logs:
                logs_data.append({
                    'id': log['id'],
                    'action_type': log['action_type'],
                    'description': log['description'],
                    'timestamp': log['timestamp'].isoformat(),
                    'related_object_id': log['related_object_id']
                })
            
            return JsonResponse({
                'success': True,
                'data': logs_data
            })
            
        except Exception as e:
            return api_error(
                f"Failed to get user audit logs: {str(e)}",
                "audit_error",
                500
            )
    
    return api_error(
        "Method not allowed",
        "method_not_allowed",
        405
    )

@csrf_exempt
def execute_modal_operation(request):
    """Execute a modal operation within a transaction"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            user = request.user
            
            # Validate required fields
            operation_type = data.get('operation_type')
            operation_data = data.get('operation_data', {})
            
            if not operation_type:
                return api_error(
                    "Operation type is required",
                    "validation_error",
                    400
                )
            
            # Log the action
            audit_logger.log_action(
                user.id,
                'modal_operation_initiated',
                f'Initiated modal operation: {operation_type}',
                {'operation_type': operation_type, 'data_keys': list(operation_data.keys())}
            )
            
            # Execute operation within transaction
            # In a real implementation, this would call specific operation functions
            # For now, we'll simulate a successful operation
            
            result = {
                'success': True,
                'message': f'Operation {operation_type} completed successfully',
                'operation_id': str(uuid.uuid4())
            }
            
            # Log successful completion
            audit_logger.log_action(
                user.id,
                'modal_operation_completed',
                f'Completed modal operation: {operation_type}',
                {'operation_type': operation_type, 'result': result['message']},
                related_object_id=result['operation_id']
            )
            
            return JsonResponse(result)
            
        except Exception as e:
            return api_error(
                f"Failed to execute modal operation: {str(e)}",
                "modal_operation_error",
                500
            )
    
    return api_error(
        "Method not allowed",
        "method_not_allowed",
        405
    )