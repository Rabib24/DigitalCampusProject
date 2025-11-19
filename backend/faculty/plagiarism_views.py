from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import json
import uuid
from assignments.models import Assignment, Submission
from courses.models import Course
import decimal

# Simulated plagiarism detection service
class PlagiarismService:
    """Simulated plagiarism detection service"""
    
    @staticmethod
    def check_plagiarism(content, threshold=0.7):
        """
        Simulate plagiarism checking
        In a real implementation, this would call an external service like Turnitin
        """
        # Simulate some plagiarism detection logic
        # In reality, this would make an API call to a plagiarism detection service
        
        # For simulation, we'll generate random similarity scores
        import random
        similarity_score = random.uniform(0, 1)
        
        # Determine if content is plagiarized based on threshold
        is_plagiarized = similarity_score > threshold
        
        return {
            'similarity_score': round(similarity_score, 4),
            'is_plagiarized': is_plagiarized,
            'threshold': threshold,
            'sources': [
                {
                    'source_id': str(uuid.uuid4()),
                    'source_url': 'https://example.com/source1',
                    'matched_text': 'This is a sample matched text...',
                    'similarity': round(random.uniform(0.5, similarity_score), 4)
                }
            ] if is_plagiarized else []
        }

@csrf_exempt
def check_submission_plagiarism(request, submission_id):
    """Check a specific submission for plagiarism"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body) if request.body else {}
            
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
            
            # Get similarity threshold (default to 0.7 if not provided)
            threshold = data.get('threshold', 0.7)
            
            # Check plagiarism
            plagiarism_result = PlagiarismService.check_plagiarism(submission.content, threshold)
            
            # Create plagiarism report
            report_id = str(uuid.uuid4())
            plagiarism_report = {
                'id': report_id,
                'submission_id': submission_id,
                'assignment_id': assignment.id,
                'student_id': submission.student_id,
                'checked_at': timezone.now().isoformat(),
                'threshold': threshold,
                'result': plagiarism_result
            }
            
            # In a real implementation, you would store this report in a database
            # For now, we'll just return it in the response
            
            return JsonResponse({
                'success': True,
                'message': 'Plagiarism check completed',
                'data': plagiarism_report
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to check plagiarism'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def check_assignment_plagiarism(request, assignment_id):
    """Check all submissions for an assignment for plagiarism"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body) if request.body else {}
            
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
            
            # Get all submissions for this assignment
            submissions = Submission.objects.filter(assignment_id=assignment_id)  # type: ignore
            
            # Get similarity threshold (default to 0.7 if not provided)
            threshold = data.get('threshold', 0.7)
            
            # Check plagiarism for each submission
            plagiarism_results = []
            for submission in submissions:
                # Check plagiarism
                plagiarism_result = PlagiarismService.check_plagiarism(submission.content, threshold)
                
                # Create plagiarism report
                report_id = str(uuid.uuid4())
                plagiarism_report = {
                    'id': report_id,
                    'submission_id': submission.id,
                    'assignment_id': assignment.id,
                    'student_id': submission.student_id,
                    'checked_at': timezone.now().isoformat(),
                    'threshold': threshold,
                    'result': plagiarism_result
                }
                
                plagiarism_results.append(plagiarism_report)
            
            # Filter results to only include plagiarized submissions
            plagiarized_submissions = [
                report for report in plagiarism_results 
                if report['result']['is_plagiarized']
            ]
            
            return JsonResponse({
                'success': True,
                'message': f'Plagiarism check completed for {len(submissions)} submissions',
                'data': {
                    'total_submissions': len(submissions),
                    'plagiarized_submissions': len(plagiarized_submissions),
                    'reports': plagiarism_results,
                    'plagiarized_only': plagiarized_submissions
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to check plagiarism for assignment'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_plagiarism_report(request, report_id):
    """Get a specific plagiarism report"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # In a real implementation, you would retrieve the report from a database
            # For now, we'll return a simulated response
            
            # Simulate retrieving a report
            plagiarism_report = {
                'id': report_id,
                'submission_id': str(uuid.uuid4()),
                'assignment_id': str(uuid.uuid4()),
                'student_id': 'STU001',
                'checked_at': timezone.now().isoformat(),
                'threshold': 0.7,
                'result': {
                    'similarity_score': 0.85,
                    'is_plagiarized': True,
                    'threshold': 0.7,
                    'sources': [
                        {
                            'source_id': str(uuid.uuid4()),
                            'source_url': 'https://example.com/source1',
                            'matched_text': 'This is a sample matched text...',
                            'similarity': 0.75
                        }
                    ]
                }
            }
            
            return JsonResponse({
                'success': True,
                'data': plagiarism_report
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve plagiarism report'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def configure_plagiarism_threshold(request):
    """Configure plagiarism detection threshold"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get threshold from request data
            threshold = data.get('threshold')
            
            if threshold is None:
                return JsonResponse({
                    'success': False,
                    'message': 'Threshold is required'
                }, status=400)
            
            # Validate threshold is between 0 and 1
            if not (0 <= threshold <= 1):
                return JsonResponse({
                    'success': False,
                    'message': 'Threshold must be between 0 and 1'
                }, status=400)
            
            # In a real implementation, you would store this configuration
            # For now, we'll just return a success response
            
            return JsonResponse({
                'success': True,
                'message': 'Plagiarism threshold configured successfully',
                'data': {
                    'threshold': threshold,
                    'configured_at': timezone.now().isoformat()
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to configure plagiarism threshold'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def batch_plagiarism_check(request):
    """Perform batch plagiarism checking for multiple submissions"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Validate required data structure
            if 'submission_ids' not in data or not isinstance(data['submission_ids'], list):
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid data format. Expected "submission_ids" as a list of submission IDs.'
                }, status=400)
            
            submission_ids = data['submission_ids']
            threshold = data.get('threshold', 0.7)
            
            # Check plagiarism for each submission
            plagiarism_results = []
            errors = []
            
            for submission_id in submission_ids:
                try:
                    # Get submission
                    try:
                        submission = Submission.objects.get(id=submission_id)  # type: ignore
                    except Submission.DoesNotExist:  # type: ignore
                        errors.append({
                            'submission_id': submission_id,
                            'error': 'Submission not found'
                        })
                        continue
                    
                    # Get assignment for this submission
                    try:
                        assignment = Assignment.objects.get(id=submission.assignment_id)  # type: ignore
                    except Assignment.DoesNotExist:  # type: ignore
                        errors.append({
                            'submission_id': submission_id,
                            'error': 'Assignment not found'
                        })
                        continue
                    
                    # Verify faculty teaches the course for this assignment
                    try:
                        course = Course.objects.get(id=assignment.course_id, instructor_id=faculty_profile.employee_id)  # type: ignore
                    except Course.DoesNotExist:  # type: ignore
                        errors.append({
                            'submission_id': submission_id,
                            'error': 'Access denied - you do not teach this course'
                        })
                        continue
                    
                    # Check plagiarism
                    plagiarism_result = PlagiarismService.check_plagiarism(submission.content, threshold)
                    
                    # Create plagiarism report
                    report_id = str(uuid.uuid4())
                    plagiarism_report = {
                        'id': report_id,
                        'submission_id': submission_id,
                        'assignment_id': assignment.id,
                        'student_id': submission.student_id,
                        'checked_at': timezone.now().isoformat(),
                        'threshold': threshold,
                        'result': plagiarism_result
                    }
                    
                    plagiarism_results.append(plagiarism_report)
                    
                except Exception as e:
                    errors.append({
                        'submission_id': submission_id,
                        'error': str(e)
                    })
            
            # Filter results to only include plagiarized submissions
            plagiarized_submissions = [
                report for report in plagiarism_results 
                if report['result']['is_plagiarized']
            ]
            
            return JsonResponse({
                'success': True,
                'message': f'Batch plagiarism check completed for {len(submission_ids)} submissions',
                'data': {
                    'total_submissions': len(submission_ids),
                    'processed_submissions': len(plagiarism_results),
                    'plagiarized_submissions': len(plagiarized_submissions),
                    'reports': plagiarism_results,
                    'plagiarized_only': plagiarized_submissions,
                    'errors': errors
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to perform batch plagiarism check'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)