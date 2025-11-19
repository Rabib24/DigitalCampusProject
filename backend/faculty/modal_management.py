from django.http import JsonResponse
from django.utils import timezone
import json
import uuid
from .error_handling import api_error

class ModalStateManager:
    """Utility class for managing modal/dialog states"""
    
    def __init__(self):
        # In-memory storage for modal states (in production, this would be stored in a database)
        self.modal_states = {}
    
    def create_modal_session(self, user_id, modal_type, initial_data=None):
        """Create a new modal session"""
        try:
            session_id = str(uuid.uuid4())
            
            modal_state = {
                'session_id': session_id,
                'user_id': user_id,
                'modal_type': modal_type,
                'created_at': timezone.now(),
                'last_updated': timezone.now(),
                'is_active': True,
                'data': initial_data or {},
                'history': []
            }
            
            # Store modal state
            self.modal_states[session_id] = modal_state
            
            return modal_state
            
        except Exception as e:
            raise api_error(
                f"Failed to create modal session: {str(e)}",
                "modal_error",
                500
            )
    
    def update_modal_state(self, session_id, updated_data):
        """Update modal state data"""
        try:
            if session_id not in self.modal_states:
                raise api_error(
                    "Modal session not found",
                    "modal_not_found",
                    404
                )
            
            modal_state = self.modal_states[session_id]
            
            # Add to history
            modal_state['history'].append({
                'timestamp': timezone.now(),
                'previous_data': modal_state['data'].copy(),
                'updated_data': updated_data
            })
            
            # Keep only last 10 history entries
            if len(modal_state['history']) > 10:
                modal_state['history'] = modal_state['history'][-10:]
            
            # Update data
            modal_state['data'].update(updated_data)
            modal_state['last_updated'] = timezone.now()
            
            return modal_state
            
        except Exception as e:
            raise api_error(
                f"Failed to update modal state: {str(e)}",
                "modal_error",
                500
            )
    
    def get_modal_state(self, session_id):
        """Get current modal state"""
        try:
            if session_id not in self.modal_states:
                raise api_error(
                    "Modal session not found",
                    "modal_not_found",
                    404
                )
            
            return self.modal_states[session_id]
            
        except Exception as e:
            raise api_error(
                f"Failed to get modal state: {str(e)}",
                "modal_error",
                500
            )
    
    def close_modal_session(self, session_id):
        """Close a modal session"""
        try:
            if session_id not in self.modal_states:
                raise api_error(
                    "Modal session not found",
                    "modal_not_found",
                    404
                )
            
            modal_state = self.modal_states[session_id]
            modal_state['is_active'] = False
            modal_state['closed_at'] = timezone.now()
            
            return modal_state
            
        except Exception as e:
            raise api_error(
                f"Failed to close modal session: {str(e)}",
                "modal_error",
                500
            )
    
    def get_user_modal_sessions(self, user_id):
        """Get all active modal sessions for a user"""
        try:
            user_sessions = []
            for session_id, modal_state in self.modal_states.items():
                if modal_state['user_id'] == user_id and modal_state['is_active']:
                    user_sessions.append(modal_state)
            
            return user_sessions
            
        except Exception as e:
            raise api_error(
                f"Failed to get user modal sessions: {str(e)}",
                "modal_error",
                500
            )

# Global instance for managing modal states
modal_manager = ModalStateManager()

class AuditLogger:
    """Utility class for logging faculty actions for audit purposes"""
    
    def __init__(self):
        # In-memory storage for audit logs (in production, this would be stored in a database)
        self.audit_logs = []
    
    def log_action(self, user_id, action_type, description, details=None, related_object_id=None):
        """Log a faculty action"""
        try:
            audit_entry = {
                'id': str(uuid.uuid4()),
                'user_id': user_id,
                'action_type': action_type,
                'description': description,
                'details': details or {},
                'related_object_id': related_object_id,
                'timestamp': timezone.now(),
                'ip_address': None  # This would be captured from the request in a real implementation
            }
            
            # Store audit entry
            self.audit_logs.append(audit_entry)
            
            # Keep only last 1000 audit entries
            if len(self.audit_logs) > 1000:
                self.audit_logs = self.audit_logs[-1000:]
            
            return audit_entry
            
        except Exception as e:
            # Don't raise an error for audit logging failures, just log it
            print(f"Audit logging failed: {str(e)}")
            return None
    
    def get_user_audit_logs(self, user_id, limit=50):
        """Get audit logs for a specific user"""
        try:
            user_logs = [
                log for log in self.audit_logs 
                if log['user_id'] == user_id
            ]
            
            # Sort by timestamp descending and limit results
            user_logs.sort(key=lambda x: x['timestamp'], reverse=True)
            return user_logs[:limit]
            
        except Exception as e:
            raise api_error(
                f"Failed to get user audit logs: {str(e)}",
                "audit_error",
                500
            )
    
    def get_object_audit_logs(self, related_object_id, limit=50):
        """Get audit logs for a specific object"""
        try:
            object_logs = [
                log for log in self.audit_logs 
                if log['related_object_id'] == related_object_id
            ]
            
            # Sort by timestamp descending and limit results
            object_logs.sort(key=lambda x: x['timestamp'], reverse=True)
            return object_logs[:limit]
            
        except Exception as e:
            raise api_error(
                f"Failed to get object audit logs: {str(e)}",
                "audit_error",
                500
            )

# Global instance for audit logging
audit_logger = AuditLogger()

# Transaction management utilities
class TransactionManager:
    """Utility class for managing transactions in modal operations"""
    
    @staticmethod
    def execute_with_transaction(operation_func, *args, **kwargs):
        """Execute an operation within a transaction context"""
        try:
            # In a real implementation, this would use Django's transaction management
            # For now, we'll just execute the function and handle exceptions
            
            # Log the start of the transaction
            audit_logger.log_action(
                kwargs.get('user_id', 'unknown'),
                'transaction_start',
                f'Starting transaction for {operation_func.__name__}',
                {'function': operation_func.__name__, 'args': str(args), 'kwargs': str(kwargs)}
            )
            
            # Execute the operation
            result = operation_func(*args, **kwargs)
            
            # Log successful completion
            audit_logger.log_action(
                kwargs.get('user_id', 'unknown'),
                'transaction_complete',
                f'Completed transaction for {operation_func.__name__}',
                {'function': operation_func.__name__}
            )
            
            return result
            
        except Exception as e:
            # Log the error
            audit_logger.log_action(
                kwargs.get('user_id', 'unknown'),
                'transaction_error',
                f'Error in transaction for {operation_func.__name__}: {str(e)}',
                {'function': operation_func.__name__, 'error': str(e)}
            )
            
            # Re-raise the exception
            raise api_error(
                f"Transaction failed: {str(e)}",
                "transaction_error",
                500
            )

# Example modal operations that would be used in views
def create_course_modal_operation(user_id, course_data):
    """Example operation for creating a course through a modal"""
    try:
        # Log the action
        audit_logger.log_action(
            user_id,
            'course_create_initiated',
            'Course creation initiated through modal',
            course_data
        )
        
        # Create a modal session
        modal_session = modal_manager.create_modal_session(
            user_id, 
            'course_creation',
            course_data
        )
        
        # In a real implementation, this would interact with the Course model
        # For now, we'll just simulate the operation
        
        # Log successful completion
        audit_logger.log_action(
            user_id,
            'course_create_completed',
            'Course creation completed',
            {'session_id': modal_session['session_id']},
            related_object_id=course_data.get('course_id')
        )
        
        # Close the modal session
        modal_manager.close_modal_session(modal_session['session_id'])
        
        return {
            'success': True,
            'message': 'Course created successfully',
            'session_id': modal_session['session_id']
        }
        
    except Exception as e:
        raise api_error(
            f"Failed to create course through modal: {str(e)}",
            "modal_operation_error",
            500
        )

def update_course_modal_operation(user_id, course_id, update_data):
    """Example operation for updating a course through a modal"""
    try:
        # Log the action
        audit_logger.log_action(
            user_id,
            'course_update_initiated',
            'Course update initiated through modal',
            update_data,
            related_object_id=course_id
        )
        
        # Create a modal session
        modal_session = modal_manager.create_modal_session(
            user_id, 
            'course_update',
            {**update_data, 'course_id': course_id}
        )
        
        # In a real implementation, this would interact with the Course model
        # For now, we'll just simulate the operation
        
        # Log successful completion
        audit_logger.log_action(
            user_id,
            'course_update_completed',
            'Course update completed',
            {'session_id': modal_session['session_id']},
            related_object_id=course_id
        )
        
        # Close the modal session
        modal_manager.close_modal_session(modal_session['session_id'])
        
        return {
            'success': True,
            'message': 'Course updated successfully',
            'session_id': modal_session['session_id']
        }
        
    except Exception as e:
        raise api_error(
            f"Failed to update course through modal: {str(e)}",
            "modal_operation_error",
            500
        )