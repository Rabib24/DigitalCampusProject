import json
from django.test import TestCase, Client
from django.urls import reverse
from unittest.mock import patch

class MilestoneReminderTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        # Mock faculty profile for testing
        self.mock_faculty = {
            'employee_id': 'FAC001',
            'first_name': 'John',
            'last_name': 'Doe',
            'department': 'Computer Science'
        }
        
    def test_create_milestone_success(self):
        """Test creating a milestone successfully"""
        url = reverse('faculty_create_milestone')
        
        # Mock the faculty profile attached to request
        with patch('faculty.middleware.get_faculty_profile') as mock_get_faculty:
            mock_get_faculty.return_value = self.mock_faculty
            
            data = {
                'student_id': 'STU001',
                'name': 'Research Project Initiation',
                'category': 'research',
                'description': 'Start working on research project',
                'priority': 'high'
            }
            
            response = self.client.post(
                url,
                data=json.dumps(data),
                content_type='application/json'
            )
            
            self.assertEqual(response.status_code, 200)
            response_data = json.loads(response.content)
            self.assertTrue(response_data['success'])
            self.assertEqual(response_data['data']['name'], 'Research Project Initiation')
            self.assertEqual(response_data['data']['category'], 'research')
            
    def test_create_milestone_missing_required_fields(self):
        """Test creating a milestone with missing required fields"""
        url = reverse('faculty_create_milestone')
        
        # Mock the faculty profile attached to request
        with patch('faculty.middleware.get_faculty_profile') as mock_get_faculty:
            mock_get_faculty.return_value = self.mock_faculty
            
            data = {
                'student_id': 'STU001',
                # Missing 'name' and 'category'
            }
            
            response = self.client.post(
                url,
                data=json.dumps(data),
                content_type='application/json'
            )
            
            self.assertEqual(response.status_code, 400)
            response_data = json.loads(response.content)
            self.assertFalse(response_data['success'])
            
    def test_get_student_milestones(self):
        """Test retrieving milestones for a student"""
        # First create a milestone
        create_url = reverse('faculty_create_milestone')
        
        with patch('faculty.middleware.get_faculty_profile') as mock_get_faculty:
            mock_get_faculty.return_value = self.mock_faculty
            
            data = {
                'student_id': 'STU001',
                'name': 'Research Project Initiation',
                'category': 'research'
            }
            
            create_response = self.client.post(
                create_url,
                data=json.dumps(data),
                content_type='application/json'
            )
            
            self.assertEqual(create_response.status_code, 200)
            
            # Now retrieve milestones for the student
            get_url = reverse('faculty_get_student_milestones', kwargs={'student_id': 'STU001'})
            get_response = self.client.get(get_url)
            
            self.assertEqual(get_response.status_code, 200)
            response_data = json.loads(get_response.content)
            self.assertTrue(response_data['success'])
            self.assertEqual(len(response_data['data']), 1)
            self.assertEqual(response_data['data'][0]['name'], 'Research Project Initiation')
            
    def test_get_milestone_templates(self):
        """Test retrieving milestone templates"""
        url = reverse('faculty_get_milestone_templates')
        
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertIn('computer_science_bs', response_data['data'])
        self.assertIn('mathematics_bs', response_data['data'])
        
    def test_create_milestone_from_template(self):
        """Test creating a milestone from a template"""
        url = reverse('faculty_create_milestone_from_template')
        
        with patch('faculty.middleware.get_faculty_profile') as mock_get_faculty:
            mock_get_faculty.return_value = self.mock_faculty
            
            data = {
                'student_id': 'STU001',
                'template_id': 'cs_research_opportunity',
                'program': 'computer_science_bs'
            }
            
            response = self.client.post(
                url,
                data=json.dumps(data),
                content_type='application/json'
            )
            
            self.assertEqual(response.status_code, 200)
            response_data = json.loads(response.content)
            self.assertTrue(response_data['success'])
            self.assertEqual(response_data['data']['name'], 'Research Project Initiation')
            
    def test_create_milestone_from_invalid_template(self):
        """Test creating a milestone from an invalid template"""
        url = reverse('faculty_create_milestone_from_template')
        
        with patch('faculty.middleware.get_faculty_profile') as mock_get_faculty:
            mock_get_faculty.return_value = self.mock_faculty
            
            data = {
                'student_id': 'STU001',
                'template_id': 'invalid_template',
                'program': 'computer_science_bs'
            }
            
            response = self.client.post(
                url,
                data=json.dumps(data),
                content_type='application/json'
            )
            
            self.assertEqual(response.status_code, 404)
            response_data = json.loads(response.content)
            self.assertFalse(response_data['success'])
            
    def test_update_milestone(self):
        """Test updating an existing milestone"""
        # First create a milestone
        create_url = reverse('faculty_create_milestone')
        
        with patch('faculty.middleware.get_faculty_profile') as mock_get_faculty:
            mock_get_faculty.return_value = self.mock_faculty
            
            data = {
                'student_id': 'STU001',
                'name': 'Research Project Initiation',
                'category': 'research'
            }
            
            create_response = self.client.post(
                create_url,
                data=json.dumps(data),
                content_type='application/json'
            )
            
            self.assertEqual(create_response.status_code, 200)
            create_data = json.loads(create_response.content)
            milestone_id = create_data['data']['id']
            
            # Now update the milestone
            update_url = reverse('faculty_update_milestone', kwargs={'milestone_id': milestone_id})
            update_data = {
                'status': 'completed',
                'notes': 'Project started successfully'
            }
            
            update_response = self.client.put(
                update_url,
                data=json.dumps(update_data),
                content_type='application/json'
            )
            
            self.assertEqual(update_response.status_code, 200)
            response_data = json.loads(update_response.content)
            self.assertTrue(response_data['success'])
            self.assertEqual(response_data['data']['status'], 'completed')
            self.assertEqual(response_data['data']['notes'], 'Project started successfully')
            
    def test_delete_milestone(self):
        """Test deleting a milestone"""
        # First create a milestone
        create_url = reverse('faculty_create_milestone')
        
        with patch('faculty.middleware.get_faculty_profile') as mock_get_faculty:
            mock_get_faculty.return_value = self.mock_faculty
            
            data = {
                'student_id': 'STU001',
                'name': 'Research Project Initiation',
                'category': 'research'
            }
            
            create_response = self.client.post(
                create_url,
                data=json.dumps(data),
                content_type='application/json'
            )
            
            self.assertEqual(create_response.status_code, 200)
            create_data = json.loads(create_response.content)
            milestone_id = create_data['data']['id']
            
            # Now delete the milestone
            delete_url = reverse('faculty_delete_milestone', kwargs={'milestone_id': milestone_id})
            delete_response = self.client.delete(delete_url)
            
            self.assertEqual(delete_response.status_code, 200)
            response_data = json.loads(delete_response.content)
            self.assertTrue(response_data['success'])