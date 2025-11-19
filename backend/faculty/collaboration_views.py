from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime
from .models import FacultySettings
from users.models import Faculty

# Mock data storage (in a real application, this would be replaced with database queries)
collaborations = [
    {
        'id': '1',
        'title': 'Machine Learning in Healthcare Consortium',
        'description': 'Collaborative research project between multiple institutions to advance machine learning applications in healthcare.',
        'faculty_id': '1',
        'collaborators': [
            {
                'id': '1',
                'name': 'Dr. Jane Smith',
                'institution': 'IUB',
                'role': 'Principal Investigator',
                'email': 'jane.smith@iub.edu'
            },
            {
                'id': '2',
                'name': 'Dr. John Doe',
                'institution': 'Harvard Medical School',
                'role': 'Co-Investigator',
                'email': 'john.doe@harvard.edu'
            },
            {
                'id': '3',
                'name': 'Prof. Alice Johnson',
                'institution': 'MIT',
                'role': 'Research Lead',
                'email': 'alice.johnson@mit.edu'
            }
        ],
        'start_date': '2023-06-01',
        'end_date': '2024-06-01',
        'status': 'active',
        'project_id': '1',
        'documents': [
            {
                'id': '1',
                'name': 'Collaboration_Agreement.pdf',
                'uploaded_at': '2023-05-15',
                'size': '1.2 MB'
            },
            {
                'id': '2',
                'name': 'Project_Plan.docx',
                'uploaded_at': '2023-05-20',
                'size': '0.8 MB'
            }
        ],
        'communications': [
            {
                'id': '1',
                'subject': 'Project Kickoff Meeting',
                'sender': 'Dr. Jane Smith',
                'date': '2023-06-05',
                'message': 'Let\'s schedule our first project meeting to discuss the research plan and timeline.'
            },
            {
                'id': '2',
                'subject': 'Data Sharing Protocol',
                'sender': 'Dr. John Doe',
                'date': '2023-06-15',
                'message': 'I\'ve prepared the data sharing protocol document for your review.'
            }
        ]
    },
    {
        'id': '2',
        'title': 'Data Science Education Network',
        'description': 'Collaboration between universities to develop standardized data science curricula.',
        'faculty_id': '1',
        'collaborators': [
            {
                'id': '1',
                'name': 'Dr. Jane Smith',
                'institution': 'IUB',
                'role': 'Project Lead',
                'email': 'jane.smith@iub.edu'
            },
            {
                'id': '4',
                'name': 'Dr. Emily Brown',
                'institution': 'Stanford University',
                'role': 'Curriculum Specialist',
                'email': 'emily.brown@stanford.edu'
            }
        ],
        'start_date': '2023-09-01',
        'status': 'active',
        'documents': [
            {
                'id': '3',
                'name': 'Curriculum_Framework.pdf',
                'uploaded_at': '2023-08-20',
                'size': '2.1 MB'
            }
        ],
        'communications': [
            {
                'id': '3',
                'subject': 'Curriculum Workshop',
                'sender': 'Dr. Emily Brown',
                'date': '2023-09-10',
                'message': 'The first curriculum development workshop is scheduled for next month.'
            }
        ]
    }
]

def check_faculty_role(request):
    """Check if the authenticated user has faculty role"""
    # In a real implementation, you would extract user info from JWT token
    # For now, we'll return True to allow access
    return True

@csrf_exempt
def get_collaborations(request):
    """Get all collaborations for the faculty member"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    # In a real implementation, filter by actual faculty ID from token
    faculty_id = '1'  # Mock faculty ID
    
    faculty_collaborations = [collab for collab in collaborations if collab['faculty_id'] == faculty_id]
    
    return JsonResponse({'collaborations': faculty_collaborations})

@csrf_exempt
def get_collaboration_detail(request, collaboration_id):
    """Get detailed information for a specific collaboration"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    # In a real implementation, filter by actual faculty ID from token
    faculty_id = '1'  # Mock faculty ID
    
    collaboration = next((collab for collab in collaborations 
                         if collab['id'] == collaboration_id and collab['faculty_id'] == faculty_id), None)
    
    if not collaboration:
        return JsonResponse({'success': False, 'message': 'Collaboration not found'}, status=404)
    
    return JsonResponse({'collaboration': collaboration})

@csrf_exempt
def create_collaboration(request):
    """Create a new collaboration"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # In a real implementation, get faculty ID from token
        faculty_id = '1'  # Mock faculty ID
        
        # Generate new ID (in a real app, this would be handled by the database)
        new_id = str(max([int(collab['id']) for collab in collaborations]) + 1) if collaborations else '1'
        
        new_collaboration = {
            'id': new_id,
            'title': data.get('title', ''),
            'description': data.get('description', ''),
            'faculty_id': faculty_id,
            'collaborators': data.get('collaborators', []),
            'start_date': data.get('start_date', datetime.now().strftime('%Y-%m-%d')),
            'end_date': data.get('end_date', ''),
            'status': data.get('status', 'active'),
            'project_id': data.get('project_id', ''),
            'documents': data.get('documents', []),
            'communications': []
        }
        
        collaborations.append(new_collaboration)
        
        return JsonResponse({
            'success': True, 
            'message': 'Collaboration created successfully',
            'collaboration': new_collaboration
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Failed to create collaboration: {str(e)}'}, status=500)

@csrf_exempt
def update_collaboration(request, collaboration_id):
    """Update an existing collaboration"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method != 'PUT':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # In a real implementation, filter by actual faculty ID from token
        faculty_id = '1'  # Mock faculty ID
        
        collaboration_index = next((i for i, collab in enumerate(collaborations) 
                                   if collab['id'] == collaboration_id and collab['faculty_id'] == faculty_id), None)
        
        if collaboration_index is None:
            return JsonResponse({'success': False, 'message': 'Collaboration not found'}, status=404)
        
        # Update collaboration fields
        collaboration = collaborations[collaboration_index]
        collaboration.update({
            'title': data.get('title', collaboration['title']),
            'description': data.get('description', collaboration['description']),
            'collaborators': data.get('collaborators', collaboration['collaborators']),
            'start_date': data.get('start_date', collaboration['start_date']),
            'end_date': data.get('end_date', collaboration.get('end_date', '')),
            'status': data.get('status', collaboration['status']),
            'project_id': data.get('project_id', collaboration.get('project_id', ''))
        })
        
        collaborations[collaboration_index] = collaboration
        
        return JsonResponse({
            'success': True, 
            'message': 'Collaboration updated successfully',
            'collaboration': collaboration
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Failed to update collaboration: {str(e)}'}, status=500)

@csrf_exempt
def delete_collaboration(request, collaboration_id):
    """Delete a collaboration"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method != 'DELETE':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    # In a real implementation, filter by actual faculty ID from token
    faculty_id = '1'  # Mock faculty ID
    
    collaboration_index = next((i for i, collab in enumerate(collaborations) 
                               if collab['id'] == collaboration_id and collab['faculty_id'] == faculty_id), None)
    
    if collaboration_index is None:
        return JsonResponse({'success': False, 'message': 'Collaboration not found'}, status=404)
    
    deleted_collaboration = collaborations.pop(collaboration_index)
    
    return JsonResponse({
        'success': True, 
        'message': 'Collaboration deleted successfully',
        'collaboration': deleted_collaboration
    })

@csrf_exempt
def add_collaborator(request, collaboration_id):
    """Add a collaborator to a collaboration"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # In a real implementation, filter by actual faculty ID from token
        faculty_id = '1'  # Mock faculty ID
        
        collaboration = next((collab for collab in collaborations 
                             if collab['id'] == collaboration_id and collab['faculty_id'] == faculty_id), None)
        
        if not collaboration:
            return JsonResponse({'success': False, 'message': 'Collaboration not found'}, status=404)
        
        # Generate new collaborator ID
        new_collab_id = str(max([int(c['id']) for c in collaboration['collaborators']]) + 1) if collaboration['collaborators'] else '1'
        
        new_collaborator = {
            'id': new_collab_id,
            'name': data.get('name', ''),
            'institution': data.get('institution', ''),
            'role': data.get('role', ''),
            'email': data.get('email', '')
        }
        
        collaboration['collaborators'].append(new_collaborator)
        
        return JsonResponse({
            'success': True, 
            'message': 'Collaborator added successfully',
            'collaborator': new_collaborator
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Failed to add collaborator: {str(e)}'}, status=500)

@csrf_exempt
def remove_collaborator(request, collaboration_id, collaborator_id):
    """Remove a collaborator from a collaboration"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method != 'DELETE':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        # In a real implementation, filter by actual faculty ID from token
        faculty_id = '1'  # Mock faculty ID
        
        collaboration = next((collab for collab in collaborations 
                             if collab['id'] == collaboration_id and collab['faculty_id'] == faculty_id), None)
        
        if not collaboration:
            return JsonResponse({'success': False, 'message': 'Collaboration not found'}, status=404)
        
        collaborator_index = next((i for i, c in enumerate(collaboration['collaborators']) 
                                  if c['id'] == collaborator_id), None)
        
        if collaborator_index is None:
            return JsonResponse({'success': False, 'message': 'Collaborator not found'}, status=404)
        
        removed_collaborator = collaboration['collaborators'].pop(collaborator_index)
        
        return JsonResponse({
            'success': True, 
            'message': 'Collaborator removed successfully',
            'collaborator': removed_collaborator
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Failed to remove collaborator: {str(e)}'}, status=500)

@csrf_exempt
def upload_collaboration_document(request, collaboration_id):
    """Upload a document for a collaboration"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # In a real implementation, filter by actual faculty ID from token
        faculty_id = '1'  # Mock faculty ID
        
        collaboration = next((collab for collab in collaborations 
                             if collab['id'] == collaboration_id and collab['faculty_id'] == faculty_id), None)
        
        if not collaboration:
            return JsonResponse({'success': False, 'message': 'Collaboration not found'}, status=404)
        
        # Generate new document ID
        new_doc_id = str(max([int(doc['id']) for doc in collaboration['documents']]) + 1) if collaboration['documents'] else '1'
        
        new_document = {
            'id': new_doc_id,
            'name': data.get('name', ''),
            'uploaded_at': datetime.now().strftime('%Y-%m-%d'),
            'size': data.get('size', '')
        }
        
        collaboration['documents'].append(new_document)
        
        return JsonResponse({
            'success': True, 
            'message': 'Document uploaded successfully',
            'document': new_document
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Failed to upload document: {str(e)}'}, status=500)

@csrf_exempt
def send_collaboration_message(request, collaboration_id):
    """Send a message to collaborators"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # In a real implementation, filter by actual faculty ID from token
        faculty_id = '1'  # Mock faculty ID
        
        collaboration = next((collab for collab in collaborations 
                             if collab['id'] == collaboration_id and collab['faculty_id'] == faculty_id), None)
        
        if not collaboration:
            return JsonResponse({'success': False, 'message': 'Collaboration not found'}, status=404)
        
        # Generate new message ID
        new_msg_id = str(max([int(msg['id']) for msg in collaboration['communications']]) + 1) if collaboration['communications'] else '1'
        
        new_message = {
            'id': new_msg_id,
            'subject': data.get('subject', ''),
            'sender': 'Dr. Jane Smith',  # In a real implementation, get from token
            'date': datetime.now().strftime('%Y-%m-%d'),
            'message': data.get('message', '')
        }
        
        collaboration['communications'].append(new_message)
        
        return JsonResponse({
            'success': True, 
            'message': 'Message sent successfully',
            'communication': new_message
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Failed to send message: {str(e)}'}, status=500)