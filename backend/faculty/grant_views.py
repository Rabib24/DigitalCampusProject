from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json
from datetime import datetime
from .models import Grant
from .decorators import faculty_required

@csrf_exempt
@faculty_required
def get_grant_applications(request):
    """Get all grant applications for the faculty member"""
    try:
        grants = Grant.objects.filter(faculty=request.faculty).order_by('-submission_date')
        grants_data = [grant.to_json() for grant in grants]
        
        return JsonResponse({
            'success': True,
            'grants': grants_data
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'Failed to fetch grant applications'
        }, status=500)

@csrf_exempt
@faculty_required
def get_grant_application_detail(request, grant_id):
    """Get detailed information for a specific grant application"""
    try:
        grant = Grant.objects.get(id=grant_id, faculty=request.faculty)
        return JsonResponse({
            'success': True,
            'grant': grant.to_json()
        })
    except Grant.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Grant application not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'Failed to fetch grant application details'
        }, status=500)

@csrf_exempt
@faculty_required
def create_grant_application(request):
    """Create a new grant application"""
    if request.method != 'POST':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        data = json.loads(request.body)
        
        # Create grant application
        grant = Grant.objects.create(
            faculty=request.faculty,
            title=data.get('title', ''),
            description=data.get('description', ''),
            funding_agency=data.get('funding_agency', ''),
            amount=data.get('amount', 0),
            submission_date=data.get('submission_date', timezone.now().date()),
            deadline=data.get('deadline', timezone.now().date()),
            status=data.get('status', 'draft'),
            documents=data.get('documents', [])
        )
        
        return JsonResponse({
            'success': True,
            'message': 'Grant application created successfully',
            'grant': grant.to_json()
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to create grant application: {str(e)}'
        }, status=500)

@csrf_exempt
@faculty_required
def update_grant_application(request, grant_id):
    """Update an existing grant application"""
    if request.method != 'PUT':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        grant = Grant.objects.get(id=grant_id, faculty=request.faculty)
        data = json.loads(request.body)
        
        # Updateable fields
        updatable_fields = [
            'title', 'description', 'funding_agency', 'amount',
            'submission_date', 'deadline', 'status', 'documents'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(grant, field, data[field])
        
        grant.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Grant application updated successfully',
            'grant': grant.to_json()
        })
    except Grant.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Grant application not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to update grant application: {str(e)}'
        }, status=500)

@csrf_exempt
@faculty_required
def delete_grant_application(request, grant_id):
    """Delete a grant application"""
    if request.method != 'DELETE':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        grant = Grant.objects.get(id=grant_id, faculty=request.faculty)
        grant_data = grant.to_json()
        grant.delete()
        
        return JsonResponse({
            'success': True,
            'message': 'Grant application deleted successfully',
            'grant': grant_data
        })
    except Grant.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Grant application not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to delete grant application: {str(e)}'
        }, status=500)

@csrf_exempt
@faculty_required
def upload_grant_document(request, grant_id):
    """Upload a document for a grant application"""
    if request.method != 'POST':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        grant = Grant.objects.get(id=grant_id, faculty=request.faculty)
        data = json.loads(request.body)
        
        # Add document to the grant
        document = data.get('document', {})
        if document:
            documents = grant.documents or []
            documents.append(document)
            grant.documents = documents
            grant.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Document uploaded successfully',
            'grant': grant.to_json()
        })
    except Grant.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Grant application not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to upload document: {str(e)}'
        }, status=500)

@csrf_exempt
@faculty_required
def get_grant_tracking(request, grant_id):
    """Get tracking information for a grant application"""
    try:
        grant = Grant.objects.get(id=grant_id, faculty=request.faculty)
        
        # Return tracking information
        tracking_info = {
            'id': grant.id,
            'title': grant.title,
            'status': grant.status,
            'submission_date': str(grant.submission_date) if grant.submission_date else None,
            'deadline': str(grant.deadline) if grant.deadline else None,
            'funding_agency': grant.funding_agency,
            'amount': grant.amount,
            'timeline': []  # TODO: Add timeline tracking when model is updated
        }
        
        return JsonResponse({
            'success': True,
            'tracking': tracking_info
        })
    except Grant.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Grant application not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to fetch tracking information: {str(e)}'
        }, status=500)