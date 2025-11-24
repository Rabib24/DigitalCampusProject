from django.urls import path
from . import cdn_views

urlpatterns = [
    path('status/', cdn_views.cdn_status, name='cdn_status'),
    path('generate-url/', cdn_views.generate_cdn_url, name='generate_cdn_url'),
    path('optimize/', cdn_views.optimize_for_delivery, name='optimize_for_delivery'),
    path('enable-folder/', cdn_views.enable_folder_cdn, name='enable_folder_cdn'),
]