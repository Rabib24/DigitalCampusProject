from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime
from .models import FacultySettings
from users.models import Faculty

# Mock data storage (in a real application, this would be replaced with database queries)
ethics_applications = [
    {
        'id': '1',
        'title': 'Machine Learning in Healthcare: Patient Data Analysis',
        'principal_investigator': 'Dr. Jane Smith',
        'department': 'Computer Science',
        'faculty_id': '1',
        'submission_date': '2023-09-15',
        'review_date': '2023-10-01',
        'status': 'approved',
        'protocol_number': 'ETH-2023-001',
        'risk_level': 'minimal',
        'project_description': 'This study involves analyzing anonymized patient data to develop predictive models for healthcare outcomes.',
        'consent_process': 'All data will be anonymized and participants will provide informed consent through our secure portal.',
        'data_management': 'Data will be stored on encrypted servers with restricted access. All identifiers will be removed before analysis.',
        'documents': [
            {
                'id': '1',
                'name': 'Research Protocol.pdf',
                'type': 'application/pdf',
                'size': '2.4 MB'
            },
            {
                'id': '2',
                'name': 'Consent Form.docx',
                'type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'size': '0.8 MB'
            }
        ]
    },
    {
        'id': '2',
        'title': 'Human-Computer Interaction Study',
        'principal_investigator': 'Dr. John Doe',
        'department': 'Computer Science',
        'faculty_id': '1',
        'submission_date': '2023-10-20',
        'status': 'under-review',
        'risk_level': 'minimal',
        'project_description': 'Investigating user behavior and preferences in educational technology interfaces.',
        'consent_process': 'Participants will be informed about the study purpose and provide digital consent before participation.',
        'data_management': 'All data will be anonymized and stored securely. No personally identifiable information will be collected.',
        'documents': [
            {
                'id': '3',
                'name': 'HCI_Study_Protocol.pdf',
                'type': 'application/pdf',
                'size': '1.7 MB'
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
def get_ethics_applications(request):
    """Get all ethics applications for the faculty member"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    # In a real implementation, filter by actual faculty ID from token
    faculty_id = '1'  # Mock faculty ID
    
    faculty_applications = [app for app in ethics_applications if app['faculty_id'] == faculty_id]
    
    return JsonResponse({'applications': faculty_applications})

@csrf_exempt
def get_ethics_application_detail(request, application_id):
    """Get detailed information for a specific ethics application"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    # In a real implementation, filter by actual faculty ID from token
    faculty_id = '1'  # Mock faculty ID
    
    application = next((app for app in ethics_applications 
                       if app['id'] == application_id and app['faculty_id'] == faculty_id), None)
    
    if not application:
        return JsonResponse({'success': False, 'message': 'Ethics application not found'}, status=404)
    
    return JsonResponse({'application': application})

@csrf_exempt
def create_ethics_application(request):
    """Create a new ethics application"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # In a real implementation, get faculty ID from token
        faculty_id = '1'  # Mock faculty ID
        
        # Generate new ID (in a real app, this would be handled by the database)
        new_id = str(max([int(app['id']) for app in ethics_applications]) + 1) if ethics_applications else '1'
        
        new_application = {
            'id': new_id,
            'title': data.get('title', ''),
            'principal_investigator': data.get('principal_investigator', ''),
            'department': data.get('department', ''),
            'faculty_id': faculty_id,
            'submission_date': datetime.now().strftime('%Y-%m-%d'),
            'status': 'submitted',
            'protocol_number': data.get('protocol_number', ''),
            'risk_level': data.get('risk_level', 'minimal'),
            'project_description': data.get('project_description', ''),
            'consent_process': data.get('consent_process', ''),
            'data_management': data.get('data_management', ''),
            'documents': data.get('documents', [])
        }
        
        ethics_applications.append(new_application)
        
        return JsonResponse({
            'success': True, 
            'message': 'Ethics application created successfully',
            'application': new_application
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Failed to create ethics application: {str(e)}'}, status=500)

@csrf_exempt
def update_ethics_application(request, application_id):
    """Update an existing ethics application"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method != 'PUT':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # In a real implementation, filter by actual faculty ID from token
        faculty_id = '1'  # Mock faculty ID
        
        application_index = next((i for i, app in enumerate(ethics_applications) 
                                 if app['id'] == application_id and app['faculty_id'] == faculty_id), None)
        
        if application_index is None:
            return JsonResponse({'success': False, 'message': 'Ethics application not found'}, status=404)
        
        # Update application fields
        application = ethics_applications[application_index]
        application.update({
            'title': data.get('title', application['title']),
            'principal_investigator': data.get('principal_investigator', application['principal_investigator']),
            'department': data.get('department', application['department']),
            'review_date': data.get('review_date', application.get('review_date')),
            'status': data.get('status', application['status']),
            'protocol_number': data.get('protocol_number', application.get('protocol_number', '')),
            'risk_level': data.get('risk_level', application['risk_level']),
            'project_description': data.get('project_description', application['project_description']),
            'consent_process': data.get('consent_process', application['consent_process']),
            'data_management': data.get('data_management', application['data_management']),
            'documents': data.get('documents', application['documents'])
        })
        
        ethics_applications[application_index] = application
        
        return JsonResponse({
            'success': True, 
            'message': 'Ethics application updated successfully',
            'application': application
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Failed to update ethics application: {str(e)}'}, status=500)

@csrf_exempt
def delete_ethics_application(request, application_id):
    """Delete an ethics application"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method != 'DELETE':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    # In a real implementation, filter by actual faculty ID from token
    faculty_id = '1'  # Mock faculty ID
    
    application_index = next((i for i, app in enumerate(ethics_applications) 
                             if app['id'] == application_id and app['faculty_id'] == faculty_id), None)
    
    if application_index is None:
        return JsonResponse({'success': False, 'message': 'Ethics application not found'}, status=404)
    
    deleted_application = ethics_applications.pop(application_index)
    
    return JsonResponse({
        'success': True, 
        'message': 'Ethics application deleted successfully',
        'application': deleted_application
    })

@csrf_exempt
def search_ethics_applications(request):
    """Search ethics applications by various criteria"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    try:
        data = json.loads(request.body) if request.body else {}
        
        # In a real implementation, filter by actual faculty ID from token
        faculty_id = '1'  # Mock faculty ID
        
        # Get search criteria
        search_term = data.get('search_term', '').lower()
        status = data.get('status', '').lower()
        risk_level = data.get('risk_level', '').lower()
        
        # Filter applications
        filtered_applications = [app for app in ethics_applications if app['faculty_id'] == faculty_id]
        
        if search_term:
            filtered_applications = [
                app for app in filtered_applications
                if search_term in app['title'].lower() or 
                   search_term in app['principal_investigator'].lower() or
                   search_term in app['department'].lower()
            ]
        
        if status:
            filtered_applications = [
                app for app in filtered_applications
                if status == app['status'].lower()
            ]
        
        if risk_level:
            filtered_applications = [
                app for app in filtered_applications
                if risk_level == app['risk_level'].lower()
            ]
        
        return JsonResponse({
            'success': True,
            'applications': filtered_applications
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Failed to search ethics applications: {str(e)}'}, status=500)

@csrf_exempt
def upload_ethics_document(request, application_id):
    """Upload a document for an ethics application"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # In a real implementation, filter by actual faculty ID from token
        faculty_id = '1'  # Mock faculty ID
        
        application = next((app for app in ethics_applications 
                           if app['id'] == application_id and app['faculty_id'] == faculty_id), None)
        
        if not application:
            return JsonResponse({'success': False, 'message': 'Ethics application not found'}, status=404)
        
        # Generate new document ID
        new_doc_id = str(max([int(doc['id']) for doc in application['documents']]) + 1) if application['documents'] else '1'
        
        new_document = {
            'id': new_doc_id,
            'name': data.get('name', ''),
            'type': data.get('type', ''),
            'size': data.get('size', '')
        }
        
        application['documents'].append(new_document)
        
        return JsonResponse({
            'success': True, 
            'message': 'Document uploaded successfully',
            'document': new_document
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Failed to upload document: {str(e)}'}, status=500)