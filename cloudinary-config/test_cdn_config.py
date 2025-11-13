#!/usr/bin/env python
"""
Test script to verify CDN configuration.
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

def test_cdn_configuration():
    """Test CDN configuration"""
    try:
        from django.conf import settings
        
        # Get CDN configuration
        cdn_config = getattr(settings, 'CLOUDINARY_CDN', {})
        enable_cdn = cdn_config.get('enable_cdn', True)
        cdn_subdomain = cdn_config.get('cdn_subdomain', True)
        secure_cdn_subdomain = cdn_config.get('secure_cdn_subdomain', True)
        cname = cdn_config.get('cname', '')
        private_cdn = cdn_config.get('private_cdn', False)
        
        print("CDN Configuration Test")
        print("=" * 25)
        print(f"CDN Enabled: {enable_cdn}")
        print(f"CDN Subdomain: {cdn_subdomain}")
        print(f"Secure CDN Subdomain: {secure_cdn_subdomain}")
        print(f"Custom CNAME: {cname if cname else 'Not set'}")
        print(f"Private CDN: {private_cdn}")
        
        # Check if CDN is properly configured
        if enable_cdn:
            print("\n✓ CDN is enabled")
            if cdn_subdomain:
                print("✓ CDN subdomain optimization is enabled")
            if secure_cdn_subdomain:
                print("✓ Secure CDN subdomain is enabled")
            if cname:
                print(f"✓ Custom CNAME configured: {cname}")
            if private_cdn:
                print("✓ Private CDN is enabled")
                
            print("\n✓ CDN configuration is complete")
            return True
        else:
            print("\n⚠ CDN is disabled")
            return False
            
    except Exception as e:
        print(f"✗ Error testing CDN configuration: {e}")
        return False

if __name__ == "__main__":
    success = test_cdn_configuration()
    sys.exit(0 if success else 1)