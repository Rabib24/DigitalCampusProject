"""
Utility functions for Cloudinary operations in the Digital Campus project.
"""

def get_cloudinary_config():
    """
    Get Cloudinary configuration from Django settings.
    
    Returns:
        dict: Cloudinary configuration
    """
    from django.conf import settings
    return getattr(settings, 'CLOUDINARY_STORAGE', {})

def verify_cloudinary_setup():
    """
    Verify that Cloudinary is properly configured.
    
    Returns:
        bool: True if Cloudinary is properly configured, False otherwise
    """
    try:
        config = get_cloudinary_config()
        required_keys = ['CLOUD_NAME', 'API_KEY', 'API_SECRET']
        
        for key in required_keys:
            if not config.get(key):
                print(f"Missing Cloudinary configuration: {key}")
                return False
                
        print("✓ Cloudinary configuration is complete")
        return True
    except Exception as e:
        print(f"Error verifying Cloudinary setup: {e}")
        return False

def get_upload_url():
    """
    Get the upload URL for Cloudinary.
    
    Returns:
        str: Upload URL
    """
    config = get_cloudinary_config()
    cloud_name = config.get('CLOUD_NAME', '')
    if cloud_name:
        return f"https://api.cloudinary.com/v1_1/{cloud_name}/upload"
    return None

def get_management_url():
    """
    Get the management URL for Cloudinary.
    
    Returns:
        str: Management URL
    """
    config = get_cloudinary_config()
    cloud_name = config.get('CLOUD_NAME', '')
    if cloud_name:
        return f"https://res.cloudinary.com/{cloud_name}/image"
    return None

def upload_file(file, folder='digital_campus/uploads', **kwargs):
    """
    Upload a file to Cloudinary.
    
    Args:
        file: File object to upload
        folder: Folder path in Cloudinary
        **kwargs: Additional options for the upload
        
    Returns:
        dict: Upload result from Cloudinary
    """
    try:
        result = cloudinary.uploader.upload(
            file,
            folder=folder,
            **kwargs
        )
        return result
    except Exception as e:
        print(f"Error uploading file: {e}")
        return None

def delete_file(public_id):
    """
    Delete a file from Cloudinary.
    
    Args:
        public_id: Public ID of the file to delete
        
    Returns:
        dict: Deletion result from Cloudinary
    """
    try:
        result = cloudinary.uploader.destroy(public_id)
        return result
    except Exception as e:
        print(f"Error deleting file: {e}")
        return None

def get_file_info(public_id):
    """
    Get information about a file in Cloudinary.
    
    Args:
        public_id: Public ID of the file
        
    Returns:
        dict: File information from Cloudinary
    """
    try:
        result = cloudinary.api.resource(public_id)
        return result
    except Exception as e:
        print(f"Error getting file info: {e}")
        return None

def create_transformation(name, transformation):
    """
    Create a named transformation in Cloudinary.
    
    Args:
        name: Name of the transformation
        transformation: Transformation parameters
        
    Returns:
        dict: Creation result from Cloudinary
    """
    try:
        result = cloudinary.api.create_transformation(name, transformation)
        return result
    except Exception as e:
        print(f"Error creating transformation: {e}")
        return None

def list_resources(folder='digital_campus', max_results=100):
    """
    List resources in a Cloudinary folder.
    
    Args:
        folder: Folder path in Cloudinary
        max_results: Maximum number of results to return
        
    Returns:
        dict: List of resources from Cloudinary
    """
    try:
        result = cloudinary.api.resources(
            type='upload',
            prefix=folder,
            max_results=max_results
        )
        return result
    except Exception as e:
        print(f"Error listing resources: {e}")
        return None