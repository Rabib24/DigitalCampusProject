"""
Cloudinary configuration for the Digital Campus project.
This file contains the configuration settings for Cloudinary integration.
"""

import os
from django.conf import settings

# Cloudinary configuration
CLOUDINARY_CONFIG = {
    'cloud_name': os.environ.get('CLOUDINARY_CLOUD_NAME', ''),
    'api_key': os.environ.get('CLOUDINARY_API_KEY', ''),
    'api_secret': os.environ.get('CLOUDINARY_API_SECRET', ''),
    'secure': True,
}

# Cloudinary storage settings
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': CLOUDINARY_CONFIG['cloud_name'],
    'API_KEY': CLOUDINARY_CONFIG['api_key'],
    'API_SECRET': CLOUDINARY_CONFIG['api_secret'],
    'MEDIA_FOLDER': 'digital_campus/media',
    'STATIC_FOLDER': 'digital_campus/static',
    'STATIC_IMAGES_FOLDER': 'digital_campus/static/images',
    'STATIC_CSS_FOLDER': 'digital_campus/static/css',
    'STATIC_JS_FOLDER': 'digital_campus/static/js',
}

# CDN and delivery settings
CLOUDINARY_CDN = {
    'enable_cdn': True,
    'cdn_subdomain': True,
    'secure_cdn_subdomain': True,
    'cname': os.environ.get('CLOUDINARY_CNAME', ''),
    'private_cdn': os.environ.get('CLOUDINARY_PRIVATE_CDN', 'False').lower() == 'true',
}

# File upload settings
FILE_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 10 * 1024 * 1024  # 10MB

# Cloudinary transformation settings
CLOUDINARY_TRANSFORMATIONS = {
    'thumbnail': {
        'width': 150,
        'height': 150,
        'crop': 'thumb',
        'gravity': 'face',
    },
    'medium': {
        'width': 1000,
        'height': 1000,
        'crop': 'limit',
    },
    'large': {
        'width': 2000,
        'height': 2000,
        'crop': 'limit',
    },
}