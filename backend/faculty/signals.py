from django.db.models.signals import post_save
from django.dispatch import receiver
from users.models import Faculty
from .models import FacultySettings

@receiver(post_save, sender=Faculty)
def create_faculty_settings(sender, instance, created, **kwargs):
    """Create FacultySettings when a Faculty profile is created"""
    if created:
        FacultySettings.objects.create(faculty=instance)