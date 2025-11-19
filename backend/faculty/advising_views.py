from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
import json
import uuid
from courses.models import Course, Enrollment
from users.models import Faculty
import decimal

# Simulated student profile data
# In a real implementation, this would come from a Student model
STUDENT_PROFILES = {
    'STU001': {
        'student_id': 'STU001',
        'name': 'John Doe',
        'email': 'johndoe@student.university.edu',
        'major': 'Computer Science',
        'year': 'Sophomore',
        'gpa': 3.75,
        'academic_standing': 'Good',
        'advisor_id': 'FAC001',
        'enrolled_courses': ['CS101', 'CS102', 'MATH101']
    },
    'STU002': {
        'student_id': 'STU002',
        'name': 'Jane Smith',
        'email': 'janesmith@student.university.edu',
        'major': 'Computer Science',
        'year': 'Junior',
        'gpa': 3.92,
        'academic_standing': 'Excellent',
        'advisor_id': 'FAC001',
        'enrolled_courses': ['CS201', 'CS202', 'PHYS101']
    },
    'STU003': {
        'student_id': 'STU003',
        'name': 'Bob Johnson',
        'email': 'bobjohnson@student.university.edu',
        'major': 'Mathematics',
        'year': 'Senior',
        'gpa': 3.25,
        'academic_standing': 'Probation',
        'advisor_id': 'FAC001',
        'enrolled_courses': ['MATH301', 'MATH302', 'STAT201']
    }
}

@csrf_exempt
def get_advisee_list(request):
    """Get list of advisees for the authenticated faculty member"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get all students advised by this faculty member
            # In a real implementation, you would query a Student model
            # For now, we'll filter our simulated data
            advisees = []
            for student_id, student_data in STUDENT_PROFILES.items():
                if student_data.get('advisor_id') == faculty_profile.employee_id:
                    advisees.append(student_data)
            
            # Apply filtering
            # Filter by academic standing
            academic_standing_filter = request.GET.get('academic_standing')
            if academic_standing_filter:
                advisees = [
                    student for student in advisees 
                    if student.get('academic_standing', '').lower() == academic_standing_filter.lower()
                ]
            
            # Filter by major
            major_filter = request.GET.get('major')
            if major_filter:
                advisees = [
                    student for student in advisees 
                    if student.get('major', '').lower() == major_filter.lower()
                ]
            
            # Apply sorting
            sort_by = request.GET.get('sort_by', 'name')
            sort_order = request.GET.get('sort_order', 'asc')
            
            if sort_by == 'gpa':
                advisees.sort(key=lambda x: x.get('gpa', 0), reverse=(sort_order == 'desc'))
            elif sort_by == 'name':
                advisees.sort(key=lambda x: x.get('name', ''), reverse=(sort_order == 'desc'))
            elif sort_by == 'year':
                # Simple year sorting (Freshman < Sophomore < Junior < Senior)
                year_order = {'Freshman': 1, 'Sophomore': 2, 'Junior': 3, 'Senior': 4}
                advisees.sort(key=lambda x: year_order.get(x.get('year', ''), 0), reverse=(sort_order == 'desc'))
            
            # Apply search
            search_query = request.GET.get('search')
            if search_query:
                search_query = search_query.lower()
                advisees = [
                    student for student in advisees
                    if search_query in student.get('name', '').lower() or
                       search_query in student.get('student_id', '').lower() or
                       search_query in student.get('email', '').lower()
                ]
            
            # Apply grouping/categorization
            group_by = request.GET.get('group_by')
            if group_by:
                grouped_advisees = {}
                for student in advisees:
                    group_key = student.get(group_by, 'Unknown')
                    if group_key not in grouped_advisees:
                        grouped_advisees[group_key] = []
                    grouped_advisees[group_key].append(student)
                advisees = grouped_advisees
            
            return JsonResponse({
                'success': True,
                'data': advisees
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve advisee list'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_advisee_detail(request, student_id):
    """Get detailed information for a specific advisee"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Check if student is advised by this faculty member
            student_profile = STUDENT_PROFILES.get(student_id)
            if not student_profile:
                return JsonResponse({
                    'success': False,
                    'message': 'Student not found'
                }, status=404)
            
            if student_profile.get('advisor_id') != faculty_profile.employee_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied - student is not your advisee'
                }, status=403)
            
            # Get additional information for the student
            # In a real implementation, you would get this from related models
            
            # Get enrolled courses
            enrolled_courses = []
            for course_code in student_profile.get('enrolled_courses', []):
                # In a real implementation, you would query the Course model
                # For now, we'll simulate course data
                course_data = {
                    'code': course_code,
                    'name': f'{course_code} Course Name',
                    'credits': 3,
                    'instructor': 'Instructor Name',
                    'grade': 'A' if course_code.endswith('01') else 'B'  # Simulated grades
                }
                enrolled_courses.append(course_data)
            
            # Add course information to student profile
            student_profile['courses'] = enrolled_courses
            
            # Calculate progress toward degree
            # In a real implementation, this would be more complex
            total_credits = len(enrolled_courses) * 3
            required_credits = 120  # Typical for a bachelor's degree
            progress_percentage = min(100, (total_credits / required_credits) * 100)
            
            student_profile['degree_progress'] = {
                'completed_credits': total_credits,
                'required_credits': required_credits,
                'progress_percentage': round(progress_percentage, 2)
            }
            
            return JsonResponse({
                'success': True,
                'data': student_profile
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve advisee details'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def search_advisees(request):
    """Search advisees with advanced filtering"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get all students advised by this faculty member
            advisees = []
            for student_id, student_data in STUDENT_PROFILES.items():
                if student_data.get('advisor_id') == faculty_profile.employee_id:
                    advisees.append(student_data)
            
            # Apply advanced filtering
            # GPA range filter
            min_gpa = request.GET.get('min_gpa')
            max_gpa = request.GET.get('max_gpa')
            if min_gpa:
                advisees = [student for student in advisees if student.get('gpa', 0) >= float(min_gpa)]
            if max_gpa:
                advisees = [student for student in advisees if student.get('gpa', 0) <= float(max_gpa)]
            
            # Year filter
            year_filter = request.GET.get('year')
            if year_filter:
                advisees = [student for student in advisees if student.get('year', '').lower() == year_filter.lower()]
            
            # Academic standing filter
            academic_standing_filter = request.GET.get('academic_standing')
            if academic_standing_filter:
                advisees = [
                    student for student in advisees 
                    if student.get('academic_standing', '').lower() == academic_standing_filter.lower()
                ]
            
            # Major filter
            major_filter = request.GET.get('major')
            if major_filter:
                advisees = [
                    student for student in advisees 
                    if student.get('major', '').lower() == major_filter.lower()
                ]
            
            # Search query
            search_query = request.GET.get('q')
            if search_query:
                search_query = search_query.lower()
                advisees = [
                    student for student in advisees
                    if search_query in student.get('name', '').lower() or
                       search_query in student.get('student_id', '').lower() or
                       search_query in student.get('email', '').lower() or
                       search_query in student.get('major', '').lower()
                ]
            
            # Apply sorting
            sort_by = request.GET.get('sort_by', 'name')
            sort_order = request.GET.get('sort_order', 'asc')
            
            if sort_by == 'gpa':
                advisees.sort(key=lambda x: x.get('gpa', 0), reverse=(sort_order == 'desc'))
            elif sort_by == 'name':
                advisees.sort(key=lambda x: x.get('name', ''), reverse=(sort_order == 'desc'))
            elif sort_by == 'year':
                year_order = {'Freshman': 1, 'Sophomore': 2, 'Junior': 3, 'Senior': 4}
                advisees.sort(key=lambda x: year_order.get(x.get('year', ''), 0), reverse=(sort_order == 'desc'))
            
            return JsonResponse({
                'success': True,
                'data': advisees
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to search advisees'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_advisee_categories(request):
    """Get advisee grouping and categorization features"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get all students advised by this faculty member
            advisees = []
            for student_id, student_data in STUDENT_PROFILES.items():
                if student_data.get('advisor_id') == faculty_profile.employee_id:
                    advisees.append(student_data)
            
            # Create categories
            categories = {
                'academic_standing': {},
                'major': {},
                'year': {},
                'gpa_ranges': {
                    '3.5-4.0': 0,
                    '3.0-3.49': 0,
                    '2.5-2.99': 0,
                    'below_2.5': 0
                }
            }
            
            # Populate categories
            for student in advisees:
                # Academic standing
                standing = student.get('academic_standing', 'Unknown')
                if standing not in categories['academic_standing']:
                    categories['academic_standing'][standing] = 0
                categories['academic_standing'][standing] += 1
                
                # Major
                major = student.get('major', 'Unknown')
                if major not in categories['major']:
                    categories['major'][major] = 0
                categories['major'][major] += 1
                
                # Year
                year = student.get('year', 'Unknown')
                if year not in categories['year']:
                    categories['year'][year] = 0
                categories['year'][year] += 1
                
                # GPA ranges
                gpa = student.get('gpa', 0)
                if gpa >= 3.5:
                    categories['gpa_ranges']['3.5-4.0'] += 1
                elif gpa >= 3.0:
                    categories['gpa_ranges']['3.0-3.49'] += 1
                elif gpa >= 2.5:
                    categories['gpa_ranges']['2.5-2.99'] += 1
                else:
                    categories['gpa_ranges']['below_2.5'] += 1
            
            return JsonResponse({
                'success': True,
                'data': categories
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve advisee categories'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_academic_progress(request, student_id):
    """Get academic progress tracking for a specific student"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Check if student is advised by this faculty member
            student_profile = STUDENT_PROFILES.get(student_id)
            if not student_profile:
                return JsonResponse({
                    'success': False,
                    'message': 'Student not found'
                }, status=404)
            
            if student_profile.get('advisor_id') != faculty_profile.employee_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied - student is not your advisee'
                }, status=403)
            
            # Simulate degree audit data
            # In a real implementation, this would come from a degree audit system
            degree_audit = {
                'student_id': student_id,
                'major': student_profile.get('major', 'Unknown'),
                'catalog_year': '2023-2024',
                'total_credits_required': 120,
                'total_credits_completed': len(student_profile.get('enrolled_courses', [])) * 3,
                'gpa': student_profile.get('gpa', 0),
                'requirements': [
                    {
                        'category': 'Core Requirements',
                        'credits_required': 45,
                        'credits_completed': 30,
                        'status': 'In Progress'
                    },
                    {
                        'category': 'Major Requirements',
                        'credits_required': 50,
                        'credits_completed': 36,
                        'status': 'In Progress'
                    },
                    {
                        'category': 'Electives',
                        'credits_required': 25,
                        'credits_completed': 15,
                        'status': 'In Progress'
                    }
                ]
            }
            
            # Calculate progress percentages
            overall_progress = min(100, (degree_audit['total_credits_completed'] / degree_audit['total_credits_required']) * 100)
            
            for requirement in degree_audit['requirements']:
                requirement['progress_percentage'] = min(100, (requirement['credits_completed'] / requirement['credits_required']) * 100)
            
            # Add projection data
            projected_gpa = calculate_projected_gpa(student_id, student_profile.get('gpa', 0))
            
            progress_data = {
                'degree_audit': degree_audit,
                'overall_progress': round(overall_progress, 2),
                'projected_gpa': projected_gpa,
                'graduation_eligibility': overall_progress >= 90  # Simple eligibility check
            }
            
            return JsonResponse({
                'success': True,
                'data': progress_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to retrieve academic progress'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

def calculate_projected_gpa(student_id, current_gpa):
    """Calculate projected GPA based on current performance"""
    # In a real implementation, this would be more sophisticated
    # For now, we'll simulate a simple projection
    import random
    adjustment = random.uniform(-0.2, 0.2)  # Random adjustment between -0.2 and +0.2
    projected_gpa = max(0.0, min(4.0, current_gpa + adjustment))
    return round(projected_gpa, 2)

@csrf_exempt
def get_gpa_projection(request, student_id):
    """Get GPA calculation and projection for a specific student"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Check if student is advised by this faculty member
            student_profile = STUDENT_PROFILES.get(student_id)
            if not student_profile:
                return JsonResponse({
                    'success': False,
                    'message': 'Student not found'
                }, status=404)
            
            if student_profile.get('advisor_id') != faculty_profile.employee_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied - student is not your advisee'
                }, status=403)
            
            current_gpa = student_profile.get('gpa', 0)
            projected_gpa = calculate_projected_gpa(student_id, current_gpa)
            
            # Simulate different scenarios
            scenarios = {
                'current': current_gpa,
                'projected': projected_gpa,
                'if_all_A': min(4.0, current_gpa + 0.3),
                'if_all_B': max(2.0, current_gpa - 0.2),
                'target_graduation': 3.0  # Minimum GPA for graduation
            }
            
            return JsonResponse({
                'success': True,
                'data': {
                    'student_id': student_id,
                    'scenarios': scenarios,
                    'recommendation': generate_gpa_recommendation(current_gpa, projected_gpa)
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to calculate GPA projection'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

def generate_gpa_recommendation(current_gpa, projected_gpa):
    """Generate recommendation based on GPA analysis"""
    if current_gpa >= 3.5:
        return "Excellent academic performance. Consider pursuing honors or research opportunities."
    elif current_gpa >= 3.0:
        return "Good academic standing. Focus on maintaining consistent performance."
    elif current_gpa >= 2.5:
        return "Satisfactory performance. Consider seeking academic support resources."
    else:
        return "Academic support recommended. Contact academic advising for resources."

@csrf_exempt
def check_degree_requirements(request, student_id):
    """Check degree requirements and validation for a specific student"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Check if student is advised by this faculty member
            student_profile = STUDENT_PROFILES.get(student_id)
            if not student_profile:
                return JsonResponse({
                    'success': False,
                    'message': 'Student not found'
                }, status=404)
            
            if student_profile.get('advisor_id') != faculty_profile.employee_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied - student is not your advisee'
                }, status=403)
            
            # Simulate degree requirement checking
            # In a real implementation, this would query a degree requirements database
            requirements_check = {
                'student_id': student_id,
                'major': student_profile.get('major', 'Unknown'),
                'requirements_met': [
                    {
                        'requirement': 'Mathematics Foundation',
                        'status': 'Completed',
                        'courses': ['MATH101', 'MATH102']
                    },
                    {
                        'requirement': 'Science Foundation',
                        'status': 'In Progress',
                        'courses': ['PHYS101'],
                        'needed': ['PHYS102']
                    }
                ],
                'requirements_pending': [
                    {
                        'requirement': 'Senior Capstone',
                        'status': 'Not Started',
                        'prerequisites': ['300-level courses']
                    }
                ]
            }
            
            # Calculate overall compliance
            total_requirements = len(requirements_check['requirements_met']) + len(requirements_check['requirements_pending'])
            completed_requirements = len(requirements_check['requirements_met'])
            compliance_percentage = (completed_requirements / total_requirements) * 100 if total_requirements > 0 else 0
            
            requirements_check['compliance_percentage'] = round(compliance_percentage, 2)
            requirements_check['on_track'] = compliance_percentage >= 70  # Simple tracking check
            
            return JsonResponse({
                'success': True,
                'data': requirements_check
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to check degree requirements'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_course_recommendations(request, student_id):
    """Get course recommendations and planning tools for a specific student"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Check if student is advised by this faculty member
            student_profile = STUDENT_PROFILES.get(student_id)
            if not student_profile:
                return JsonResponse({
                    'success': False,
                    'message': 'Student not found'
                }, status=404)
            
            if student_profile.get('advisor_id') != faculty_profile.employee_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied - student is not your advisee'
                }, status=403)
            
            # Simulate course recommendations
            # In a real implementation, this would use complex algorithms based on student history
            major = student_profile.get('major', 'Unknown')
            year = student_profile.get('year', 'Unknown')
            
            recommendations = {
                'student_id': student_id,
                'major': major,
                'year': year,
                'recommended_courses': generate_course_recommendations(major, year),
                'prerequisites_needed': check_prerequisites(student_profile.get('enrolled_courses', [])),
                'planning_tools': {
                    'four_year_plan': generate_four_year_plan(major),
                    'next_semester': generate_next_semester_plan(major, year)
                }
            }
            
            return JsonResponse({
                'success': True,
                'data': recommendations
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to generate course recommendations'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

def generate_course_recommendations(major, year):
    """Generate course recommendations based on major and year"""
    # In a real implementation, this would be more sophisticated
    base_recommendations = [
        {
            'course_code': 'CS301',
            'course_name': 'Data Structures and Algorithms',
            'credits': 3,
            'priority': 'High',
            'reason': 'Core requirement for Computer Science major'
        },
        {
            'course_code': 'CS302',
            'course_name': 'Database Systems',
            'credits': 3,
            'priority': 'Medium',
            'reason': 'Recommended for Computer Science major'
        }
    ]
    
    # Add year-specific recommendations
    if year == 'Sophomore':
        base_recommendations.append({
            'course_code': 'MATH201',
            'course_name': 'Discrete Mathematics',
            'credits': 3,
            'priority': 'High',
            'reason': 'Prerequisite for advanced CS courses'
        })
    
    return base_recommendations

def check_prerequisites(enrolled_courses):
    """Check for missing prerequisites"""
    # In a real implementation, this would query a prerequisites database
    return [
        {
            'course_code': 'CS301',
            'missing_prerequisites': ['CS102', 'MATH102']
        }
    ]

def generate_four_year_plan(major):
    """Generate a four-year academic plan"""
    # In a real implementation, this would be more detailed
    return {
        'freshman': ['CS101', 'CS102', 'MATH101', 'MATH102'],
        'sophomore': ['CS201', 'CS202', 'MATH201', 'PHYS101'],
        'junior': ['CS301', 'CS302', 'CS303', 'ELECTIVE1'],
        'senior': ['CS401', 'CS402', 'CAPSTONE', 'ELECTIVE2']
    }

def generate_next_semester_plan(major, year):
    """Generate a plan for the next semester"""
    # In a real implementation, this would be more detailed
    return ['CS301', 'CS302', 'MATH201'] if year == 'Sophomore' else ['CS401', 'CS402']

@csrf_exempt
def simulate_cgpa(request, student_id):
    """Simulate CGPA calculation with what-if scenarios"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Check if student is advised by this faculty member
            student_profile = STUDENT_PROFILES.get(student_id)
            if not student_profile:
                return JsonResponse({
                    'success': False,
                    'message': 'Student not found'
                }, status=404)
            
            if student_profile.get('advisor_id') != faculty_profile.employee_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied - student is not your advisee'
                }, status=403)
            
            # Get current academic data
            current_gpa = student_profile.get('gpa', 0)
            current_credits = len(student_profile.get('enrolled_courses', [])) * 3
            
            # Get what-if scenario data
            scenario_courses = data.get('courses', [])
            scenario_grades = data.get('grades', {})
            
            # Calculate projected CGPA
            projected_data = calculate_projected_cgpa(
                current_gpa, 
                current_credits, 
                scenario_courses, 
                scenario_grades
            )
            
            # Generate recommendations based on scenario
            recommendations = generate_cgpa_recommendations(
                student_id, 
                projected_data['projected_cgpa'],
                scenario_courses
            )
            
            simulation_result = {
                'student_id': student_id,
                'current_gpa': current_gpa,
                'current_credits': current_credits,
                'scenario': {
                    'courses': scenario_courses,
                    'grades': scenario_grades
                },
                'projection': projected_data,
                'recommendations': recommendations
            }
            
            return JsonResponse({
                'success': True,
                'data': simulation_result
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to simulate CGPA'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

def calculate_projected_cgpa(current_gpa, current_credits, scenario_courses, scenario_grades):
    """Calculate projected CGPA based on current data and scenario"""
    # Grade point mapping
    grade_points = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'F': 0.0
    }
    
    # Calculate current grade points
    current_grade_points = current_gpa * current_credits
    
    # Calculate scenario grade points
    scenario_grade_points = 0
    scenario_credits = 0
    
    for course in scenario_courses:
        course_code = course.get('code', '')
        credits = course.get('credits', 3)
        grade = scenario_grades.get(course_code, 'B')  # Default to B if not specified
        
        grade_point = grade_points.get(grade, 3.0)  # Default to 3.0 (B) if grade not found
        scenario_grade_points += grade_point * credits
        scenario_credits += credits
    
    # Calculate projected CGPA
    total_grade_points = current_grade_points + scenario_grade_points
    total_credits = current_credits + scenario_credits
    
    projected_cgpa = total_grade_points / total_credits if total_credits > 0 else 0
    
    return {
        'projected_cgpa': round(projected_cgpa, 2),
        'total_credits': total_credits,
        'current_grade_points': current_grade_points,
        'scenario_grade_points': scenario_grade_points,
        'improvement': round(projected_cgpa - current_gpa, 2)
    }

def generate_cgpa_recommendations(student_id, projected_cgpa, scenario_courses):
    """Generate recommendations based on CGPA simulation"""
    recommendations = []
    
    if projected_cgpa >= 3.5:
        recommendations.append({
            'type': 'excellent',
            'message': 'Excellent projected CGPA! Consider pursuing honors or research opportunities.',
            'priority': 'high'
        })
    elif projected_cgpa >= 3.0:
        recommendations.append({
            'type': 'good',
            'message': 'Good projected CGPA. Focus on maintaining consistent performance.',
            'priority': 'medium'
        })
    elif projected_cgpa >= 2.5:
        recommendations.append({
            'type': 'satisfactory',
            'message': 'Satisfactory projected CGPA. Consider seeking academic support resources.',
            'priority': 'high'
        })
    else:
        recommendations.append({
            'type': 'concern',
            'message': 'Academic support recommended. Contact academic advising for resources.',
            'priority': 'urgent'
        })
    
    # Course-specific recommendations
    for course in scenario_courses:
        course_code = course.get('code', '')
        credits = course.get('credits', 3)
        difficulty = course.get('difficulty', 'medium')
        
        if difficulty == 'high':
            recommendations.append({
                'type': 'course',
                'message': f'Consider additional support for {course_code} due to its high difficulty level.',
                'priority': 'medium'
            })
    
    return recommendations

@csrf_exempt
def get_course_recommendations_cgpa(request, student_id):
    """Get course recommendations based on degree requirements and CGPA goals"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Check if student is advised by this faculty member
            student_profile = STUDENT_PROFILES.get(student_id)
            if not student_profile:
                return JsonResponse({
                    'success': False,
                    'message': 'Student not found'
                }, status=404)
            
            if student_profile.get('advisor_id') != faculty_profile.employee_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied - student is not your advisee'
                }, status=403)
            
            # Get student's target CGPA from query parameters
            target_cgpa = float(request.GET.get('target_cgpa', 3.0))
            
            # Generate course recommendations
            recommendations = generate_degree_based_recommendations(
                student_id, 
                student_profile, 
                target_cgpa
            )
            
            return JsonResponse({
                'success': True,
                'data': recommendations
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to generate course recommendations'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

def generate_degree_based_recommendations(student_id, student_profile, target_cgpa):
    """Generate course recommendations based on degree requirements and CGPA goals"""
    major = student_profile.get('major', 'Unknown')
    current_gpa = student_profile.get('gpa', 0)
    year = student_profile.get('year', 'Unknown')
    
    # Base recommendations
    recommendations = {
        'student_id': student_id,
        'current_gpa': current_gpa,
        'target_cgpa': target_cgpa,
        'gap_analysis': target_cgpa - current_gpa,
        'recommended_courses': [],
        'required_courses': [],
        'elective_courses': []
    }
    
    # Add required courses based on major
    required_courses = get_required_courses(major, year)
    recommendations['required_courses'] = required_courses
    
    # Add elective courses based on interests and gaps
    elective_courses = get_elective_courses(major, current_gpa, target_cgpa)
    recommendations['elective_courses'] = elective_courses
    
    # Combine all recommendations
    all_courses = required_courses + elective_courses
    recommendations['recommended_courses'] = all_courses[:10]  # Limit to top 10
    
    # Add study plan
    recommendations['study_plan'] = generate_study_plan(all_courses, year)
    
    return recommendations

def get_required_courses(major, year):
    """Get required courses based on major and year"""
    # In a real implementation, this would query a curriculum database
    base_required = [
        {
            'code': 'CS301',
            'name': 'Data Structures and Algorithms',
            'credits': 3,
            'prerequisites': ['CS102'],
            'importance': 'high',
            'difficulty': 'high'
        }
    ]
    
    if year == 'Sophomore':
        base_required.append({
            'code': 'MATH201',
            'name': 'Discrete Mathematics',
            'credits': 3,
            'prerequisites': ['MATH102'],
            'importance': 'high',
            'difficulty': 'medium'
        })
    
    return base_required

def get_elective_courses(major, current_gpa, target_cgpa):
    """Get elective courses based on current performance and goals"""
    # In a real implementation, this would be more sophisticated
    electives = [
        {
            'code': 'CS401',
            'name': 'Artificial Intelligence',
            'credits': 3,
            'prerequisites': ['CS301'],
            'importance': 'medium',
            'difficulty': 'high'
        }
    ]
    
    # Adjust recommendations based on performance gap
    gap = target_cgpa - current_gpa
    if gap > 0.5:
        # Student needs significant improvement, recommend easier electives
        electives.append({
            'code': 'CS350',
            'name': 'Web Development',
            'credits': 3,
            'prerequisites': ['CS102'],
            'importance': 'low',
            'difficulty': 'medium'
        })
    
    return electives

def generate_study_plan(courses, year):
    """Generate a study plan based on courses and year"""
    # In a real implementation, this would be more detailed
    return {
        'year': year,
        'semesters': {
            'fall': [course for course in courses if 'CS' in course['code']][:3],
            'spring': [course for course in courses if 'MATH' in course['code']][:2]
        },
        'timeline': '2 years',
        'credits_per_semester': 15
    }

@csrf_exempt
def project_graduation_timeline(request, student_id):
    """Project graduation timeline based on current progress"""
    if request.method == 'GET':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Check if student is advised by this faculty member
            student_profile = STUDENT_PROFILES.get(student_id)
            if not student_profile:
                return JsonResponse({
                    'success': False,
                    'message': 'Student not found'
                }, status=404)
            
            if student_profile.get('advisor_id') != faculty_profile.employee_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied - student is not your advisee'
                }, status=403)
            
            # Project graduation timeline
            timeline = calculate_graduation_timeline(student_id, student_profile)
            
            return JsonResponse({
                'success': True,
                'data': timeline
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to project graduation timeline'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

def calculate_graduation_timeline(student_id, student_profile):
    """Calculate projected graduation timeline"""
    current_credits = len(student_profile.get('enrolled_courses', [])) * 3
    required_credits = 120  # Typical for a bachelor's degree
    credits_per_semester = 15  # Standard full-time load
    
    remaining_credits = max(0, required_credits - current_credits)
    semesters_needed = remaining_credits / credits_per_semester
    
    # Calculate timeline
    timeline = {
        'student_id': student_id,
        'current_credits': current_credits,
        'required_credits': required_credits,
        'remaining_credits': remaining_credits,
        'credits_per_semester': credits_per_semester,
        'semesters_needed': round(semesters_needed, 1),
        'years_needed': round(semesters_needed / 2, 1),
        'graduation_date': calculate_projected_graduation_date(semesters_needed),
        'on_track': semesters_needed <= 8  # 4 years max
    }
    
    return timeline

def calculate_projected_graduation_date(semesters_needed):
    """Calculate projected graduation date"""
    # In a real implementation, this would calculate actual dates
    return f"{int(semesters_needed)} semesters from now"

@csrf_exempt
def optimize_academic_plan(request, student_id):
    """Optimize academic plan for CGPA improvement and graduation"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Check if student is advised by this faculty member
            student_profile = STUDENT_PROFILES.get(student_id)
            if not student_profile:
                return JsonResponse({
                    'success': False,
                    'message': 'Student not found'
                }, status=404)
            
            if student_profile.get('advisor_id') != faculty_profile.employee_id:
                return JsonResponse({
                    'success': False,
                    'message': 'Access denied - student is not your advisee'
                }, status=403)
            
            # Get optimization parameters
            target_cgpa = data.get('target_cgpa', 3.0)
            timeline_semesters = data.get('timeline_semesters', 8)
            
            # Optimize academic plan
            optimized_plan = generate_optimized_academic_plan(
                student_id, 
                student_profile, 
                target_cgpa, 
                timeline_semesters
            )
            
            return JsonResponse({
                'success': True,
                'data': optimized_plan
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to optimize academic plan'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

def generate_optimized_academic_plan(student_id, student_profile, target_cgpa, timeline_semesters):
    """Generate optimized academic plan"""
    current_gpa = student_profile.get('gpa', 0)
    major = student_profile.get('major', 'Unknown')
    year = student_profile.get('year', 'Unknown')
    
    # Analyze gap
    gpa_gap = target_cgpa - current_gpa
    
    # Generate optimization strategy
    strategy = {
        'student_id': student_id,
        'current_gpa': current_gpa,
        'target_cgpa': target_cgpa,
        'gpa_gap': round(gpa_gap, 2),
        'recommendations': [],
        'semester_plan': [],
        'resources': []
    }
    
    # Add GPA improvement recommendations
    if gpa_gap > 0:
        strategy['recommendations'].append({
            'type': 'gpa_improvement',
            'message': f'Need to improve GPA by {gpa_gap:.2f} points',
            'actions': [
                'Focus on high-credit courses',
                'Seek tutoring for challenging subjects',
                'Consider retaking courses with low grades'
            ]
        })
    
    # Generate semester-by-semester plan
    for semester in range(1, int(timeline_semesters) + 1):
        semester_courses = generate_semester_courses(major, year, semester, current_gpa)
        strategy['semester_plan'].append({
            'semester': semester,
            'courses': semester_courses,
            'credits': sum(course['credits'] for course in semester_courses),
            'projected_gpa': calculate_semester_projected_gpa(semester_courses, current_gpa)
        })
    
    # Add resources
    strategy['resources'] = [
        'Academic Success Center',
        'Tutoring Services',
        'Study Groups',
        'Faculty Office Hours'
    ]
    
    return strategy

def generate_semester_courses(major, year, semester, current_gpa):
    """Generate courses for a specific semester"""
    # In a real implementation, this would be more sophisticated
    base_courses = [
        {
            'code': f'{major[:2]}{300 + semester * 10}',
            'name': f'Advanced {major} Course {semester}',
            'credits': 3,
            'difficulty': 'medium' if current_gpa >= 3.0 else 'low'
        }
    ]
    
    # Add additional courses for higher-performing students
    if current_gpa >= 3.5 and semester <= 4:
        base_courses.append({
            'code': f'{major[:2]}{400 + semester * 10}',
            'name': f'Honors {major} Course {semester}',
            'credits': 3,
            'difficulty': 'high'
        })
    
    return base_courses

def calculate_semester_projected_gpa(courses, current_gpa):
    """Calculate projected GPA for a semester"""
    # In a real implementation, this would be more accurate
    # For now, we'll simulate based on course difficulty
    difficulty_factor = sum(1 if course['difficulty'] == 'high' else 0 for course in courses) / len(courses)
    projected_gpa = current_gpa + (0.2 * (1 - difficulty_factor))  # Simpler courses = higher GPA
    return min(4.0, round(projected_gpa, 2))
