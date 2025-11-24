from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.core.mail import send_mail
import json
import uuid
from datetime import datetime, timedelta
from .models import Milestone
from .decorators import faculty_required
from users.models import Student, Faculty

# Default milestone templates for different programs
MILESTONE_TEMPLATES = {
    'computer_science_bs': [
        {
            'id': 'cs_advising_1',
            'name': 'First Academic Advising Session',
            'description': 'Initial meeting with academic advisor to discuss degree plan',
            'timing': 'Before completing 30 credits',
            'category': 'advising',
            'priority': 'high',
            'default_deadline_days': 30
        },
        {
            'id': 'cs_course_planning',
            'name': 'Course Planning for Next Year',
            'description': 'Plan courses for the upcoming academic year',
            'timing': 'Before registration period',
            'category': 'planning',
            'priority': 'medium',
            'default_deadline_days': 60
        },
        {
            'id': 'cs_research_opportunity',
            'name': 'Research Project Initiation',
            'description': 'Identify and begin work on a research project with faculty',
            'timing': 'Before Junior year',
            'category': 'research',
            'priority': 'low',
            'default_deadline_days': 180
        }
    ],
    'mathematics_bs': [
        {
            'id': 'math_advising_1',
            'name': 'First Academic Advising Session',
            'description': 'Initial meeting with academic advisor to discuss degree plan',
            'timing': 'Before completing 30 credits',
            'category': 'advising',
            'priority': 'high',
            'default_deadline_days': 30
        },
        {
            'id': 'math_course_planning',
            'name': 'Course Planning for Next Year',
            'description': 'Plan courses for the upcoming academic year',
            'timing': 'Before registration period',
            'category': 'planning',
            'priority': 'medium',
            'default_deadline_days': 60
        }
    ]
}

@csrf_exempt
@faculty_required
def create_milestone(request):
    """Create a new milestone for a student"""
    if request.method != 'POST':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        data = json.loads(request.body)
        
        # Get faculty from request (attached by middleware)
        faculty_profile = request.faculty
        
        # Validate required fields
        required_fields = ['student_id', 'name', 'category']
        for field in required_fields:
            if field not in data:
                return JsonResponse({
                    'success': False,
                    'message': f'Missing required field: {field}'
                }, status=400)
        
        # Check if student is advised by this faculty member
        try:
            student = Student.objects.get(student_id=data['student_id'], advisor_id=faculty_profile.employee_id)
        except Student.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Student not found or not advised by you'
            }, status=404)
        
        # Parse deadline if provided
        deadline = None
        if 'deadline' in data:
            try:
                deadline = datetime.fromisoformat(data['deadline'])
            except ValueError:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid deadline format. Use ISO format (YYYY-MM-DDTHH:MM:SS)'
                }, status=400)
        
        # Create milestone
        milestone = Milestone.objects.create(
            faculty=faculty_profile,
            student=student,
            name=data['name'],
            description=data.get('description', ''),
            category=data['category'],
            priority=data.get('priority', 'medium'),
            status=data.get('status', 'pending'),
            notes=data.get('notes', ''),
            deadline=deadline
        )
        
        return JsonResponse({
            'success': True,
            'message': 'Milestone created successfully',
            'data': milestone.to_json()
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'Failed to create milestone'
        }, status=500)

@csrf_exempt
@faculty_required
def get_student_milestones(request, student_id):
    """Get all milestones for a specific student"""
    if request.method != 'GET':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        # Get faculty from request (attached by middleware)
        faculty_profile = request.faculty
        
        # Check if student is advised by this faculty member
        try:
            student = Student.objects.get(student_id=student_id, advisor_id=faculty_profile.employee_id)
        except Student.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Student not found or not advised by you'
            }, status=404)
        
        # Get milestones for this student and faculty
        milestones = Milestone.objects.filter(student=student, faculty=faculty_profile)
        
        # Apply filtering
        status_filter = request.GET.get('status')
        if status_filter:
            milestones = milestones.filter(status=status_filter)
        
        category_filter = request.GET.get('category')
        if category_filter:
            milestones = milestones.filter(category=category_filter)
        
        priority_filter = request.GET.get('priority')
        if priority_filter:
            milestones = milestones.filter(priority=priority_filter)
        
        # Sort by deadline (if exists) or creation date
        milestones = milestones.order_by('deadline', 'created_at')
        
        # Convert to JSON
        milestones_data = [milestone.to_json() for milestone in milestones]
        
        return JsonResponse({
            'success': True,
            'data': milestones_data
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'Failed to retrieve milestones'
        }, status=500)

@csrf_exempt
@faculty_required
def update_milestone(request, milestone_id):
    """Update an existing milestone"""
    if request.method != 'PUT':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        # Get faculty from request (attached by middleware)
        faculty_profile = request.faculty
        
        # Get milestone
        try:
            milestone = Milestone.objects.get(id=milestone_id, faculty=faculty_profile)
        except Milestone.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Milestone not found'
            }, status=404)
        
        data = json.loads(request.body)
        
        # Updateable fields
        updatable_fields = [
            'name', 'description', 'category', 'priority', 'status',
            'notes', 'deadline'
        ]
        
        for field in updatable_fields:
            if field in data:
                if field == 'deadline' and data[field]:
                    try:
                        setattr(milestone, field, datetime.fromisoformat(data[field]))
                    except ValueError:
                        return JsonResponse({
                            'success': False,
                            'message': 'Invalid deadline format. Use ISO format (YYYY-MM-DDTHH:MM:SS)'
                        }, status=400)
                elif field == 'deadline' and data[field] is None:
                    setattr(milestone, field, None)
                else:
                    setattr(milestone, field, data[field])
        
        # Handle completion
        if 'status' in data and data['status'] == 'completed' and milestone.completed_at is None:
            milestone.completed_at = timezone.now()
        elif 'status' in data and data['status'] != 'completed':
            milestone.completed_at = None
        
        milestone.updated_at = timezone.now()
        milestone.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Milestone updated successfully',
            'data': milestone.to_json()
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'Failed to update milestone'
        }, status=500)

@csrf_exempt
@faculty_required
def delete_milestone(request, milestone_id):
    """Delete a milestone"""
    if request.method != 'DELETE':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        # Get faculty from request (attached by middleware)
        faculty_profile = request.faculty
        
        # Get milestone
        try:
            milestone = Milestone.objects.get(id=milestone_id, faculty=faculty_profile)
        except Milestone.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Milestone not found'
            }, status=404)
        
        milestone_data = milestone.to_json()
        milestone.delete()
        
        return JsonResponse({
            'success': True,
            'message': 'Milestone deleted successfully',
            'data': milestone_data
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'Failed to delete milestone'
        }, status=500)

@csrf_exempt
@faculty_required
def get_milestone_detail(request, milestone_id):
    """Get detailed information for a specific milestone"""
    if request.method != 'GET':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        # Get faculty from request (attached by middleware)
        faculty_profile = request.faculty
        
        # Get milestone
        try:
            milestone = Milestone.objects.get(id=milestone_id, faculty=faculty_profile)
        except Milestone.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Milestone not found'
            }, status=404)
        
        return JsonResponse({
            'success': True,
            'data': milestone.to_json()
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'Failed to fetch milestone details'
        }, status=500)

@csrf_exempt
@faculty_required
def complete_milestone(request, milestone_id):
    """Mark a milestone as completed"""
    if request.method != 'POST':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        # Get faculty from request (attached by middleware)
        faculty_profile = request.faculty
        
        # Get milestone
        try:
            milestone = Milestone.objects.get(id=milestone_id, faculty=faculty_profile)
        except Milestone.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Milestone not found'
            }, status=404)
        
        # Mark as completed
        milestone.status = 'completed'
        milestone.completed_at = timezone.now()
        milestone.updated_at = timezone.now()
        milestone.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Milestone marked as completed',
            'data': milestone.to_json()
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'Failed to complete milestone'
        }, status=500)

@csrf_exempt
@faculty_required
def create_milestone_from_template(request):
    """Create a milestone from a template"""
    if request.method != 'POST':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        data = json.loads(request.body)
        
        # Get faculty from request (attached by middleware)
        faculty_profile = request.faculty
        
        # Validate required fields
        required_fields = ['student_id', 'template_id', 'program']
        for field in required_fields:
            if field not in data:
                return JsonResponse({
                    'success': False,
                    'message': f'Missing required field: {field}'
                }, status=400)
        
        # Check if student is advised by this faculty member
        try:
            student = Student.objects.get(student_id=data['student_id'], advisor_id=faculty_profile.employee_id)
        except Student.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Student not found or not advised by you'
            }, status=404)
        
        # Find template
        program = data['program']
        template_id = data['template_id']
        
        if program not in MILESTONE_TEMPLATES:
            return JsonResponse({
                'success': False,
                'message': f'Program {program} not found'
            }, status=404)
        
        template = None
        for t in MILESTONE_TEMPLATES[program]:
            if t['id'] == template_id:
                template = t
                break
        
        if not template:
            return JsonResponse({
                'success': False,
                'message': f'Template {template_id} not found for program {program}'
            }, status=404)
        
        # Create milestone from template
        deadline = None
        if 'default_deadline_days' in template:
            deadline = timezone.now() + timedelta(days=template['default_deadline_days'])
        
        milestone = Milestone.objects.create(
            faculty=faculty_profile,
            student=student,
            name=template['name'],
            description=template['description'],
            category=template['category'],
            priority=template['priority'],
            status='pending',
            deadline=deadline,
            notes=''
        )
        
        return JsonResponse({
            'success': True,
            'message': 'Milestone created from template successfully',
            'data': milestone.to_json()
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'Failed to create milestone from template'
        }, status=500)

@csrf_exempt
@faculty_required
def get_milestone_templates(request, program):
    """Get milestone templates for a specific program"""
    if request.method != 'GET':
        return JsonResponse({
            'success': False,
            'message': 'Method not allowed'
        }, status=405)
    
    try:
        if program not in MILESTONE_TEMPLATES:
            return JsonResponse({
                'success': False,
                'message': f'Program {program} not found'
            }, status=404)
        
        return JsonResponse({
            'success': True,
            'templates': MILESTONE_TEMPLATES[program]
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': 'Failed to fetch milestone templates'
        }, status=500)