from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json
import uuid
from datetime import datetime, timedelta
import pytz

# Simulated appointment data
# In a real implementation, this would come from a database model
APPOINTMENTS = {}

@csrf_exempt
def create_appointment(request):
    """Create a new appointment"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Validate required fields
            required_fields = ['student_id', 'start_time', 'duration_minutes', 'type']
            for field in required_fields:
                if field not in data:
                    return JsonResponse({
                        'success': False,
                        'message': f'Missing required field: {field}'
                    }, status=400)
            
            # Parse start time
            try:
                start_time = datetime.fromisoformat(data['start_time'])
            except ValueError:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid start_time format. Use ISO format (YYYY-MM-DDTHH:MM:SS)'
                }, status=400)
            
            # Check for conflicts
            conflict = check_appointment_conflict(
                faculty_profile.employee_id,
                start_time,
                data['duration_minutes'],
                data.get('student_id')
            )
            
            if conflict:
                return JsonResponse({
                    'success': False,
                    'message': 'Appointment conflict detected',
                    'conflict': conflict
                }, status=409)
            
            # Create appointment
            appointment_id = str(uuid.uuid4())
            appointment = {
                'id': appointment_id,
                'faculty_id': faculty_profile.employee_id,
                'student_id': data['student_id'],
                'start_time': start_time.isoformat(),
                'duration_minutes': data['duration_minutes'],
                'type': data['type'],
                'title': data.get('title', f'{data["type"]} Appointment'),
                'description': data.get('description', ''),
                'location': data.get('location', 'Online'),
                'status': 'scheduled',
                'created_at': timezone.now().isoformat(),
                'updated_at': timezone.now().isoformat()
            }
            
            # Store appointment
            APPOINTMENTS[appointment_id] = appointment
            
            # In a real implementation, you would send notifications here
            # send_appointment_notification(appointment)
            
            return JsonResponse({
                'success': True,
                'message': 'Appointment created successfully',
                'data': appointment
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to create appointment'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

def check_appointment_conflict(faculty_id, start_time, duration_minutes, student_id=None):
    """Check for appointment conflicts"""
    end_time = start_time + timedelta(minutes=duration_minutes)
    
    for appointment in APPOINTMENTS.values():
        # Check if this appointment is with the same faculty
        if appointment['faculty_id'] != faculty_id:
            continue
            
        # Skip cancelled appointments
        if appointment['status'] == 'cancelled':
            continue
            
        # Parse appointment times
        appt_start = datetime.fromisoformat(appointment['start_time'])
        appt_end = appt_start + timedelta(minutes=appointment['duration_minutes'])
        
        # Check for time overlap
        if (start_time < appt_end and end_time > appt_start):
            return {
                'conflicting_appointment_id': appointment['id'],
                'conflicting_start_time': appointment['start_time'],
                'conflicting_end_time': appt_end.isoformat()
            }
    
    return None

@csrf_exempt
def get_faculty_appointments(request):
    """Get all appointments for the authenticated faculty member"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Filter appointments for this faculty member
            faculty_appointments = [
                appointment for appointment in APPOINTMENTS.values()
                if appointment['faculty_id'] == faculty_profile.employee_id
            ]
            
            # Apply filtering
            status_filter = request.GET.get('status')
            if status_filter:
                faculty_appointments = [
                    appt for appt in faculty_appointments
                    if appt['status'] == status_filter
                ]
            
            type_filter = request.GET.get('type')
            if type_filter:
                faculty_appointments = [
                    appt for appt in faculty_appointments
                    if appt['type'] == type_filter
                ]
            
            # Apply date range filtering
            from_date = request.GET.get('from_date')
            to_date = request.GET.get('to_date')
            if from_date:
                from_datetime = datetime.fromisoformat(from_date)
                faculty_appointments = [
                    appt for appt in faculty_appointments
                    if datetime.fromisoformat(appt['start_time']) >= from_datetime
                ]
            if to_date:
                to_datetime = datetime.fromisoformat(to_date)
                faculty_appointments = [
                    appt for appt in faculty_appointments
                    if datetime.fromisoformat(appt['start_time']) <= to_datetime
                ]
            
            # Sort by start time
            faculty_appointments.sort(key=lambda x: x['start_time'])
            
            return JsonResponse({
                'success': True,
                'data': faculty_appointments
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve appointments'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_appointment_detail(request, appointment_id):
    """Get detailed information for a specific appointment"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get appointment
            appointment = APPOINTMENTS.get(appointment_id)
            if not appointment:
                return JsonResponse({
                    'success': False,
                    'message': 'Appointment not found'
                }, status=404)
            
            # Verify faculty owns this appointment
            if appointment['faculty_id'] != faculty_profile.employee_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied - you do not own this appointment'
                }, status=403)
            
            return JsonResponse({
                'success': True,
                'data': appointment
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve appointment details'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def update_appointment(request, appointment_id):
    """Update an existing appointment"""
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get appointment
            appointment = APPOINTMENTS.get(appointment_id)
            if not appointment:
                return JsonResponse({
                    'success': False,
                    'message': 'Appointment not found'
                }, status=404)
            
            # Verify faculty owns this appointment
            if appointment['faculty_id'] != faculty_profile.employee_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied - you do not own this appointment'
                }, status=403)
            
            # Check if appointment is already completed or cancelled
            if appointment['status'] in ['completed', 'cancelled']:
                return JsonResponse({
                    'success': False,
                    'message': f'Cannot update appointment with status: {appointment["status"]}'
                }, status=400)
            
            # Validate and update fields
            updatable_fields = [
                'start_time', 'duration_minutes', 'type', 'title', 
                'description', 'location', 'status'
            ]
            
            # Check for conflicts if time is being changed
            if 'start_time' in data or 'duration_minutes' in data:
                start_time = datetime.fromisoformat(data.get('start_time', appointment['start_time']))
                duration_minutes = data.get('duration_minutes', appointment['duration_minutes'])
                
                conflict = check_appointment_conflict(
                    faculty_profile.employee_id,
                    start_time,
                    duration_minutes,
                    appointment['student_id']
                )
                
                if conflict and conflict['conflicting_appointment_id'] != appointment_id:
                    return JsonResponse({
                        'success': False,
                        'message': 'Appointment conflict detected',
                        'conflict': conflict
                    }, status=409)
            
            # Update appointment fields
            for field in updatable_fields:
                if field in data:
                    if field == 'start_time':
                        try:
                            appointment[field] = datetime.fromisoformat(data[field]).isoformat()
                        except ValueError:
                            return JsonResponse({
                                'success': False,
                                'message': 'Invalid start_time format. Use ISO format (YYYY-MM-DDTHH:MM:SS)'
                            }, status=400)
                    else:
                        appointment[field] = data[field]
            
            # Update timestamp
            appointment['updated_at'] = timezone.now().isoformat()
            
            # Store updated appointment
            APPOINTMENTS[appointment_id] = appointment
            
            return JsonResponse({
                'success': True,
                'message': 'Appointment updated successfully',
                'data': appointment
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to update appointment'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def cancel_appointment(request, appointment_id):
    """Cancel an appointment"""
    if request.method == 'DELETE':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get appointment
            appointment = APPOINTMENTS.get(appointment_id)
            if not appointment:
                return JsonResponse({
                    'success': False,
                    'message': 'Appointment not found'
                }, status=404)
            
            # Verify faculty owns this appointment
            if appointment['faculty_id'] != faculty_profile.employee_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied - you do not own this appointment'
                }, status=403)
            
            # Check if appointment is already completed or cancelled
            if appointment['status'] in ['completed', 'cancelled']:
                return JsonResponse({
                    'success': False,
                    'message': f'Cannot cancel appointment with status: {appointment["status"]}'
                }, status=400)
            
            # Cancel appointment
            appointment['status'] = 'cancelled'
            appointment['updated_at'] = timezone.now().isoformat()
            
            # Store updated appointment
            APPOINTMENTS[appointment_id] = appointment
            
            # In a real implementation, you would send cancellation notifications here
            # send_cancellation_notification(appointment)
            
            return JsonResponse({
                'success': True,
                'message': 'Appointment cancelled successfully',
                'data': appointment
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to cancel appointment'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_appointment_types(request):
    """Get available appointment types and their default durations"""
    if request.method == 'GET':
        try:
            # In a real implementation, this would come from a database
            appointment_types = [
                {
                    'type': 'advising',
                    'name': 'Academic Advising',
                    'default_duration': 30,
                    'description': 'General academic advising session'
                },
                {
                    'type': 'course-planning',
                    'name': 'Course Planning',
                    'default_duration': 45,
                    'description': 'Course selection and planning session'
                },
                {
                    'type': 'research',
                    'name': 'Research Discussion',
                    'default_duration': 60,
                    'description': 'Research project discussion'
                },
                {
                    'type': 'thesis',
                    'name': 'Thesis Advising',
                    'default_duration': 60,
                    'description': 'Thesis progress discussion'
                }
            ]
            
            return JsonResponse({
                'success': True,
                'data': appointment_types
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve appointment types'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_faculty_availability(request):
    """Get faculty availability for scheduling appointments"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # In a real implementation, this would come from a faculty availability model
            # For now, we'll simulate some availability data
            availability = {
                'faculty_id': faculty_profile.employee_id,
                'availability_slots': [
                    {
                        'day': 'Monday',
                        'start_time': '09:00',
                        'end_time': '12:00'
                    },
                    {
                        'day': 'Tuesday',
                        'start_time': '14:00',
                        'end_time': '17:00'
                    },
                    {
                        'day': 'Wednesday',
                        'start_time': '09:00',
                        'end_time': '12:00'
                    },
                    {
                        'day': 'Thursday',
                        'start_time': '14:00',
                        'end_time': '17:00'
                    },
                    {
                        'day': 'Friday',
                        'start_time': '09:00',
                        'end_time': '11:00'
                    }
                ],
                'default_duration': 30,
                'buffer_time': 15  # Minutes between appointments
            }
            
            return JsonResponse({
                'success': True,
                'data': availability
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve faculty availability'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)