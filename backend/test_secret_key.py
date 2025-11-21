import os
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

print("SECRET_KEY from settings:", settings.SECRET_KEY[:50])
print("SECRET_KEY length:", len(settings.SECRET_KEY))