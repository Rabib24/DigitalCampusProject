from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json
from datetime import datetime
from .models import Collaboration
from .decorators import faculty_required

@csrf_exempt
@faculty_required
def get_collaborations(request):
    """Get all collaborations for the faculty member"""
    try:
        collaborations = Collaboration.objects.filter(faculty=request.faculty).order_by('-created_at')
        collaborations_data = [collaboration.to_json() for collaboration in collaborations]
        
        return JsonResponse({
            'success': True,
            'collaborations': collaborations_data
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'Failed to fetch collaborations'
        }, status=500)

@csrf_exempt
@faculty_required
def get_collaboration_detail(request, collaboration_id):
    """Get detailed information for a specific collaboration"""
    try:
        collaboration = Collaboration.objects.get(id=collaboration_id, faculty=request.faculty)
        return JsonResponse({
            'success': True,
            'collaboration': collaboration.to_json()
        })
    except Collaboration.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Collaboration not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'Failed to fetch collaboration details'
        }, status=500)

@csrf_exempt
@faculty_required
def create_collaboration(request):
    """Create a new collaboration"""
    if request.method != 'POST':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        data = json.loads(request.body)
        
        # Create collaboration
        collaboration = Collaboration.objects.create(
            faculty=request.faculty,
            title=data.get('title', ''),
            description=data.get('description', ''),
            start_date=data.get('start_date') if data.get('start_date') else None,
            end_date=data.get('end_date') if data.get('end_date') else None,
            status=data.get('status', 'active'),
            project_id=data.get('project_id', ''),
            collaborators=data.get('collaborators', []),
            documents=data.get('documents', []),
            communications=data.get('communications', [])
        )
        
        return JsonResponse({
            'success': True,
            'message': 'Collaboration created successfully',
            'collaboration': collaboration.to_json()
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to create collaboration: {str(e)}'
        }, status=500)

@csrf_exempt
@faculty_required
def update_collaboration(request, collaboration_id):
    """Update an existing collaboration"""
    if request.method != 'PUT':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        collaboration = Collaboration.objects.get(id=collaboration_id, faculty=request.faculty)
        data = json.loads(request.body)
        
        # Updateable fields
        updatable_fields = [
            'title', 'description', 'start_date', 'end_date', 'status',
            'project_id', 'collaborators', 'documents', 'communications'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(collaboration, field, data[field])
        
        collaboration.updated_at = timezone.now()
        collaboration.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Collaboration updated successfully',
            'collaboration': collaboration.to_json()
        })
    except Collaboration.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Collaboration not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to update collaboration: {str(e)}'
        }, status=500)

@csrf_exempt
@faculty_required
def delete_collaboration(request, collaboration_id):
    """Delete a collaboration"""
    if request.method != 'DELETE':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        collaboration = Collaboration.objects.get(id=collaboration_id, faculty=request.faculty)
        collaboration_data = collaboration.to_json()
        collaboration.delete()
        
        return JsonResponse({
            'success': True,
            'message': 'Collaboration deleted successfully',
            'collaboration': collaboration_data
        })
    except Collaboration.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Collaboration not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to delete collaboration: {str(e)}'
        }, status=500)

@csrf_exempt
@faculty_required
def add_collaborator(request, collaboration_id):
    """Add a collaborator to a collaboration"""
    if request.method != 'POST':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        collaboration = Collaboration.objects.get(id=collaboration_id, faculty=request.faculty)
        data = json.loads(request.body)
        
        # Add collaborator to the collaboration
        collaborator = data.get('collaborator', {})
        if collaborator:
            collaborators = collaboration.collaborators or []
            collaborators.append(collaborator)
            collaboration.collaborators = collaborators
            collaboration.updated_at = timezone.now()
            collaboration.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Collaborator added successfully',
            'collaboration': collaboration.to_json()
        })
    except Collaboration.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Collaboration not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to add collaborator: {str(e)}'
        }, status=500)

@csrf_exempt
@faculty_required
def remove_collaborator(request, collaboration_id, collaborator_id):
    """Remove a collaborator from a collaboration"""
    if request.method != 'DELETE':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        collaboration = Collaboration.objects.get(id=collaboration_id, faculty=request.faculty)
        
        # Remove collaborator from the collaboration
        collaborators = collaboration.collaborators or []
        collaborators = [c for c in collaborators if str(c.get('id', '')) != str(collaborator_id)]
        collaboration.collaborators = collaborators
        collaboration.updated_at = timezone.now()
        collaboration.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Collaborator removed successfully',
            'collaboration': collaboration.to_json()
        })
    except Collaboration.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Collaboration not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to remove collaborator: {str(e)}'
        }, status=500)

@csrf_exempt
@faculty_required
def upload_document(request, collaboration_id):
    """Upload a document to a collaboration"""
    if request.method != 'POST':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        collaboration = Collaboration.objects.get(id=collaboration_id, faculty=request.faculty)
        data = json.loads(request.body)
        
        # Add document to the collaboration
        document = data.get('document', {})
        if document:
            documents = collaboration.documents or []
            documents.append(document)
            collaboration.documents = documents
            collaboration.updated_at = timezone.now()
            collaboration.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Document uploaded successfully',
            'collaboration': collaboration.to_json()
        })
    except Collaboration.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Collaboration not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to upload document: {str(e)}'
        }, status=500)

@csrf_exempt
@faculty_required
def send_message(request, collaboration_id):
    """Send a message to collaborators in a collaboration"""
    if request.method != 'POST':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        collaboration = Collaboration.objects.get(id=collaboration_id, faculty=request.faculty)
        data = json.loads(request.body)
        
        # Add message to the collaboration
        message = data.get('message', {})
        if message:
            communications = collaboration.communications or []
            communications.append(message)
            collaboration.communications = communications
            collaboration.updated_at = timezone.now()
            collaboration.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Message sent successfully',
            'collaboration': collaboration.to_json()
        })
    except Collaboration.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Collaboration not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to send message: {str(e)}'
        }, status=500)