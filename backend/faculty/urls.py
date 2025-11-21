from django.urls import path
from . import views
from . import auth_views
from . import settings_views
from . import profile_views

urlpatterns = [
    # Authentication endpoints
    path('auth/login/', auth_views.faculty_login, name='faculty_login'),
    path('auth/logout/', auth_views.faculty_logout, name='faculty_logout'),
    
    # Settings endpoints
    path('settings/', settings_views.get_faculty_settings, name='faculty_get_settings'),
    path('settings/update/', settings_views.update_faculty_settings, name='faculty_update_settings'),
    
    # Profile endpoints
    path('profile/', profile_views.get_faculty_profile, name='faculty_get_profile'),
    path('profile/update/', profile_views.update_faculty_profile, name='faculty_update_profile'),
    
    # Existing dashboard endpoints
    path('dashboard/overview/', views.dashboard_overview, name='faculty_dashboard_overview'),
    path('courses/', views.courses_list, name='faculty_courses_list'),
    path('courses/<int:course_id>/', views.course_detail, name='faculty_course_detail'),
    path('assignments/', views.assignments_list, name='faculty_assignments_list'),
    path('assignments/<int:assignment_id>/', views.assignment_detail, name='faculty_assignment_detail'),
    path('courses/<int:course_id>/gradebook/', views.gradebook, name='faculty_gradebook'),
    path('grades/<int:grade_id>/', views.update_grade, name='faculty_update_grade'),
    path('advising/advisees/', views.advisees_list, name='faculty_advisees_list'),
    path('advising/advisees/<int:student_id>/', views.advisee_detail, name='faculty_advisee_detail'),
    path('research/projects/', views.research_projects, name='faculty_research_projects'),
    path('analytics/', views.analytics, name='faculty_analytics'),
    path('recordings/', views.recordings, name='faculty_recordings'),
]