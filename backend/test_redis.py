import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Try to import and test Redis
try:
    import redis
    from django.conf import settings
    
    print("Attempting to connect to Redis...")
    
    # Initialize Redis connection
    redis_client = redis.Redis(
        host=settings.REDIS_HOST if hasattr(settings, 'REDIS_HOST') else 'localhost',
        port=settings.REDIS_PORT if hasattr(settings, 'REDIS_PORT') else 6379,
        db=0,
        socket_connect_timeout=1,  # 1 second timeout
        socket_timeout=1
    )
    
    # Try to ping Redis
    redis_client.ping()
    print("Redis connection successful!")
    print(f"Redis client: {redis_client}")
    
except Exception as e:
    print(f"Redis connection failed: {e}")
    print("Redis is not available, but the application should still work with proper error handling.")