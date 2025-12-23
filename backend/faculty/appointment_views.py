"""
Faculty Appointment Management Views
Handles appointment scheduling and management for faculty advising
"""

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from appointments.models import Appointment
from users.models import User
from .decorators import faculty_required
import json
import uuid
from datetime import datetime


@csrf_exempt
@require_http_methods(["GET"])
@faculty_required
def get_appointments(request):
    """Get all appointments for the faculty member"""
    try:
        faculty_id = request.faculty.user_id
        
        # Get all appointments for this faculty member
        appointments = Appointment.objects.filter(faculty_id=faculty_id).order_by('-start_datetime')
        
        # Convert to JSON format
        appointments_data = []
        for appointment in appointments:
            # Get student information
            try:
                student = User.objects.get(user_id=appointment.student_id)
                student_info = {
                    'id': student.user_id,
                    'studentId': student.user_id,
                    'firstName': student.first_name,
                    'lastName': student.last_name,
                    'email': student.email,
                    'program': getattr(student, 'program', 'Unknown'),
                    'year': getattr(student, 'year', 0),
                    'gpa': getattr(student, 'gpa', 0.0)
                }
            except User.DoesNotExist:
                student_info = {
                    'id': appointment.student_id,
                    'studentId': appointment.student_id,
                    'firstName': 'Unknown',
                    'lastName': 'Student',
                    'email': '',
                    'program': 'Unknown',
                    'year': 0,
                    'gpa': 0.0
                }
            
            appointments_data.append({
                'id': appointment.id,
                'advisee': student_info,
                'date': appointment.start_datetime.strftime('%Y-%m-%d'),
                'time': appointment.start_datetime.strftime('%H:%M'),
                'duration': int((appointment.end_datetime - appointment.start_datetime).total_seconds() / 60),
                'type': 'academic',  # Default type
                'status': appointment.status,
                'notes': appointment.notes,
                'location': appointment.location,
                'title': appointment.title,
                'description': appointment.description
            })
        
        return JsonResponse({
            'success': True,
            'appointments': appointments_data
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to fetch appointments: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
@faculty_required
def create_appointment(request):
    """Create a new appointment"""
    try:
        data = json.loads(request.body)
        faculty_id = request.faculty.user_id
        
        # Validate required fields
        required_fields = ['student_id', 'date', 'time', 'duration', 'title']
        for field in required_fields:
            if field not in data:
                return JsonResponse({
                    'success': False,
                    'message': f'Missing required field: {field}'
                }, status=400)
        
        # Parse date and time
        try:
            start_datetime = datetime.strptime(f"{data['date']} {data['time']}", '%Y-%m-%d %H:%M')
            duration_minutes = int(data['duration'])
            end_datetime = start_datetime + timezone.timedelta(minutes=duration_minutes)
        except ValueError as e:
            return JsonResponse({
                'success': False,
                'message': f'Invalid date/time format: {str(e)}'
            }, status=400)
        
        # Create appointment
        appointment = Appointment(
            id=str(uuid.uuid4()),
            faculty_id=faculty_id,
            student_id=data['student_id'],
            title=data['title'],
            description=data.get('description', ''),
            start_datetime=start_datetime,
            end_datetime=end_datetime,
            location=data.get('location', ''),
            status='scheduled',
            notes=data.get('notes', '')
        )
        appointment.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Appointment created successfully',
            'appointment': appointment.to_json()
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to create appointment: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["PUT"])
@faculty_required
def update_appointment(request, appointment_id):
    """Update an existing appointment"""
    try:
        data = json.loads(request.body)
        faculty_id = request.faculty.user_id
        
        # Get appointment
        try:
            appointment = Appointment.objects.get(id=appointment_id, faculty_id=faculty_id)
        except Appointment.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Appointment not found'
            }, status=404)
        
        # Update fields
        if 'title' in data:
            appointment.title = data['title']
        if 'description' in data:
            appointment.description = data['description']
        if 'location' in data:
            appointment.location = data['location']
        if 'notes' in data:
            appointment.notes = data['notes']
        
        # Update date/time if provided
        if 'date' in data and 'time' in data:
            try:
                start_datetime = datetime.strptime(f"{data['date']} {data['time']}", '%Y-%m-%d %H:%M')
                duration_minutes = int(data.get('duration', 30))
                appointment.start_datetime = start_datetime
                appointment.end_datetime = start_datetime + timezone.timedelta(minutes=duration_minutes)
            except ValueError as e:
                return JsonResponse({
                    'success': False,
                    'message': f'Invalid date/time format: {str(e)}'
                }, status=400)
        
        appointment.updated_at = timezone.now()
        appointment.save()
        
        return JsonResponse({
            'success': True,
            'message': 'Appointment updated successfully',
            'appointment': appointment.to_json()
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to update appointment: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["DELETE"])
@faculty_required
def delete_appointment(request, appointment_id):
    """Delete an appointment"""
    try:
        faculty_id = request.faculty.user_id
        
        # Get and delete appointment
        try:
            appointment = Appointment.objects.get(id=appointment_id, faculty_id=faculty_id)
            appointment.delete()
            
            return JsonResponse({
                'success': True,
                'message': 'Appointment deleted successfully'
            })
        except Appointment.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Appointment not found'
            }, status=404)
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to delete appointment: {str(e)}'
        }, status=500)


@csrf_exempt
@require_http_methods(["PUT"])
@faculty_required
def update_appointment_status(request, appointment_id):
    """Update appointment status (complete, cancel, no-show)"""
    try:
        data = json.loads(request.body)
        faculty_id = request.faculty.user_id
        
        # Get appointment
        try:
            appointment = Appointment.objects.get(id=appointment_id, faculty_id=faculty_id)
        except Appointment.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Appointment not found'
            }, status=404)
        
        # Update status
        status = data.get('status')
        if status == 'completed':
            appointment.complete()
        elif status == 'cancelled':
            appointment.cancel()
        elif status == 'no-show':
            appointment.mark_no_show()
        else:
            return JsonResponse({
                'success': False,
                'message': 'Invalid status'
            }, status=400)
        
        return JsonResponse({
            'success': True,
            'message': f'Appointment marked as {status}',
            'appointment': appointment.to_json()
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': f'Failed to update appointment status: {str(e)}'
        }, status=500)
