from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import EnrollmentPeriod
from django.utils import timezone
import json
import uuid


def check_admin_role(request):
    """Check if the authenticated user has admin role"""
    return hasattr(request, 'admin') and request.admin is not None


@csrf_exempt
def create_enrollment_period(request):
    """Create a new enrollment period"""
    if request.method == 'POST':
        try:
            # Check if user has admin role
            if not check_admin_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Parse JSON data from request body
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'success': False, 'message': 'Invalid JSON data'}, status=400)
            
            # Extract required fields
            name = data.get('name')
            start_date = data.get('start_date')
            end_date = data.get('end_date')
            
            # Validate required fields
            if not name or not start_date or not end_date:
                return JsonResponse({
                    'success': False, 
                    'message': 'Name, start_date, and end_date are required'
                }, status=400)
            
            # Create enrollment period
            enrollment_period = EnrollmentPeriod(
                id=str(uuid.uuid4()),
                name=name,
                description=data.get('description', ''),
                start_date=start_date,
                end_date=end_date,
                student_group=data.get('student_group', ''),
                is_active=data.get('is_active', True)
            )
            
            # Save enrollment period
            enrollment_period.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Enrollment period created successfully',
                'data': enrollment_period.to_json()
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to create enrollment period'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def get_enrollment_periods(request):
    """Get all enrollment periods"""
    if request.method == 'GET':
        try:
            # Check if user has admin role
            if not check_admin_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Get all enrollment periods
            enrollment_periods = EnrollmentPeriod.objects.all()
            
            # Convert to JSON format
            periods_data = []
            for period in enrollment_periods:
                periods_data.append(period.to_json())
            
            return JsonResponse({'enrollment_periods': periods_data})
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to fetch enrollment periods'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def get_enrollment_period(request, period_id):
    """Get a specific enrollment period"""
    if request.method == 'GET':
        try:
            # Check if user has admin role
            if not check_admin_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Get enrollment period
            try:
                enrollment_period = EnrollmentPeriod.objects.get(id=period_id)
            except EnrollmentPeriod.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Enrollment period not found'}, status=404)
            
            return JsonResponse({
                'success': True,
                'data': enrollment_period.to_json()
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to fetch enrollment period'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def update_enrollment_period(request, period_id):
    """Update an enrollment period"""
    if request.method == 'PUT':
        try:
            # Check if user has admin role
            if not check_admin_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Get enrollment period
            try:
                enrollment_period = EnrollmentPeriod.objects.get(id=period_id)
            except EnrollmentPeriod.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Enrollment period not found'}, status=404)
            
            # Parse JSON data from request body
            try:
                data = json.loads(request.body)
            except json.JSONDecodeError:
                return JsonResponse({'success': False, 'message': 'Invalid JSON data'}, status=400)
            
            # Update fields if provided
            if 'name' in data:
                enrollment_period.name = data['name']
            if 'description' in data:
                enrollment_period.description = data['description']
            if 'start_date' in data:
                enrollment_period.start_date = data['start_date']
            if 'end_date' in data:
                enrollment_period.end_date = data['end_date']
            if 'student_group' in data:
                enrollment_period.student_group = data['student_group']
            if 'is_active' in data:
                enrollment_period.is_active = data['is_active']
            
            # Save enrollment period
            enrollment_period.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Enrollment period updated successfully',
                'data': enrollment_period.to_json()
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to update enrollment period'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


@csrf_exempt
def delete_enrollment_period(request, period_id):
    """Delete an enrollment period"""
    if request.method == 'DELETE':
        try:
            # Check if user has admin role
            if not check_admin_role(request):
                return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
            
            # Get enrollment period
            try:
                enrollment_period = EnrollmentPeriod.objects.get(id=period_id)
            except EnrollmentPeriod.DoesNotExist:
                return JsonResponse({'success': False, 'message': 'Enrollment period not found'}, status=404)
            
            # Delete enrollment period
            enrollment_period.delete()
            
            return JsonResponse({
                'success': True,
                'message': 'Enrollment period deleted successfully'
            })
            
        except Exception as e:
            return JsonResponse({'success': False, 'message': 'Failed to delete enrollment period'}, status=500)
    
    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)