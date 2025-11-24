"""
CDN configuration for Cloudinary integration in the Digital Campus project.
This file contains the CDN settings and utilities for Cloudinary CDN.
"""

import os
import cloudinary

def configure_cloudinary_cdn():
    """
    Configure Cloudinary CDN settings.
    """
    # Get CDN configuration from environment variables or defaults
    cdn_config = {
        'enable_cdn': os.environ.get('CLOUDINARY_ENABLE_CDN', 'True').lower() == 'true',
        'cdn_subdomain': os.environ.get('CLOUDINARY_CDN_SUBDOMAIN', 'True').lower() == 'true',
        'secure_cdn_subdomain': os.environ.get('CLOUDINARY_SECURE_CDN_SUBDOMAIN', 'True').lower() == 'true',
        'cname': os.environ.get('CLOUDINARY_CNAME', ''),
        'private_cdn': os.environ.get('CLOUDINARY_PRIVATE_CDN', 'False').lower() == 'true',
    }
    
    # Apply CDN configuration to Cloudinary
    cloudinary.config(
        cloud_name=os.environ.get('CLOUDINARY_CLOUD_NAME', ''),
        api_key=os.environ.get('CLOUDINARY_API_KEY', ''),
        api_secret=os.environ.get('CLOUDINARY_API_SECRET', ''),
        secure=True,
        cdn_subdomain=cdn_config['cdn_subdomain'],
        secure_cdn_subdomain=cdn_config['secure_cdn_subdomain'],
        cname=cdn_config['cname'] if cdn_config['cname'] else None,
        private_cdn=cdn_config['private_cdn'],
    )
    
    return cdn_config

def get_cdn_url(public_id, transformation=None):
    """
    Generate a CDN URL for a Cloudinary resource.
    
    Args:
        public_id: Public ID of the resource
        transformation: Transformation parameters (optional)
        
    Returns:
        str: CDN URL for the resource
    """
    try:
        # Build the URL with CDN configuration
        url_options = {
            'secure': True,
            'cdn_subdomain': True,
        }
        
        if transformation:
            url_options['transformation'] = transformation
            
        url = cloudinary.utils.cloudinary_url(public_id, **url_options)
        return url[0] if isinstance(url, tuple) else url
    except Exception as e:
        print(f"Error generating CDN URL: {e}")
        return None

def optimize_for_cdn(file_path, optimizations=None):
    """
    Optimize a file for CDN delivery.
    
    Args:
        file_path: Path to the file
        optimizations: Optimization parameters (optional)
        
    Returns:
        dict: Optimization result
    """
    if optimizations is None:
        optimizations = {
            'quality': 'auto',
            'fetch_format': 'auto',
            'progressive': True,
        }
    
    try:
        # Apply optimizations
        optimized_url = cloudinary.utils.cloudinary_url(
            file_path,
            **optimizations
        )
        
        return {
            'success': True,
            'optimized_url': optimized_url[0] if isinstance(optimized_url, tuple) else optimized_url,
            'optimizations_applied': optimizations
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def enable_cdn_for_folder(folder_path):
    """
    Enable CDN delivery for all resources in a folder.
    
    Args:
        folder_path: Path to the folder in Cloudinary
        
    Returns:
        dict: Operation result
    """
    try:
        # This would typically involve setting up distribution settings
        # For Cloudinary, CDN is automatically enabled when using their URLs
        return {
            'success': True,
            'message': f'CDN enabled for folder: {folder_path}',
            'cdn_base_url': f'https://res.cloudinary.com/{os.environ.get("CLOUDINARY_CLOUD_NAME", "")}/image/upload/'
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

# Initialize CDN configuration
CDN_CONFIG = configure_cloudinary_cdn()

def get_cdn_status():
    """
    Get the current CDN configuration status.
    
    Returns:
        dict: CDN status information
    """
    return {
        'enabled': CDN_CONFIG['enable_cdn'],
        'cdn_subdomain': CDN_CONFIG['cdn_subdomain'],
        'secure_cdn_subdomain': CDN_CONFIG['secure_cdn_subdomain'],
        'cname': CDN_CONFIG['cname'],
        'private_cdn': CDN_CONFIG['private_cdn'],
        'cloud_name': os.environ.get('CLOUDINARY_CLOUD_NAME', ''),
    }