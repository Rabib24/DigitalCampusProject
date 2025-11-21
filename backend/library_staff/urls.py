from django.urls import path
from . import views

urlpatterns = [
    # Library staff dashboard endpoints
    path('dashboard/overview/', views.dashboard_overview, name='library_staff_dashboard_overview'),
    path('book-management/', views.book_management, name='library_staff_book_management'),
    path('patron-management/', views.patron_management, name='library_staff_patron_management'),
]