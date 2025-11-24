from django.urls import path
from users.views import login_view, register_view, logout_view
from users.sso_views import sso_login, sso_callback

urlpatterns = [
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('logout/', logout_view, name='logout'),
    path('sso/login/', sso_login, name='sso_login'),
    path('sso/callback/', sso_callback, name='sso_callback'),
]