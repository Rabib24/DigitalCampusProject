from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.db.models import Q
import json

from .models import EthicsApplication
from .decorators import faculty_required

@csrf_exempt
@faculty_required
def get_ethics_applications(request):
    """Return all ethics applications owned by the authenticated faculty officer."""
    try:
        applications = EthicsApplication.objects.filter(faculty=request.faculty)
        payload = [application.to_json() for application in applications]
        return JsonResponse({'success': True, 'applications': payload})
    except Exception:
        return JsonResponse({'success': False, 'message': 'Failed to fetch ethics applications'}, status=500)

@csrf_exempt
@faculty_required
def get_ethics_application_detail(request, application_id):
    try:
        application = EthicsApplication.objects.get(id=application_id, faculty=request.faculty)
        return JsonResponse({'success': True, 'application': application.to_json()})
    except EthicsApplication.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Ethics application not found'}, status=404)
    except Exception:
        return JsonResponse({'success': False, 'message': 'Failed to fetch application details'}, status=500)

@csrf_exempt
@faculty_required
def create_ethics_application(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    try:
        data = json.loads(request.body)
        application = EthicsApplication.objects.create(
            faculty=request.faculty,
            title=data.get('title', ''),
            principal_investigator=data.get('principal_investigator', ''),
            department=data.get('department', ''),
            submission_date=data.get('submission_date', timezone.now().date()),
            status=data.get('status', 'submitted'),
            protocol_number=data.get('protocol_number', ''),
            risk_level=data.get('risk_level', 'minimal'),
            project_description=data.get('project_description', ''),
            consent_process=data.get('consent_process', ''),
            data_management=data.get('data_management', ''),
            documents=data.get('documents', [])
        )
        return JsonResponse({
            'success': True,
            'message': 'Ethics application created successfully',
            'application': application.to_json()
        })
    except Exception:
        return JsonResponse({'success': False, 'message': 'Failed to create ethics application'}, status=500)

@csrf_exempt
@faculty_required
def update_ethics_application(request, application_id):
    if request.method != 'PUT':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    try:
        application = EthicsApplication.objects.get(id=application_id, faculty=request.faculty)
        data = json.loads(request.body)
        updatable = [
            'title', 'principal_investigator', 'department', 'review_date', 'status',
            'protocol_number', 'risk_level', 'project_description', 'consent_process',
            'data_management', 'documents'
        ]
        for field in updatable:
            if field in data:
                setattr(application, field, data[field])
        application.save()
        return JsonResponse({'success': True, 'message': 'Ethics application updated successfully', 'application': application.to_json()})
    except EthicsApplication.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Ethics application not found'}, status=404)
    except Exception:
        return JsonResponse({'success': False, 'message': 'Failed to update ethics application'}, status=500)

@csrf_exempt
@faculty_required
def delete_ethics_application(request, application_id):
    if request.method != 'DELETE':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    try:
        application = EthicsApplication.objects.get(id=application_id, faculty=request.faculty)
        application_json = application.to_json()
        application.delete()
        return JsonResponse({'success': True, 'message': 'Ethics application deleted successfully', 'application': application_json})
    except EthicsApplication.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Ethics application not found'}, status=404)
    except Exception:
        return JsonResponse({'success': False, 'message': 'Failed to delete ethics application'}, status=500)

@csrf_exempt
@faculty_required
def search_ethics_applications(request):
    try:
        data = json.loads(request.body) if request.body else {}
        search_term = data.get('search_term', '').strip()
        status = data.get('status', '').strip()
        risk_level = data.get('risk_level', '').strip()

        applications = EthicsApplication.objects.filter(faculty=request.faculty)
        if search_term:
            applications = applications.filter(
                Q(title__icontains=search_term) |
                Q(principal_investigator__icontains=search_term) |
                Q(department__icontains=search_term)
            )
        if status:
            applications = applications.filter(status__iexact=status)
        if risk_level:
            applications = applications.filter(risk_level__iexact=risk_level)

        payload = [application.to_json() for application in applications]
        return JsonResponse({'success': True, 'applications': payload})
    except Exception:
        return JsonResponse({'success': False, 'message': 'Failed to search ethics applications'}, status=500)

@csrf_exempt
@faculty_required
def upload_ethics_document(request, application_id):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)
    try:
        application = EthicsApplication.objects.get(id=application_id, faculty=request.faculty)
        data = json.loads(request.body)
        documents = application.documents or []
        next_doc_id = str(max((int(doc.get('id', 0)) for doc in documents), default=0) + 1)
        new_document = {
            'id': next_doc_id,
            'name': data.get('name', ''),
            'type': data.get('type', ''),
            'size': data.get('size', '')
        }
        documents.append(new_document)
        application.documents = documents
        application.save(update_fields=['documents'])
        return JsonResponse({'success': True, 'message': 'Document uploaded successfully', 'document': new_document})
    except EthicsApplication.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Ethics application not found'}, status=404)
    except Exception:
        return JsonResponse({'success': False, 'message': 'Failed to upload document'}, status=500)