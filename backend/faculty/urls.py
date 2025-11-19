from django.urls import path
from . import views
from . import auth_views
from . import settings_views
from . import profile_views
from . import course_views
from . import notification_views
from . import form_views
from . import modal_views
from . import assignment_views
from . import plagiarism_views
from . import advising_views
from . import appointment_views
from . import milestone_views
from . import research_views
from . import grant_views
from . import publication_views
from . import ethics_views
from . import collaboration_views

urlpatterns = [
    # Authentication endpoints
    path('auth/login/', auth_views.faculty_login, name='faculty_login'),
    path('auth/logout/', auth_views.faculty_logout, name='faculty_logout'),
    path('auth/register/', auth_views.faculty_register, name='faculty_register'),
    path('auth/mfa/enable/', auth_views.enable_mfa, name='faculty_enable_mfa'),
    path('auth/mfa/verify/', auth_views.verify_mfa, name='faculty_verify_mfa'),
    path('auth/password-reset/request/', auth_views.faculty_request_password_reset, name='faculty_request_password_reset'),
    path('auth/password-reset/reset/', auth_views.faculty_reset_password, name='faculty_reset_password'),
    path('auth/invitation/send/', auth_views.faculty_send_invitation, name='faculty_send_invitation'),
    path('auth/bulk-register/', auth_views.faculty_bulk_register, name='faculty_bulk_register'),
    
    # Settings endpoints
    path('settings/', settings_views.get_faculty_settings, name='faculty_get_settings'),
    path('settings/update/', settings_views.update_faculty_settings, name='faculty_update_settings'),
    path('settings/reset/', settings_views.reset_faculty_settings, name='faculty_reset_settings'),
    
    # Profile endpoints
    path('profile/', profile_views.get_faculty_profile, name='faculty_get_profile'),
    path('profile/update/', profile_views.update_faculty_profile, name='faculty_update_profile'),
    path('profile/picture/', profile_views.upload_profile_picture, name='faculty_upload_picture'),
    path('profile/privacy/', profile_views.update_privacy_settings, name='faculty_update_privacy'),
    
    # Course endpoints
    path('courses/list/', course_views.get_faculty_courses, name='faculty_get_courses'),
    path('courses/search/', course_views.search_courses, name='faculty_search_courses'),
    path('courses/create/', course_views.create_course, name='faculty_create_course'),
    path('courses/bulk-update/', course_views.bulk_update_courses, name='faculty_bulk_update_courses'),
    path('courses/bulk-delete/', course_views.bulk_delete_courses, name='faculty_bulk_delete_courses'),
    path('courses/<str:course_id>/', course_views.get_course_detail, name='faculty_get_course_detail'),
    path('courses/<str:course_id>/update/', course_views.update_course, name='faculty_update_course'),
    path('courses/<str:course_id>/delete/', course_views.delete_course, name='faculty_delete_course'),
    path('courses/<str:course_id>/enrollments/', course_views.get_course_enrollments, name='faculty_get_course_enrollments'),
    path('courses/<str:course_id>/enrollments/add/', course_views.add_student_to_course, name='faculty_add_student_to_course'),
    path('courses/<str:course_id>/enrollments/remove/<str:student_id>/', course_views.remove_student_from_course, name='faculty_remove_student_from_course'),
    path('courses/<str:course_id>/enrollments/bulk/', course_views.bulk_enroll_students, name='faculty_bulk_enroll_students'),
    path('courses/<str:course_id>/enrollments/waitlist/', course_views.manage_waitlist, name='faculty_manage_waitlist'),
    path('courses/<str:course_id>/enrollments/waitlist/list/', course_views.get_course_waitlist, name='faculty_get_course_waitlist'),
    path('courses/<str:course_id>/assignments/', course_views.get_course_assignments, name='faculty_get_course_assignments'),
    path('courses/<str:course_id>/analytics/', course_views.get_course_analytics, name='faculty_get_course_analytics'),
    path('courses/templates/', course_views.get_course_templates, name='faculty_get_course_templates'),
    
    # Notification endpoints
    path('notifications/', notification_views.get_faculty_notifications, name='faculty_get_notifications'),
    path('notifications/unread/', notification_views.get_unread_notifications, name='faculty_get_unread_notifications'),
    path('notifications/<str:notification_id>/read/', notification_views.mark_notification_as_read, name='faculty_mark_notification_as_read'),
    path('notifications/read-all/', notification_views.mark_all_notifications_as_read, name='faculty_mark_all_notifications_as_read'),
    path('notifications/<str:notification_id>/delete/', notification_views.delete_notification, name='faculty_delete_notification'),
    path('notifications/create/', notification_views.create_notification, name='faculty_create_notification'),
    path('notifications/count/', notification_views.get_notification_count, name='faculty_get_notification_count'),
    
    # Form management endpoints
    path('forms/validate-field/', form_views.validate_form_field, name='faculty_validate_form_field'),
    path('forms/validate/', form_views.validate_form, name='faculty_validate_form'),
    path('forms/drafts/save/', form_views.save_form_draft, name='faculty_save_form_draft'),
    path('forms/drafts/load/<str:form_name>/', form_views.load_form_draft, name='faculty_load_form_draft'),
    path('forms/drafts/delete/<str:form_name>/', form_views.delete_form_draft, name='faculty_delete_form_draft'),
    path('forms/drafts/list/', form_views.list_form_drafts, name='faculty_list_form_drafts'),
    path('forms/submit/', form_views.submit_form, name='faculty_submit_form'),
    
    # Modal management endpoints
    path('modals/create/', modal_views.create_modal_session, name='faculty_create_modal_session'),
    path('modals/<str:session_id>/update/', modal_views.update_modal_state, name='faculty_update_modal_state'),
    path('modals/<str:session_id>/', modal_views.get_modal_state, name='faculty_get_modal_state'),
    path('modals/<str:session_id>/close/', modal_views.close_modal_session, name='faculty_close_modal_session'),
    path('modals/sessions/', modal_views.get_user_modal_sessions, name='faculty_get_user_modal_sessions'),
    path('modals/audit-logs/', modal_views.get_user_audit_logs, name='faculty_get_user_audit_logs'),
    path('modals/execute/', modal_views.execute_modal_operation, name='faculty_execute_modal_operation'),
    
    # Existing dashboard endpoints
    path('dashboard/overview/', views.dashboard_overview, name='faculty_dashboard_overview'),
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
    
    # Assignment endpoints
    path('assignments/create/', assignment_views.create_assignment, name='faculty_create_assignment'),
    path('assignments/list/', assignment_views.get_faculty_assignments, name='faculty_get_assignments'),
    path('assignments/<str:assignment_id>/', assignment_views.get_assignment_detail, name='faculty_get_assignment_detail'),
    path('assignments/search/', assignment_views.search_assignments, name='faculty_search_assignments'),
    path('assignments/<str:assignment_id>/analytics/', assignment_views.get_assignment_analytics, name='faculty_get_assignment_analytics'),
    path('assignments/templates/', assignment_views.get_assignment_templates, name='faculty_get_assignment_templates'),
    
    # Grading endpoints
    path('grades/submit/', assignment_views.submit_grade, name='faculty_submit_grade'),
    path('grades/bulk/', assignment_views.bulk_grade_submissions, name='faculty_bulk_grade_submissions'),
    path('grades/export/<str:course_id>/', assignment_views.export_gradebook, name='faculty_export_gradebook'),
    path('grades/statistics/<str:assignment_id>/', assignment_views.calculate_grade_statistics, name='faculty_calculate_grade_statistics'),
    
    # Submission review endpoints
    path('submissions/<str:submission_id>/review/', assignment_views.review_submission, name='faculty_review_submission'),
    path('submissions/<str:submission_id>/reviews/', assignment_views.get_submission_reviews, name='faculty_get_submission_reviews'),
    path('submissions/<str:submission_id>/peer-reviewer/', assignment_views.add_peer_reviewer, name='faculty_add_peer_reviewer'),
    path('assignments/<str:assignment_id>/peer-reviews/', assignment_views.get_peer_reviews, name='faculty_get_peer_reviews'),
    
    # Plagiarism check endpoints
    path('plagiarism/check/submission/<str:submission_id>/', plagiarism_views.check_submission_plagiarism, name='faculty_check_submission_plagiarism'),
    path('plagiarism/check/assignment/<str:assignment_id>/', plagiarism_views.check_assignment_plagiarism, name='faculty_check_assignment_plagiarism'),
    path('plagiarism/report/<str:report_id>/', plagiarism_views.get_plagiarism_report, name='faculty_get_plagiarism_report'),
    path('plagiarism/configure/', plagiarism_views.configure_plagiarism_threshold, name='faculty_configure_plagiarism_threshold'),
    path('plagiarism/batch/', plagiarism_views.batch_plagiarism_check, name='faculty_batch_plagiarism_check'),
    
    # Advising endpoints
    path('advising/advisees/', advising_views.get_advisee_list, name='faculty_get_advisee_list'),
    path('advising/advisees/<str:student_id>/', advising_views.get_advisee_detail, name='faculty_get_advisee_detail'),
    path('advising/advisees/search/', advising_views.search_advisees, name='faculty_search_advisees'),
    path('advising/advisees/categories/', advising_views.get_advisee_categories, name='faculty_get_advisee_categories'),
    
    # Academic progress tracking endpoints
    path('advising/progress/<str:student_id>/', advising_views.get_academic_progress, name='faculty_get_academic_progress'),
    path('advising/gpa-projection/<str:student_id>/', advising_views.get_gpa_projection, name='faculty_get_gpa_projection'),
    path('advising/requirements/<str:student_id>/', advising_views.check_degree_requirements, name='faculty_check_degree_requirements'),
    path('advising/recommendations/<str:student_id>/', advising_views.get_course_recommendations, name='faculty_get_course_recommendations'),
    
    # CGPA simulation endpoints
    path('advising/cgpa-simulation/<str:student_id>/', advising_views.simulate_cgpa, name='faculty_simulate_cgpa'),
    path('advising/course-recommendations/<str:student_id>/', advising_views.get_course_recommendations_cgpa, name='faculty_get_course_recommendations_cgpa'),
    path('advising/graduation-timeline/<str:student_id>/', advising_views.project_graduation_timeline, name='faculty_project_graduation_timeline'),
    path('advising/optimize-plan/<str:student_id>/', advising_views.optimize_academic_plan, name='faculty_optimize_academic_plan'),
    
    # Appointment scheduling endpoints
    path('appointments/create/', appointment_views.create_appointment, name='faculty_create_appointment'),
    path('appointments/list/', appointment_views.get_faculty_appointments, name='faculty_get_appointments'),
    path('appointments/<str:appointment_id>/', appointment_views.get_appointment_detail, name='faculty_get_appointment_detail'),
    path('appointments/<str:appointment_id>/update/', appointment_views.update_appointment, name='faculty_update_appointment'),
    path('appointments/<str:appointment_id>/cancel/', appointment_views.cancel_appointment, name='faculty_cancel_appointment'),
    path('appointments/types/', appointment_views.get_appointment_types, name='faculty_get_appointment_types'),
    path('appointments/availability/', appointment_views.get_faculty_availability, name='faculty_get_availability'),
    
    # Milestone reminder endpoints
    path('milestones/create/', milestone_views.create_milestone, name='faculty_create_milestone'),
    path('milestones/templates/', milestone_views.get_milestone_templates, name='faculty_get_milestone_templates'),
    path('milestones/from-template/', milestone_views.create_milestone_from_template, name='faculty_create_milestone_from_template'),
    path('milestones/student/<str:student_id>/', milestone_views.get_student_milestones, name='faculty_get_student_milestones'),
    path('milestones/<str:milestone_id>/update/', milestone_views.update_milestone, name='faculty_update_milestone'),
    path('milestones/<str:milestone_id>/delete/', milestone_views.delete_milestone, name='faculty_delete_milestone'),
    path('milestones/upcoming/', milestone_views.get_upcoming_milestones, name='faculty_get_upcoming_milestones'),
        
    # Research project endpoints
    path('research/projects/list/', research_views.get_research_projects, name='faculty_get_research_projects'),
    path('research/projects/create/', research_views.create_research_project, name='faculty_create_research_project'),
    path('research/projects/<str:project_id>/', research_views.get_research_project_detail, name='faculty_get_research_project_detail'),
    path('research/projects/<str:project_id>/update/', research_views.update_research_project, name='faculty_update_research_project'),
    path('research/projects/<str:project_id>/delete/', research_views.delete_research_project, name='faculty_delete_research_project'),
    path('research/projects/<str:project_id>/publications/add/', research_views.add_publication, name='faculty_add_publication'),
    path('research/projects/<str:project_id>/milestones/add/', research_views.add_milestone, name='faculty_add_milestone'),
    
    # Grant application endpoints
    path('grants/list/', grant_views.get_grant_applications, name='faculty_get_grant_applications'),
    path('grants/create/', grant_views.create_grant_application, name='faculty_create_grant_application'),
    path('grants/<str:grant_id>/', grant_views.get_grant_application_detail, name='faculty_get_grant_application_detail'),
    path('grants/<str:grant_id>/update/', grant_views.update_grant_application, name='faculty_update_grant_application'),
    path('grants/<str:grant_id>/delete/', grant_views.delete_grant_application, name='faculty_delete_grant_application'),
    path('grants/<str:grant_id>/documents/upload/', grant_views.upload_grant_document, name='faculty_upload_grant_document'),
    path('grants/<str:grant_id>/tracking/', grant_views.get_grant_tracking, name='faculty_get_grant_tracking'),
    
    # Publication management endpoints
    path('publications/list/', publication_views.get_publications, name='faculty_get_publications'),
    path('publications/create/', publication_views.create_publication, name='faculty_create_publication'),
    path('publications/<str:publication_id>/', publication_views.get_publication_detail, name='faculty_get_publication_detail'),
    path('publications/<str:publication_id>/update/', publication_views.update_publication, name='faculty_update_publication'),
    path('publications/<str:publication_id>/delete/', publication_views.delete_publication, name='faculty_delete_publication'),
    path('publications/search/', publication_views.search_publications, name='faculty_search_publications'),
    
    # Ethics approval endpoints
    path('ethics/list/', ethics_views.get_ethics_applications, name='faculty_get_ethics_applications'),
    path('ethics/create/', ethics_views.create_ethics_application, name='faculty_create_ethics_application'),
    path('ethics/<str:application_id>/', ethics_views.get_ethics_application_detail, name='faculty_get_ethics_application_detail'),
    path('ethics/<str:application_id>/update/', ethics_views.update_ethics_application, name='faculty_update_ethics_application'),
    path('ethics/<str:application_id>/delete/', ethics_views.delete_ethics_application, name='faculty_delete_ethics_application'),
    path('ethics/<str:application_id>/documents/upload/', ethics_views.upload_ethics_document, name='faculty_upload_ethics_document'),
    path('ethics/search/', ethics_views.search_ethics_applications, name='faculty_search_ethics_applications'),
    
    # Research collaboration endpoints
    path('collaborations/list/', collaboration_views.get_collaborations, name='faculty_get_collaborations'),
    path('collaborations/create/', collaboration_views.create_collaboration, name='faculty_create_collaboration'),
    path('collaborations/<str:collaboration_id>/', collaboration_views.get_collaboration_detail, name='faculty_get_collaboration_detail'),
    path('collaborations/<str:collaboration_id>/update/', collaboration_views.update_collaboration, name='faculty_update_collaboration'),
    path('collaborations/<str:collaboration_id>/delete/', collaboration_views.delete_collaboration, name='faculty_delete_collaboration'),
    path('collaborations/<str:collaboration_id>/collaborators/add/', collaboration_views.add_collaborator, name='faculty_add_collaborator'),
    path('collaborations/<str:collaboration_id>/collaborators/<str:collaborator_id>/remove/', collaboration_views.remove_collaborator, name='faculty_remove_collaborator'),
    path('collaborations/<str:collaboration_id>/documents/upload/', collaboration_views.upload_collaboration_document, name='faculty_upload_collaboration_document'),
    path('collaborations/<str:collaboration_id>/messages/send/', collaboration_views.send_collaboration_message, name='faculty_send_collaboration_message'),
]