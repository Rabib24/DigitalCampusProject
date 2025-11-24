from django.urls import path
from faculty.milestone_views import create_milestone, get_student_milestones, get_milestone_detail, update_milestone, delete_milestone, complete_milestone, create_milestone_from_template, get_milestone_templates

urlpatterns = [
    path('create/', create_milestone, name='faculty_milestones_create'),
    path('student/<str:student_id>/', get_student_milestones, name='faculty_milestones_student'),
    path('<uuid:milestone_id>/', get_milestone_detail, name='faculty_milestones_detail'),
    path('<uuid:milestone_id>/update/', update_milestone, name='faculty_milestones_update'),
    path('<uuid:milestone_id>/delete/', delete_milestone, name='faculty_milestones_delete'),
    path('<uuid:milestone_id>/complete/', complete_milestone, name='faculty_milestones_complete'),
    path('templates/create/', create_milestone_from_template, name='faculty_milestones_create_from_template'),
    path('templates/<str:program>/', get_milestone_templates, name='faculty_milestones_templates'),
]