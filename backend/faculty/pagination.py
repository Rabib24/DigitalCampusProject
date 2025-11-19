from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import JsonResponse
from .error_handling import api_error

class FacultyPaginator:
    """Custom paginator for faculty data with additional metadata"""
    
    def __init__(self, queryset, page_size=20):
        self.queryset = queryset
        self.page_size = page_size
    
    def get_paginated_response(self, request, page_number=None):
        """Get paginated response with metadata"""
        try:
            # Get page number from request or parameter
            if page_number is None:
                page_number = int(request.GET.get('page', 1))
            
            # Get page size from request (with limits)
            page_size = min(
                int(request.GET.get('page_size', self.page_size)),
                100  # Maximum page size
            )
            
            # Create paginator
            paginator = Paginator(self.queryset, page_size)
            
            # Get page
            try:
                page_obj = paginator.page(page_number)
            except PageNotAnInteger:
                page_obj = paginator.page(1)
            except EmptyPage:
                page_obj = paginator.page(paginator.num_pages)
            
            # Prepare pagination metadata
            pagination_info = {
                'current_page': page_obj.number,
                'total_pages': paginator.num_pages,
                'total_items': paginator.count,
                'page_size': page_size,
                'has_next': page_obj.has_next(),
                'has_previous': page_obj.has_previous(),
                'next_page': page_obj.next_page_number() if page_obj.has_next() else None,
                'previous_page': page_obj.previous_page_number() if page_obj.has_previous() else None,
            }
            
            return {
                'items': page_obj.object_list,
                'pagination': pagination_info
            }
            
        except Exception as e:
            raise api_error(
                f"Pagination error: {str(e)}",
                "pagination_error",
                500
            )

def paginated_api_response(queryset, request, serializer_func=None, page_size=20):
    """Create a paginated API response"""
    try:
        # Create paginator
        paginator = FacultyPaginator(queryset, page_size)
        paginated_data = paginator.get_paginated_response(request)
        
        # Serialize items if serializer function is provided
        items = paginated_data['items']
        if serializer_func:
            serialized_items = [serializer_func(item) for item in items]
        else:
            # If no serializer, assume items have to_json method
            serialized_items = [item.to_json() if hasattr(item, 'to_json') else item for item in items]
        
        # Return paginated response
        return JsonResponse({
            'success': True,
            'data': serialized_items,
            'pagination': paginated_data['pagination']
        })
        
    except Exception as e:
        return api_error(
            f"Failed to create paginated response: {str(e)}",
            "pagination_error",
            500
        )

def cursor_pagination_response(queryset, request, cursor_field='id', page_size=20):
    """Create a cursor-based pagination response for better performance on large datasets"""
    try:
        # Get cursor from request
        cursor = request.GET.get('cursor')
        page_size = min(int(request.GET.get('page_size', page_size)), 100)
        
        # Apply cursor-based filtering
        if cursor:
            # Filter queryset based on cursor field
            queryset = queryset.filter(**{f'{cursor_field}__gt': cursor})
        
        # Limit results
        items = list(queryset[:page_size + 1])  # Get one extra to check if there are more
        
        # Determine if there are more items
        has_more = len(items) > page_size
        if has_more:
            items = items[:-1]  # Remove the extra item
        
        # Get next cursor if there are more items
        next_cursor = None
        if has_more and items:
            next_cursor = getattr(items[-1], cursor_field)
        
        # Serialize items
        serialized_items = [item.to_json() if hasattr(item, 'to_json') else item for item in items]
        
        # Prepare pagination info
        pagination_info = {
            'has_more': has_more,
            'next_cursor': str(next_cursor) if next_cursor else None,
            'page_size': page_size,
            'item_count': len(serialized_items)
        }
        
        return JsonResponse({
            'success': True,
            'data': serialized_items,
            'pagination': pagination_info
        })
        
    except Exception as e:
        return api_error(
            f"Failed to create cursor-based pagination response: {str(e)}",
            "pagination_error",
            500
        )

# Utility functions for common pagination patterns

def paginate_courses(courses_queryset, request):
    """Paginate courses with default settings"""
    return paginated_api_response(
        queryset=courses_queryset,
        request=request,
        serializer_func=lambda course: course.to_json(),
        page_size=10
    )

def paginate_assignments(assignments_queryset, request):
    """Paginate assignments with default settings"""
    return paginated_api_response(
        queryset=assignments_queryset,
        request=request,
        serializer_func=lambda assignment: assignment.to_json(),
        page_size=15
    )

def paginate_enrollments(enrollments_queryset, request):
    """Paginate enrollments with default settings"""
    return paginated_api_response(
        queryset=enrollments_queryset,
        request=request,
        serializer_func=lambda enrollment: enrollment.to_json(),
        page_size=20
    )

def paginate_notifications(notifications_queryset, request):
    """Paginate notifications with cursor-based pagination"""
    return cursor_pagination_response(
        queryset=notifications_queryset,
        request=request,
        cursor_field='created_at',
        page_size=20
    )