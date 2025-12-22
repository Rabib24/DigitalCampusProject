from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from research.models import ResearchProject
import json
from datetime import datetime
from .decorators import faculty_required


@csrf_exempt
@faculty_required
def get_research_projects(request):
    """Get all research projects for the faculty member"""
    try:
        # Get research projects owned by this faculty
        projects_qs = ResearchProject.objects.filter(owner_id=request.faculty.employee_id)  # type: ignore
        
        # Convert to JSON format with additional fields for frontend
        projects = []
        for project in projects_qs:
            project_data = project.to_json()
            
            # Add frontend-expected fields
            # Convert snake_case to camelCase and add counts
            projects.append({
                'id': project_data.get('id'),
                'title': project_data.get('title', ''),
                'description': project_data.get('description', ''),
                'status': project_data.get('status', 'draft'),
                'startDate': project_data.get('start_date', ''),
                'endDate': project_data.get('end_date'),
                'collaborators': 0,  # TODO: Add collaborators count when model is updated
                'publications': 0,  # TODO: Add publications count when model is updated
                'funding': project_data.get('budget', 0)
            })
        
        return JsonResponse({'projects': projects})
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'success': False, 'message': 'Failed to fetch research projects'}, status=500)


@csrf_exempt
@faculty_required
def get_research_project_detail(request, project_id):
    """Get detailed information for a specific research project"""
    try:
        # Get research project owned by this faculty
        try:
            project = ResearchProject.objects.get(id=project_id, owner_id=request.faculty.employee_id)  # type: ignore
        except ResearchProject.DoesNotExist:  # type: ignore
            return JsonResponse({'success': False, 'message': 'Project not found or access denied'}, status=404)
        
        # Convert to JSON format with additional fields for frontend
        project_data = project.to_json()
        
        result = {
            'id': project_data.get('id'),
            'title': project_data.get('title', ''),
            'description': project_data.get('description', ''),
            'status': project_data.get('status', 'draft'),
            'startDate': project_data.get('start_date', ''),
            'endDate': project_data.get('end_date'),
            'collaborators': [],  # TODO: Add collaborators when model is updated
            'publications': [],  # TODO: Add publications when model is updated
            'funding': project_data.get('budget', 0),
            'milestones': []  # TODO: Add milestones when model is updated
        }
        
        return JsonResponse({'project': result})
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'success': False, 'message': 'Failed to fetch project details'}, status=500)


@csrf_exempt
@faculty_required
def create_research_project(request):
    """Create a new research project"""
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # Create new research project
        project = ResearchProject.objects.create(
            owner_id=request.faculty.employee_id,
            title=data.get('title', ''),
            description=data.get('description', ''),
            status=data.get('status', 'draft'),
            start_date=data.get('startDate', datetime.now().strftime('%Y-%m-%d')),
            end_date=data.get('endDate'),
            budget=data.get('funding', 0)
        )
        
        project_data = {
            'id': project.id,
            'title': project.title,
            'description': project.description,
            'status': project.status,
            'startDate': str(project.start_date),
            'endDate': str(project.end_date) if project.end_date else None,
            'collaborators': 0,
            'publications': 0,
            'funding': project.budget
        }
        
        return JsonResponse({
            'success': True, 
            'message': 'Research project created successfully',
            'project': project_data
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'success': False, 'message': f'Failed to create project: {str(e)}'}, status=500)


@csrf_exempt
@faculty_required
def update_research_project(request, project_id):
    """Update an existing research project"""
    if request.method != 'PUT':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # Get research project
        try:
            project = ResearchProject.objects.get(id=project_id, owner_id=request.faculty.employee_id)  # type: ignore
        except ResearchProject.DoesNotExist:  # type: ignore
            return JsonResponse({'success': False, 'message': 'Project not found or access denied'}, status=404)
        
        # Update project fields
        project.title = data.get('title', project.title)
        project.description = data.get('description', project.description)
        project.status = data.get('status', project.status)
        project.start_date = data.get('startDate', project.start_date)
        project.end_date = data.get('endDate', project.end_date)
        project.budget = data.get('funding', project.budget)
        project.save()
        
        project_data = {
            'id': project.id,
            'title': project.title,
            'description': project.description,
            'status': project.status,
            'startDate': str(project.start_date),
            'endDate': str(project.end_date) if project.end_date else None,
            'collaborators': 0,
            'publications': 0,
            'funding': project.budget
        }
        
        return JsonResponse({
            'success': True, 
            'message': 'Research project updated successfully',
            'project': project_data
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'success': False, 'message': f'Failed to update project: {str(e)}'}, status=500)


@csrf_exempt
@faculty_required
def delete_research_project(request, project_id):
    """Delete a research project"""
    if request.method != 'DELETE':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        # Get research project
        try:
            project = ResearchProject.objects.get(id=project_id, owner_id=request.faculty.employee_id)  # type: ignore
        except ResearchProject.DoesNotExist:  # type: ignore
            return JsonResponse({'success': False, 'message': 'Project not found or access denied'}, status=404)
        
        # Delete project
        project.delete()
        
        return JsonResponse({
            'success': True, 
            'message': 'Research project deleted successfully'
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'success': False, 'message': f'Failed to delete project: {str(e)}'}, status=500)


@csrf_exempt
@faculty_required
def add_publication(request, project_id):
    """Add a publication to a research project"""
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # Get research project
        try:
            project = ResearchProject.objects.get(id=project_id, owner_id=request.faculty.employee_id)  # type: ignore
        except ResearchProject.DoesNotExist:  # type: ignore
            return JsonResponse({'success': False, 'message': 'Project not found or access denied'}, status=404)
        
        # TODO: Add publication model and create publication here
        # For now, just return success
        
        return JsonResponse({
            'success': True, 
            'message': 'Publication added successfully (feature not yet fully implemented)'
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'success': False, 'message': f'Failed to add publication: {str(e)}'}, status=500)


@csrf_exempt
@faculty_required
def add_milestone(request, project_id):
    """Add a milestone to a research project"""
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # Get research project
        try:
            project = ResearchProject.objects.get(id=project_id, owner_id=request.faculty.employee_id)  # type: ignore
        except ResearchProject.DoesNotExist:  # type: ignore
            return JsonResponse({'success': False, 'message': 'Project not found or access denied'}, status=404)
        
        # TODO: Add milestone model and create milestone here
        # For now, just return success
        
        return JsonResponse({
            'success': True, 
            'message': 'Milestone added successfully (feature not yet fully implemented)'
        })
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'success': False, 'message': f'Failed to add milestone: {str(e)}'}, status=500)