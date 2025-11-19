from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime

# Mock data storage (in a real application, this would be replaced with database models)
grants = [
    {
        'id': 1,
        'faculty_id': 1,
        'title': 'Machine Learning in Healthcare Research Grant',
        'description': 'Funding for research on applying machine learning techniques to improve healthcare outcomes',
        'funding_agency': 'National Science Foundation',
        'amount': 150000,
        'submission_date': '2023-10-15',
        'deadline': '2024-01-30',
        'status': 'submitted',
        'documents': [
            {
                'id': 1,
                'name': 'Research_Proposal.pdf',
                'uploaded_at': '2023-10-10'
            }
        ]
    },
    {
        'id': 2,
        'faculty_id': 1,
        'title': 'Data Science Education Grant',
        'description': 'Grant to support data science curriculum development and student training',
        'funding_agency': 'Department of Education',
        'amount': 75000,
        'submission_date': '2023-11-01',
        'deadline': '2024-02-15',
        'status': 'under-review',
        'documents': [
            {
                'id': 2,
                'name': 'Curriculum_Plan.pdf',
                'uploaded_at': '2023-10-25'
            },
            {
                'id': 3,
                'name': 'Budget_Justification.pdf',
                'uploaded_at': '2023-10-25'
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
def get_grant_applications(request):
    """Get all grant applications for the faculty member"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    # In a real implementation, filter by actual faculty ID from token
    faculty_id = 1  # Mock faculty ID
    
    faculty_grants = [grant for grant in grants if grant['faculty_id'] == faculty_id]
    
    return JsonResponse({'grants': faculty_grants})

@csrf_exempt
def get_grant_application_detail(request, grant_id):
    """Get detailed information for a specific grant application"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    # In a real implementation, filter by actual faculty ID from token
    faculty_id = 1  # Mock faculty ID
    
    grant = next((g for g in grants if g['id'] == int(grant_id) and g['faculty_id'] == faculty_id), None)
    
    if not grant:
        return JsonResponse({'success': False, 'message': 'Grant application not found'}, status=404)
    
    return JsonResponse({'grant': grant})

@csrf_exempt
def create_grant_application(request):
    """Create a new grant application"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # In a real implementation, get faculty ID from token
        faculty_id = 1  # Mock faculty ID
        
        # Generate new ID (in a real app, this would be handled by the database)
        new_id = max([g['id'] for g in grants]) + 1 if grants else 1
        
        new_grant = {
            'id': new_id,
            'faculty_id': faculty_id,
            'title': data.get('title', ''),
            'description': data.get('description', ''),
            'funding_agency': data.get('funding_agency', ''),
            'amount': data.get('amount', 0),
            'submission_date': data.get('submission_date', datetime.now().strftime('%Y-%m-%d')),
            'deadline': data.get('deadline', ''),
            'status': data.get('status', 'draft'),
            'documents': []
        }
        
        grants.append(new_grant)
        
        return JsonResponse({
            'success': True, 
            'message': 'Grant application created successfully',
            'grant': new_grant
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Failed to create grant application: {str(e)}'}, status=500)

@csrf_exempt
def update_grant_application(request, grant_id):
    """Update an existing grant application"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method != 'PUT':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # In a real implementation, filter by actual faculty ID from token
        faculty_id = 1  # Mock faculty ID
        
        grant_index = next((i for i, g in enumerate(grants) 
                           if g['id'] == int(grant_id) and g['faculty_id'] == faculty_id), None)
        
        if grant_index is None:
            return JsonResponse({'success': False, 'message': 'Grant application not found'}, status=404)
        
        # Update grant fields
        grant = grants[grant_index]
        grant.update({
            'title': data.get('title', grant['title']),
            'description': data.get('description', grant['description']),
            'funding_agency': data.get('funding_agency', grant['funding_agency']),
            'amount': data.get('amount', grant['amount']),
            'submission_date': data.get('submission_date', grant['submission_date']),
            'deadline': data.get('deadline', grant['deadline']),
            'status': data.get('status', grant['status'])
        })
        
        grants[grant_index] = grant
        
        return JsonResponse({
            'success': True, 
            'message': 'Grant application updated successfully',
            'grant': grant
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Failed to update grant application: {str(e)}'}, status=500)

@csrf_exempt
def delete_grant_application(request, grant_id):
    """Delete a grant application"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method != 'DELETE':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    # In a real implementation, filter by actual faculty ID from token
    faculty_id = 1  # Mock faculty ID
    
    grant_index = next((i for i, g in enumerate(grants) 
                       if g['id'] == int(grant_id) and g['faculty_id'] == faculty_id), None)
    
    if grant_index is None:
        return JsonResponse({'success': False, 'message': 'Grant application not found'}, status=404)
    
    deleted_grant = grants.pop(grant_index)
    
    return JsonResponse({
        'success': True, 
        'message': 'Grant application deleted successfully',
        'grant': deleted_grant
    })

@csrf_exempt
def upload_grant_document(request, grant_id):
    """Upload a document for a grant application"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # In a real implementation, filter by actual faculty ID from token
        faculty_id = 1  # Mock faculty ID
        
        grant = next((g for g in grants 
                     if g['id'] == int(grant_id) and g['faculty_id'] == faculty_id), None)
        
        if not grant:
            return JsonResponse({'success': False, 'message': 'Grant application not found'}, status=404)
        
        # Generate new document ID
        new_doc_id = max([doc['id'] for doc in grant['documents']]) + 1 if grant['documents'] else 1
        
        new_document = {
            'id': new_doc_id,
            'name': data.get('name', ''),
            'uploaded_at': datetime.now().strftime('%Y-%m-%d')
        }
        
        grant['documents'].append(new_document)
        
        return JsonResponse({
            'success': True, 
            'message': 'Document uploaded successfully',
            'document': new_document
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Failed to upload document: {str(e)}'}, status=500)

@csrf_exempt
def get_grant_tracking(request, grant_id):
    """Get tracking information for a grant application"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    # In a real implementation, filter by actual faculty ID from token
    faculty_id = 1  # Mock faculty ID
    
    grant = next((g for g in grants 
                 if g['id'] == int(grant_id) and g['faculty_id'] == faculty_id), None)
    
    if not grant:
        return JsonResponse({'success': False, 'message': 'Grant application not found'}, status=404)
    
    # Mock tracking data
    tracking_data = {
        'id': grant['id'],
        'title': grant['title'],
        'status': grant['status'],
        'submission_date': grant['submission_date'],
        'last_updated': datetime.now().strftime('%Y-%m-%d'),
        'review_stage': 'Initial Review' if grant['status'] == 'under-review' else 'Not Started',
        'next_milestone': 'Final Decision' if grant['status'] == 'under-review' else 'Submission'
    }
    
    return JsonResponse({
        'success': True,
        'tracking': tracking_data
    })