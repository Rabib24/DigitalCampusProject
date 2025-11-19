from django.db.models import Q
from django.http import JsonResponse
import json
from .error_handling import api_error

class FacultyDataFilter:
    """Utility class for filtering faculty data"""
    
    @staticmethod
    def filter_courses(courses_queryset, filter_params):
        """Filter courses based on provided parameters"""
        try:
            # Filter by course code
            if 'code' in filter_params:
                courses_queryset = courses_queryset.filter(code__icontains=filter_params['code'])
            
            # Filter by course name
            if 'name' in filter_params:
                courses_queryset = courses_queryset.filter(name__icontains=filter_params['name'])
            
            # Filter by department
            if 'department' in filter_params:
                courses_queryset = courses_queryset.filter(department__icontains=filter_params['department'])
            
            # Filter by instructor ID
            if 'instructor_id' in filter_params:
                courses_queryset = courses_queryset.filter(instructor_id=filter_params['instructor_id'])
            
            # Filter by credits
            if 'credits' in filter_params:
                courses_queryset = courses_queryset.filter(credits=filter_params['credits'])
            
            # Filter by enrollment limit
            if 'enrollment_limit_min' in filter_params:
                courses_queryset = courses_queryset.filter(enrollment_limit__gte=filter_params['enrollment_limit_min'])
            
            if 'enrollment_limit_max' in filter_params:
                courses_queryset = courses_queryset.filter(enrollment_limit__lte=filter_params['enrollment_limit_max'])
            
            # Filter by date range
            if 'start_date_from' in filter_params:
                courses_queryset = courses_queryset.filter(start_date__gte=filter_params['start_date_from'])
            
            if 'start_date_to' in filter_params:
                courses_queryset = courses_queryset.filter(start_date__lte=filter_params['start_date_to'])
            
            if 'end_date_from' in filter_params:
                courses_queryset = courses_queryset.filter(end_date__gte=filter_params['end_date_from'])
            
            if 'end_date_to' in filter_params:
                courses_queryset = courses_queryset.filter(end_date__lte=filter_params['end_date_to'])
            
            return courses_queryset
            
        except Exception as e:
            raise api_error(
                f"Failed to filter courses: {str(e)}",
                "filter_error",
                500
            )
    
    @staticmethod
    def filter_assignments(assignments_queryset, filter_params):
        """Filter assignments based on provided parameters"""
        try:
            # Filter by course ID
            if 'course_id' in filter_params:
                assignments_queryset = assignments_queryset.filter(course_id=filter_params['course_id'])
            
            # Filter by title
            if 'title' in filter_params:
                assignments_queryset = assignments_queryset.filter(title__icontains=filter_params['title'])
            
            # Filter by type
            if 'type' in filter_params:
                assignments_queryset = assignments_queryset.filter(type=filter_params['type'])
            
            # Filter by points
            if 'points_min' in filter_params:
                assignments_queryset = assignments_queryset.filter(points__gte=filter_params['points_min'])
            
            if 'points_max' in filter_params:
                assignments_queryset = assignments_queryset.filter(points__gte=filter_params['points_max'])
            
            # Filter by date range
            if 'due_date_from' in filter_params:
                assignments_queryset = assignments_queryset.filter(due_date__gte=filter_params['due_date_from'])
            
            if 'due_date_to' in filter_params:
                assignments_queryset = assignments_queryset.filter(due_date__lte=filter_params['due_date_to'])
            
            if 'start_date_from' in filter_params:
                assignments_queryset = assignments_queryset.filter(start_date__gte=filter_params['start_date_from'])
            
            if 'start_date_to' in filter_params:
                assignments_queryset = assignments_queryset.filter(start_date__lte=filter_params['start_date_to'])
            
            return assignments_queryset
            
        except Exception as e:
            raise api_error(
                f"Failed to filter assignments: {str(e)}",
                "filter_error",
                500
            )
    
    @staticmethod
    def filter_enrollments(enrollments_queryset, filter_params):
        """Filter enrollments based on provided parameters"""
        try:
            # Filter by course ID
            if 'course_id' in filter_params:
                enrollments_queryset = enrollments_queryset.filter(course_id=filter_params['course_id'])
            
            # Filter by student ID
            if 'student_id' in filter_params:
                enrollments_queryset = enrollments_queryset.filter(student_id=filter_params['student_id'])
            
            # Filter by status
            if 'status' in filter_params:
                enrollments_queryset = enrollments_queryset.filter(status=filter_params['status'])
            
            # Filter by grade
            if 'grade' in filter_params:
                enrollments_queryset = enrollments_queryset.filter(grade=filter_params['grade'])
            
            # Filter by date range
            if 'enrollment_date_from' in filter_params:
                enrollments_queryset = enrollments_queryset.filter(enrollment_date__gte=filter_params['enrollment_date_from'])
            
            if 'enrollment_date_to' in filter_params:
                enrollments_queryset = enrollments_queryset.filter(enrollment_date__lte=filter_params['enrollment_date_to'])
            
            return enrollments_queryset
            
        except Exception as e:
            raise api_error(
                f"Failed to filter enrollments: {str(e)}",
                "filter_error",
                500
            )
    
    @staticmethod
    def filter_notifications(notifications_queryset, filter_params):
        """Filter notifications based on provided parameters"""
        try:
            # Filter by user ID
            if 'user_id' in filter_params:
                notifications_queryset = notifications_queryset.filter(user_id=filter_params['user_id'])
            
            # Filter by title
            if 'title' in filter_params:
                notifications_queryset = notifications_queryset.filter(title__icontains=filter_params['title'])
            
            # Filter by message
            if 'message' in filter_params:
                notifications_queryset = notifications_queryset.filter(message__icontains=filter_params['message'])
            
            # Filter by type
            if 'type' in filter_params:
                notifications_queryset = notifications_queryset.filter(type=filter_params['type'])
            
            # Filter by read status
            if 'is_read' in filter_params:
                is_read = filter_params['is_read'].lower() == 'true'
                notifications_queryset = notifications_queryset.filter(is_read=is_read)
            
            # Filter by date range
            if 'created_at_from' in filter_params:
                notifications_queryset = notifications_queryset.filter(created_at__gte=filter_params['created_at_from'])
            
            if 'created_at_to' in filter_params:
                notifications_queryset = notifications_queryset.filter(created_at__lte=filter_params['created_at_to'])
            
            return notifications_queryset
            
        except Exception as e:
            raise api_error(
                f"Failed to filter notifications: {str(e)}",
                "filter_error",
                500
            )

class FacultyDataSorter:
    """Utility class for sorting faculty data"""
    
    @staticmethod
    def sort_courses(courses_queryset, sort_params):
        """Sort courses based on provided parameters"""
        try:
            # Default sorting
            if not sort_params:
                return courses_queryset.order_by('-created_at')
            
            # Parse sort parameters
            sort_fields = []
            for param in sort_params.split(','):
                param = param.strip()
                if param.startswith('-'):
                    # Descending order
                    field = param[1:]
                    if field in ['code', 'name', 'department', 'credits', 'created_at', 'start_date', 'end_date']:
                        sort_fields.append(f'-{field}')
                else:
                    # Ascending order
                    if param in ['code', 'name', 'department', 'credits', 'created_at', 'start_date', 'end_date']:
                        sort_fields.append(param)
            
            if sort_fields:
                return courses_queryset.order_by(*sort_fields)
            else:
                return courses_queryset.order_by('-created_at')
                
        except Exception as e:
            raise api_error(
                f"Failed to sort courses: {str(e)}",
                "sort_error",
                500
            )
    
    @staticmethod
    def sort_assignments(assignments_queryset, sort_params):
        """Sort assignments based on provided parameters"""
        try:
            # Default sorting
            if not sort_params:
                return assignments_queryset.order_by('-created_at')
            
            # Parse sort parameters
            sort_fields = []
            for param in sort_params.split(','):
                param = param.strip()
                if param.startswith('-'):
                    # Descending order
                    field = param[1:]
                    if field in ['title', 'course_id', 'due_date', 'points', 'created_at', 'start_date']:
                        sort_fields.append(f'-{field}')
                else:
                    # Ascending order
                    if param in ['title', 'course_id', 'due_date', 'points', 'created_at', 'start_date']:
                        sort_fields.append(param)
            
            if sort_fields:
                return assignments_queryset.order_by(*sort_fields)
            else:
                return assignments_queryset.order_by('-created_at')
                
        except Exception as e:
            raise api_error(
                f"Failed to sort assignments: {str(e)}",
                "sort_error",
                500
            )
    
    @staticmethod
    def sort_enrollments(enrollments_queryset, sort_params):
        """Sort enrollments based on provided parameters"""
        try:
            # Default sorting
            if not sort_params:
                return enrollments_queryset.order_by('-enrollment_date')
            
            # Parse sort parameters
            sort_fields = []
            for param in sort_params.split(','):
                param = param.strip()
                if param.startswith('-'):
                    # Descending order
                    field = param[1:]
                    if field in ['student_id', 'course_id', 'enrollment_date', 'status', 'grade']:
                        sort_fields.append(f'-{field}')
                else:
                    # Ascending order
                    if param in ['student_id', 'course_id', 'enrollment_date', 'status', 'grade']:
                        sort_fields.append(param)
            
            if sort_fields:
                return enrollments_queryset.order_by(*sort_fields)
            else:
                return enrollments_queryset.order_by('-enrollment_date')
                
        except Exception as e:
            raise api_error(
                f"Failed to sort enrollments: {str(e)}",
                "sort_error",
                500
            )
    
    @staticmethod
    def sort_notifications(notifications_queryset, sort_params):
        """Sort notifications based on provided parameters"""
        try:
            # Default sorting
            if not sort_params:
                return notifications_queryset.order_by('-created_at')
            
            # Parse sort parameters
            sort_fields = []
            for param in sort_params.split(','):
                param = param.strip()
                if param.startswith('-'):
                    # Descending order
                    field = param[1:]
                    if field in ['title', 'user_id', 'type', 'created_at', 'is_read']:
                        sort_fields.append(f'-{field}')
                else:
                    # Ascending order
                    if param in ['title', 'user_id', 'type', 'created_at', 'is_read']:
                        sort_fields.append(param)
            
            if sort_fields:
                return notifications_queryset.order_by(*sort_fields)
            else:
                return notifications_queryset.order_by('-created_at')
                
        except Exception as e:
            raise api_error(
                f"Failed to sort notifications: {str(e)}",
                "sort_error",
                500
            )

def apply_filtering_and_sorting(queryset, request, data_type):
    """Apply filtering and sorting to a queryset based on request parameters"""
    try:
        # Get filter parameters from request
        filter_params = {}
        for key, value in request.GET.items():
            if key.startswith('filter_'):
                filter_key = key[7:]  # Remove 'filter_' prefix
                filter_params[filter_key] = value
        
        # Apply filtering based on data type
        if data_type == 'courses':
            queryset = FacultyDataFilter.filter_courses(queryset, filter_params)
        elif data_type == 'assignments':
            queryset = FacultyDataFilter.filter_assignments(queryset, filter_params)
        elif data_type == 'enrollments':
            queryset = FacultyDataFilter.filter_enrollments(queryset, filter_params)
        elif data_type == 'notifications':
            queryset = FacultyDataFilter.filter_notifications(queryset, filter_params)
        
        # Get sort parameters from request
        sort_params = request.GET.get('sort', '')
        
        # Apply sorting based on data type
        if data_type == 'courses':
            queryset = FacultyDataSorter.sort_courses(queryset, sort_params)
        elif data_type == 'assignments':
            queryset = FacultyDataSorter.sort_assignments(queryset, sort_params)
        elif data_type == 'enrollments':
            queryset = FacultyDataSorter.sort_enrollments(queryset, sort_params)
        elif data_type == 'notifications':
            queryset = FacultyDataSorter.sort_notifications(queryset, sort_params)
        
        return queryset
        
    except Exception as e:
        raise api_error(
            f"Failed to apply filtering and sorting: {str(e)}",
            "filter_sort_error",
            500
        )