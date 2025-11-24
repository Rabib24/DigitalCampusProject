"""
Security configuration for the Digital Campus project.
This file contains security settings and utilities for WAF and DDoS protection.
"""

import os
import re
from django.http import HttpResponseForbidden
from django.utils.deprecation import MiddlewareMixin

class SecurityMiddleware(MiddlewareMixin):
    """
    Middleware for implementing basic WAF and DDoS protection.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        
        # Load security configuration from environment variables
        self.enable_waf = os.environ.get('SECURITY_ENABLE_WAF', 'True').lower() == 'true'
        self.enable_ddos_protection = os.environ.get('SECURITY_ENABLE_DDOS', 'True').lower() == 'true'
        self.rate_limit = int(os.environ.get('SECURITY_RATE_LIMIT', '100'))
        self.block_suspicious_ips = os.environ.get('SECURITY_BLOCK_SUSPICIOUS_IPS', 'True').lower() == 'true'
        
        # Suspicious patterns to block (basic WAF rules)
        self.suspicious_patterns = [
            r"(\b(SELECT|UNION|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)",
            r"(\/\*.*\*\/)",
            r"(\b(OR|AND)\s+\d+\s*=\s*\d+)",
            r"(\b(OR|AND)\s+'\w+'\s*=\s*'\w+')",
            r"(\.\.\/)",
            r"(<script.*?>)",
            r"(javascript:)",
            r"(onerror\s*=)",
            r"(onload\s*=)",
            r"(eval\s*\()",
            r"(document\.cookie)",
            r"(document\.write)",
        ]
        
        # Compile regex patterns for better performance
        self.compiled_patterns = [re.compile(pattern, re.IGNORECASE) for pattern in self.suspicious_patterns]
        
        # Track request counts per IP for basic DDoS protection
        self.ip_request_count = {}
        
    def __call__(self, request):
        # Check if security is enabled
        if not self.enable_waf and not self.enable_ddos_protection:
            return self.get_response(request)
            
        # Get client IP
        client_ip = self.get_client_ip(request)
        
        # Check for DDoS protection
        if self.enable_ddos_protection:
            if self.is_ddos_attack(client_ip):
                return HttpResponseForbidden("Too many requests. Access denied.")
        
        # Check for WAF protection
        if self.enable_waf:
            if self.is_suspicious_request(request):
                return HttpResponseForbidden("Suspicious request blocked.")
        
        # Continue with the request
        response = self.get_response(request)
        return response
        
    def get_client_ip(self, request):
        """
        Get the client IP address from the request.
        """
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
        
    def is_ddos_attack(self, client_ip):
        """
        Check if the request is part of a DDoS attack.
        """
        # Simple rate limiting implementation
        if client_ip in self.ip_request_count:
            self.ip_request_count[client_ip] += 1
        else:
            self.ip_request_count[client_ip] = 1
            
        # Reset count periodically (in a real implementation, this would be more sophisticated)
        if self.ip_request_count[client_ip] > 1000:
            self.ip_request_count[client_ip] = 0
            
        return self.ip_request_count[client_ip] > self.rate_limit
        
    def is_suspicious_request(self, request):
        """
        Check if the request contains suspicious patterns.
        """
        # Check GET parameters
        for key, value in request.GET.items():
            if self.contains_suspicious_patterns(str(value)):
                return True
                
        # Check POST data
        if request.method == 'POST':
            try:
                for key, value in request.POST.items():
                    if self.contains_suspicious_patterns(str(value)):
                        return True
            except:
                # If we can't parse POST data, check the raw body
                body = request.body.decode('utf-8', errors='ignore')
                if self.contains_suspicious_patterns(body):
                    return True
                    
        # Check headers
        for key, value in request.META.items():
            if isinstance(value, str) and self.contains_suspicious_patterns(value):
                return True
                
        # Check path
        if self.contains_suspicious_patterns(request.path):
            return True
            
        return False
        
    def contains_suspicious_patterns(self, text):
        """
        Check if text contains suspicious patterns.
        """
        for pattern in self.compiled_patterns:
            if pattern.search(text):
                return True
        return False

# Security configuration
SECURITY_CONFIG = {
    'enable_waf': os.environ.get('SECURITY_ENABLE_WAF', 'True').lower() == 'true',
    'enable_ddos_protection': os.environ.get('SECURITY_ENABLE_DDOS', 'True').lower() == 'true',
    'rate_limit': int(os.environ.get('SECURITY_RATE_LIMIT', '100')),
    'block_suspicious_ips': os.environ.get('SECURITY_BLOCK_SUSPICIOUS_IPS', 'True').lower() == 'true',
    'allowed_ips': os.environ.get('SECURITY_ALLOWED_IPS', '').split(','),
    'blocked_ips': os.environ.get('SECURITY_BLOCKED_IPS', '').split(','),
}

def get_security_status():
    """
    Get the current security configuration status.
    
    Returns:
        dict: Security status information
    """
    return {
        'waf_enabled': SECURITY_CONFIG['enable_waf'],
        'ddos_protection_enabled': SECURITY_CONFIG['enable_ddos_protection'],
        'rate_limit': SECURITY_CONFIG['rate_limit'],
        'block_suspicious_ips': SECURITY_CONFIG['block_suspicious_ips'],
        'allowed_ips_count': len([ip for ip in SECURITY_CONFIG['allowed_ips'] if ip]),
        'blocked_ips_count': len([ip for ip in SECURITY_CONFIG['blocked_ips'] if ip]),
    }

def is_ip_allowed(ip):
    """
    Check if an IP is in the allowed list.
    
    Args:
        ip: IP address to check
        
    Returns:
        bool: True if IP is allowed, False otherwise
    """
    allowed_ips = SECURITY_CONFIG['allowed_ips']
    return not any(allowed_ips) or ip in allowed_ips

def is_ip_blocked(ip):
    """
    Check if an IP is in the blocked list.
    
    Args:
        ip: IP address to check
        
    Returns:
        bool: True if IP is blocked, False otherwise
    """
    blocked_ips = SECURITY_CONFIG['blocked_ips']
    return ip in blocked_ips