from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.core.mail import send_mail
import json
import uuid
from datetime import datetime, timedelta

# Simulated milestone data
# In a real implementation, this would come from a database model
MILESTONES = {}

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
def create_milestone(request):
    """Create a new milestone for a student"""
    if request.method == 'POST':
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
            # In a real implementation, you would verify this against student records
            # For now, we'll assume the faculty has access
            
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
            milestone_id = str(uuid.uuid4())
            milestone = {
                'id': milestone_id,
                'faculty_id': faculty_profile.employee_id,
                'student_id': data['student_id'],
                'name': data['name'],
                'description': data.get('description', ''),
                'category': data['category'],
                'priority': data.get('priority', 'medium'),
                'status': 'pending',
                'deadline': deadline.isoformat() if deadline else None,
                'completed_at': None,
                'created_at': timezone.now().isoformat(),
                'updated_at': timezone.now().isoformat(),
                'reminders_sent': 0,
                'notes': data.get('notes', '')
            }
            
            # Store milestone
            MILESTONES[milestone_id] = milestone
            
            # In a real implementation, you would schedule reminders here
            # schedule_milestone_reminders(milestone)
            
            return JsonResponse({
                'success': True,
                'message': 'Milestone created successfully',
                'data': milestone
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to create milestone'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_student_milestones(request, student_id):
    """Get all milestones for a specific student"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Filter milestones for this student and faculty
            student_milestones = [
                milestone for milestone in MILESTONES.values()
                if milestone['student_id'] == student_id and 
                   milestone['faculty_id'] == faculty_profile.employee_id
            ]
            
            # Apply filtering
            status_filter = request.GET.get('status')
            if status_filter:
                student_milestones = [
                    milestone for milestone in student_milestones
                    if milestone['status'] == status_filter
                ]
            
            category_filter = request.GET.get('category')
            if category_filter:
                student_milestones = [
                    milestone for milestone in student_milestones
                    if milestone['category'] == category_filter
                ]
            
            priority_filter = request.GET.get('priority')
            if priority_filter:
                student_milestones = [
                    milestone for milestone in student_milestones
                    if milestone['priority'] == priority_filter
                ]
            
            # Sort by deadline (if exists) or creation date
            student_milestones.sort(key=lambda x: x.get('deadline') or x['created_at'])
            
            return JsonResponse({
                'success': True,
                'data': student_milestones
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve milestones'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def update_milestone(request, milestone_id):
    """Update an existing milestone"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Check if milestone exists
            if milestone_id not in MILESTONES:
                return JsonResponse({
                    'success': False,
                    'message': 'Milestone not found'
                }, status=404)
            
            # Check if faculty has access to this milestone
            milestone = MILESTONES[milestone_id]
            if milestone['faculty_id'] != faculty_profile.employee_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied'
                }, status=403)
            
            # Update milestone fields
            updatable_fields = ['name', 'description', 'category', 'priority', 'status', 'notes']
            for field in updatable_fields:
                if field in data:
                    milestone[field] = data[field]
            
            # Handle deadline update
            if 'deadline' in data:
                try:
                    if data['deadline'] is None:
                        milestone['deadline'] = None
                    else:
                        deadline = datetime.fromisoformat(data['deadline'])
                        milestone['deadline'] = deadline.isoformat()
                except ValueError:
                    return JsonResponse({
                        'success': False,
                        'message': 'Invalid deadline format. Use ISO format (YYYY-MM-DDTHH:MM:SS) or null'
                    }, status=400)
            
            # Handle completion
            if 'status' in data and data['status'] == 'completed':
                milestone['completed_at'] = timezone.now().isoformat()
            
            # Update timestamp
            milestone['updated_at'] = timezone.now().isoformat()
            
            # Store updated milestone
            MILESTONES[milestone_id] = milestone
            
            return JsonResponse({
                'success': True,
                'message': 'Milestone updated successfully',
                'data': milestone
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to update milestone'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def delete_milestone(request, milestone_id):
    """Delete a milestone"""
    if request.method == 'DELETE':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Check if milestone exists
            if milestone_id not in MILESTONES:
                return JsonResponse({
                    'success': False,
                    'message': 'Milestone not found'
                }, status=404)
            
            # Check if faculty has access to this milestone
            milestone = MILESTONES[milestone_id]
            if milestone['faculty_id'] != faculty_profile.employee_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied'
                }, status=403)
            
            # Delete milestone
            del MILESTONES[milestone_id]
            
            return JsonResponse({
                'success': True,
                'message': 'Milestone deleted successfully'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to delete milestone'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_milestone_templates(request):
    """Get available milestone templates for different programs"""
    if request.method == 'GET':
        try:
            return JsonResponse({
                'success': True,
                'data': MILESTONE_TEMPLATES
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve milestone templates'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def create_milestone_from_template(request):
    """Create a milestone from a template"""
    if request.method == 'POST':
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
            milestone_id = str(uuid.uuid4())
            deadline = None
            if 'default_deadline_days' in template:
                deadline = timezone.now() + timedelta(days=template['default_deadline_days'])
            
            milestone = {
                'id': milestone_id,
                'faculty_id': faculty_profile.employee_id,
                'student_id': data['student_id'],
                'name': template['name'],
                'description': template['description'],
                'category': template['category'],
                'priority': template['priority'],
                'status': 'pending',
                'deadline': deadline.isoformat() if deadline else None,
                'completed_at': None,
                'created_at': timezone.now().isoformat(),
                'updated_at': timezone.now().isoformat(),
                'reminders_sent': 0,
                'notes': ''
            }
            
            # Store milestone
            MILESTONES[milestone_id] = milestone
            
            return JsonResponse({
                'success': True,
                'message': 'Milestone created from template successfully',
                'data': milestone
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to create milestone from template'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_upcoming_milestones(request):
    """Get upcoming milestones for all students advised by this faculty member"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Filter milestones for this faculty
            faculty_milestones = [
                milestone for milestone in MILESTONES.values()
                if milestone['faculty_id'] == faculty_profile.employee_id
            ]
            
            # Filter for upcoming milestones (not completed and has deadline)
            upcoming_milestones = [
                milestone for milestone in faculty_milestones
                if milestone['status'] != 'completed' and milestone['deadline']
            ]
            
            # Convert deadlines to datetime for comparison
            now = timezone.now()
            upcoming_milestones_with_dates = []
            for milestone in upcoming_milestones:
                try:
                    deadline = datetime.fromisoformat(milestone['deadline'])
                    # Add timezone info if missing
                    if deadline.tzinfo is None:
                        deadline = timezone.make_aware(deadline)
                    milestone['deadline_dt'] = deadline
                    upcoming_milestones_with_dates.append(milestone)
                except ValueError:
                    # Skip milestones with invalid deadline format
                    pass
            
            # Filter for milestones due within the next 30 days
            filtered_milestones = [
                milestone for milestone in upcoming_milestones_with_dates
                if milestone['deadline_dt'] <= now + timedelta(days=30)
            ]
            
            # Sort by deadline
            filtered_milestones.sort(key=lambda x: x['deadline_dt'])
            
            # Remove temporary deadline_dt field
            for milestone in filtered_milestones:
                del milestone['deadline_dt']
            
            return JsonResponse({
                'success': True,
                'data': filtered_milestones
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve upcoming milestones'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

def send_milestone_reminder(milestone):
    """Send a reminder for an upcoming milestone (simulated)"""
    # In a real implementation, this would send an email or notification
    # For now, we'll just increment the reminders counter
    milestone_id = milestone['id']
    if milestone_id in MILESTONES:
        MILESTONES[milestone_id]['reminders_sent'] += 1
        MILESTONES[milestone_id]['updated_at'] = timezone.now().isoformat()
    
    # Simulate sending email
    print(f"Reminder sent for milestone: {milestone['name']} (ID: {milestone_id})")
    return True