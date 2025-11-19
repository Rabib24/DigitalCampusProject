from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.core.cache import cache
import json
import uuid
from users.models import Faculty

# In-memory storage for form drafts (in production, this would be stored in a database)
form_drafts = {}

@csrf_exempt
def validate_form_field(request):
    """Validate a specific form field"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Extract field data
            field_name = data.get('field_name')
            field_value = data.get('field_value')
            field_type = data.get('field_type', 'text')
            
            if not field_name or field_value is None:
                return JsonResponse({
                    'success': False,
                    'message': 'Missing required field data'
                }, status=400)
            
            # Perform validation based on field type
            errors = []
            
            # Required field validation
            if data.get('required', False) and (field_value is None or field_value == ''):
                errors.append(f'{field_name} is required')
            
            # Type-specific validation
            if field_type == 'email' and field_value:
                if '@' not in field_value or '.' not in field_value:
                    errors.append('Please enter a valid email address')
            
            elif field_type == 'number' and field_value:
                try:
                    float(field_value)
                except ValueError:
                    errors.append('Please enter a valid number')
            
            elif field_type == 'date' and field_value:
                try:
                    # Simple date validation (YYYY-MM-DD format)
                    if len(field_value) != 10 or field_value[4] != '-' or field_value[7] != '-':
                        raise ValueError
                except ValueError:
                    errors.append('Please enter a valid date in YYYY-MM-DD format')
            
            # Custom validation rules
            min_length = data.get('min_length')
            max_length = data.get('max_length')
            
            if isinstance(field_value, str):
                if min_length and len(field_value) < min_length:
                    errors.append(f'{field_name} must be at least {min_length} characters long')
                
                if max_length and len(field_value) > max_length:
                    errors.append(f'{field_name} must be no more than {max_length} characters long')
            
            # Return validation result
            return JsonResponse({
                'success': True,
                'valid': len(errors) == 0,
                'errors': errors
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to validate form field'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def validate_form(request):
    """Validate an entire form"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Extract form data
            form_data = data.get('form_data', {})
            validation_rules = data.get('validation_rules', {})
            
            # Validate each field
            form_errors = {}
            is_valid = True
            
            for field_name, field_value in form_data.items():
                # Get validation rules for this field
                field_rules = validation_rules.get(field_name, {})
                
                # Perform validation
                field_errors = []
                
                # Required field validation
                if field_rules.get('required', False) and (field_value is None or field_value == ''):
                    field_errors.append('This field is required')
                
                # Type-specific validation
                field_type = field_rules.get('type', 'text')
                
                if field_type == 'email' and field_value:
                    if '@' not in field_value or '.' not in field_value:
                        field_errors.append('Please enter a valid email address')
                
                elif field_type == 'number' and field_value:
                    try:
                        float(field_value)
                    except ValueError:
                        field_errors.append('Please enter a valid number')
                
                elif field_type == 'date' and field_value:
                    try:
                        # Simple date validation (YYYY-MM-DD format)
                        if len(field_value) != 10 or field_value[4] != '-' or field_value[7] != '-':
                            raise ValueError
                    except ValueError:
                        field_errors.append('Please enter a valid date in YYYY-MM-DD format')
                
                # Length validation
                if isinstance(field_value, str):
                    min_length = field_rules.get('min_length')
                    max_length = field_rules.get('max_length')
                    
                    if min_length and len(field_value) < min_length:
                        field_errors.append(f'This field must be at least {min_length} characters long')
                    
                    if max_length and len(field_value) > max_length:
                        field_errors.append(f'This field must be no more than {max_length} characters long')
                
                # If there are errors for this field, add them to the form errors
                if field_errors:
                    form_errors[field_name] = field_errors
                    is_valid = False
            
            # Return validation result
            return JsonResponse({
                'success': True,
                'valid': is_valid,
                'errors': form_errors
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to validate form'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def save_form_draft(request):
    """Save a form draft"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            user = request.user
            
            # Extract form data
            form_name = data.get('form_name')
            form_data = data.get('form_data', {})
            
            if not form_name:
                return JsonResponse({
                    'success': False,
                    'message': 'Form name is required'
                }, status=400)
            
            # Generate draft ID
            draft_id = str(uuid.uuid4())
            
            # Create draft data
            draft_data = {
                'id': draft_id,
                'form_name': form_name,
                'form_data': form_data,
                'user_id': user.id,
                'created_at': timezone.now().isoformat(),
                'updated_at': timezone.now().isoformat()
            }
            
            # Store draft in memory (in production, this would be stored in a database)
            # Using a simple in-memory dictionary for demonstration
            draft_key = f"form_draft_{user.id}_{form_name}"
            form_drafts[draft_key] = draft_data
            
            # Also store in Redis cache if available
            try:
                cache.set(draft_key, draft_data, timeout=86400)  # 24 hours
            except:
                pass  # Redis not available, continue with in-memory storage
            
            return JsonResponse({
                'success': True,
                'message': 'Form draft saved successfully',
                'draft_id': draft_id
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to save form draft'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def load_form_draft(request, form_name):
    """Load a form draft"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            user = request.user
            
            # Create draft key
            draft_key = f"form_draft_{user.id}_{form_name}"
            
            # Try to get draft from Redis cache first
            draft_data = None
            try:
                draft_data = cache.get(draft_key)
            except:
                pass  # Redis not available
            
            # If not in cache, try in-memory storage
            if not draft_data and draft_key in form_drafts:
                draft_data = form_drafts[draft_key]
            
            if not draft_data:
                return JsonResponse({
                    'success': False,
                    'message': 'Form draft not found'
                }, status=404)
            
            return JsonResponse({
                'success': True,
                'draft': draft_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to load form draft'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def delete_form_draft(request, form_name):
    """Delete a form draft"""
    if request.method == 'DELETE':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            user = request.user
            
            # Create draft key
            draft_key = f"form_draft_{user.id}_{form_name}"
            
            # Delete from in-memory storage
            if draft_key in form_drafts:
                del form_drafts[draft_key]
            
            # Delete from Redis cache if available
            try:
                cache.delete(draft_key)
            except:
                pass  # Redis not available
            
            return JsonResponse({
                'success': True,
                'message': 'Form draft deleted successfully'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to delete form draft'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def list_form_drafts(request):
    """List all form drafts for the user"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            user = request.user
            
            # Get drafts from in-memory storage
            user_drafts = []
            draft_prefix = f"form_draft_{user.id}_"
            
            for key, draft in form_drafts.items():
                if key.startswith(draft_prefix):
                    user_drafts.append({
                        'id': draft['id'],
                        'form_name': draft['form_name'],
                        'created_at': draft['created_at'],
                        'updated_at': draft['updated_at']
                    })
            
            return JsonResponse({
                'success': True,
                'drafts': user_drafts
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to list form drafts'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def submit_form(request):
    """Submit a form with rate limiting"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            user = request.user
            
            # Implement rate limiting using Redis
            try:
                # Create a key for rate limiting
                rate_limit_key = f"form_submission_rate_limit_{user.id}"
                
                # Check if user has submitted too many forms recently
                submission_count = cache.get(rate_limit_key)
                if submission_count is None:
                    submission_count = 0
                
                # If user has submitted more than 10 forms in the last minute, reject
                if submission_count >= 10:
                    return JsonResponse({
                        'success': False,
                        'message': 'Rate limit exceeded. Please wait before submitting again.'
                    }, status=429)
                
                # Increment submission count
                cache.set(rate_limit_key, submission_count + 1, timeout=60)  # 1 minute
            except:
                pass  # Redis not available, skip rate limiting
            
            # Process form submission
            form_name = data.get('form_name')
            form_data = data.get('form_data', {})
            
            # In a real implementation, you would:
            # 1. Validate the form data
            # 2. Save the data to the appropriate database tables
            # 3. Send notifications if needed
            # 4. Log the submission
            
            # For now, we'll just return a success response
            return JsonResponse({
                'success': True,
                'message': 'Form submitted successfully',
                'submission_id': str(uuid.uuid4())
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to submit form'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)