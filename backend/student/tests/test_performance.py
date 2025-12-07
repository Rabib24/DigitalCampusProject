"""
Performance tests for high-concurrency registration periods
"""
import time
import threading
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from django.utils import timezone
from student.models import Student, EnrollmentPeriod, Course, Section

class PerformanceTest(TestCase):
    def setUp(self):
        """Set up test data for performance testing"""
        # Create enrollment period
        self.enrollment_period = EnrollmentPeriod.objects.create(
            name="Performance Test Registration",
            start_date=timezone.now() - timezone.timedelta(days=1),
            end_date=timezone.now() + timezone.timedelta(days=1),
            priority_end_date=timezone.now() + timezone.timedelta(hours=12)
        )
        
        # Create test course with ample capacity
        self.course = Course.objects.create(
            course_id="PERF101",
            name="Performance Testing Course",
            credits=3,
            department="Testing",
            max_capacity=1000
        )
        
        # Create section
        self.section = Section.objects.create(
            section_id="PERF101-001",
            course=self.course,
            faculty_name="Dr. Performance",
            schedule_days="MW",
            schedule_time="14:00-15:30",
            room="Performance Lab",
            current_enrollment=0,
            max_capacity=500
        )

    def test_concurrent_enrollment_performance(self):
        """Test performance under concurrent enrollment requests"""
        # Create multiple test users
        users = []
        clients = []
        
        for i in range(50):  # Test with 50 concurrent users
            user = User.objects.create_user(
                username=f'testuser{i}',
                password='testpass123'
            )
            
            student = Student.objects.create(
                student_id=f"STU{i:03d}",
                first_name=f"User{i}",
                last_name="Test",
                email=f"user{i}@test.edu",
                academic_standing="good",
                user=user
            )
            
            client = APIClient()
            client.force_authenticate(user=user)
            
            users.append(user)
            clients.append(client)
        
        # Track start time
        start_time = time.time()
        
        # Simulate concurrent enrollment requests
        def enroll_user(client, user_index):
            url = f"/api/student/courses/{self.course.course_id}/enroll/"
            try:
                response = client.post(url)
                return response.status_code
            except Exception as e:
                return f"Error: {str(e)}"
        
        # Create threads for concurrent requests
        threads = []
        results = []
        
        for i, client in enumerate(clients):
            thread = threading.Thread(target=lambda c=client, idx=i: results.append(enroll_user(c, idx)))
            threads.append(thread)
            thread.start()
        
        # Wait for all threads to complete
        for thread in threads:
            thread.join()
        
        # Calculate elapsed time
        elapsed_time = time.time() - start_time
        
        # Log performance metrics
        successful_requests = len([r for r in results if r == 200])
        failed_requests = len(results) - successful_requests
        
        print(f"Performance Test Results:")
        print(f"- Total Requests: {len(results)}")
        print(f"- Successful Requests: {successful_requests}")
        print(f"- Failed Requests: {failed_requests}")
        print(f"- Elapsed Time: {elapsed_time:.2f} seconds")
        print(f"- Requests per Second: {len(results)/elapsed_time:.2f}")
        
        # Assert reasonable performance (less than 10 seconds for 50 requests)
        self.assertLess(elapsed_time, 10.0)
        
        # Assert majority of requests succeeded
        self.assertGreater(successful_requests, len(results) * 0.8)

    def test_large_dataset_handling(self):
        """Test handling of large course catalogs"""
        # Create additional courses to simulate large dataset
        additional_courses = []
        for i in range(1000):  # Create 1000 additional courses
            course = Course.objects.create(
                course_id=f"LARGE{i:04d}",
                name=f"Large Dataset Course {i}",
                credits=3,
                department="LargeDataset",
                max_capacity=50
            )
            additional_courses.append(course)
        
        # Test search performance
        start_time = time.time()
        
        # Simulate searching through large dataset
        search_results = Course.objects.filter(department="LargeDataset")
        result_count = search_results.count()
        
        elapsed_time = time.time() - start_time
        
        print(f"Large Dataset Test Results:")
        print(f"- Courses in Database: {result_count}")
        print(f"- Search Time: {elapsed_time:.4f} seconds")
        
        # Assert reasonable search performance (less than 1 second for 1000 courses)
        self.assertLess(elapsed_time, 1.0)
        
        # Clean up additional courses to avoid database bloat
        for course in additional_courses:
            course.delete()