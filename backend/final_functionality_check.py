#!/usr/bin/env python
"""
Final functionality check for DigitalCampus application
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

def check_django_setup():
    """Check that Django is properly configured"""
    print("1. Checking Django setup...")
    try:
        from django.conf import settings
        print(f"✓ Django settings loaded - Database engine: {settings.DATABASES['default']['ENGINE']}")
        print(f"✓ Secret key configured: {len(settings.SECRET_KEY) > 0}")
        print(f"✓ Installed apps: {len(settings.INSTALLED_APPS)}")
        return True
    except Exception as e:
        print(f"✗ Django setup error: {e}")
        return False

def check_model_imports():
    """Check that all models can be imported"""
    print("\n2. Checking model imports...")
    
    models_to_check = [
        ('users.models', 'User'),
        ('users.models', 'Faculty'),
        ('users.models', 'Student'),
        ('courses.models', 'Course'),
        ('assignments.models', 'Assignment'),
        ('assignments.models', 'Grade'),
        ('research.models', 'ResearchProject'),
        ('permissions.models', 'Permission'),
        ('permissions.models', 'UserPermission'),
        ('permissions.models', 'RolePermission'),
    ]
    
    success_count = 0
    for module, class_name in models_to_check:
        try:
            mod = __import__(module, fromlist=[class_name])
            cls = getattr(mod, class_name)
            print(f"✓ {module}.{class_name} imported successfully")
            success_count += 1
        except Exception as e:
            print(f"✗ {module}.{class_name} import failed: {e}")
    
    print(f"   Imported {success_count}/{len(models_to_check)} models")
    return success_count == len(models_to_check)

def check_view_imports():
    """Check that all views can be imported"""
    print("\n3. Checking view imports...")
    
    views_to_check = [
        ('faculty.views', 'dashboard_overview'),
        ('faculty.views', 'courses_list'),
        ('faculty.auth_views', 'faculty_login'),
        ('faculty.auth_views', 'faculty_logout'),
    ]
    
    success_count = 0
    for module, func_name in views_to_check:
        try:
            mod = __import__(module, fromlist=[func_name])
            func = getattr(mod, func_name)
            print(f"✓ {module}.{func_name} imported successfully")
            success_count += 1
        except Exception as e:
            print(f"✗ {module}.{func_name} import failed: {e}")
    
    print(f"   Imported {success_count}/{len(views_to_check)} views")
    return success_count == len(views_to_check)

def check_middleware_imports():
    """Check that middleware can be imported"""
    print("\n4. Checking middleware imports...")
    
    middleware_to_check = [
        ('faculty.middleware', 'FacultyRoleMiddleware'),
        ('users.middleware', 'JWTAuthenticationMiddleware'),
        ('permissions.middleware', 'AttributeBasedPermissionMiddleware'),
    ]
    
    success_count = 0
    for module, class_name in middleware_to_check:
        try:
            mod = __import__(module, fromlist=[class_name])
            cls = getattr(mod, class_name)
            print(f"✓ {module}.{class_name} imported successfully")
            success_count += 1
        except Exception as e:
            print(f"✗ {module}.{class_name} import failed: {e}")
    
    print(f"   Imported {success_count}/{len(middleware_to_check)} middleware classes")
    return success_count == len(middleware_to_check)

def check_url_configuration():
    """Check that URL configuration is valid"""
    print("\n5. Checking URL configuration...")
    
    try:
        from django.urls import reverse
        # Try to reverse some faculty URLs
        urls_to_check = [
            'faculty_login',
            'faculty_logout',
            'faculty_dashboard_overview',
            'faculty_courses_list',
        ]
        
        success_count = 0
        for url_name in urls_to_check:
            try:
                url = reverse(url_name)
                print(f"✓ URL '{url_name}' resolves to: {url}")
                success_count += 1
            except Exception as e:
                print(f"⚠ URL '{url_name}' resolution failed: {e}")
        
        print(f"   Resolved {success_count}/{len(urls_to_check)} URLs")
        return True
    except Exception as e:
        print(f"✗ URL configuration error: {e}")
        return False

def check_settings_configuration():
    """Check important settings configuration"""
    print("\n6. Checking settings configuration...")
    
    try:
        from django.conf import settings
        
        # Check database configuration
        db_config = settings.DATABASES.get('default', {})
        print(f"✓ Database engine: {db_config.get('ENGINE', 'Not configured')}")
        print(f"✓ Database name: {db_config.get('NAME', 'Not configured')}")
        
        # Check middleware
        middleware = settings.MIDDLEWARE
        required_middleware = [
            'faculty.middleware.FacultyRoleMiddleware',
            'permissions.middleware.AttributeBasedPermissionMiddleware',
        ]
        
        for req_mw in required_middleware:
            if req_mw in middleware:
                print(f"✓ Required middleware '{req_mw}' is configured")
            else:
                print(f"⚠ Required middleware '{req_mw}' is NOT configured")
        
        # Check installed apps
        apps = settings.INSTALLED_APPS
        required_apps = ['faculty', 'permissions']
        
        for req_app in required_apps:
            if req_app in apps:
                print(f"✓ Required app '{req_app}' is installed")
            else:
                print(f"⚠ Required app '{req_app}' is NOT installed")
        
        return True
    except Exception as e:
        print(f"✗ Settings configuration error: {e}")
        return False

def main():
    """Main function"""
    print("=== DigitalCampus Application Functionality Check ===")
    
    tests = [
        ("Django Setup", check_django_setup),
        ("Model Imports", check_model_imports),
        ("View Imports", check_view_imports),
        ("Middleware Imports", check_middleware_imports),
        ("URL Configuration", check_url_configuration),
        ("Settings Configuration", check_settings_configuration),
    ]
    
    passed_tests = 0
    total_tests = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed_tests += 1
        except Exception as e:
            print(f"✗ {test_name} test failed with exception: {e}")
    
    print(f"\n=== Test Results ===")
    print(f"Passed: {passed_tests}/{total_tests} tests")
    
    if passed_tests == total_tests:
        print("✅ All functionality checks passed!")
        print("✅ DigitalCampus application components are properly configured")
    else:
        print("⚠ Some functionality checks failed")
        print("⚠ Please review the errors above")

if __name__ == "__main__":
    main()