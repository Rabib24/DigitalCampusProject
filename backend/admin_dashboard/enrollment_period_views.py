from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from student.models import EnrollmentPeriod
import json
import uuid


def check_admin_role(request):
    """Check if the authenticated user has admin role"""
    return hasattr(request, 'admin') and request.admin is not None


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
            start_date = data.get('start_date')
            end_date = data.get('end_date')
            description = data.get('description', '')
            student_group = data.get('student_group', '')
            is_active = data.get('is_active', True)
            
            if not name or not start_date or not end_date:
                return JsonResponse({'success': False, 'message': 'Name, start date, and end date are required'}, status=400)
            
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
            
            if 'name' in data:
                period.name = data['name']
            if 'description' in data:
                period.description = data['description']
            if 'start_date' in data:
                period.start_date = data['start_date']
            if 'end_date' in data:
                period.end_date = data['end_date']
            if 'student_group' in data:
                period.student_group = data['student_group']
            if 'is_active' in data:
                period.is_active = data['is_active']
            
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
