#!/usr/bin/env python
"""
Test script to verify Cloudinary configuration.
"""

import os
import sys
import django

# Add the backend directory to the Python path
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend')
sys.path.insert(0, backend_dir)

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.config.settings')
django.setup()

def test_cloudinary_configuration():
    """Test Cloudinary configuration"""
    try:
        from django.conf import settings
        
        # Get Cloudinary configuration
        cloudinary_config = getattr(settings, 'CLOUDINARY_STORAGE', {})
        cloud_name = cloudinary_config.get('CLOUD_NAME', '')
        api_key = cloudinary_config.get('API_KEY', '')
        api_secret = cloudinary_config.get('API_SECRET', '')
        
        print("Cloudinary Configuration Test")
        print("=" * 30)
        print(f"Cloud Name: {cloud_name if cloud_name else 'NOT SET'}")
        print(f"API Key: {api_key if api_key else 'NOT SET'}")
        print(f"API Secret: {'*' * len(api_secret) if api_secret else 'NOT SET'}")
        
        # Check if all required configuration is present
        if cloud_name and api_key and api_secret:
            print("\n✓ Cloudinary is properly configured")
            print("✓ Ready for file uploads and management")
            return True
        else:
            print("\n✗ Cloudinary configuration is incomplete")
            print("Please set the following environment variables:")
            if not cloud_name:
                print("  - CLOUDINARY_CLOUD_NAME")
            if not api_key:
                print("  - CLOUDINARY_API_KEY")
            if not api_secret:
                print("  - CLOUDINARY_API_SECRET")
            return False
            
    except Exception as e:
        print(f"✗ Error testing Cloudinary configuration: {e}")
        return False

if __name__ == "__main__":
    success = test_cloudinary_configuration()
    sys.exit(0 if success else 1)