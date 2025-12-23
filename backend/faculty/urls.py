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
from . import research_views
from . import appointment_views
from . import notification_views
from . import announcement_views
from . import schedule_views
from . import publication_views

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
    
    # Dashboard overview
    path('dashboard/overview/', views.dashboard_overview, name='faculty_dashboard_overview'),
    
    # Course management endpoints (consolidated - using views.py for main data fetching)
    path('courses/', views.courses_list, name='faculty_courses_list'),
    path('courses/search/', course_views.search_courses, name='faculty_search_courses'),
    path('courses/create/', course_views.create_course, name='faculty_create_course'),
    path('courses/templates/', course_views.get_course_templates, name='faculty_get_course_templates'),
    path('courses/bulk-delete/', course_views.bulk_delete_courses, name='faculty_bulk_delete_courses'),
    path('courses/bulk-update/', course_views.bulk_update_courses, name='faculty_bulk_update_courses'),
    path('courses/<str:course_id>/', views.course_detail, name='faculty_course_detail'),
    path('courses/<str:course_id>/update/', course_views.update_course, name='faculty_update_course'),
    path('courses/<str:course_id>/delete/', course_views.delete_course, name='faculty_delete_course'),
    path('courses/<str:course_id>/gradebook/', views.gradebook, name='faculty_gradebook'),
    path('courses/<str:course_id>/assignments/', course_views.get_course_assignments, name='faculty_get_course_assignments'),
    path('courses/<str:course_id>/analytics/', course_views.get_course_analytics, name='faculty_get_course_analytics'),
    
    # Course enrollment management endpoints
    path('courses/<str:course_id>/enrollment/', course_views.manage_course_enrollment, name='faculty_manage_course_enrollment'),
    path('courses/<str:course_id>/enrollments/', course_views.get_course_enrollments, name='faculty_get_course_enrollments'),
    path('courses/<str:course_id>/enroll/', course_views.add_student_to_course, name='faculty_add_student_to_course'),
    path('courses/<str:course_id>/enrollments/<str:student_id>/remove/', course_views.remove_student_from_course, name='faculty_remove_student_from_course'),
    path('courses/<str:course_id>/bulk-enroll/', course_views.bulk_enroll_students, name='faculty_bulk_enroll_students'),
    
    # Course waitlist management endpoints
    path('courses/<str:course_id>/waitlist/', course_views.get_course_waitlist, name='faculty_get_course_waitlist'),
    path('courses/<str:course_id>/waitlist/manage/', course_views.manage_waitlist, name='faculty_manage_waitlist'),
    
    # Course roster endpoint
    path('courses/<str:course_id>/roster/', course_views.get_course_roster, name='faculty_get_course_roster'),
    
    # Assignment endpoints
    path('assignments/', views.assignments_list, name='faculty_assignments_list'),
    path('assignments/<str:assignment_id>/', views.assignment_detail, name='faculty_assignment_detail'),
    
    # Grade endpoints
    path('grades/<str:grade_id>/', views.update_grade, name='faculty_update_grade'),
    
    # Advising endpoints
    path('advising/advisees/', real_advising_views.get_advisee_list, name='faculty_advisees_list'),
    path('advising/advisees/search/', real_advising_views.search_advisees, name='faculty_advisees_search'),
    path('advising/advisees/categories/', real_advising_views.get_advisee_categories, name='faculty_advisees_categories'),
    path('advising/advisees/<str:student_id>/', real_advising_views.get_advisee_detail, name='faculty_advisee_detail'),
    path('advising/advisees/<str:student_id>/progress/', real_advising_views.get_academic_progress, name='faculty_advisee_progress'),
    
    # Appointment endpoints
    path('appointments/', appointment_views.get_appointments, name='faculty_appointments_list'),
    path('appointments/create/', appointment_views.create_appointment, name='faculty_appointments_create'),
    path('appointments/<str:appointment_id>/', appointment_views.update_appointment, name='faculty_appointments_update'),
    path('appointments/<str:appointment_id>/delete/', appointment_views.delete_appointment, name='faculty_appointments_delete'),
    path('appointments/<str:appointment_id>/status/', appointment_views.update_appointment_status, name='faculty_appointments_update_status'),
    
    # Notification endpoints
    path('notifications/', notification_views.get_notifications, name='faculty_notifications_list'),
    path('notifications/<str:notification_id>/mark-read/', notification_views.mark_notification_read, name='faculty_notifications_mark_read'),
    path('notifications/mark-all-read/', notification_views.mark_all_notifications_read, name='faculty_notifications_mark_all_read'),
    path('notifications/<str:notification_id>/delete/', notification_views.delete_notification, name='faculty_notifications_delete'),
    
    # Announcement endpoints
    path('announcements/', announcement_views.get_announcements, name='faculty_announcements_list'),
    path('announcements/create/', announcement_views.create_announcement, name='faculty_announcements_create'),
    path('announcements/<str:announcement_id>/update/', announcement_views.update_announcement, name='faculty_announcements_update'),
    path('announcements/<str:announcement_id>/delete/', announcement_views.delete_announcement, name='faculty_announcements_delete'),
    
    # Research project endpoints
    path('research/projects/', research_views.get_research_projects, name='faculty_research_projects'),
    path('research/projects/create/', research_views.create_research_project, name='faculty_research_create'),
    path('research/projects/<int:project_id>/', research_views.get_research_project_detail, name='faculty_research_detail'),
    path('research/projects/<int:project_id>/update/', research_views.update_research_project, name='faculty_research_update'),
    path('research/projects/<int:project_id>/delete/', research_views.delete_research_project, name='faculty_research_delete'),
    path('research/projects/<int:project_id>/publications/add/', research_views.add_publication, name='faculty_research_add_publication'),
    path('research/projects/<int:project_id>/milestones/add/', research_views.add_milestone, name='faculty_research_add_milestone'),
    
    # Publication endpoints
    path('publications/', publication_views.get_publications, name='faculty_publications_list'),
    path('publications/create/', publication_views.create_publication, name='faculty_publications_create'),
    path('publications/<str:publication_id>/', publication_views.get_publication_detail, name='faculty_publication_detail'),
    path('publications/<str:publication_id>/update/', publication_views.update_publication, name='faculty_publication_update'),
    path('publications/<str:publication_id>/delete/', publication_views.delete_publication, name='faculty_publication_delete'),
    
    # Research ethics endpoints
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
    path('grants/<int:grant_id>/tracking/', grant_views.get_grant_tracking, name='faculty_grants_tracking'),
    
    # Analytics endpoints
    path('analytics/', views.analytics, name='faculty_analytics'),
    
    # Schedule endpoints
    path('schedule/', schedule_views.get_schedule, name='faculty_schedule'),
    path('schedule/weekly-overview/', schedule_views.get_weekly_overview, name='faculty_weekly_overview'),
    
    # Recording endpoints
    path('recordings/', recording_views.get_recordings, name='faculty_recordings'),
    path('recordings/create/', recording_views.create_recording, name='faculty_create_recording'),
    path('recordings/<str:recording_id>/', recording_views.get_recording_detail, name='faculty_recording_detail'),
    path('recordings/<str:recording_id>/update/', recording_views.update_recording, name='faculty_update_recording'),
    path('recordings/<str:recording_id>/delete/', recording_views.delete_recording, name='faculty_delete_recording'),
    path('recordings/<str:recording_id>/view/', recording_views.increment_view_count, name='faculty_increment_view_count'),
    path('recordings/<str:recording_id>/download/', recording_views.increment_download_count, name='faculty_increment_download_count'),
    
    # Collaboration and milestone endpoints
    path('collaborations/', include('faculty.collaboration_urls')),
    path('milestones/', include('faculty.milestone_urls')),
]