from django.urls import path
from . import views

urlpatterns = [
    # Finance admin dashboard endpoints
    path('dashboard/overview/', views.dashboard_overview, name='finance_admin_dashboard_overview'),
    path('payment-management/', views.payment_management, name='finance_admin_payment_management'),
    path('financial-aid-management/', views.financial_aid_management, name='finance_admin_financial_aid_management'),
]