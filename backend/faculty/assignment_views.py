from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.db import models
import json
import uuid
from assignments.models import Assignment
from courses.models import Course
import decimal

@csrf_exempt
def create_assignment(request):
    """Create a new assignment"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Validate required fields
            required_fields = ['course_id', 'title', 'description', 'due_date', 'points', 'type']
            for field in required_fields:
                if field not in data:
                    return JsonResponse({
                        'success': False,
                        'message': f'Missing required field: {field}'
                    }, status=400)
            
            # Verify faculty teaches this course
            try:
                course = Course.objects.get(id=data['course_id'], instructor_id=faculty_profile.employee_id)  # type: ignore
            except Course.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Course not found or access denied'
                }, status=404)
            
            # Check if using a template
            template_id = data.get('template_id')
            if template_id:
                try:
                    template_assignment = Assignment.objects.get(id=template_id)  # type: ignore
                    # Use template data as base
                    assignment_data = template_assignment.to_json()
                    # Override with provided data
                    assignment_data.update(data)
                except Assignment.DoesNotExist:  # type: ignore
                    return JsonResponse({
                        'success': False,
                        'message': 'Template assignment not found'
                    }, status=404)
            else:
                assignment_data = data
            
            # Generate assignment ID
            assignment_id = str(uuid.uuid4())
            
            # Create assignment
            assignment = Assignment(
                id=assignment_id,
                course_id=assignment_data['course_id'],
                title=assignment_data['title'],
                description=assignment_data['description'],
                due_date=assignment_data['due_date'],
                points=assignment_data['points'],
                type=assignment_data['type'],
                start_date=assignment_data.get('start_date', timezone.now()),
                allow_late_submission=assignment_data.get('allow_late_submission', False),
                late_penalty=decimal.Decimal(str(assignment_data.get('late_penalty', 0))),
                max_submissions=assignment_data.get('max_submissions', 1),
                visible_to_students=assignment_data.get('visible_to_students', True),
                category=assignment_data.get('category', ''),
                weight=decimal.Decimal(str(assignment_data.get('weight', 1.0)))
            )
            
            # Add optional fields if provided
            if 'attachments' in assignment_data:
                assignment.attachments = assignment_data['attachments']
            
            if 'rubric' in assignment_data:
                assignment.rubric = assignment_data['rubric']
            
            # Save assignment
            assignment.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Assignment created successfully',
                'data': assignment.to_json()
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to create assignment'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_assignment_templates(request):
    """Get available assignment templates for quick creation"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get templates (assignments marked as templates)
            # In a real implementation, you might have a separate Template model
            # For now, we'll get assignments that have been marked as templates
            # Since there's no is_template field in the Assignment model, we'll return
            # a few sample assignments that could be used as templates
            templates = Assignment.objects.filter(course_id__in=[
                course.id for course in Course.objects.filter(instructor_id=faculty_profile.employee_id)  # type: ignore
            ])[:10]  # type: ignore
            
            # Convert to JSON format
            templates_data = [template.to_json() for template in templates]
            
            return JsonResponse({
                'success': True,
                'data': templates_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve assignment templates'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_faculty_assignments(request):
    """Get all assignments created by the authenticated faculty member"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get assignments where course_id matches courses taught by faculty
            courses = Course.objects.filter(instructor_id=faculty_profile.employee_id)  # type: ignore
            course_ids = [course.id for course in courses]
            
            assignments = Assignment.objects.filter(course_id__in=course_ids)  # type: ignore
            
            # Apply filtering and sorting
            # For assignments, we'll need to implement custom filtering logic
            # since we don't have a generic apply_filtering_and_sorting function for assignments yet
            
            # Handle basic filtering
            course_id_filter = request.GET.get('course_id')
            if course_id_filter:
                assignments = assignments.filter(course_id=course_id_filter)
            
            type_filter = request.GET.get('type')
            if type_filter:
                assignments = assignments.filter(type=type_filter)
            
            # Handle date range filtering
            from_date = request.GET.get('from_date')
            to_date = request.GET.get('to_date')
            if from_date:
                assignments = assignments.filter(due_date__gte=from_date)
            if to_date:
                assignments = assignments.filter(due_date__lte=to_date)
            
            # Convert to JSON format
            assignments_data = [assignment.to_json() for assignment in assignments]
            
            # Add submission statistics to each assignment
            for assignment_data in assignments_data:
                assignment_id = assignment_data['id']
                # In a real implementation, you would get actual submission counts
                # For now, we'll just add placeholder statistics
                assignment_data['submission_stats'] = {
                    'total_submissions': 0,
                    'graded_submissions': 0,
                    'pending_submissions': 0,
                    'average_score': 0.0
                }
            
            return JsonResponse({
                'success': True,
                'data': assignments_data
            })
            
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
def get_assignment_detail(request, assignment_id):
    """Get detailed information for a specific assignment"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get assignment
            try:
                assignment = Assignment.objects.get(id=assignment_id)  # type: ignore
            except Assignment.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Assignment not found'
                }, status=404)
            
            # Verify faculty teaches the course for this assignment
            try:
                course = Course.objects.get(id=assignment.course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
            except Course.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied - you do not teach this course'
                }, status=403)
            
            # Get detailed assignment data
            assignment_data = assignment.to_json()
            
            # Add submission statistics
            # In a real implementation, you would get actual submission data
            # For now, we'll just add placeholder statistics
            assignment_data['submission_stats'] = {
                'total_submissions': 0,
                'graded_submissions': 0,
                'pending_submissions': 0,
                'average_score': 0.0
            }
            
            # Add performance metrics
            assignment_data['performance_metrics'] = {
                'completion_rate': 0.0,
                'on_time_submission_rate': 0.0,
                'average_late_penalty': 0.0
            }
            
            return JsonResponse({
                'success': True,
                'data': assignment_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve assignment details'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def search_assignments(request):
    """Search assignments with content indexing"""
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
            
            # Get assignments where course_id matches courses taught by faculty
            courses = Course.objects.filter(instructor_id=faculty_profile.employee_id)  # type: ignore
            course_ids = [course.id for course in courses]
            
            # Search assignments in faculty's courses
            assignments = Assignment.objects.filter(
                course_id__in=course_ids
            ).filter(  # type: ignore
                models.Q(title__icontains=query) |
                models.Q(description__icontains=query) |
                models.Q(category__icontains=query)
            )
            
            # Handle filtering
            course_id_filter = request.GET.get('course_id')
            if course_id_filter:
                assignments = assignments.filter(course_id=course_id_filter)
            
            type_filter = request.GET.get('type')
            if type_filter:
                assignments = assignments.filter(type=type_filter)
            
            # Handle date range filtering
            from_date = request.GET.get('from_date')
            to_date = request.GET.get('to_date')
            if from_date:
                assignments = assignments.filter(due_date__gte=from_date)
            if to_date:
                assignments = assignments.filter(due_date__lte=to_date)
            
            # Convert to JSON format
            assignments_data = [assignment.to_json() for assignment in assignments]
            
            # Add submission statistics to each assignment
            for assignment_data in assignments_data:
                assignment_id = assignment_data['id']
                # In a real implementation, you would get actual submission counts
                assignment_data['submission_stats'] = {
                    'total_submissions': 0,
                    'graded_submissions': 0,
                    'pending_submissions': 0,
                    'average_score': 0.0
                }
            
            return JsonResponse({
                'success': True,
                'data': assignments_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to search assignments'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_assignment_analytics(request, assignment_id):
    """Get analytics for a specific assignment"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get assignment
            try:
                assignment = Assignment.objects.get(id=assignment_id)  # type: ignore
            except Assignment.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Assignment not found'
                }, status=404)
            
            # Verify faculty teaches the course for this assignment
            try:
                course = Course.objects.get(id=assignment.course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
            except Course.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied - you do not teach this course'
                }, status=403)
            
            # Generate analytics data
            # In a real implementation, you would get actual data from the database
            # For now, we'll just create placeholder analytics
            
            analytics_data = {
                'assignment_id': assignment_id,
                'title': assignment.title,
                'total_students': 0,  # Would get from course enrollment
                'total_submissions': 0,
                'graded_submissions': 0,
                'pending_submissions': 0,
                'late_submissions': 0,
                'on_time_submissions': 0,
                'average_score': 0.0,
                'score_distribution': {},  # Would contain grade distribution data
                'completion_rate': 0.0,
                'on_time_submission_rate': 0.0,
                'average_late_penalty': 0.0
            }
            
            return JsonResponse({
                'success': True,
                'data': analytics_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve assignment analytics'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def submit_grade(request):
    """Submit a grade for a student's assignment"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Validate required fields
            required_fields = ['assignment_id', 'student_id', 'points', 'max_points']
            for field in required_fields:
                if field not in data:
                    return JsonResponse({
                        'success': False,
                        'message': f'Missing required field: {field}'
                    }, status=400)
            
            # Get assignment
            try:
                assignment = Assignment.objects.get(id=data['assignment_id'])  # type: ignore
            except Assignment.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Assignment not found'
                }, status=404)
            
            # Verify faculty teaches the course for this assignment
            try:
                course = Course.objects.get(id=assignment.course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
            except Course.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied - you do not teach this course'
                }, status=403)
            
            # Create or update grade
            from assignments.models import Grade
            
            # Check if grade already exists
            try:
                grade = Grade.objects.get(
                    assignment_id=data['assignment_id'],
                    student_id=data['student_id']
                )  # type: ignore
                
                # Update existing grade
                grade.value = decimal.Decimal(str(data['points']))
                grade.max_points = decimal.Decimal(str(data['max_points']))
                if 'letter_grade' in data:
                    grade.letter_grade = data['letter_grade']
                if 'comments' in data:
                    grade.comments = data['comments']
                if 'category' in data:
                    grade.category = data['category']
                grade.grader_id = faculty_profile.employee_id
            except Grade.DoesNotExist:  # type: ignore
                # Create new grade
                grade_id = str(uuid.uuid4())
                grade = Grade(
                    id=grade_id,
                    assignment_id=data['assignment_id'],
                    student_id=data['student_id'],
                    value=decimal.Decimal(str(data['points'])),
                    max_points=decimal.Decimal(str(data['max_points'])),
                    letter_grade=data.get('letter_grade', ''),
                    category=data.get('category', 'assignment'),
                    grader_id=faculty_profile.employee_id,
                    comments=data.get('comments', '')
                )
            
            # Save grade
            grade.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Grade submitted successfully',
                'data': grade.to_json()
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to submit grade'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def bulk_grade_submissions(request):
    """Bulk grade multiple student submissions"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Validate required data structure
            if 'grades' not in data or not isinstance(data['grades'], list):
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid data format. Expected "grades" as a list of grade objects.'
                }, status=400)
            
            processed_grades = []
            errors = []
            
            # Process each grade submission
            for grade_data in data['grades']:
                try:
                    # Validate required fields for this grade
                    required_fields = ['assignment_id', 'student_id', 'points', 'max_points']
                    for field in required_fields:
                        if field not in grade_data:
                            errors.append({
                                'student_id': grade_data.get('student_id', 'unknown'),
                                'error': f'Missing required field: {field}'
                            })
                            continue
                    
                    # Get assignment
                    try:
                        assignment = Assignment.objects.get(id=grade_data['assignment_id'])  # type: ignore
                    except Assignment.DoesNotExist:  # type: ignore
                        errors.append({
                            'student_id': grade_data['student_id'],
                            'error': 'Assignment not found'
                        })
                        continue
                    
                    # Verify faculty teaches the course for this assignment
                    try:
                        course = Course.objects.get(id=assignment.course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
                    except Course.DoesNotExist:  # type: ignore
                        errors.append({
                            'student_id': grade_data['student_id'],
                            'error': 'Access denied - you do not teach this course'
                        })
                        continue
                    
                    # Create or update grade
                    from assignments.models import Grade
                    
                    # Check if grade already exists
                    try:
                        grade = Grade.objects.get(
                            assignment_id=grade_data['assignment_id'],
                            student_id=grade_data['student_id']
                        )  # type: ignore
                        
                        # Update existing grade
                        grade.value = decimal.Decimal(str(grade_data['points']))
                        grade.max_points = decimal.Decimal(str(grade_data['max_points']))
                        if 'letter_grade' in grade_data:
                            grade.letter_grade = grade_data['letter_grade']
                        if 'comments' in grade_data:
                            grade.comments = grade_data['comments']
                        if 'category' in grade_data:
                            grade.category = grade_data['category']
                        grade.grader_id = faculty_profile.employee_id
                    except Grade.DoesNotExist:  # type: ignore
                        # Create new grade
                        grade_id = str(uuid.uuid4())
                        grade = Grade(
                            id=grade_id,
                            assignment_id=grade_data['assignment_id'],
                            student_id=grade_data['student_id'],
                            value=decimal.Decimal(str(grade_data['points'])),
                            max_points=decimal.Decimal(str(grade_data['max_points'])),
                            letter_grade=grade_data.get('letter_grade', ''),
                            category=grade_data.get('category', 'assignment'),
                            grader_id=faculty_profile.employee_id,
                            comments=grade_data.get('comments', '')
                        )
                    
                    # Save grade
                    grade.save()
                    
                    processed_grades.append({
                        'student_id': grade_data['student_id'],
                        'grade_id': grade.id,
                        'data': grade.to_json()
                    })
                    
                except Exception as e:
                    errors.append({
                        'student_id': grade_data.get('student_id', 'unknown'),
                        'error': str(e)
                    })
            
            return JsonResponse({
                'success': True,
                'message': f'Bulk grading completed. {len(processed_grades)} grades processed, {len(errors)} errors.',
                'processed_grades': processed_grades,
                'errors': errors
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to process bulk grading'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def export_gradebook(request, course_id):
    """Export gradebook data for a course"""
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
            
            # Get all assignments for this course
            assignments = Assignment.objects.filter(course_id=course_id)  # type: ignore
            
            # Get all grades for these assignments
            from assignments.models import Grade
            assignment_ids = [assignment.id for assignment in assignments]
            grades = Grade.objects.filter(assignment_id__in=assignment_ids)  # type: ignore
            
            # Get all students enrolled in this course
            from courses.models import Enrollment
            enrollments = Enrollment.objects.filter(course_id=course_id)  # type: ignore
            student_ids = [enrollment.student_id for enrollment in enrollments]
            
            # Format data for export
            # In a real implementation, you might want to format this as CSV or Excel
            # For now, we'll return JSON data
            
            # Create a structured gradebook
            gradebook_data = {
                'course': course.to_json(),
                'assignments': [assignment.to_json() for assignment in assignments],
                'students': [enrollment.student_id for enrollment in enrollments],
                'grades': [grade.to_json() for grade in grades]
            }
            
            return JsonResponse({
                'success': True,
                'data': gradebook_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to export gradebook'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def calculate_grade_statistics(request, assignment_id):
    """Calculate grade statistics for an assignment"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get assignment
            try:
                assignment = Assignment.objects.get(id=assignment_id)  # type: ignore
            except Assignment.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Assignment not found'
                }, status=404)
            
            # Verify faculty teaches the course for this assignment
            try:
                course = Course.objects.get(id=assignment.course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
            except Course.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied - you do not teach this course'
                }, status=403)
            
            # Get all grades for this assignment
            from assignments.models import Grade
            grades = Grade.objects.filter(assignment_id=assignment_id)  # type: ignore
            
            # Calculate statistics
            grade_values = []
            for grade in grades:
                try:
                    percentage = grade.calculate_percentage()
                    if percentage is not None:
                        grade_values.append(percentage)
                except:
                    pass
            
            # Calculate basic statistics
            if grade_values:
                average = sum(grade_values) / len(grade_values)
                minimum = min(grade_values)
                maximum = max(grade_values)
                
                # Calculate median
                sorted_values = sorted(grade_values)
                n = len(sorted_values)
                if n % 2 == 0:
                    median = (sorted_values[n//2 - 1] + sorted_values[n//2]) / 2
                else:
                    median = sorted_values[n//2]
            else:
                average = 0
                minimum = 0
                maximum = 0
                median = 0
            
            # Calculate grade distribution
            grade_distribution = {
                'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0
            }
            
            for grade in grades:
                letter_grade = getattr(grade, 'letter_grade', '')
                if letter_grade in grade_distribution:
                    grade_distribution[letter_grade] += 1
            
            statistics_data = {
                'assignment_id': assignment_id,
                'assignment_title': assignment.title,
                'total_grades': len(grade_values),
                'average_percentage': round(average, 2),
                'median_percentage': round(median, 2),
                'min_percentage': round(minimum, 2),
                'max_percentage': round(maximum, 2),
                'grade_distribution': grade_distribution
            }
            
            return JsonResponse({
                'success': True,
                'data': statistics_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to calculate grade statistics'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def review_submission(request, submission_id):
    """Review a student submission with annotations and feedback"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get submission
            try:
                submission = Submission.objects.get(id=submission_id)  # type: ignore
            except Submission.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Submission not found'
                }, status=404)
            
            # Get assignment for this submission
            try:
                assignment = Assignment.objects.get(id=submission.assignment_id)  # type: ignore
            except Assignment.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Assignment not found'
                }, status=404)
            
            # Verify faculty teaches the course for this assignment
            try:
                course = Course.objects.get(id=assignment.course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
            except Course.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied - you do not teach this course'
                }, status=403)
            
            # Add review data to submission
            review_data = {
                'reviewer_id': faculty_profile.employee_id,
                'reviewed_at': timezone.now().isoformat(),
                'comments': data.get('comments', ''),
                'annotations': data.get('annotations', []),
                'grade': data.get('grade'),
                'feedback': data.get('feedback', '')
            }
            
            # If there's a revision history, add this review to it
            if submission.revision_history is None:
                submission.revision_history = []
            
            submission.revision_history.append(review_data)
            
            # Update submission with review data
            if 'grade' in data:
                submission.grade = decimal.Decimal(str(data['grade']))
            if 'feedback' in data:
                submission.feedback = data['feedback']
            
            # Save submission
            submission.save()
            
            return JsonResponse({
                'success': True,
                'message': 'Submission reviewed successfully',
                'data': {
                    'submission_id': submission_id,
                    'review_data': review_data
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to review submission'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_submission_reviews(request, submission_id):
    """Get all reviews for a specific submission"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get submission
            try:
                submission = Submission.objects.get(id=submission_id)  # type: ignore
            except Submission.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Submission not found'
                }, status=404)
            
            # Get assignment for this submission
            try:
                assignment = Assignment.objects.get(id=submission.assignment_id)  # type: ignore
            except Assignment.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Assignment not found'
                }, status=404)
            
            # Verify faculty teaches the course for this assignment
            try:
                course = Course.objects.get(id=assignment.course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
            except Course.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied - you do not teach this course'
                }, status=403)
            
            # Get review history
            review_history = submission.revision_history or []
            
            return JsonResponse({
                'success': True,
                'data': {
                    'submission_id': submission_id,
                    'student_id': submission.student_id,
                    'assignment_id': assignment.id,
                    'reviews': review_history
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve submission reviews'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def add_peer_reviewer(request, submission_id):
    """Add a peer reviewer to a submission"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get submission
            try:
                submission = Submission.objects.get(id=submission_id)  # type: ignore
            except Submission.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Submission not found'
                }, status=404)
            
            # Get assignment for this submission
            try:
                assignment = Assignment.objects.get(id=submission.assignment_id)  # type: ignore
            except Assignment.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Assignment not found'
                }, status=404)
            
            # Verify faculty teaches the course for this assignment
            try:
                course = Course.objects.get(id=assignment.course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
            except Course.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied - you do not teach this course'
                }, status=403)
            
            # Get peer reviewer ID from request data
            peer_reviewer_id = data.get('peer_reviewer_id')
            if not peer_reviewer_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Peer reviewer ID is required'
                }, status=400)
            
            # In a real implementation, you would add the peer reviewer to a peer review system
            # For now, we'll just simulate adding a peer reviewer
            
            peer_review_data = {
                'peer_reviewer_id': peer_reviewer_id,
                'assigned_at': timezone.now().isoformat(),
                'status': 'assigned'
            }
            
            # If there's a peer review list, add this reviewer to it
            # In a real implementation, you might have a separate PeerReview model
            # For now, we'll just return a success response
            
            return JsonResponse({
                'success': True,
                'message': 'Peer reviewer added successfully',
                'data': peer_review_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to add peer reviewer'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_peer_reviews(request, assignment_id):
    """Get all peer reviews for an assignment"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get assignment
            try:
                assignment = Assignment.objects.get(id=assignment_id)  # type: ignore
            except Assignment.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Assignment not found'
                }, status=404)
            
            # Verify faculty teaches the course for this assignment
            try:
                course = Course.objects.get(id=assignment.course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
            except Course.DoesNotExist:  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied - you do not teach this course'
                }, status=403)
            
            # In a real implementation, you would retrieve peer reviews from a database
            # For now, we'll just return a simulated response
            
            peer_reviews = [
                {
                    'id': str(uuid.uuid4()),
                    'submission_id': str(uuid.uuid4()),
                    'reviewer_id': 'STU002',  # Peer student ID
                    'reviewee_id': 'STU001',  # Student being reviewed
                    'assignment_id': assignment_id,
                    'score': 4.5,
                    'comments': 'Good work overall, but could improve documentation',
                    'submitted_at': timezone.now().isoformat()
                }
            ]
            
            return JsonResponse({
                'success': True,
                'data': {
                    'assignment_id': assignment_id,
                    'peer_reviews': peer_reviews
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve peer reviews'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)
