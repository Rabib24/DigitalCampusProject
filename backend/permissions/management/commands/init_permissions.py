from django.core.management.base import BaseCommand
from permissions.services import PermissionService

class Command(BaseCommand):
    help = 'Initialize default permissions for the system'
    
    def handle(self, *args, **options):
        self.stdout.write('Initializing default permissions...')
        PermissionService.initialize_default_permissions()
        self.stdout.write(
            self.style.SUCCESS('Successfully initialized default permissions')
        )