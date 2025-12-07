import { apiGet, apiPost } from '@/lib/api';

export interface SpecialEnrollmentRequest {
  id: string;
  student_id: string;
  student_name: string;
  course_id: string;
  course_code: string;
  course_name: string;
  request_type: string;
  reason: string;
  status: string;
  requested_at: string;
  processed_at: string | null;
  processed_by: string;
  admin_notes: string;
}

export interface CreateSpecialEnrollmentData {
  student_id: string;
  course_id: string;
  request_type: string;
  reason: string;
}

// Admin Special Enrollment Override API Service
export class AdminSpecialEnrollmentService {
  // Get all special enrollment requests
  static async getSpecialEnrollmentRequests(): Promise<SpecialEnrollmentRequest[]> {
    try {
      const response = await apiGet('/admin-dashboard/enrollment/overrides/');
      const data = await response.json();
      return data.special_requests || [];
    } catch (error) {
      console.error('Failed to fetch special enrollment requests:', error);
      throw new Error('Failed to fetch special enrollment requests');
    }
  }

  // Create a new special enrollment request
  static async createSpecialEnrollmentRequest(data: CreateSpecialEnrollmentData): Promise<any> {
    try {
      const response = await apiPost('/admin-dashboard/enrollment/overrides/create/', data);
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to create special enrollment request');
      }
      return result;
    } catch (error) {
      console.error('Failed to create special enrollment request:', error);
      throw new Error('Failed to create special enrollment request');
    }
  }

  // Process a special enrollment request (approve/reject)
  static async processSpecialEnrollmentRequest(requestId: string, action: 'approve' | 'reject', reason?: string): Promise<any> {
    try {
      const data = {
        action,
        reason: reason || ''
      };
      
      const response = await apiPost(`/admin-dashboard/enrollment/overrides/${requestId}/`, data);
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || `Failed to ${action} special enrollment request`);
      }
      return result;
    } catch (error) {
      console.error(`Failed to ${action} special enrollment request:`, error);
      throw new Error(`Failed to ${action} special enrollment request`);
    }
  }
}