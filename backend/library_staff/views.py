from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from users.models import User, Staff
from library.models import LibraryBook
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta
import json

def check_library_staff_role(request):
    """Check if the authenticated user has library staff role"""
    return hasattr(request, 'staff') and request.staff is not None

def check_library_staff_permission(request, permission_codename):
    """Check if the library staff user has a specific permission"""
    if not check_library_staff_role(request):
        return False
    
    # Check if user has the required permission
    return request.user.has_permission(permission_codename)

# Library staff dashboard views
@csrf_exempt
def dashboard_overview(request):
    """Get library staff dashboard overview"""
    # Check basic library staff role
    if not check_library_staff_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    try:
        # Get library statistics
        total_books = LibraryBook.objects.count()
        available_books = LibraryBook.objects.filter(status='available').count()
        borrowed_books = LibraryBook.objects.filter(status='borrowed').count()
        reserved_books = LibraryBook.objects.filter(status='reserved').count()
        
        # Get overdue books
        overdue_books = LibraryBook.objects.filter(
            due_date__lt=timezone.now().date(),
            status='borrowed'
        ).count()
        
        # Get recent checkouts
        recent_checkouts = LibraryBook.objects.filter(
            checkout_date__gte=timezone.now() - timedelta(days=7)
        ).count()
        
        # Get reservation requests
        reservation_requests = LibraryBook.objects.filter(status='reserved').count()
        
        data = {
            'totalBooks': total_books,
            'availableBooks': available_books,
            'borrowedBooks': borrowed_books,
            'reservedBooks': reserved_books,
            'overdueBooks': overdue_books,
            'recentCheckouts': recent_checkouts,
            'reservationRequests': reservation_requests,
        }
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to fetch dashboard data'}, status=500)
    
    return JsonResponse(data)

@csrf_exempt
def book_management(request):
    """Get book management data"""
    # Check basic library staff role
    if not check_library_staff_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    try:
        # Get book statistics by status
        books_by_status = LibraryBook.objects.values('status').annotate(count=Count('status'))
        
        # Get recently added books
        recent_books = LibraryBook.objects.order_by('-created_at')[:10]
        
        # Convert to JSON format
        recent_books_data = []
        for book in recent_books:
            recent_books_data.append({
                'id': book.id,
                'title': book.title,
                'author': book.author,
                'isbn': book.isbn,
                'status': book.status,
                'created_at': book.created_at.isoformat() if book.created_at else None,
            })
        
        data = {
            'booksByStatus': list(books_by_status),
            'recentBooks': recent_books_data,
        }
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to fetch book management data'}, status=500)
    
    return JsonResponse(data)

@csrf_exempt
def patron_management(request):
    """Get patron management data"""
    # Check basic library staff role
    if not check_library_staff_role(request):
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)
    
    try:
        # Get patron statistics (placeholder data for now)
        patron_stats = {
            'totalPatrons': 1247,
            'activePatrons': 892,
            'suspendedPatrons': 12,
            'newPatronsThisMonth': 45,
        }
        
        # Get recent patron activities (placeholder)
        recent_activities = [
            {'timestamp': '2023-10-15T10:30:00Z', 'activity': 'Book checkout', 'patron': 'John Doe'},
            {'timestamp': '2023-10-15T09:45:00Z', 'activity': 'Book return', 'patron': 'Jane Smith'},
            {'timestamp': '2023-10-15T08:20:00Z', 'activity': 'Reservation made', 'patron': 'Bob Johnson'},
            {'timestamp': '2023-10-15T07:15:00Z', 'activity': 'Fine payment', 'patron': 'Alice Brown'},
        ]
        
        data = {
            'patronStats': patron_stats,
            'recentActivities': recent_activities,
        }
    
    except Exception as e:
        return JsonResponse({'success': False, 'message': 'Failed to fetch patron management data'}, status=500)
    
    return JsonResponse(data)