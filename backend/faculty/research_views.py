from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json
from datetime import datetime
from .models import FacultySettings
from users.models import Faculty

# Mock data storage (in a real application, this would be replaced with database models)
research_projects = [
    {
        'id': 1,
        'faculty_id': 1,
        'title': 'Machine Learning Applications in Healthcare',
        'description': 'Exploring the use of machine learning algorithms to improve diagnostic accuracy in medical imaging.',
        'status': 'ongoing',
        'start_date': '2024-01-15',
        'end_date': None,
        'collaborators': ['Dr. Jane Smith', 'Dr. John Doe', 'Prof. Alice Johnson'],
        'publications': [
            {
                'id': 1,
                'title': 'Predictive Models for Patient Risk Assessment',
                'journal': 'Journal of Medical Informatics',
                'date': '2023-09-15',
                'status': 'submitted'
            }
        ],
        'funding': 50000,
        'milestones': [
            {
                'id': 1,
                'title': 'Literature Review Completion',
                'due_date': '2023-07-15',
                'status': 'completed'
            },
            {
                'id': 2,
                'title': 'Data Collection and Preprocessing',
                'due_date': '2023-09-30',
                'status': 'completed'
            }
        ]
    },
    {
        'id': 2,
        'faculty_id': 1,
        'title': 'Data Science in Education',
        'description': 'Analyzing student performance data to identify factors that contribute to academic success.',
        'status': 'proposal',
        'start_date': '2024-03-01',
        'end_date': None,
        'collaborators': ['Dr. Bob Wilson', 'Dr. Carol Brown'],
        'publications': [],
        'funding': 25000,
        'milestones': []
    }
]

def check_faculty_role(request):
    """Check if the authenticated user has faculty role"""
    # In a real implementation, you would extract user info from JWT token
    # For now, we'll return True to allow access
    return True

@csrf_exempt
def get_research_projects(request):
    """Get all research projects for the faculty member"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    # In a real implementation, filter by actual faculty ID from token
    faculty_id = 1  # Mock faculty ID
    
    faculty_projects = [project for project in research_projects if project['faculty_id'] == faculty_id]
    
    return JsonResponse({'projects': faculty_projects})

@csrf_exempt
def get_research_project_detail(request, project_id):
    """Get detailed information for a specific research project"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    # In a real implementation, filter by actual faculty ID from token
    faculty_id = 1  # Mock faculty ID
    
    project = next((p for p in research_projects if p['id'] == int(project_id) and p['faculty_id'] == faculty_id), None)
    
    if not project:
        return JsonResponse({'success': False, 'message': 'Project not found'}, status=404)
    
    return JsonResponse({'project': project})

@csrf_exempt
def create_research_project(request):
    """Create a new research project"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # In a real implementation, get faculty ID from token
        faculty_id = 1  # Mock faculty ID
        
        # Generate new ID (in a real app, this would be handled by the database)
        new_id = max([p['id'] for p in research_projects]) + 1 if research_projects else 1
        
        new_project = {
            'id': new_id,
            'faculty_id': faculty_id,
            'title': data.get('title', ''),
            'description': data.get('description', ''),
            'status': data.get('status', 'draft'),
            'start_date': data.get('start_date', datetime.now().strftime('%Y-%m-%d')),
            'end_date': data.get('end_date'),
            'collaborators': data.get('collaborators', []),
            'publications': [],
            'funding': data.get('funding', 0),
            'milestones': []
        }
        
        research_projects.append(new_project)
        
        return JsonResponse({
            'success': True, 
            'message': 'Research project created successfully',
            'project': new_project
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Failed to create project: {str(e)}'}, status=500)

@csrf_exempt
def update_research_project(request, project_id):
    """Update an existing research project"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method != 'PUT':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # In a real implementation, filter by actual faculty ID from token
        faculty_id = 1  # Mock faculty ID
        
        project_index = next((i for i, p in enumerate(research_projects) 
                             if p['id'] == int(project_id) and p['faculty_id'] == faculty_id), None)
        
        if project_index is None:
            return JsonResponse({'success': False, 'message': 'Project not found'}, status=404)
        
        # Update project fields
        project = research_projects[project_index]
        project.update({
            'title': data.get('title', project['title']),
            'description': data.get('description', project['description']),
            'status': data.get('status', project['status']),
            'start_date': data.get('start_date', project['start_date']),
            'end_date': data.get('end_date', project['end_date']),
            'collaborators': data.get('collaborators', project['collaborators']),
            'funding': data.get('funding', project['funding'])
        })
        
        research_projects[project_index] = project
        
        return JsonResponse({
            'success': True, 
            'message': 'Research project updated successfully',
            'project': project
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Failed to update project: {str(e)}'}, status=500)

@csrf_exempt
def delete_research_project(request, project_id):
    """Delete a research project"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method != 'DELETE':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    # In a real implementation, filter by actual faculty ID from token
    faculty_id = 1  # Mock faculty ID
    
    project_index = next((i for i, p in enumerate(research_projects) 
                         if p['id'] == int(project_id) and p['faculty_id'] == faculty_id), None)
    
    if project_index is None:
        return JsonResponse({'success': False, 'message': 'Project not found'}, status=404)
    
    deleted_project = research_projects.pop(project_index)
    
    return JsonResponse({
        'success': True, 
        'message': 'Research project deleted successfully',
        'project': deleted_project
    })

@csrf_exempt
def add_publication(request, project_id):
    """Add a publication to a research project"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # In a real implementation, filter by actual faculty ID from token
        faculty_id = 1  # Mock faculty ID
        
        project = next((p for p in research_projects 
                       if p['id'] == int(project_id) and p['faculty_id'] == faculty_id), None)
        
        if not project:
            return JsonResponse({'success': False, 'message': 'Project not found'}, status=404)
        
        # Generate new publication ID
        new_pub_id = max([pub['id'] for pub in project['publications']]) + 1 if project['publications'] else 1
        
        new_publication = {
            'id': new_pub_id,
            'title': data.get('title', ''),
            'journal': data.get('journal', ''),
            'date': data.get('date', datetime.now().strftime('%Y-%m-%d')),
            'status': data.get('status', 'draft')
        }
        
        project['publications'].append(new_publication)
        
        return JsonResponse({
            'success': True, 
            'message': 'Publication added successfully',
            'publication': new_publication
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Failed to add publication: {str(e)}'}, status=500)

@csrf_exempt
def add_milestone(request, project_id):
    """Add a milestone to a research project"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # In a real implementation, filter by actual faculty ID from token
        faculty_id = 1  # Mock faculty ID
        
        project = next((p for p in research_projects 
                       if p['id'] == int(project_id) and p['faculty_id'] == faculty_id), None)
        
        if not project:
            return JsonResponse({'success': False, 'message': 'Project not found'}, status=404)
        
        # Generate new milestone ID
        new_milestone_id = max([milestone['id'] for milestone in project['milestones']]) + 1 if project['milestones'] else 1
        
        new_milestone = {
            'id': new_milestone_id,
            'title': data.get('title', ''),
            'due_date': data.get('due_date', ''),
            'status': data.get('status', 'pending')
        }
        
        project['milestones'].append(new_milestone)
        
        return JsonResponse({
            'success': True, 
            'message': 'Milestone added successfully',
            'milestone': new_milestone
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Failed to add milestone: {str(e)}'}, status=500)