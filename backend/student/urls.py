from django.urls import path
from . import course_views
from . import admin_views
from . import views

urlpatterns = [
    # Student dashboard endpoint
    path('dashboard/', views.student_dashboard, name='student_dashboard'),
    
    # Student grades endpoints
    path('grades/', views.student_grades, name='student_grades'),
    path('grades/stats/', views.student_grade_stats, name='student_grade_stats'),
    
    # Student degree planning endpoint
    path('degree-planning/', views.degree_planning, name='degree_planning'),
    
    # Student course enrollment endpoints
    path('courses/available/', course_views.get_available_courses, name='get_available_courses'),
    path('courses/search/', course_views.search_courses, name='search_courses'),
    path('courses/recommended/', course_views.get_recommended_courses_view, name='get_recommended_courses'),
    path('courses/<str:course_id>/enroll/', course_views.enroll_in_course, name='enroll_in_course'),
    path('courses/<str:course_id>/drop/', course_views.drop_course, name='drop_course'),
    path('courses/waitlist/', course_views.get_waitlisted_courses, name='get_waitlisted_courses'),
    path('courses/', course_views.get_student_courses, name='get_student_courses'),
    path('enrollments/', course_views.get_student_enrollments, name='get_student_enrollments'),
    path('assignments/', course_views.get_student_assignments, name='get_student_assignments'),
    
    # Student enrollment periods endpoint
    path('enrollment/periods/', course_views.get_student_enrollment_periods, name='get_student_enrollment_periods'),
    
    # Student course cart endpoints
    path('enrollment/cart/', course_views.get_cart, name='get_cart'),
    path('enrollment/cart/add/<str:course_id>/', course_views.add_to_cart, name='add_to_cart'),
    path('enrollment/cart/remove/<str:course_id>/', course_views.remove_from_cart, name='remove_from_cart'),
    path('enrollment/cart/clear/', course_views.clear_cart, name='clear_cart'),
    path('enrollment/cart/enroll/', course_views.enroll_from_cart, name='enroll_from_cart'),
    
    # Admin enrollment period management endpoints
    path('admin/enrollment/periods/', admin_views.create_enrollment_period, name='create_enrollment_period'),
    path('admin/enrollment/periods/list/', admin_views.get_enrollment_periods, name='get_enrollment_periods'),
    path('admin/enrollment/periods/<str:period_id>/', admin_views.get_enrollment_period, name='get_enrollment_period'),
    path('admin/enrollment/periods/<str:period_id>/update/', admin_views.update_enrollment_period, name='update_enrollment_period'),
    path('admin/enrollment/periods/<str:period_id>/delete/', admin_views.delete_enrollment_period, name='delete_enrollment_period'),
]