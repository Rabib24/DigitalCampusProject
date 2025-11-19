import jwt
import redis
import pyotp
import uuid
import hashlib
import csv
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone
from datetime import datetime, timedelta
import json
import random
import string
from users.models import User, Faculty
from .models import FacultySettings

# Initialize Redis connection
try:
    redis_client = redis.Redis(
        host=settings.REDIS_HOST if hasattr(settings, 'REDIS_HOST') else 'localhost',
        port=settings.REDIS_PORT if hasattr(settings, 'REDIS_PORT') else 6379,
        db=0
    )
except:
    redis_client = None

def generate_jwt_token(user):
    """Generate JWT token for user"""
    payload = {
        'user_id': user.id,
        'username': user.username,
        'role': user.role,
        'exp': datetime.utcnow() + timedelta(hours=24),  # Token expires in 24 hours
        'iat': datetime.utcnow()
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
    return token

def blacklist_token(token):
    """Add token to blacklist in Redis"""
    if redis_client:
        # Set token to expire in 24 hours (same as JWT expiration)
        redis_client.setex(f"blacklisted_token_{token}", 24 * 60 * 60, "1")

def check_rate_limit(ip_address):
    """Check if IP address has exceeded rate limit"""
    if not redis_client:
        return True  # If Redis is not available, allow request
    
    # Get current attempt count for this IP
    key = f"login_attempts_{ip_address}"
    attempts = redis_client.get(key)
    
    if attempts is None:
        # First attempt, set expiration to 15 minutes
        redis_client.setex(key, 15 * 60, 1)
        return True
    else:
        try:
            # Decode bytes to string if needed, then convert to int
            if isinstance(attempts, bytes):
                attempts_str = attempts.decode('utf-8')
            else:
                attempts_str = str(attempts)
            attempts_int = int(attempts_str)
            
            if attempts_int >= 10:  # Max 10 attempts per 15 minutes
                return False
            else:
                # Increment attempt count
                redis_client.incr(key)
                return True
        except (ValueError, TypeError):
            # If we can't parse the attempts, reset the counter
            redis_client.setex(key, 15 * 60, 1)
            return True

def log_security_event(event_type, ip_address, user_id=None, details=None):
    """Log security events for monitoring"""
    if redis_client:
        event_data = {
            'timestamp': str(timezone.now()),
            'event_type': event_type,
            'ip_address': ip_address,
            'user_id': user_id,
            'details': details or {}
        }
        # Store in Redis list for security monitoring
        redis_client.lpush("security_events", json.dumps(event_data))
        # Keep only last 1000 events
        redis_client.ltrim("security_events", 0, 999)

def generate_password_reset_token(user):
    """Generate a secure password reset token"""
    # Create a unique token using user ID, timestamp, and random string
    token_data = f"{user.id}{timezone.now().isoformat()}{uuid.uuid4()}"
    token = hashlib.sha256(token_data.encode()).hexdigest()
    
    # Store token in Redis with 1 hour expiration
    if redis_client:
        reset_data = {
            'user_id': user.id,
            'created_at': timezone.now().isoformat()
        }
        redis_client.setex(f"password_reset_{token}", 60 * 60, json.dumps(reset_data))
    
    return token

def validate_password_reset_token(token):
    """Validate a password reset token and return user if valid"""
    if not redis_client:
        return None
    
    # Get token data from Redis
    reset_data_bytes = redis_client.get(f"password_reset_{token}")
    if not reset_data_bytes:
        return None
    
    try:
        # Decode bytes to string if needed
        if isinstance(reset_data_bytes, bytes):
            reset_data_str = reset_data_bytes.decode('utf-8')
        else:
            reset_data_str = str(reset_data_bytes)
            
        reset_data = json.loads(reset_data_str)
        user_id = reset_data.get('user_id')
        user = User.objects.get(id=user_id)  # type: ignore
        return user
    except:
        return None

def is_password_common(password):
    """Check if password is in common password list"""
    # This is a simplified version - in production, you would use a larger list
    common_passwords = [
        'password', '123456', 'qwerty', 'admin', 'welcome',
        'password123', '123456789', 'abcdef', '000000'
    ]
    return password.lower() in common_passwords

def is_password_valid(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if len(password) > 128:
        return False, "Password must be less than 128 characters long"
    
    if is_password_common(password):
        return False, "Password is too common"
    
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in password)
    
    if not (has_upper and has_lower and has_digit and has_special):
        return False, "Password must contain uppercase, lowercase, digit, and special character"
    
    return True, "Password is valid"

def send_password_reset_email(user, token):
    """Send password reset email (simplified version)"""
    # In a real implementation, you would integrate with an email service
    # like SendGrid, Mailgun, or SMTP
    reset_url = f"https://digitalcampus.example.com/reset-password?token={token}"
    
    # Log the email instead of actually sending it
    log_security_event('password_reset_email_sent', 'system', user.id, {
        'email': user.email,
        'reset_url': reset_url
    })
    
    return True

def send_faculty_invitation_email(email, invitation_token):
    """Send faculty invitation email (simplified version)"""
    # In a real implementation, you would integrate with an email service
    # like SendGrid, Mailgun, or SMTP
    invitation_url = f"https://digitalcampus.example.com/faculty/register?token={invitation_token}"
    
    # Log the email instead of actually sending it
    log_security_event('faculty_invitation_sent', 'system', details={
        'email': email,
        'invitation_url': invitation_url
    })
    
    return True

def generate_invitation_token():
    """Generate a unique invitation token"""
    token_data = f"{timezone.now().isoformat()}{uuid.uuid4()}"
    token = hashlib.sha256(token_data.encode()).hexdigest()
    
    # Store token in Redis with 7 days expiration
    if redis_client:
        invitation_data = {
            'created_at': timezone.now().isoformat()
        }
        redis_client.setex(f"faculty_invitation_{token}", 7 * 24 * 60 * 60, json.dumps(invitation_data))
    
    return token

def validate_invitation_token(token):
    """Validate an invitation token"""
    if not redis_client:
        return False
    
    # Get token data from Redis
    invitation_data_bytes = redis_client.get(f"faculty_invitation_{token}")
    if not invitation_data_bytes:
        return False
    
    return True

@csrf_exempt
def faculty_login(request):
    """Faculty login endpoint with JWT token generation"""
    if request.method == 'POST':
        try:
            # Get IP address for security logging
            ip_address = request.META.get('REMOTE_ADDR', '')
            
            # Check rate limiting
            if not check_rate_limit(ip_address):
                log_security_event('rate_limit_exceeded', ip_address)
                return JsonResponse({
                    'success': False,
                    'message': 'Too many login attempts. Please try again later.'
                }, status=429)
            
            data = json.loads(request.body)
            identifier = data.get('identifier')  # email or username
            password = data.get('password')
            mfa_code = data.get('mfa_code')  # Optional MFA code
            
            # Try to authenticate with email or username (ID)
            user = None
            
            # First try with email
            if '@' in identifier:
                try:
                    user = User.objects.get(email=identifier, role='faculty')  # type: ignore
                except User.DoesNotExist:  # type: ignore
                    pass
            
            # If not found by email, try with username (ID)
            if not user:
                try:
                    user = User.objects.get(username=identifier, role='faculty')  # type: ignore
                except User.DoesNotExist:  # type: ignore
                    pass
            
            # If user not found
            if not user:
                log_security_event('login_failed', ip_address, details={'reason': 'user_not_found', 'identifier': identifier})
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid credentials'
                }, status=401)
            
            # Check password
            if not check_password(password, user.password):
                # Increment failed login attempts
                user.failed_login_attempts += 1
                
                # Lock account after 5 failed attempts
                if user.failed_login_attempts >= 5:
                    user.locked_until = timezone.now() + timedelta(minutes=30)
                
                user.save()
                
                log_security_event('login_failed', ip_address, user.id, {'reason': 'invalid_password'})
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid credentials'
                }, status=401)
            
            # Check if account is locked
            if user.locked_until and user.locked_until > timezone.now():
                log_security_event('login_failed', ip_address, user.id, {'reason': 'account_locked'})
                return JsonResponse({
                    'success': False,
                    'message': 'Account is locked. Please try again later.'
                }, status=403)
            
            # Reset failed login attempts
            user.failed_login_attempts = 0
            user.locked_until = None
            user.save()
            
            # Check if MFA is enabled
            if user.mfa_enabled:
                # If MFA code is not provided, request it
                if not mfa_code:
                    return JsonResponse({
                        'success': False,
                        'message': 'MFA code required',
                        'mfa_required': True
                    }, status=401)
                
                # Verify MFA code
                try:
                    faculty_profile = Faculty.objects.get(user=user)  # type: ignore
                    totp = pyotp.TOTP(faculty_profile.mfa_secret)
                    if not totp.verify(mfa_code):
                        log_security_event('mfa_failed', ip_address, user.id)
                        return JsonResponse({
                            'success': False,
                            'message': 'Invalid MFA code'
                        }, status=401)
                except Faculty.DoesNotExist:  # type: ignore
                    return JsonResponse({
                        'success': False,
                        'message': 'Faculty profile not found'
                    }, status=404)
            
            # Update last login
            user.update_last_login()
            
            # Generate JWT token
            token = generate_jwt_token(user)
            
            # Store session info in Redis
            if redis_client:
                session_data = {
                    'user_id': user.id,
                    'login_time': str(timezone.now()),
                    'ip_address': ip_address,
                }
                redis_client.setex(f"user_session_{user.id}", 24 * 60 * 60, json.dumps(session_data))
            
            # Log successful login
            log_security_event('login_success', ip_address, user.id)
            
            # Return user data and token
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'status': user.status
            }
            
            # Include faculty-specific information
            try:
                faculty_profile = Faculty.objects.get(user=user)  # type: ignore
                user_data['employee_id'] = faculty_profile.employee_id
                user_data['department'] = faculty_profile.department
                user_data['title'] = faculty_profile.title
                user_data['office_location'] = faculty_profile.office_location
            except Faculty.DoesNotExist:  # type: ignore
                pass
            
            return JsonResponse({
                'success': True,
                'user': user_data,
                'token': token
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Login failed'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def faculty_logout(request):
    """Faculty logout endpoint with token invalidation"""
    if request.method == 'POST':
        try:
            # Get token from authorization header
            auth_header = request.META.get('HTTP_AUTHORIZATION')
            ip_address = request.META.get('REMOTE_ADDR', '')
            
            if auth_header and auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
                
                # Blacklist the token
                blacklist_token(token)
                
                # Remove session from Redis
                if hasattr(request, 'user') and redis_client:
                    user_id = request.user.id
                    redis_client.delete(f"user_session_{user_id}")
                    log_security_event('logout_success', ip_address, user_id)
            
            return JsonResponse({
                'success': True,
                'message': 'Logged out successfully'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Logout failed'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def faculty_register(request):
    """Faculty registration endpoint (admin approval required)"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            first_name = data.get('firstName')
            last_name = data.get('lastName')
            email = data.get('email')
            employee_id = data.get('employeeId')
            department = data.get('department')
            title = data.get('title')
            password = data.get('password')
            confirm_password = data.get('confirmPassword')
            invitation_token = data.get('invitationToken')
            
            # Validate required fields
            if not all([first_name, last_name, email, employee_id, department, title]):
                return JsonResponse({
                    'success': False,
                    'message': 'All fields are required'
                }, status=400)
            
            # Validate password
            if password != confirm_password:
                return JsonResponse({
                    'success': False,
                    'message': 'Passwords do not match'
                }, status=400)
            
            # Validate password strength
            is_valid, message = is_password_valid(password)
            if not is_valid:
                return JsonResponse({
                    'success': False,
                    'message': message
                }, status=400)
            
            # Validate invitation token if provided
            if invitation_token and not validate_invitation_token(invitation_token):
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid or expired invitation token'
                }, status=400)
            
            # Check if user already exists
            if User.objects.filter(email=email).exists():  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'User with this email already exists'
                }, status=400)
            
            if User.objects.filter(username=employee_id).exists():  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'User with this employee ID already exists'
                }, status=400)
            
            # Hash password
            hashed_password = make_password(password)
            
            # Create user (status will be inactive until admin approval)
            user = User.objects.create(  # type: ignore
                username=employee_id,
                email=email,
                first_name=first_name,
                last_name=last_name,
                role='faculty',
                status='inactive',  # Requires admin approval
                password=hashed_password,
                mfa_enabled=False
            )
            
            # Create faculty profile
            faculty = Faculty.objects.create(  # type: ignore
                user=user,
                employee_id=employee_id,
                department=department,
                title=title
            )
            
            # Create default faculty settings
            FacultySettings.objects.create(  # type: ignore
                faculty=faculty
            )
            
            # Log the registration
            ip_address = request.META.get('REMOTE_ADDR', '')
            log_security_event('faculty_registered', ip_address, user.id, {
                'email': email,
                'employee_id': employee_id,
                'department': department,
                'title': title
            })
            
            return JsonResponse({
                'success': True,
                'message': 'Registration successful. Awaiting admin approval.'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Registration failed'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def faculty_request_password_reset(request):
    """Request password reset token"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            
            if not email:
                return JsonResponse({
                    'success': False,
                    'message': 'Email is required'
                }, status=400)
            
            # Check rate limiting for this IP
            ip_address = request.META.get('REMOTE_ADDR', '')
            if not check_rate_limit(f"reset_{ip_address}"):
                return JsonResponse({
                    'success': False,
                    'message': 'Too many reset requests. Please try again later.'
                }, status=429)
            
            # Find faculty user by email
            try:
                user = User.objects.get(email=email, role='faculty')  # type: ignore
                
                # Generate password reset token
                token = generate_password_reset_token(user)
                
                # Send password reset email
                if send_password_reset_email(user, token):
                    log_security_event('password_reset_requested', ip_address, user.id)
                    return JsonResponse({
                        'success': True,
                        'message': 'Password reset instructions sent to your email'
                    })
                else:
                    return JsonResponse({
                        'success': False,
                        'message': 'Failed to send password reset email'
                    }, status=500)
                    
            except User.DoesNotExist:  # type: ignore
                # Don't reveal if user exists or not for security
                log_security_event('password_reset_failed', ip_address, details={'reason': 'user_not_found', 'email': email})
                return JsonResponse({
                    'success': True,
                    'message': 'If an account exists with this email, password reset instructions have been sent'
                })
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to process password reset request'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def faculty_reset_password(request):
    """Reset password with token"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            token = data.get('token')
            new_password = data.get('new_password')
            confirm_password = data.get('confirm_password')
            
            # Validate input
            if not token or not new_password or not confirm_password:
                return JsonResponse({
                    'success': False,
                    'message': 'Token, new password, and confirm password are required'
                }, status=400)
            
            if new_password != confirm_password:
                return JsonResponse({
                    'success': False,
                    'message': 'Passwords do not match'
                }, status=400)
            
            # Validate password strength
            is_valid, message = is_password_valid(new_password)
            if not is_valid:
                return JsonResponse({
                    'success': False,
                    'message': message
                }, status=400)
            
            # Validate reset token
            user = validate_password_reset_token(token)
            if not user:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid or expired password reset token'
                }, status=400)
            
            # Check if password was used recently (simplified version)
            # In production, you would store password history
            if check_password(new_password, user.password):
                return JsonResponse({
                    'success': False,
                    'message': 'New password cannot be the same as current password'
                }, status=400)
            
            # Update password
            user.password = make_password(new_password)
            user.save()
            
            # Delete the used token
            if redis_client:
                redis_client.delete(f"password_reset_{token}")
            
            # Log the password reset
            ip_address = request.META.get('REMOTE_ADDR', '')
            log_security_event('password_reset_completed', ip_address, user.id)
            
            return JsonResponse({
                'success': True,
                'message': 'Password reset successfully'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to reset password'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def faculty_send_invitation(request):
    """Send faculty invitation (admin only)"""
    if request.method == 'POST':
        try:
            # In a real implementation, you would check if the user is an admin
            # For now, we'll just implement the functionality
            
            data = json.loads(request.body)
            email = data.get('email')
            
            if not email:
                return JsonResponse({
                    'success': False,
                    'message': 'Email is required'
                }, status=400)
            
            # Check if faculty already exists
            if User.objects.filter(email=email, role='faculty').exists():  # type: ignore
                return JsonResponse({
                    'success': False,
                    'message': 'Faculty with this email already exists'
                }, status=400)
            
            # Generate invitation token
            invitation_token = generate_invitation_token()
            
            # Send invitation email
            if send_faculty_invitation_email(email, invitation_token):
                log_security_event('faculty_invitation_sent', request.META.get('REMOTE_ADDR', ''), details={
                    'email': email
                })
                return JsonResponse({
                    'success': True,
                    'message': 'Invitation sent successfully'
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Failed to send invitation'
                }, status=500)
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to send invitation'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def faculty_bulk_register(request):
    """Bulk register faculty from CSV (admin only)"""
    if request.method == 'POST':
        try:
            # In a real implementation, you would check if the user is an admin
            # For now, we'll just implement the functionality
            
            # This is a simplified version - in production, you would handle file uploads
            data = json.loads(request.body)
            faculty_data_list = data.get('facultyData', [])
            
            if not faculty_data_list:
                return JsonResponse({
                    'success': False,
                    'message': 'Faculty data is required'
                }, status=400)
            
            successful_registrations = []
            failed_registrations = []
            
            for faculty_data in faculty_data_list:
                try:
                    first_name = faculty_data.get('firstName')
                    last_name = faculty_data.get('lastName')
                    email = faculty_data.get('email')
                    employee_id = faculty_data.get('employeeId')
                    department = faculty_data.get('department')
                    title = faculty_data.get('title')
                    
                    # Validate required fields
                    if not all([first_name, last_name, email, employee_id, department, title]):
                        failed_registrations.append({
                            'email': email or 'unknown',
                            'reason': 'Missing required fields'
                        })
                        continue
                    
                    # Check if user already exists
                    if User.objects.filter(email=email).exists():  # type: ignore
                        failed_registrations.append({
                            'email': email,
                            'reason': 'User with this email already exists'
                        })
                        continue
                    
                    if User.objects.filter(username=employee_id).exists():  # type: ignore
                        failed_registrations.append({
                            'email': email,
                            'reason': 'User with this employee ID already exists'
                        })
                        continue
                    
                    # Generate a random password for initial setup
                    temp_password = ''.join(random.choices(string.ascii_letters + string.digits, k=12))
                    hashed_password = make_password(temp_password)
                    
                    # Create user (status will be inactive until admin approval)
                    user = User.objects.create(  # type: ignore
                        username=employee_id,
                        email=email,
                        first_name=first_name,
                        last_name=last_name,
                        role='faculty',
                        status='inactive',  # Requires admin approval
                        password=hashed_password,
                        mfa_enabled=False
                    )
                    
                    # Create faculty profile
                    faculty = Faculty.objects.create(  # type: ignore
                        user=user,
                        employee_id=employee_id,
                        department=department,
                        title=title
                    )
                    
                    # Create default faculty settings
                    FacultySettings.objects.create(  # type: ignore
                        faculty=faculty
                    )
                    
                    successful_registrations.append({
                        'email': email,
                        'employee_id': employee_id
                    })
                    
                except Exception as e:
                    failed_registrations.append({
                        'email': faculty_data.get('email', 'unknown'),
                        'reason': str(e)
                    })
            
            log_security_event('faculty_bulk_registration', request.META.get('REMOTE_ADDR', ''), details={
                'successful': len(successful_registrations),
                'failed': len(failed_registrations)
            })
            
            return JsonResponse({
                'success': True,
                'message': f'Bulk registration completed. {len(successful_registrations)} successful, {len(failed_registrations)} failed.',
                'successful_registrations': successful_registrations,
                'failed_registrations': failed_registrations
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to process bulk registration'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def enable_mfa(request):
    """Enable Multi-Factor Authentication for faculty"""
    if request.method == 'POST':
        try:
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Generate a new TOTP secret
            secret = pyotp.random_base32()
            
            # Create TOTP object for QR code generation
            totp = pyotp.TOTP(secret)
            issuer = "DigitalCampus Faculty"
            username = faculty_profile.user.username
            
            # Generate provisioning URI for QR code
            provisioning_uri = totp.provisioning_uri(
                name=f"{username}@{issuer}",
                issuer_name=issuer
            )
            
            # Store the secret temporarily (in a real implementation, you would store it in the database)
            if redis_client:
                redis_client.setex(
                    f"mfa_secret_{faculty_profile.user.id}",
                    300,  # 5 minutes expiration
                    secret
                )
            
            return JsonResponse({
                'success': True,
                'message': 'MFA enabled successfully',
                'secret': secret,
                'provisioning_uri': provisioning_uri,
                'qr_code_url': f"https://api.qrserver.com/v1/create-qr-code/?data={provisioning_uri}&size=200x200"
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to enable MFA'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def verify_mfa(request):
    """Verify MFA setup for faculty"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            mfa_code = data.get('mfa_code')
            
            if not mfa_code:
                return JsonResponse({
                    'success': False,
                    'message': 'MFA code is required'
                }, status=400)
            
            # Get faculty from request (attached by middleware)
            faculty_profile = request.faculty
            
            # Get the temporary secret from Redis
            if not redis_client:
                return JsonResponse({
                    'success': False,
                    'message': 'MFA service temporarily unavailable'
                }, status=500)
            
            secret_key = f"mfa_secret_{faculty_profile.user.id}"
            secret = redis_client.get(secret_key)
            
            if not secret:
                return JsonResponse({
                    'success': False,
                    'message': 'MFA setup session expired. Please try again.'
                }, status=400)
            
            # Decode bytes to string if needed
            if isinstance(secret, bytes):
                secret = secret.decode('utf-8')
            
            # Verify the MFA code
            totp = pyotp.TOTP(secret)
            if totp.verify(mfa_code):
                # Save the secret to the faculty profile
                faculty_profile.mfa_secret = secret
                faculty_profile.user.mfa_enabled = True
                faculty_profile.user.save()
                faculty_profile.save()
                
                # Remove the temporary secret
                redis_client.delete(secret_key)
                
                return JsonResponse({
                    'success': True,
                    'message': 'MFA verified and enabled successfully'
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid MFA code. Please try again.'
                }, status=400)
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Failed to verify MFA'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)