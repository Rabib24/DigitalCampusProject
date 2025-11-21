from django.urls import path
from . import views

urlpatterns = [
    # Admin dashboard endpoints
    path('dashboard/overview/', views.dashboard_overview, name='admin_dashboard_overview'),
    path('user-management/', views.user_management, name='admin_user_management'),
    path('system-monitoring/', views.system_monitoring, name='admin_system_monitoring'),
]