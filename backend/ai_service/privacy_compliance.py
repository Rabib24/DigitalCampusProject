#!/usr/bin/env python3
"""
Privacy Compliance Module for Digital Campus AI Services

This module implements data privacy compliance measures for FERPA and GDPR compliance.
"""

import hashlib
import logging
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional

# Set up logging
logger = logging.getLogger(__name__)

class PrivacyComplianceManager:
    """
    Manages privacy compliance for AI services in accordance with FERPA and GDPR.
    """
    
    def __init__(self):
        """
        Initialize the Privacy Compliance Manager.
        """
        self.compliance_policies = {
            'FERPA': {
                'description': 'Family Educational Rights and Privacy Act',
                'principles': [
                    'Protect student education records',
                    'Ensure parental/stUDENT consent for data disclosure',
                    'Provide access to educational records',
                    'Allow amendment of inaccurate records'
                ],
                'data_categories': ['student_records', 'grades', 'enrollments', 'disciplinary_records']
            },
            'GDPR': {
                'description': 'General Data Protection Regulation',
                'principles': [
                    'Lawfulness, fairness and transparency',
                    'Purpose limitation',
                    'Data minimization',
                    'Accuracy',
                    'Storage limitation',
                    'Integrity and confidentiality',
                    'Accountability'
                ],
                'data_categories': ['personal_data', 'special_category_data', 'biometric_data']
            }
        }
        
        # Data retention periods (in days)
        self.retention_periods = {
            'training_data': 365 * 3,  # 3 years
            'audit_logs': 365,         # 1 year
            'temporary_data': 30       # 30 days
        }
        
        logger.info("Privacy Compliance Manager initialized")
    
    def anonymize_data(self, data: Dict[str, Any], pii_fields: List[str]) -> Dict[str, Any]:
        """
        Anonymize personally identifiable information in the data.
        
        Args:
            data: Dictionary containing data records
            pii_fields: List of field names that contain PII
            
        Returns:
            Dictionary with PII anonymized
        """
        anonymized_data = data.copy()
        
        for field in pii_fields:
            if field in anonymized_data and anonymized_data[field]:
                # Hash the PII data to anonymize it
                anonymized_data[field] = self._hash_value(str(anonymized_data[field]))
                
        return anonymized_data
    
    def pseudonymize_data(self, data: Dict[str, Any], pii_fields: List[str]) -> Dict[str, Any]:
        """
        Pseudonymize personally identifiable information in the data.
        This replaces PII with artificial identifiers that can be reversed with a key.
        
        Args:
            data: Dictionary containing data records
            pii_fields: List of field names that contain PII
            
        Returns:
            Dictionary with PII pseudonymized
        """
        pseudonymized_data = data.copy()
        
        for field in pii_fields:
            if field in pseudonymized_data and pseudonymized_data[field]:
                # Create a pseudonym that can be reversed with a key
                pseudonymized_data[field] = self._create_pseudonym(str(pseudonymized_data[field]))
                
        return pseudonymized_data
    
    def _hash_value(self, value: str) -> str:
        """
        Hash a value for anonymization.
        
        Args:
            value: String value to hash
            
        Returns:
            Hashed value
        """
        return hashlib.sha256(value.encode()).hexdigest()[:32]
    
    def _create_pseudonym(self, value: str) -> str:
        """
        Create a pseudonym for a value.
        
        Args:
            value: String value to pseudonymize
            
        Returns:
            Pseudonymized value
        """
        # In a real implementation, this would use a reversible encryption scheme
        # For now, we'll use a deterministic hash with a prefix
        hashed = hashlib.sha256(value.encode()).hexdigest()[:16]
        return f"PSEUDO_{hashed}"
    
    def apply_data_minimization(self, data: Dict[str, Any], required_fields: List[str]) -> Dict[str, Any]:
        """
        Apply data minimization principle by keeping only required fields.
        
        Args:
            data: Dictionary containing data records
            required_fields: List of fields that are necessary for processing
            
        Returns:
            Dictionary with only required fields
        """
        minimized_data = {}
        
        for field in required_fields:
            if field in data:
                minimized_data[field] = data[field]
                
        return minimized_data
    
    def check_consent(self, user_id: str, purpose: str) -> bool:
        """
        Check if user has given consent for a specific data processing purpose.
        
        Args:
            user_id: Identifier for the user
            purpose: Purpose of data processing
            
        Returns:
            Boolean indicating if consent is given
        """
        # In a real implementation, this would check a consent management system
        # For now, we'll assume consent is given for demonstration purposes
        logger.info(f"Checking consent for user {user_id} for purpose: {purpose}")
        return True
    
    def enforce_storage_limitation(self, data_timestamp: datetime, data_type: str) -> bool:
        """
        Check if data should be retained based on storage limitation principles.
        
        Args:
            data_timestamp: Timestamp when data was created
            data_type: Type of data
            
        Returns:
            Boolean indicating if data should be retained
        """
        if data_type in self.retention_periods:
            retention_period = self.retention_periods[data_type]
            expiry_date = data_timestamp + timedelta(days=retention_period)
            return datetime.now() < expiry_date
        
        # If data type is not specified, retain for 1 year by default
        expiry_date = data_timestamp + timedelta(days=365)
        return datetime.now() < expiry_date
    
    def log_data_access(self, user_id: str, data_type: str, purpose: str):
        """
        Log data access for accountability purposes.
        
        Args:
            user_id: Identifier for the user accessing data
            data_type: Type of data being accessed
            purpose: Purpose of data access
        """
        logger.info(f"Data access logged - User: {user_id}, Data: {data_type}, Purpose: {purpose}")
    
    def get_privacy_notice(self) -> Dict[str, Any]:
        """
        Get the privacy notice for AI services.
        
        Returns:
            Dictionary containing privacy notice information
        """
        return {
            'data_controller': 'Digital Campus Institution',
            'contact_email': 'privacy@digitalcampus.edu',
            'data_purposes': [
                'Academic performance analysis',
                'Course recommendations',
                'Learning pattern identification'
            ],
            'data_retention': 'Training data retained for 3 years',
            'user_rights': [
                'Right to access personal data',
                'Right to rectification',
                'Right to erasure',
                'Right to data portability',
                'Right to object'
            ],
            'last_updated': datetime.now().isoformat()
        }

# Global instance of PrivacyComplianceManager
privacy_manager = PrivacyComplianceManager()

def ensure_ferpa_compliance(data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
    """
    Ensure FERPA compliance for educational data.
    
    Args:
        data: Dictionary containing educational data
        user_id: Identifier for the student
        
    Returns:
        FERPA-compliant data
    """
    # Check consent for educational data processing
    if not privacy_manager.check_consent(user_id, 'educational_analysis'):
        raise PermissionError("Consent not given for educational data processing")
    
    # Apply data minimization
    required_fields = ['student_id', 'course_id', 'grade_points', 'credits']
    minimized_data = privacy_manager.apply_data_minimization(data, required_fields)
    
    # Anonymize non-essential PII
    pii_fields = []  # In educational context, student_id might be needed for linking
    anonymized_data = privacy_manager.anonymize_data(minimized_data, pii_fields)
    
    # Log the data access
    privacy_manager.log_data_access(user_id, 'educational_data', 'academic_analysis')
    
    return anonymized_data

def ensure_gdpr_compliance(data: Dict[str, Any], user_id: str) -> Dict[str, Any]:
    """
    Ensure GDPR compliance for personal data.
    
    Args:
        data: Dictionary containing personal data
        user_id: Identifier for the data subject
        
    Returns:
        GDPR-compliant data
    """
    # Check consent for personal data processing
    if not privacy_manager.check_consent(user_id, 'personal_analysis'):
        raise PermissionError("Consent not given for personal data processing")
    
    # Apply data minimization
    required_fields = ['user_id', 'preferences', 'interaction_history']
    minimized_data = privacy_manager.apply_data_minimization(data, required_fields)
    
    # Pseudonymize personal identifiers
    pii_fields = ['user_id']
    pseudonymized_data = privacy_manager.pseudonymize_data(minimized_data, pii_fields)
    
    # Log the data access
    privacy_manager.log_data_access(user_id, 'personal_data', 'preference_analysis')
    
    return pseudonymized_data

if __name__ == "__main__":
    # Example usage
    sample_data = {
        'student_id': 'STU12345',
        'student_name': 'John Doe',
        'email': 'john.doe@university.edu',
        'course_id': 'CS101',
        'grade': 'A',
        'grade_points': 4.0,
        'credits': 3,
        'enrollment_date': '2023-09-01'
    }
    
    print("Original data:", sample_data)
    
    # Apply FERPA compliance
    try:
        ferpa_compliant_data = ensure_ferpa_compliance(sample_data, 'STU12345')
        print("FERPA compliant data:", ferpa_compliant_data)
    except PermissionError as e:
        print("FERPA compliance error:", e)
    
    # Apply GDPR compliance
    try:
        gdpr_compliant_data = ensure_gdpr_compliance(sample_data, 'STU12345')
        print("GDPR compliant data:", gdpr_compliant_data)
    except PermissionError as e:
        print("GDPR compliance error:", e)
    
    # Get privacy notice
    privacy_notice = privacy_manager.get_privacy_notice()
    print("Privacy notice:", privacy_notice)