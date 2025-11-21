from django.urls import path
from . import views

urlpatterns = [
    # IT admin dashboard endpoints
    path('dashboard/overview/', views.dashboard_overview, name='it_admin_dashboard_overview'),
    path('system-management/', views.system_management, name='it_admin_system_management'),
    path('user-management/', views.user_management, name='it_admin_user_management'),
]