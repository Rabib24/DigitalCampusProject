"""
Faculty Publication Management Views
Handles publication CRUD operations for faculty
"""

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from publications.models import Publication
from .decorators import faculty_required
import json
import uuid


@csrf_exempt
@require_http_methods(["GET"])
@faculty_required
def get_publications(request):
    """Get all publications for the faculty member"""
    try:
        faculty_id = request.faculty.employee_id
        
        # Get all publications where this faculty member is an author
        all_publications = Publication.objects.all()
        publications = []
        
        for pub in all_publications:
            # Check if faculty_id is in the faculty_ids array
            if pub.faculty_ids and isinstance(pub.faculty_ids, list):
                if faculty_id in pub.faculty_ids:
                    publications.append(pub)
        
        # Convert to JSON format
        publications_data = []
        for pub in publications:
            pub_json = pub.to_json()
            # Map status from database to frontend format
            # Assuming default status is 'published' if not specified
            pub_json['status'] = pub_json.get('status', 'published')
            publications_data.append(pub_json)
        
        # Sort by publication date (newest first)
        publications_data.sort(key=lambda x: x.get('publication_date', ''), reverse=True)
        
        return JsonResponse({
            'success': True,
            'publications': publications_data,
            'total': len(publications_data)
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to fetch publications: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
@faculty_required
def create_publication(request):
    """Create a new publication"""
    try:
        data = json.loads(request.body)
        faculty_id = request.faculty.employee_id
        
        # Validate required fields
        if not data.get('title') or not data.get('publication_date'):
            return JsonResponse({
                'success': False,
                'message': 'Title and publication date are required'
            }, status=400)
        
        # Generate unique ID
        pub_id = f"PUB-{uuid.uuid4().hex[:12].upper()}"
        
        # Create publication
        publication = Publication.objects.create(
            id=pub_id,
            title=data.get('title'),
            authors=data.get('authors', []),
            abstract=data.get('abstract', ''),
            publication_date=data.get('publication_date'),
            journal=data.get('journal', ''),
            volume=data.get('volume', ''),
            issue=data.get('issue', ''),
            pages=data.get('pages', ''),
            doi=data.get('doi', ''),
            isbn=data.get('isbn', ''),
            publisher=data.get('publisher', ''),
            research_project_id=data.get('research_project_id', ''),
            faculty_ids=[faculty_id],  # Add creating faculty as an author
            keywords=data.get('keywords', []),
            citations=0,
            document_url=data.get('document_url', ''),
            created_at=timezone.now(),
            updated_at=timezone.now()
        )
        
        return JsonResponse({
            'success': True,
            'message': 'Publication created successfully',
            'publication': publication.to_json()
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to create publication: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["GET"])
@faculty_required
def get_publication_detail(request, publication_id):
    """Get details of a specific publication"""
    try:
        publication = Publication.objects.get(id=publication_id)
        
        # Verify faculty has access
        faculty_id = request.faculty.employee_id
        if publication.faculty_ids and isinstance(publication.faculty_ids, list):
            if faculty_id not in publication.faculty_ids:
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied'
                }, status=403)
        
        return JsonResponse({
            'success': True,
            'publication': publication.to_json()
        })
        
    except Publication.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Publication not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to fetch publication: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["PUT"])
@faculty_required
def update_publication(request, publication_id):
    """Update a publication"""
    try:
        publication = Publication.objects.get(id=publication_id)
        
        # Verify faculty has access
        faculty_id = request.faculty.employee_id
        if publication.faculty_ids and isinstance(publication.faculty_ids, list):
            if faculty_id not in publication.faculty_ids:
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied'
                }, status=403)
        
        data = json.loads(request.body)
        
        # Update fields
        if 'title' in data:
            publication.title = data['title']
        if 'authors' in data:
            publication.authors = data['authors']
        if 'abstract' in data:
            publication.abstract = data['abstract']
        if 'publication_date' in data:
            publication.publication_date = data['publication_date']
        if 'journal' in data:
            publication.journal = data['journal']
        if 'volume' in data:
            publication.volume = data['volume']
        if 'issue' in data:
            publication.issue = data['issue']
        if 'pages' in data:
            publication.pages = data['pages']
        if 'doi' in data:
            publication.doi = data['doi']
        if 'isbn' in data:
            publication.isbn = data['isbn']
        if 'publisher' in data:
            publication.publisher = data['publisher']
        if 'keywords' in data:
            publication.keywords = data['keywords']
        if 'document_url' in data:
            publication.document_url = data['document_url']
        
        publication.updated_at = timezone.now()
        publication.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Publication updated successfully',
            'publication': publication.to_json()
        })
        
    except Publication.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Publication not found'
        }, status=404)
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to update publication: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["DELETE"])
@faculty_required
def delete_publication(request, publication_id):
    """Delete a publication"""
    try:
        publication = Publication.objects.get(id=publication_id)
        
        # Verify faculty has access
        faculty_id = request.faculty.employee_id
        if publication.faculty_ids and isinstance(publication.faculty_ids, list):
            if faculty_id not in publication.faculty_ids:
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied'
                }, status=403)
        
        publication.delete()
        
        return JsonResponse({
            'success': True,
            'message': 'Publication deleted successfully'
        })
        
    except Publication.DoesNotExist:
        return JsonResponse({
            'success': False,
            'message': 'Publication not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to delete publication: {str(e)}'
        }, status=500)
