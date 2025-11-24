import redis
import jwt
from django.conf import settings
from datetime import datetime

# Initialize Redis client
redis_client = redis.Redis(
    host=getattr(settings, 'REDIS_HOST', 'localhost'),
    port=getattr(settings, 'REDIS_PORT', 6379),
    db=getattr(settings, 'REDIS_DB', 0),
    decode_responses=True
)

def add_token_to_blacklist(token: str) -> bool:
    """
    Add a JWT token to the blacklist in Redis.
    
    Args:
        token: The JWT token to blacklist
        
    Returns:
        True if successful, False otherwise
    """
    try:
        # Decode the token to get expiration time
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        exp_timestamp = decoded.get('exp')
        
        if not exp_timestamp:
            return False
            
        # Calculate TTL (time until token expires)
        current_time = datetime.now().timestamp()
        ttl = int(exp_timestamp - current_time)
        
        # Only add to blacklist if token hasn't expired yet
        if ttl > 0:
            redis_key = f"blacklist:token:{token}"
            redis_client.setex(redis_key, ttl, '1')
            return True
        
        return False
        
    except jwt.ExpiredSignatureError:
        # Token already expired, no need to blacklist
        return True
    except jwt.InvalidTokenError:
        # Invalid token, can't blacklist
        return False
    except Exception as e:
        print(f"Error adding token to blacklist: {e}")
        return False


def is_token_blacklisted(token: str) -> bool:
    """
    Check if a JWT token is in the blacklist.
    
    Args:
        token: The JWT token to check
        
    Returns:
        True if blacklisted, False otherwise
    """
    try:
        redis_key = f"blacklist:token:{token}"
        return redis_client.exists(redis_key) > 0
    except Exception as e:
        print(f"Error checking token blacklist: {e}")
        # Fail secure: if we can't check, assume it's blacklisted
        return True


def remove_token_from_blacklist(token: str) -> bool:
    """
    Remove a token from the blacklist (mainly for testing purposes).
    
    Args:
        token: The JWT token to remove
        
    Returns:
        True if successful, False otherwise
    """
    try:
        redis_key = f"blacklist:token:{token}"
        redis_client.delete(redis_key)
        return True
    except Exception as e:
        print(f"Error removing token from blacklist: {e}")
        return False


def cleanup_expired_tokens():
    """
    Cleanup expired tokens from blacklist.
    This is mainly for maintenance, as Redis TTL handles this automatically.
    """
    try:
        # Redis automatically removes keys when TTL expires
        # This function is here for manual cleanup if needed
        pattern = "blacklist:token:*"
        for key in redis_client.scan_iter(pattern):
            # Check if key still exists (Redis will auto-delete expired ones)
            if redis_client.ttl(key) == -2:
                redis_client.delete(key)
        return True
    except Exception as e:
        print(f"Error during token cleanup: {e}")
        return False
