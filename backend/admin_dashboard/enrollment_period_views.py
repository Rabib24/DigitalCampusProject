from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from student.models import EnrollmentPeriod
import json
import uuid
from datetime import datetime


def check_admin_role(request):
    """Check if the authenticated user has admin role"""
    return hasattr(request, 'admin') and request.admin is not None


def parse_datetime(datetime_str):
    """Parse datetime string to datetime object"""
    if not datetime_str:
        return None
    
    # Clean up the datetime string
    cleaned_str = datetime_str.strip()
    
    # Handle various common formats
    formats_to_try = [
        '%Y-%m-%dT%H:%M:%S',  # ISO format
        '%Y-%m-%d %H:%M:%S',  # Standard format
        '%Y-%m-%d',           # Date only
        '%m.%d.%Y %H:%M%p',   # User format: 12.9.2025 10.00AM
        '%m.%d.%Y %H.%M%p',   # User format: 12.9.2025 10.00AM
        '%m.%d.%Y %H:%M %p',  # With space before AM/PM
        '%m.%d.%Y %H.%M %p',  # With space before AM/PM
        '%m/%d/%Y %H:%M%p',   # Alternative with slashes
        '%m/%d/%Y %H.%M%p',   # Alternative with slashes
        '%m/%d/%Y %H:%M %p',  # Alternative with slashes and space
        '%m/%d/%Y %H.%M %p',  # Alternative with slashes and space
    ]
    
    # Try ISO format first
    try:
        if 'T' in cleaned_str:
            return datetime.fromisoformat(cleaned_str.replace('Z', '+00:00'))
        else:
            # Try parsing date only format
            return datetime.fromisoformat(cleaned_str)
    except ValueError:
        pass
    
    # Try other formats
    for fmt in formats_to_try:
        try:
            # Handle lowercase am/pm
            test_str = cleaned_str.replace('am', 'AM').replace('pm', 'PM')
            # Handle case where minutes might be omitted
            if '%H:%M' in fmt and ':' not in test_str.split()[-1]:
                # If format expects : but input has ., convert it
                time_part = test_str.split()[-1]
                if '.' in time_part and ':' not in time_part:
                    time_part = time_part.replace('.', ':')
                    test_str = ' '.join(test_str.split()[:-1] + [time_part])
            return datetime.strptime(test_str, fmt)
        except ValueError:
            continue
    
    # If all else fails, raise an exception
    raise ValueError(f"Unable to parse datetime string: {datetime_str}")


@csrf_exempt
def get_enrollment_periods(request):
    """Get all enrollment periods"""
    if request.method == 'GET':
        try:
            if not check_admin_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            periods = EnrollmentPeriod.objects.all().order_by('-start_date')
            data = [period.to_json() for period in periods]
            
            return JsonResponse({'success': True, 'data': data})
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to fetch enrollment periods: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def create_enrollment_period(request):
    """Create a new enrollment period"""
    if request.method == 'POST':
        try:
            if not check_admin_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'success': False, 'message': 'Invalid JSON data'}, status=400)
            
            name = data.get('name')
            start_date_str = data.get('start_date')
            end_date_str = data.get('end_date')
            description = data.get('description', '')
            student_group = data.get('student_group', '')
            is_active = data.get('is_active', True)
            
            if not name or not start_date_str or not end_date_str:
                return JsonResponse({'success': False, 'message': 'Name, start date, and end date are required'}, status=400)
            
            # Parse datetime values
            try:
                start_date = parse_datetime(start_date_str)
                end_date = parse_datetime(end_date_str)
                
                if start_date >= end_date:
                    return JsonResponse({'success': False, 'message': 'End date must be after start date'}, status=400)
            except Exception as e:
                return JsonResponse({'success': False, 'message': f'Error parsing dates: {str(e)}'}, status=400)
            
            period = EnrollmentPeriod(
                id=str(uuid.uuid4()),
                name=name,
                description=description,
                start_date=start_date,
                end_date=end_date,
                student_group=student_group,
                is_active=is_active
            )
            period.save()
            
            return JsonResponse({'success': True, 'message': 'Enrollment period created successfully', 'data': period.to_json()})
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to create enrollment period: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def update_enrollment_period(request, period_id):
    """Update an existing enrollment period"""
    if request.method == 'PUT':
        try:
            if not check_admin_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'success': False, 'message': 'Invalid JSON data'}, status=400)
            
            try:
                period = EnrollmentPeriod.objects.get(id=period_id)
            except EnrollmentPeriod.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Enrollment period not found'}, status=404)
            
            # Update fields
            if 'name' in data:
                period.name = data['name']
            if 'description' in data:
                period.description = data['description']
            if 'start_date' in data:
                try:
                    period.start_date = parse_datetime(data['start_date'])
                except Exception as e:
                    return JsonResponse({'success': False, 'message': f'Error parsing start date: {str(e)}'}, status=400)
            if 'end_date' in data:
                try:
                    period.end_date = parse_datetime(data['end_date'])
                except Exception as e:
                    return JsonResponse({'success': False, 'message': f'Error parsing end date: {str(e)}'}, status=400)
            if 'student_group' in data:
                period.student_group = data['student_group']
            if 'is_active' in data:
                period.is_active = data['is_active']
            
            # Validate date relationship
            if period.start_date >= period.end_date:
                return JsonResponse({'success': False, 'message': 'End date must be after start date'}, status=400)
            
            period.save()
            
            return JsonResponse({'success': True, 'message': 'Enrollment period updated successfully', 'data': period.to_json()})
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to update enrollment period: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def delete_enrollment_period(request, period_id):
    """Delete an enrollment period"""
    if request.method == 'DELETE':
        try:
            if not check_admin_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            try:
                period = EnrollmentPeriod.objects.get(id=period_id)
            except EnrollmentPeriod.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Enrollment period not found'}, status=404)
            
            period.delete()
            
            return JsonResponse({'success': True, 'message': 'Enrollment period deleted successfully'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': f'Failed to delete enrollment period: {str(e)}'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)