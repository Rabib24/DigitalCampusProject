# Simple in-memory token blacklist implementation
# This is a temporary solution when Redis is not available

# In-memory storage for blacklisted tokens
_blacklisted_tokens = set()

def add_token_to_blacklist(token: str) -> bool:
    """
    Add a JWT token to the blacklist in memory.
    
    Args:
        token: The JWT token to blacklist
        
    Returns:
        True if successful, False otherwise
    """
    try:
        _blacklisted_tokens.add(token)
        return True
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
        return token in _blacklisted_tokens
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
        _blacklisted_tokens.discard(token)
        return True
    except Exception as e:
        print(f"Error removing token from blacklist: {e}")
        return False


def cleanup_expired_tokens():
    """
    Cleanup expired tokens from blacklist.
    Since we don't track expiration in this simple implementation,
    this function does nothing.
    """
    # In a more sophisticated implementation, we would clean up expired tokens
    # But for this simple in-memory version, we'll just return True
    return True