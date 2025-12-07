from django.urls import path
from . import views

urlpatterns = [
    path('recommendations/', views.ai_recommendations, name='ai_recommendations'),
    path('performance-prediction/', views.academic_performance_prediction, name='academic_performance_prediction'),
    path('search/', views.ai_search, name='ai_search'),
    # path('chatbot/', views.ai_chatbot, name='ai_chatbot'),  # Commented out as view doesn't exist
]