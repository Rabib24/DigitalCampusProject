import json
from django.test import TestCase, Client
from django.contrib.auth.models import User
from courses.models import Course, Enrollment
from users.models import Faculty
import uuid

class EnrollmentManagementTestCase(TestCase):
    def setUp(self):
        """Set up test data"""
        # Create a test user
        self.user = User.objects.create_user(
            username='testfaculty',
            email='faculty@test.com',
            password='testpass123'
        )
        
        # Create a faculty profile
        self.faculty = Faculty.objects.create(
            user=self.user,
            employee_id='FAC001',
            department='Computer Science',
            title='Assistant Professor',
            office_hours='MWF 9-11 AM'
        )
        
        # Create a test course
        self.course_id = str(uuid.uuid4())
        self.course = Course.objects.create(
            id=self.course_id,
            code='CS101',
            name='Introduction to Computer Science',
            description='Basic programming concepts',
            credits=3,
            instructor_id='FAC001',
            department='Computer Science',
            enrollment_limit=2  # Set a low limit for testing waitlist functionality
        )
        
        # Create test client
        self.client = Client()
        
    def test_add_student_to_course(self):
        """Test adding a student to a course"""
        # Prepare data
        student_id = 'STU001'
        data = {
            'student_id': student_id
        }
        
        # Make POST request
        response = self.client.post(
            f'/api/faculty/courses/{self.course_id}/enrollments/add/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['message'], 'Student enrolled successfully')
        self.assertIn('data', response_data)
        
        # Verify enrollment in database
        enrollment = Enrollment.objects.get(course_id=self.course_id, student_id=student_id)
        self.assertEqual(enrollment.status, 'active')
        
    def test_add_student_to_full_course(self):
        """Test adding a student to a course that is at capacity"""
        # First, enroll two students to fill the course
        Enrollment.objects.create(
            course_id=self.course_id,
            student_id='STU001',
            status='active'
        )
        
        Enrollment.objects.create(
            course_id=self.course_id,
            student_id='STU002',
            status='active'
        )
        
        # Try to add a third student
        student_id = 'STU003'
        data = {
            'student_id': student_id
        }
        
        # Make POST request
        response = self.client.post(
            f'/api/faculty/courses/{self.course_id}/enrollments/add/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['message'], 'Student added to waitlist - course is at capacity')
        self.assertIn('data', response_data)
        
        # Verify enrollment in database
        enrollment = Enrollment.objects.get(course_id=self.course_id, student_id=student_id)
        self.assertEqual(enrollment.status, 'waitlisted')
        
    def test_remove_student_from_course(self):
        """Test removing a student from a course"""
        # First, enroll a student
        student_id = 'STU001'
        Enrollment.objects.create(
            course_id=self.course_id,
            student_id=student_id,
            status='active'
        )
        
        # Make DELETE request
        response = self.client.delete(
            f'/api/faculty/courses/{self.course_id}/enrollments/remove/{student_id}/'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response_data['message'], 'Student removed from course successfully')
        
        # Verify enrollment is removed from database
        with self.assertRaises(Enrollment.DoesNotExist):
            Enrollment.objects.get(course_id=self.course_id, student_id=student_id)
            
    def test_remove_student_not_enrolled(self):
        """Test removing a student who is not enrolled in the course"""
        # Make DELETE request for non-enrolled student
        student_id = 'STU999'
        response = self.client.delete(
            f'/api/faculty/courses/{self.course_id}/enrollments/remove/{student_id}/'
        )
        
        # Check response
        self.assertEqual(response.status_code, 404)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['success'])
        self.assertEqual(response_data['message'], 'Student is not enrolled in this course')
        
    def test_bulk_enroll_students(self):
        """Test bulk enrolling students in a course"""
        # Prepare data
        student_ids = ['STU001', 'STU002', 'STU003']
        data = {
            'student_ids': student_ids
        }
        
        # Make POST request
        response = self.client.post(
            f'/api/faculty/courses/{self.course_id}/enrollments/bulk/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('enrolled_students', response_data)
        self.assertIn('waitlisted_students', response_data)
        self.assertIn('errors', response_data)
        
        # Should have 2 enrolled students (due to enrollment limit) and 1 waitlisted
        self.assertEqual(len(response_data['enrolled_students']), 2)
        self.assertEqual(len(response_data['waitlisted_students']), 1)
        
        # Verify enrollments in database
        active_enrollments = Enrollment.objects.filter(
            course_id=self.course_id, 
            status='active'
        )
        waitlisted_enrollments = Enrollment.objects.filter(
            course_id=self.course_id, 
            status='waitlisted'
        )
        
        self.assertEqual(active_enrollments.count(), 2)
        self.assertEqual(waitlisted_enrollments.count(), 1)
        
    def test_manage_waitlist_approve(self):
        """Test approving students from the waitlist"""
        # First, fill the course
        Enrollment.objects.create(
            course_id=self.course_id,
            student_id='STU001',
            status='active'
        )
        
        Enrollment.objects.create(
            course_id=self.course_id,
            student_id='STU002',
            status='active'
        )
        
        # Add a student to the waitlist
        waitlisted_student_id = 'STU003'
        Enrollment.objects.create(
            course_id=self.course_id,
            student_id=waitlisted_student_id,
            status='waitlisted'
        )
        
        # Remove one student to free up space
        Enrollment.objects.get(course_id=self.course_id, student_id='STU001').delete()
        
        # Approve the waitlisted student
        data = {
            'action': 'approve',
            'student_ids': [waitlisted_student_id]
        }
        
        # Make POST request
        response = self.client.post(
            f'/api/faculty/courses/{self.course_id}/enrollments/waitlist/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(len(response_data['processed_students']), 1)
        self.assertEqual(response_data['processed_students'][0]['action'], 'approved')
        
        # Verify student is now active
        enrollment = Enrollment.objects.get(
            course_id=self.course_id, 
            student_id=waitlisted_student_id
        )
        self.assertEqual(enrollment.status, 'active')
        
    def test_manage_waitlist_reject(self):
        """Test rejecting students from the waitlist"""
        # Add a student to the waitlist
        waitlisted_student_id = 'STU003'
        Enrollment.objects.create(
            course_id=self.course_id,
            student_id=waitlisted_student_id,
            status='waitlisted'
        )
        
        # Reject the waitlisted student
        data = {
            'action': 'reject',
            'student_ids': [waitlisted_student_id]
        }
        
        # Make POST request
        response = self.client.post(
            f'/api/faculty/courses/{self.course_id}/enrollments/waitlist/',
            data=json.dumps(data),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(len(response_data['processed_students']), 1)
        self.assertEqual(response_data['processed_students'][0]['action'], 'rejected')
        
        # Verify student is removed from waitlist
        with self.assertRaises(Enrollment.DoesNotExist):
            Enrollment.objects.get(
                course_id=self.course_id, 
                student_id=waitlisted_student_id
            )
            
    def test_get_course_waitlist(self):
        """Test getting the course waitlist"""
        # Add students to the waitlist
        Enrollment.objects.create(
            course_id=self.course_id,
            student_id='STU001',
            status='waitlisted'
        )
        
        Enrollment.objects.create(
            course_id=self.course_id,
            student_id='STU002',
            status='waitlisted'
        )
        
        # Make GET request
        response = self.client.get(
            f'/api/faculty/courses/{self.course_id}/enrollments/waitlist/list/'
        )
        
        # Check response
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('data', response_data)
        self.assertEqual(len(response_data['data']), 2)