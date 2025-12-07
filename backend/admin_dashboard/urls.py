from django.urls import path
from . import views
from . import enrollment_views

urlpatterns = [
    # Admin dashboard endpoints
    path('dashboard/overview/', views.dashboard_overview, name='admin_dashboard_overview'),
    path('user-management/', views.user_management, name='admin_user_management'),
    path('system-monitoring/', views.system_monitoring, name='admin_system_monitoring'),
    
    # New unified admin dashboard endpoints
    path('permission-management/', views.permission_management, name='admin_permission_management'),
    path('course-management/', views.course_management, name='admin_course_management'),
    path('faculty-management/', views.faculty_management, name='admin_faculty_management'),
    path('student-management/', views.student_management, name='admin_student_management'),
    path('grade-management/', views.grade_management, name='admin_grade_management'),
    path('reporting/', views.reporting, name='admin_reporting'),
    
    # Enrollment management endpoints
    path('enrollment/faculty-assignment/', enrollment_views.assign_faculty_to_course, name='admin_assign_faculty'),
    path('enrollment/reports/', enrollment_views.get_enrollment_reports, name='admin_enrollment_reports'),
    path('enrollment/overrides/', enrollment_views.get_enrollment_overrides, name='admin_enrollment_overrides'),
    path('enrollment/overrides/create/', enrollment_views.create_enrollment_override_request, name='admin_create_enrollment_override'),
    path('enrollment/overrides/<str:request_id>/', enrollment_views.process_enrollment_override, name='admin_process_enrollment_override'),
    
    # Course faculty management endpoints
    path('courses/<str:course_id>/faculty/', enrollment_views.get_course_faculty, name='admin_get_course_faculty'),
    path('courses/<str:course_id>/faculty/assign/', enrollment_views.assign_faculty_to_course, name='admin_assign_faculty_to_course'),
    path('courses/<str:course_id>/faculty/update/', enrollment_views.update_course_faculty, name='admin_update_course_faculty'),
    path('courses/<str:course_id>/faculty/remove/', enrollment_views.remove_faculty_from_course, name='admin_remove_faculty_from_course'),
]