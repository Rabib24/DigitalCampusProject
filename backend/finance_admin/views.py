from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from users.models import User, Staff
from finance.models import Payment, FinancialAid
from django.db.models import Count, Sum
from django.utils import timezone
from datetime import timedelta
import json

def check_finance_admin_role(request):
    """Check if the authenticated user has finance admin role"""
    return hasattr(request, 'staff') and request.staff is not None

def check_finance_admin_permission(request, permission_codename):
    """Check if the finance admin user has a specific permission"""
    if not check_finance_admin_role(request):
        return False
    
    # Check if user has the required permission
    return request.user.has_permission(permission_codename)

# Finance admin dashboard views
@csrf_exempt
def dashboard_overview(request):
    """Get finance admin dashboard overview"""
    # Check basic finance admin role
    if not check_finance_admin_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    try:
        # Get payment statistics
        total_payments = Payment.objects.count()
        total_payment_amount = Payment.objects.aggregate(Sum('amount'))['amount__sum'] or 0
        
        # Get recent payments
        recent_payments = Payment.objects.filter(
            created_at__gte=timezone.now() - timedelta(days=30)
        ).count()
        
        # Get pending financial aid applications
        pending_aid_applications = FinancialAid.objects.filter(status='pending').count()
        
        # Get overdue payments
        overdue_payments = Payment.objects.filter(
            due_date__lt=timezone.now().date(),
            status='pending'
        ).count()
        
        # Get payment statistics by type
        payments_by_type = Payment.objects.values('type').annotate(count=Count('type'))
        
        data = {
            'totalPayments': total_payments,
            'totalPaymentAmount': float(total_payment_amount),
            'recentPayments': recent_payments,
            'pendingAidApplications': pending_aid_applications,
            'overduePayments': overdue_payments,
            'paymentsByType': list(payments_by_type),
        }
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to fetch dashboard data'}, status=500)
    
    return JsonResponse(data)

@csrf_exempt
def payment_management(request):
    """Get payment management data"""
    # Check basic finance admin role
    if not check_finance_admin_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    try:
        # Get payment statistics by status
        payments_by_status = Payment.objects.values('status').annotate(count=Count('status'))
        
        # Get recent payments
        recent_payments = Payment.objects.order_by('-created_at')[:10]
        
        # Convert to JSON format
        recent_payments_data = []
        for payment in recent_payments:
            recent_payments_data.append({
                'id': payment.id,
                'user_id': payment.user_id,
                'amount': float(payment.amount),
                'currency': payment.currency,
                'type': payment.type,
                'status': payment.status,
                'description': payment.description,
                'created_at': payment.created_at.isoformat() if payment.created_at else None,
            })
        
        data = {
            'paymentsByStatus': list(payments_by_status),
            'recentPayments': recent_payments_data,
        }
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to fetch payment management data'}, status=500)
    
    return JsonResponse(data)

@csrf_exempt
def financial_aid_management(request):
    """Get financial aid management data"""
    # Check basic finance admin role
    if not check_finance_admin_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    try:
        # Get financial aid statistics by status
        aid_by_status = FinancialAid.objects.values('status').annotate(count=Count('status'))
        
        # Get recent financial aid applications
        recent_aid = FinancialAid.objects.order_by('-application_date')[:10]
        
        # Convert to JSON format
        recent_aid_data = []
        for aid in recent_aid:
            recent_aid_data.append({
                'id': aid.id,
                'student_id': aid.student_id,
                'type': aid.type,
                'amount': float(aid.amount) if aid.amount else 0,
                'status': aid.status,
                'application_date': aid.application_date.isoformat() if aid.application_date else None,
            })
        
        data = {
            'aidByStatus': list(aid_by_status),
            'recentAid': recent_aid_data,
        }
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to fetch financial aid management data'}, status=500)
    
    return JsonResponse(data)