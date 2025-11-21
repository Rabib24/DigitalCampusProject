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
        print(f"Redis client host: {redis_client.connection_pool.connection_kwargs.get('host')}")
        print(f"Redis client port: {redis_client.connection_pool.connection_kwargs.get('port')}")
    else:
        print("Redis client is not available - this is expected if Redis is not running")
        
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()