from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.db.models import Q
import json
import uuid
from courses.models import Course, Enrollment
from assignments.models import Assignment
from users.models import Faculty
from .pagination import paginate_courses, paginate_assignments, paginate_enrollments
from .filtering import apply_filtering_and_sorting

@csrf_exempt
def get_faculty_courses(request):
    """Get all courses taught by the authenticated faculty member"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get courses where instructor_id matches faculty employee_id
            courses = Course.objects.filter(instructor_id=faculty_profile.employee_id)  # type: ignore
            
            # Apply filtering and sorting
            courses = apply_filtering_and_sorting(courses, request, 'courses')
            
            # Return paginated response
            return paginate_courses(courses, request)
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve courses'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def search_courses(request):
    """Search courses with full-text indexing"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get search query
            query = request.GET.get('q', '')
            
            if not query:
                return JsonResponse({
                    'success': False,
                    'message': 'Search query is required'
                }, status=400)
            
            # Search courses where instructor_id matches faculty employee_id
            courses = Course.objects.filter(
                instructor_id=faculty_profile.employee_id
            ).filter(  # type: ignore
                Q(code__icontains=query) |
                Q(name__icontains=query) |
                Q(description__icontains=query) |
                Q(department__icontains=query)
            )
            
            # Apply filtering and sorting
            courses = apply_filtering_and_sorting(courses, request, 'courses')
            
            # Return paginated response
            return paginate_courses(courses, request)
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to search courses'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_course_detail(request, course_id):
    """Get detailed information for a specific course"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get course where instructor_id matches faculty employee_id
            try:
                course = Course.objects.get(id=course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
            except Course.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Course not found or access denied'
                }, status=404)
            
            # Get enrollments for this course
            enrollments = Enrollment.objects.filter(course_id=course_id)  # type: ignore
            
            # Apply filtering and sorting to enrollments
            enrollments = apply_filtering_and_sorting(enrollments, request, 'enrollments')
            
            # Get assignments for this course
            assignments = Assignment.objects.filter(course_id=course_id)  # type: ignore
            
            # Apply filtering and sorting to assignments
            assignments = apply_filtering_and_sorting(assignments, request, 'assignments')
            
            # Convert to JSON format
            # For enrollments and assignments, we'll get a limited number since they might be large
            enrollments_data = [enrollment.to_json() for enrollment in list(enrollments[:50])]  # Limit to 50
            assignments_data = [assignment.to_json() for assignment in list(assignments[:50])]  # Limit to 50
            
            # Prepare detailed course data
            course_data = course.to_json()
            course_data['enrollments'] = enrollments_data
            course_data['assignments'] = assignments_data
            
            return JsonResponse({
                'success': True,
                'data': course_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve course details'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def create_course(request):
    """Create a new course"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Validate required fields
            required_fields = ['code', 'name', 'description', 'credits', 'department']
            for field in required_fields:
                if field not in data:
                    return JsonResponse({
                        'success': False,
                        'message': f'Missing required field: {field}'
                    }, status=400)
            
            # Check for course code uniqueness
            if Course.objects.filter(code=data['code']).exists():  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'A course with this code already exists'
                }, status=400)
            
            # Check if using a template
            template_id = data.get('template_id')
            if template_id:
                try:
                    template_course = Course.objects.get(id=template_id)  # type: ignore
                    # Use template data as base
                    course_data = template_course.to_json()
                    # Override with provided data
                    course_data.update(data)
                except Course.DoesNotExist:  # type: ignore
                    return JsonResponse({
                        'success': False,
                        'message': 'Template course not found'
                    }, status=404)
            else:
                course_data = data
            
            # Generate course ID
            course_id = str(uuid.uuid4())
            
            # Create course
            course = Course(
                id=course_id,
                code=course_data['code'],
                name=course_data['name'],
                description=course_data['description'],
                credits=course_data['credits'],
                instructor_id=faculty_profile.employee_id,
                department=course_data['department'],
                enrollment_limit=course_data.get('enrollment_limit', 30),
                start_date=course_data.get('start_date', timezone.now().date()),
                end_date=course_data.get('end_date', timezone.now().date()),
            )
            
            # Add optional fields if provided
            if 'schedule' in course_data:
                course.schedule = course_data['schedule']
            
            if 'prerequisites' in course_data:
                course.prerequisites = course_data['prerequisites']
            
            if 'syllabus' in course_data:
                course.syllabus = course_data['syllabus']
            
            if 'textbooks' in course_data:
                course.textbooks = course_data['textbooks']
            
            if 'grading_scale' in course_data:
                course.grading_scale = course_data['grading_scale']
            
            if 'categories' in course_data:
                course.categories = course_data['categories']
            
            if 'materials' in course_data:
                course.materials = course_data['materials']
            
            course.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Course created successfully',
                'data': course.to_json()
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to create course'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def update_course(request, course_id):
    """Update an existing course"""
    if request.method == 'PUT' or request.method == 'PATCH':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get course where instructor_id matches faculty employee_id
            try:
                course = Course.objects.get(id=course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
            except Course.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Course not found or access denied'
                }, status=404)
            
            # For PATCH, we only update fields that are provided
            # For PUT, we might want to reset fields not provided (but we'll keep it simple for now)
            
            # Store original course data for change tracking
            original_data = course.to_json()
            
            # Update course fields (only if provided in data for PATCH, or always for PUT)
            if 'code' in data:
                # Check for course code uniqueness (excluding current course)
                if Course.objects.filter(code=data['code']).exclude(id=course_id).exists():  # type: ignore
                    return JsonResponse({
                        'success': False,
                        'message': 'A course with this code already exists'
                    }, status=400)
                course.code = data['code']
            
            if 'name' in data:
                course.name = data['name']
            
            if 'description' in data:
                course.description = data['description']
            
            if 'credits' in data:
                course.credits = data['credits']
            
            if 'department' in data:
                course.department = data['department']
            
            if 'schedule' in data:
                course.schedule = data['schedule']
            
            if 'enrollment_limit' in data:
                course.enrollment_limit = data['enrollment_limit']
            
            if 'start_date' in data:
                course.start_date = data['start_date']
            
            if 'end_date' in data:
                course.end_date = data['end_date']
            
            if 'prerequisites' in data:
                course.prerequisites = data['prerequisites']
            
            if 'syllabus' in data:
                course.syllabus = data['syllabus']
            
            if 'textbooks' in data:
                course.textbooks = data['textbooks']
            
            if 'grading_scale' in data:
                course.grading_scale = data['grading_scale']
            
            if 'categories' in data:
                course.categories = data['categories']
            
            if 'materials' in data:
                course.materials = data['materials']
            
            # Save updated course
            course.save()
            
            # Prepare change tracking data
            updated_data = course.to_json()
            changes = {}
            for key in updated_data:
                if key in original_data and original_data[key] != updated_data[key]:
                    changes[key] = {
                        'from': original_data[key],
                        'to': updated_data[key]
                    }
            
            return JsonResponse({
                'success': True,
                'message': 'Course updated successfully',
                'data': updated_data,
                'changes': changes
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to update course'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def delete_course(request, course_id):
    """Delete a course (soft delete with archiving and dependency checking)"""
    if request.method == 'DELETE':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get course where instructor_id matches faculty employee_id
            try:
                course = Course.objects.get(id=course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
            except Course.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Course not found or access denied'
                }, status=404)
            
            # Check for dependencies before deletion
            # Check if there are any enrollments
            enrollment_count = Enrollment.objects.filter(course_id=course_id).count()  # type: ignore
            
            # Check if there are any assignments
            assignment_count = Assignment.objects.filter(course_id=course_id).count()  # type: ignore
            
            # If there are dependencies, we need to handle them appropriately
            if enrollment_count > 0 or assignment_count > 0:
                # For now, we'll allow deletion but archive the course instead of permanent deletion
                # In a real implementation, you might want to prevent deletion if there are dependencies
                pass
            
            # Archive the course instead of permanent deletion
            # Add audit logging
            audit_log = {
                'course_id': course_id,
                'course_code': course.code,
                'course_name': course.name,
                'deleted_by': faculty_profile.employee_id,
                'deleted_at': timezone.now().isoformat(),
                'enrollment_count': enrollment_count,
                'assignment_count': assignment_count
            }
            
            # Mark course as archived/soft deleted
            # In a real implementation, you might add an 'archived' field to the Course model
            # For now, we'll just add a note to the course description
            course.description += f"\n[ARCHIVED on {timezone.now().strftime('%Y-%m-%d %H:%M:%S')}]"
            course.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Course archived successfully',
                'audit_log': audit_log
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to delete course'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def bulk_delete_courses(request):
    """Bulk delete multiple courses"""
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Expecting a list of course IDs to delete
            if 'course_ids' not in data or not isinstance(data['course_ids'], list):
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid data format. Expected "course_ids" as a list of course IDs.'
                }, status=400)
            
            deleted_courses = []
            errors = []
            
            # Process each course deletion
            for course_id in data['course_ids']:
                try:
                    # Get course where instructor_id matches faculty employee_id
                    course = Course.objects.get(id=course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
                    
                    # Check for dependencies
                    enrollment_count = Enrollment.objects.filter(course_id=course_id).count()  # type: ignore
                    assignment_count = Assignment.objects.filter(course_id=course_id).count()  # type: ignore
                    
                    # Archive the course
                    audit_log = {
                        'course_id': course_id,
                        'course_code': course.code,
                        'course_name': course.name,
                        'deleted_by': faculty_profile.employee_id,
                        'deleted_at': timezone.now().isoformat(),
                        'enrollment_count': enrollment_count,
                        'assignment_count': assignment_count
                    }
                    
                    # Mark course as archived
                    course.description += f"\n[ARCHIVED on {timezone.now().strftime('%Y-%m-%d %H:%M:%S')}]"
                    course.save()
                    
                    deleted_courses.append({
                        'course_id': course_id,
                        'audit_log': audit_log
                    })
                    
                except Course.DoesNotExist:  # type: ignore
                    errors.append({
                        'course_id': course_id,
                        'error': 'Course not found or access denied'
                    })
                except Exception as e:
                    errors.append({
                        'course_id': course_id,
                        'error': str(e)
                    })
            
            return JsonResponse({
                'success': True,
                'message': f'Bulk deletion completed. {len(deleted_courses)} courses archived, {len(errors)} errors.',
                'deleted_courses': deleted_courses,
                'errors': errors
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to bulk delete courses'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_course_enrollments(request, course_id):
    """Get all enrollments for a specific course"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Verify faculty teaches this course
            try:
                course = Course.objects.get(id=course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
            except Course.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Course not found or access denied'
                }, status=404)
            
            # Get enrollments for this course
            enrollments = Enrollment.objects.filter(course_id=course_id)  # type: ignore
            
            # Apply filtering and sorting
            enrollments = apply_filtering_and_sorting(enrollments, request, 'enrollments')
            
            # Return paginated response
            return paginate_enrollments(enrollments, request)
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve enrollments'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_course_assignments(request, course_id):
    """Get all assignments for a specific course"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Verify faculty teaches this course
            try:
                course = Course.objects.get(id=course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
            except Course.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Course not found or access denied'
                }, status=404)
            
            # Get assignments for this course
            assignments = Assignment.objects.filter(course_id=course_id)  # type: ignore
            
            # Apply filtering and sorting
            assignments = apply_filtering_and_sorting(assignments, request, 'assignments')
            
            # Return paginated response
            return paginate_assignments(assignments, request)
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve assignments'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_course_analytics(request, course_id):
    """Get analytics for a specific course"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Verify faculty teaches this course
            try:
                course = Course.objects.get(id=course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
            except Course.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Course not found or access denied'
                }, status=404)
            
            # Get enrollments for analytics
            enrollments = Enrollment.objects.filter(course_id=course_id)  # type: ignore
            
            # Apply filtering to enrollments for analytics
            enrollments = apply_filtering_and_sorting(enrollments, request, 'enrollments')
            
            # Calculate analytics
            total_enrollments = enrollments.count()
            active_enrollments = enrollments.filter(status='active').count()
            completed_enrollments = enrollments.filter(status='completed').count()
            dropped_enrollments = enrollments.filter(status='dropped').count()
            
            # Grade distribution
            grade_distribution = {}
            completed_enrollments_qs = enrollments.filter(status='completed')
            for enrollment in completed_enrollments_qs:
                grade = enrollment.grade
                if grade:
                    if grade in grade_distribution:
                        grade_distribution[grade] += 1
                    else:
                        grade_distribution[grade] = 1
            
            # Student count
            student_count = course.get_student_count()
            
            analytics_data = {
                'total_enrollments': total_enrollments,
                'active_enrollments': active_enrollments,
                'completed_enrollments': completed_enrollments,
                'dropped_enrollments': dropped_enrollments,
                'student_count': student_count,
                'grade_distribution': grade_distribution
            }
            
            return JsonResponse({
                'success': True,
                'data': analytics_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve course analytics'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_course_templates(request):
    """Get available course templates for quick creation"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get templates (courses marked as templates)
            # In a real implementation, you might have a separate Template model
            # For now, we'll get courses that have been marked as templates
            templates = Course.objects.filter(is_template=True)  # type: ignore
            
            # Apply filtering and sorting
            templates = apply_filtering_and_sorting(templates, request, 'courses')
            
            # Return paginated response
            return paginate_courses(templates, request)
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve course templates'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def bulk_update_courses(request):
    """Bulk update multiple courses"""
    if request.method == 'PUT' or request.method == 'PATCH':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Expecting a list of course updates
            if 'courses' not in data or not isinstance(data['courses'], list):
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid data format. Expected "courses" as a list of course updates.'
                }, status=400)
            
            updated_courses = []
            errors = []
            
            # Process each course update
            for course_data in data['courses']:
                course_id = course_data.get('id')
                if not course_id:
                    errors.append({
                        'course_id': 'unknown',
                        'error': 'Course ID is required'
                    })
                    continue
                
                try:
                    # Get course where instructor_id matches faculty employee_id
                    course = Course.objects.get(id=course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
                    
                    # Store original course data for change tracking
                    original_data = course.to_json()
                    
                    # Update course fields
                    if 'code' in course_data:
                        # Check for course code uniqueness (excluding current course)
                        if Course.objects.filter(code=course_data['code']).exclude(id=course_id).exists():  # type: ignore
                            errors.append({
                                'course_id': course_id,
                                'error': 'A course with this code already exists'
                            })
                            continue
                        course.code = course_data['code']
                    
                    if 'name' in course_data:
                        course.name = course_data['name']
                    
                    if 'description' in course_data:
                        course.description = course_data['description']
                    
                    if 'credits' in course_data:
                        course.credits = course_data['credits']
                    
                    if 'department' in course_data:
                        course.department = course_data['department']
                    
                    if 'schedule' in course_data:
                        course.schedule = course_data['schedule']
                    
                    if 'enrollment_limit' in course_data:
                        course.enrollment_limit = course_data['enrollment_limit']
                    
                    if 'start_date' in course_data:
                        course.start_date = course_data['start_date']
                    
                    if 'end_date' in course_data:
                        course.end_date = course_data['end_date']
                    
                    if 'prerequisites' in course_data:
                        course.prerequisites = course_data['prerequisites']
                    
                    if 'syllabus' in course_data:
                        course.syllabus = course_data['syllabus']
                    
                    if 'textbooks' in course_data:
                        course.textbooks = course_data['textbooks']
                    
                    if 'grading_scale' in course_data:
                        course.grading_scale = course_data['grading_scale']
                    
                    if 'categories' in course_data:
                        course.categories = course_data['categories']
                    
                    if 'materials' in course_data:
                        course.materials = course_data['materials']
                    
                    # Save updated course
                    course.save()
                    
                    # Prepare change tracking data
                    updated_data = course.to_json()
                    changes = {}
                    for key in updated_data:
                        if key in original_data and original_data[key] != updated_data[key]:
                            changes[key] = {
                                'from': original_data[key],
                                'to': updated_data[key]
                            }
                    
                    updated_courses.append({
                        'course_id': course_id,
                        'data': updated_data,
                        'changes': changes
                    })
                    
                except Course.DoesNotExist:  # type: ignore
                    errors.append({
                        'course_id': course_id,
                        'error': 'Course not found or access denied'
                    })
                except Exception as e:
                    errors.append({
                        'course_id': course_id,
                        'error': str(e)
                    })
            
            return JsonResponse({
                'success': True,
                'message': f'Bulk update completed. {len(updated_courses)} courses updated, {len(errors)} errors.',
                'updated_courses': updated_courses,
                'errors': errors
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to bulk update courses'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def add_student_to_course(request, course_id):
    """Add a student to a course"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Verify faculty teaches this course
            try:
                course = Course.objects.get(id=course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
            except Course.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Course not found or access denied'
                }, status=404)
            
            # Get student ID from request data
            student_id = data.get('student_id')
            if not student_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Student ID is required'
                }, status=400)
            
            # Check if student is already enrolled
            if Enrollment.objects.filter(course_id=course_id, student_id=student_id).exists():  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Student is already enrolled in this course'
                }, status=400)
            
            # Check if course is at enrollment limit
            current_enrollment_count = Enrollment.objects.filter(course_id=course_id).count()  # type: ignore
            if current_enrollment_count >= course.enrollment_limit:
                # Add to waitlist instead
                enrollment = Enrollment(
                    course_id=course_id,
                    student_id=student_id,
                    status='waitlisted'
                )
                message = 'Student added to waitlist - course is at capacity'
            else:
                # Add to course
                enrollment = Enrollment(
                    course_id=course_id,
                    student_id=student_id,
                    status='active'
                )
                message = 'Student enrolled successfully'
            
            # Save enrollment
            enrollment.save()
            
            return JsonResponse({
                'success': True,
                'message': message,
                'data': enrollment.to_json()
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to add student to course'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def remove_student_from_course(request, course_id, student_id):
    """Remove a student from a course"""
    if request.method == 'DELETE':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Verify faculty teaches this course
            try:
                course = Course.objects.get(id=course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
            except Course.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Course not found or access denied'
                }, status=404)
            
            # Get enrollment record
            try:
                enrollment = Enrollment.objects.get(course_id=course_id, student_id=student_id)  # type: ignore
            except Enrollment.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Student is not enrolled in this course'
                }, status=404)
            
            # Delete enrollment
            enrollment.delete()
            
            # If there are students on the waitlist and the course is now below capacity,
            # automatically enroll the next student from the waitlist
            current_enrollment_count = Enrollment.objects.filter(
                course_id=course_id, 
                status='active'
            ).count()  # type: ignore
            
            if current_enrollment_count < course.enrollment_limit:
                # Get the next waitlisted student
                waitlisted_enrollment = Enrollment.objects.filter(
                    course_id=course_id, 
                    status='waitlisted'
                ).order_by('created_at').first()  # type: ignore
                
                if waitlisted_enrollment:
                    waitlisted_enrollment.status = 'active'
                    waitlisted_enrollment.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Student removed from course successfully'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to remove student from course'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def bulk_enroll_students(request, course_id):
    """Bulk enroll students in a course from CSV data"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Verify faculty teaches this course
            try:
                course = Course.objects.get(id=course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
            except Course.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Course not found or access denied'
                }, status=404)
            
            # Expecting a list of student IDs
            if 'student_ids' not in data or not isinstance(data['student_ids'], list):
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid data format. Expected "student_ids" as a list of student IDs.'
                }, status=400)
            
            enrolled_students = []
            waitlisted_students = []
            errors = []
            
            # Process each student enrollment
            for student_id in data['student_ids']:
                try:
                    # Check if student is already enrolled
                    if Enrollment.objects.filter(course_id=course_id, student_id=student_id).exists():  # type: ignore
                        errors.append({
                            'student_id': student_id,
                            'error': 'Student is already enrolled in this course'
                        })
                        continue
                    
                    # Check if course is at enrollment limit
                    current_enrollment_count = Enrollment.objects.filter(
                        course_id=course_id, 
                        status='active'
                    ).count()  # type: ignore
                    
                    if current_enrollment_count >= course.enrollment_limit:
                        # Add to waitlist
                        enrollment = Enrollment(
                            course_id=course_id,
                            student_id=student_id,
                            status='waitlisted'
                        )
                        enrollment.save()
                        waitlisted_students.append({
                            'student_id': student_id,
                            'data': enrollment.to_json()
                        })
                    else:
                        # Add to course
                        enrollment = Enrollment(
                            course_id=course_id,
                            student_id=student_id,
                            status='active'
                        )
                        enrollment.save()
                        enrolled_students.append({
                            'student_id': student_id,
                            'data': enrollment.to_json()
                        })
                        
                except Exception as e:
                    errors.append({
                        'student_id': student_id,
                        'error': str(e)
                    })
            
            # If there were any successful enrollments, check if we need to auto-enroll from waitlist
            if enrolled_students or waitlisted_students:
                # This would be handled automatically when students are added above
                pass
            
            return JsonResponse({
                'success': True,
                'message': f'Bulk enrollment completed. {len(enrolled_students)} students enrolled, {len(waitlisted_students)} students waitlisted, {len(errors)} errors.',
                'enrolled_students': enrolled_students,
                'waitlisted_students': waitlisted_students,
                'errors': errors
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to bulk enroll students'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def manage_waitlist(request, course_id):
    """Manage course waitlist - approve or reject waitlisted students"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Verify faculty teaches this course
            try:
                course = Course.objects.get(id=course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
            except Course.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Course not found or access denied'
                }, status=404)
            
            # Get action and student IDs from request data
            action = data.get('action')  # 'approve' or 'reject'
            student_ids = data.get('student_ids', [])
            
            if action not in ['approve', 'reject']:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid action. Must be "approve" or "reject".'
                }, status=400)
            
            if not student_ids:
                return JsonResponse({
                    'success': False,
                    'message': 'At least one student ID is required.'
                }, status=400)
            
            processed_students = []
            errors = []
            
            # Process each student
            for student_id in student_ids:
                try:
                    # Get waitlisted enrollment record
                    try:
                        enrollment = Enrollment.objects.get(
                            course_id=course_id, 
                            student_id=student_id, 
                            status='waitlisted'
                        )  # type: ignore
                    except Enrollment.DoesNotExist:  # type: ignore
                        errors.append({
                            'student_id': student_id,
                            'error': 'Student is not waitlisted for this course'
                        })
                        continue
                    
                    if action == 'approve':
                        # Check if course is at enrollment limit
                        current_enrollment_count = Enrollment.objects.filter(
                            course_id=course_id, 
                            status='active'
                        ).count()  # type: ignore
                        
                        if current_enrollment_count >= course.enrollment_limit:
                            errors.append({
                                'student_id': student_id,
                                'error': 'Cannot approve - course is at capacity'
                            })
                            continue
                        
                        # Approve student (move from waitlist to active)
                        enrollment.status = 'active'
                        enrollment.save()
                        processed_students.append({
                            'student_id': student_id,
                            'action': 'approved',
                            'data': enrollment.to_json()
                        })
                    else:  # action == 'reject'
                        # Reject student (remove from waitlist)
                        enrollment.delete()
                        processed_students.append({
                            'student_id': student_id,
                            'action': 'rejected'
                        })
                        
                except Exception as e:
                    errors.append({
                        'student_id': student_id,
                        'error': str(e)
                    })
            
            return JsonResponse({
                'success': True,
                'message': f'Waitlist management completed. {len(processed_students)} students processed, {len(errors)} errors.',
                'processed_students': processed_students,
                'errors': errors
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to manage waitlist'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_course_roster(request, course_id):
    """Get class roster for a specific course"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Verify faculty teaches this course
            try:
                course = Course.objects.get(id=course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
            except Course.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Course not found or access denied'
                }, status=404)
            
            # Get all enrollments for this course (active, completed, dropped)
            enrollments = Enrollment.objects.filter(course_id=course_id)  # type: ignore
            
            # Apply filtering and sorting
            enrollments = apply_filtering_and_sorting(enrollments, request, 'enrollments')
            
            # Return paginated response
            return paginate_enrollments(enrollments, request)
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve course roster'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)


@csrf_exempt
def manage_course_enrollment(request, course_id):
    """Manage course enrollment - add, update, or remove students"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Verify faculty teaches this course
            try:
                course = Course.objects.get(id=course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
            except Course.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Course not found or access denied'
                }, status=404)
            
            # Get action from request data
            action = data.get('action')  # 'add', 'remove', 'update_status'
            student_id = data.get('student_id')
            
            if action not in ['add', 'remove', 'update_status']:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid action. Must be "add", "remove", or "update_status".'
                }, status=400)
            
            if not student_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Student ID is required.'
                }, status=400)
            
            if action == 'add':
                # Add student to course
                # Check if student is already enrolled
                if Enrollment.objects.filter(course_id=course_id, student_id=student_id).exists():  # type: ignore
                    return JsonResponse({
                        'success': False,
                        'message': 'Student is already enrolled in this course'
                    }, status=400)
                
                # Check if course is at enrollment limit
                current_enrollment_count = Enrollment.objects.filter(course_id=course_id, status='active').count()  # type: ignore
                if current_enrollment_count >= course.enrollment_limit:
                    # Add to waitlist instead
                    enrollment = Enrollment(
                        id=str(uuid.uuid4()),
                        course_id=course_id,
                        student_id=student_id,
                        status='waitlisted'
                    )
                    message = 'Student added to waitlist - course is at capacity'
                else:
                    # Add to course
                    enrollment = Enrollment(
                        id=str(uuid.uuid4()),
                        course_id=course_id,
                        student_id=student_id,
                        status='active'
                    )
                    message = 'Student enrolled successfully'
                
                # Save enrollment
                enrollment.save()
                
                return JsonResponse({
                    'success': True,
                    'message': message,
                    'data': enrollment.to_json()
                })
            
            elif action == 'remove':
                # Remove student from course
                try:
                    enrollment = Enrollment.objects.get(course_id=course_id, student_id=student_id)  # type: ignore
                except Enrollment.DoesNotExist:  # type: ignore
                    return JsonResponse({
                        'success': False,
                        'message': 'Student is not enrolled in this course'
                    }, status=404)
                
                # Delete enrollment
                enrollment.delete()
                
                # If there are students on the waitlist and the course is now below capacity,
                # automatically enroll the next student from the waitlist
                current_enrollment_count = Enrollment.objects.filter(
                    course_id=course_id, 
                    status='active'
                ).count()  # type: ignore
                
                if current_enrollment_count < course.enrollment_limit:
                    # Get the next waitlisted student
                    waitlisted_enrollment = Enrollment.objects.filter(
                        course_id=course_id, 
                        status='waitlisted'
                    ).order_by('created_at').first()  # type: ignore
                    
                    if waitlisted_enrollment:
                        waitlisted_enrollment.status = 'active'
                        waitlisted_enrollment.save()
                
                return JsonResponse({
                    'success': True,
                    'message': 'Student removed from course successfully'
                })
            
            elif action == 'update_status':
                # Update enrollment status
                try:
                    enrollment = Enrollment.objects.get(course_id=course_id, student_id=student_id)  # type: ignore
                except Enrollment.DoesNotExist:  # type: ignore
                    return JsonResponse({
                        'success': False,
                        'message': 'Student is not enrolled in this course'
                    }, status=404)
                
                # Get new status from request data
                new_status = data.get('status')
                if new_status not in ['active', 'dropped', 'completed', 'waitlisted']:
                    return JsonResponse({
                        'success': False,
                        'message': 'Invalid status. Must be "active", "dropped", "completed", or "waitlisted".'
                    }, status=400)
                
                # Update status
                old_status = enrollment.status
                enrollment.status = new_status
                enrollment.save()
                
                return JsonResponse({
                    'success': True,
                    'message': f'Enrollment status updated from {old_status} to {new_status}',
                    'data': enrollment.to_json()
                })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to manage course enrollment'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)


@csrf_exempt
def get_course_waitlist(request, course_id):
    """Get all waitlisted students for a specific course"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Verify faculty teaches this course
            try:
                course = Course.objects.get(id=course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
            except Course.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Course not found or access denied'
                }, status=404)
            
            # Get waitlisted enrollments for this course
            waitlisted_enrollments = Enrollment.objects.filter(
                course_id=course_id, 
                status='waitlisted'
            )  # type: ignore
            
            # Apply filtering and sorting
            waitlisted_enrollments = apply_filtering_and_sorting(
                waitlisted_enrollments, 
                request, 
                'enrollments'
            )
            
            # Return paginated response
            return paginate_enrollments(waitlisted_enrollments, request)
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve waitlist'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)
