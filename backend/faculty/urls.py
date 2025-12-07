from django.urls import path, include
from . import views
from . import auth_views
from . import settings_views
from . import profile_views
from . import ethics_views
from . import real_advising_views
from . import recording_views
from . import grant_views
from . import course_views

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
    
    # Course management endpoints
    path('courses/', course_views.get_faculty_courses, name='faculty_get_courses'),
    path('courses/search/', course_views.search_courses, name='faculty_search_courses'),
    path('courses/create/', course_views.create_course, name='faculty_create_course'),
    path('courses/<str:course_id>/', course_views.get_course_detail, name='faculty_get_course_detail'),
    path('courses/<str:course_id>/update/', course_views.update_course, name='faculty_update_course'),
    path('courses/<str:course_id>/delete/', course_views.delete_course, name='faculty_delete_course'),
    path('courses/bulk-delete/', course_views.bulk_delete_courses, name='faculty_bulk_delete_courses'),
    path('courses/bulk-update/', course_views.bulk_update_courses, name='faculty_bulk_update_courses'),
    path('courses/templates/', course_views.get_course_templates, name='faculty_get_course_templates'),
    
    # Course enrollment management endpoints
    path('courses/<str:course_id>/enrollments/', course_views.get_course_enrollments, name='faculty_get_course_enrollments'),
    path('courses/<str:course_id>/enroll/', course_views.add_student_to_course, name='faculty_add_student_to_course'),
    path('courses/<str:course_id>/enrollments/<str:student_id>/remove/', course_views.remove_student_from_course, name='faculty_remove_student_from_course'),
    path('courses/<str:course_id>/bulk-enroll/', course_views.bulk_enroll_students, name='faculty_bulk_enroll_students'),
    
    # Course enrollment management endpoints
    path('courses/<str:course_id>/enrollment/', course_views.manage_course_enrollment, name='faculty_manage_course_enrollment'),
    path('courses/<str:course_id>/enrollments/', course_views.get_course_enrollments, name='faculty_get_course_enrollments'),
    
    # Course waitlist management endpoints
    path('courses/<str:course_id>/waitlist/', course_views.get_course_waitlist, name='faculty_get_course_waitlist'),
    path('courses/<str:course_id>/waitlist/manage/', course_views.manage_waitlist, name='faculty_manage_waitlist'),
    
    # Course roster endpoint
    path('courses/<str:course_id>/roster/', course_views.get_course_roster, name='faculty_get_course_roster'),
    
    # Course assignments endpoints
    path('courses/<str:course_id>/assignments/', course_views.get_course_assignments, name='faculty_get_course_assignments'),
    
    # Course analytics endpoints
    path('courses/<str:course_id>/analytics/', course_views.get_course_analytics, name='faculty_get_course_analytics'),
    
    # Existing dashboard endpoints
    path('dashboard/overview/', views.dashboard_overview, name='faculty_dashboard_overview'),
    path('courses/', views.courses_list, name='faculty_courses_list'),
    path('courses/<int:course_id>/', views.course_detail, name='faculty_course_detail'),
    path('assignments/', views.assignments_list, name='faculty_assignments_list'),
    path('assignments/<int:assignment_id>/', views.assignment_detail, name='faculty_assignment_detail'),
    path('courses/<int:course_id>/gradebook/', views.gradebook, name='faculty_gradebook'),
    path('grades/<int:grade_id>/', views.update_grade, name='faculty_update_grade'),
    path('advising/advisees/', real_advising_views.get_advisee_list, name='faculty_advisees_list'),
    path('advising/advisees/<str:student_id>/', real_advising_views.get_advisee_detail, name='faculty_advisee_detail'),
    path('advising/advisees/search/', real_advising_views.search_advisees, name='faculty_advisees_search'),
    path('advising/advisees/categories/', real_advising_views.get_advisee_categories, name='faculty_advisees_categories'),
    path('advising/advisees/<str:student_id>/progress/', real_advising_views.get_academic_progress, name='faculty_advisee_progress'),
    path('research/projects/', views.research_projects, name='faculty_research_projects'),
    path('research/ethics/', ethics_views.get_ethics_applications, name='faculty_ethics_applications'),
    path('research/ethics/create/', ethics_views.create_ethics_application, name='faculty_ethics_create'),
    path('research/ethics/search/', ethics_views.search_ethics_applications, name='faculty_ethics_search'),
    path('research/ethics/<int:application_id>/', ethics_views.get_ethics_application_detail, name='faculty_ethics_detail'),
    path('research/ethics/<int:application_id>/update/', ethics_views.update_ethics_application, name='faculty_ethics_update'),
    path('research/ethics/<int:application_id>/delete/', ethics_views.delete_ethics_application, name='faculty_ethics_delete'),
    path('research/ethics/<int:application_id>/documents/', ethics_views.upload_ethics_document, name='faculty_ethics_upload_document'),
    
    # Grant applications endpoints
    path('grants/list/', grant_views.get_grant_applications, name='faculty_grants_list'),
    path('grants/create/', grant_views.create_grant_application, name='faculty_grants_create'),
    path('grants/<int:grant_id>/', grant_views.get_grant_application_detail, name='faculty_grants_detail'),
    path('grants/<int:grant_id>/update/', grant_views.update_grant_application, name='faculty_grants_update'),
    path('grants/<int:grant_id>/delete/', grant_views.delete_grant_application, name='faculty_grants_delete'),
    path('grants/<int:grant_id>/documents/upload/', grant_views.upload_grant_document, name='faculty_grants_upload_document'),
    path('analytics/', views.analytics, name='faculty_analytics'),
    path('recordings/', recording_views.get_recordings, name='faculty_recordings'),
    path('recordings/<str:recording_id>/', recording_views.get_recording_detail, name='faculty_recording_detail'),
    path('recordings/create/', recording_views.create_recording, name='faculty_create_recording'),
    path('recordings/<str:recording_id>/update/', recording_views.update_recording, name='faculty_update_recording'),
    path('recordings/<str:recording_id>/delete/', recording_views.delete_recording, name='faculty_delete_recording'),
    path('recordings/<str:recording_id>/view/', recording_views.increment_view_count, name='faculty_increment_view_count'),
    path('recordings/<str:recording_id>/download/', recording_views.increment_download_count, name='faculty_increment_download_count'),
    path('collaborations/', include('faculty.collaboration_urls')),
    path('milestones/', include('faculty.milestone_urls')),
]