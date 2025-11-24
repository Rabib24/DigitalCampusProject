from django.urls import path
from security_views import security_status, check_ip, update_security_config, test_waf

urlpatterns = [
    path('status/', security_status, name='security_status'),
    path('check-ip/', check_ip, name='check_ip'),
    path('update-config/', update_security_config, name='update_security_config'),
    path('test-waf/', test_waf, name='test_waf'),
]