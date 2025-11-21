import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Test the Redis client from faculty auth views
try:
    print("Testing Redis client from faculty auth views...")
    
    # Import the Redis client from faculty auth views
    from faculty.auth_views import redis_client
    
    if redis_client:
        print("Redis client is available")
        print(f"Redis client: {redis_client}")
        
        # Don't ping Redis to avoid hanging
        print("Redis client initialized without ping test")
    else:
        print("Redis client is not available")
        
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()