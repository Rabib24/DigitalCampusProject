from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime
from .models import FacultySettings
from users.models import Faculty
from publications.models import Publication

# Mock data storage (in a real application, this would be replaced with database queries)
publications = [
    {
        'id': '1',
        'title': 'Machine Learning Approaches for Healthcare Predictive Analytics',
        'authors': ['Dr. Jane Smith', 'Dr. John Doe', 'Prof. Alice Johnson'],
        'abstract': 'This paper presents novel machine learning techniques for predicting patient outcomes...',
        'publication_date': '2023-09-15',
        'journal': 'Journal of Medical Informatics',
        'volume': '15',
        'issue': '3',
        'pages': '127-145',
        'doi': '10.1234/jmi.2023.001',
        'isbn': '',
        'publisher': 'Medical Informatics Press',
        'research_project_id': '1',
        'faculty_ids': ['1'],
        'keywords': ['machine learning', 'healthcare', 'predictive analytics', 'data science'],
        'citations': 25,
        'document_url': '/documents/ml_healthcare_2023.pdf',
        'created_at': '2023-08-01T10:00:00Z',
        'updated_at': '2023-09-20T14:30:00Z',
        'status': 'published'
    },
    {
        'id': '2',
        'title': 'A Comprehensive Review of AI in Medicine',
        'authors': ['Dr. Jane Smith', 'Dr. Emily Brown'],
        'abstract': 'This review examines the current state of artificial intelligence applications in medicine...',
        'publication_date': '2023-11-20',
        'journal': 'AI in Medicine',
        'volume': '8',
        'issue': '2',
        'pages': '89-112',
        'doi': '10.5678/aim.2023.002',
        'isbn': '',
        'publisher': 'AI Medical Publications',
        'research_project_id': '1',
        'faculty_ids': ['1'],
        'keywords': ['artificial intelligence', 'medicine', 'review', 'applications'],
        'citations': 12,
        'document_url': '/documents/ai_medicine_2023.pdf',
        'created_at': '2023-10-05T09:15:00Z',
        'updated_at': '2023-11-25T16:45:00Z',
        'status': 'published'
    },
    {
        'id': '3',
        'title': 'Deep Learning for Medical Image Analysis',
        'authors': ['Dr. John Doe', 'Dr. Jane Smith'],
        'abstract': 'We propose a new deep learning architecture for medical image segmentation...',
        'publication_date': '2023-07-10',
        'journal': 'Medical Image Analysis',
        'volume': '12',
        'issue': '4',
        'pages': '201-225',
        'doi': '10.5678/mia.2023.003',
        'isbn': '',
        'publisher': 'Image Analysis Journal',
        'research_project_id': '2',
        'faculty_ids': ['1'],
        'keywords': ['deep learning', 'medical imaging', 'segmentation', 'CNN'],
        'citations': 42,
        'document_url': '/documents/dl_medical_2023.pdf',
        'created_at': '2023-06-01T11:30:00Z',
        'updated_at': '2023-07-15T09:20:00Z',
        'status': 'published'
    }
]

def check_faculty_role(request):
    """Check if the authenticated user has faculty role"""
    # In a real implementation, you would extract user info from JWT token
    # For now, we'll return True to allow access
    return True

@csrf_exempt
def get_publications(request):
    """Get all publications for the faculty member"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    # In a real implementation, filter by actual faculty ID from token
    faculty_id = '1'  # Mock faculty ID
    
    faculty_publications = [pub for pub in publications if faculty_id in pub.get('faculty_ids', [])]
    
    return JsonResponse({'publications': faculty_publications})

@csrf_exempt
def get_publication_detail(request, publication_id):
    """Get detailed information for a specific publication"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    # In a real implementation, filter by actual faculty ID from token
    faculty_id = '1'  # Mock faculty ID
    
    publication = next((p for p in publications 
                       if p['id'] == publication_id and faculty_id in p.get('faculty_ids', [])), None)
    
    if not publication:
        return JsonResponse({'success': False, 'message': 'Publication not found'}, status=404)
    
    return JsonResponse({'publication': publication})

@csrf_exempt
def create_publication(request):
    """Create a new publication"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # In a real implementation, get faculty ID from token
        faculty_id = '1'  # Mock faculty ID
        
        # Generate new ID (in a real app, this would be handled by the database)
        new_id = str(max([int(p['id']) for p in publications]) + 1) if publications else '1'
        
        new_publication = {
            'id': new_id,
            'title': data.get('title', ''),
            'authors': data.get('authors', []),
            'abstract': data.get('abstract', ''),
            'publication_date': data.get('publication_date', datetime.now().strftime('%Y-%m-%d')),
            'journal': data.get('journal', ''),
            'volume': data.get('volume', ''),
            'issue': data.get('issue', ''),
            'pages': data.get('pages', ''),
            'doi': data.get('doi', ''),
            'isbn': data.get('isbn', ''),
            'publisher': data.get('publisher', ''),
            'research_project_id': data.get('research_project_id', ''),
            'faculty_ids': [faculty_id],
            'keywords': data.get('keywords', []),
            'citations': 0,
            'document_url': data.get('document_url', ''),
            'created_at': datetime.now().isoformat() + 'Z',
            'updated_at': datetime.now().isoformat() + 'Z',
            'status': data.get('status', 'draft')
        }
        
        publications.append(new_publication)
        
        return JsonResponse({
            'success': True, 
            'message': 'Publication created successfully',
            'publication': new_publication
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Failed to create publication: {str(e)}'}, status=500)

@csrf_exempt
def update_publication(request, publication_id):
    """Update an existing publication"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method != 'PUT':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # In a real implementation, filter by actual faculty ID from token
        faculty_id = '1'  # Mock faculty ID
        
        publication_index = next((i for i, p in enumerate(publications) 
                                 if p['id'] == publication_id and faculty_id in p.get('faculty_ids', [])), None)
        
        if publication_index is None:
            return JsonResponse({'success': False, 'message': 'Publication not found'}, status=404)
        
        # Update publication fields
        publication = publications[publication_index]
        publication.update({
            'title': data.get('title', publication['title']),
            'authors': data.get('authors', publication['authors']),
            'abstract': data.get('abstract', publication['abstract']),
            'publication_date': data.get('publication_date', publication['publication_date']),
            'journal': data.get('journal', publication['journal']),
            'volume': data.get('volume', publication['volume']),
            'issue': data.get('issue', publication['issue']),
            'pages': data.get('pages', publication['pages']),
            'doi': data.get('doi', publication['doi']),
            'isbn': data.get('isbn', publication['isbn']),
            'publisher': data.get('publisher', publication['publisher']),
            'research_project_id': data.get('research_project_id', publication['research_project_id']),
            'keywords': data.get('keywords', publication['keywords']),
            'document_url': data.get('document_url', publication['document_url']),
            'updated_at': datetime.now().isoformat() + 'Z',
            'status': data.get('status', publication['status'])
        })
        
        publications[publication_index] = publication
        
        return JsonResponse({
            'success': True, 
            'message': 'Publication updated successfully',
            'publication': publication
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Failed to update publication: {str(e)}'}, status=500)

@csrf_exempt
def delete_publication(request, publication_id):
    """Delete a publication"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    if request.method != 'DELETE':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    
    # In a real implementation, filter by actual faculty ID from token
    faculty_id = '1'  # Mock faculty ID
    
    publication_index = next((i for i, p in enumerate(publications) 
                             if p['id'] == publication_id and faculty_id in p.get('faculty_ids', [])), None)
    
    if publication_index is None:
        return JsonResponse({'success': False, 'message': 'Publication not found'}, status=404)
    
    deleted_publication = publications.pop(publication_index)
    
    return JsonResponse({
        'success': True, 
        'message': 'Publication deleted successfully',
        'publication': deleted_publication
    })

@csrf_exempt
def search_publications(request):
    """Search publications by various criteria"""
    if not check_faculty_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    try:
        data = json.loads(request.body) if request.body else {}
        
        # In a real implementation, filter by actual faculty ID from token
        faculty_id = '1'  # Mock faculty ID
        
        # Get search criteria
        search_term = data.get('search_term', '').lower()
        journal = data.get('journal', '').lower()
        status = data.get('status', '').lower()
        year = data.get('year', '')
        
        # Filter publications
        filtered_publications = [pub for pub in publications if faculty_id in pub.get('faculty_ids', [])]
        
        if search_term:
            filtered_publications = [
                pub for pub in filtered_publications
                if search_term in pub['title'].lower() or 
                   search_term in pub['abstract'].lower() or
                   any(search_term in author.lower() for author in pub['authors'])
            ]
        
        if journal:
            filtered_publications = [
                pub for pub in filtered_publications
                if journal in pub['journal'].lower()
            ]
        
        if status:
            filtered_publications = [
                pub for pub in filtered_publications
                if status == pub['status'].lower()
            ]
        
        if year:
            filtered_publications = [
                pub for pub in filtered_publications
                if pub['publication_date'].startswith(str(year))
            ]
        
        return JsonResponse({
            'success': True,
            'publications': filtered_publications
        })
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Failed to search publications: {str(e)}'}, status=500)