from django.urls import path
from faculty.collaboration_views import get_collaborations, create_collaboration, get_collaboration_detail, update_collaboration, delete_collaboration, add_collaborator, remove_collaborator, upload_document, send_message

urlpatterns = [
    path('list/', get_collaborations, name='faculty_collaborations_list'),
    path('create/', create_collaboration, name='faculty_collaborations_create'),
    path('<int:collaboration_id>/', get_collaboration_detail, name='faculty_collaborations_detail'),
    path('<int:collaboration_id>/update/', update_collaboration, name='faculty_collaborations_update'),
    path('<int:collaboration_id>/delete/', delete_collaboration, name='faculty_collaborations_delete'),
    path('<int:collaboration_id>/collaborators/add/', add_collaborator, name='faculty_collaborations_add_collaborator'),
    path('<int:collaboration_id>/collaborators/<int:collaborator_id>/remove/', remove_collaborator, name='faculty_collaborations_remove_collaborator'),
    path('<int:collaboration_id>/documents/upload/', upload_document, name='faculty_collaborations_upload_document'),
    path('<int:collaboration_id>/messages/send/', send_message, name='faculty_collaborations_send_message'),
]