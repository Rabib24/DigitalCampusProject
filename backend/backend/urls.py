"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

api_v1_patterns = ([
    path('ai/', include('ai_service.urls')),
    path('auth/', include('users.urls')),
    path('faculty/', include('faculty.urls')),
    path('admin/', include('admin_dashboard.urls')),
    path('library/', include('library_staff.urls')),
    path('finance/', include('finance_admin.urls')),
    path('it/', include('it_admin.urls')),
    path('search/', include('search_urls')),
    path('security/', include('security_urls')),
    path('student/', include('student.urls')),], 'v1')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(api_v1_patterns, namespace='v1')),
]