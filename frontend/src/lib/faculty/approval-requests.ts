/**
 * Faculty Approval Requests API Service
 * Provides functions for faculty members to manage approval requests
 */

import { apiGet, apiPost } from '@/lib/api';

// Types
export interface FacultyApprovalRequest {
  id: string;
  student_id: string;
  student_name: string;
  course_id: string;
  course_code: string;
  course_name: string;
  faculty_id: string;
  faculty_name: string;
  approval_type: string;
  reason: string;
  supporting_documents?: string[];
  status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  submitted_at: string;
  reviewed_at?: string;
  reviewer_notes?: string;
  approval_conditions?: string;
}

export interface SubmitApprovalRequestData {
  student_id: string;
  course_id: string;
  faculty_id: string;
  approval_type: string;
  reason: string;
  supporting_documents?: string[];
}

export interface ProcessApprovalData {
  action: 'approve' | 'reject' | 'request_revision';
  notes?: string;
  conditions?: string;
}

// Custom error class for approval request errors
export class FacultyApprovalError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'FacultyApprovalError';
  }
}

// Helper function to handle API errors
async function handleApiError(response: Response, operation: string): Promise<never> {
  let errorMessage = `Failed to ${operation}`;
  
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorMessage;
  } catch {
    // If we can't parse the error response, use the default message
  }
  
  throw new FacultyApprovalError(errorMessage, undefined, undefined, response.status);
}

// Faculty Approval Requests API Service
export class FacultyApprovalService {
  /**
   * Get all pending approval requests for the authenticated faculty member
   */
  static async getPendingApprovalRequests(): Promise<FacultyApprovalRequest[]> {
    try {
      const response = await apiGet('/faculty/approval-requests/pending/');
      if (!response.ok) {
        await handleApiError(response, 'fetch pending approval requests');
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      if (error instanceof FacultyApprovalError) {
        throw error;
      }
      console.error('Failed to fetch pending approval requests:', error);
      throw new FacultyApprovalError('Failed to fetch pending approval requests');
    }
  }

  /**
   * Get all approval requests (pending and processed) for the authenticated faculty member
   */
  static async getAllApprovalRequests(): Promise<FacultyApprovalRequest[]> {
    try {
      const response = await apiGet('/faculty/approval-requests/');
      if (!response.ok) {
        await handleApiError(response, 'fetch all approval requests');
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      if (error instanceof FacultyApprovalError) {
        throw error;
      }
      console.error('Failed to fetch all approval requests:', error);
      throw new FacultyApprovalError('Failed to fetch all approval requests');
    }
  }

  /**
   * Get detailed information for a specific approval request
   */
  static async getApprovalRequestDetail(requestId: string): Promise<FacultyApprovalRequest> {
    try {
      const response = await apiGet(`/faculty/approval-requests/${requestId}/`);
      if (!response.ok) {
        await handleApiError(response, 'fetch approval request details');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      if (error instanceof FacultyApprovalError) {
        throw error;
      }
      console.error('Failed to fetch approval request details:', error);
      throw new FacultyApprovalError('Failed to fetch approval request details');
    }
  }

  /**
   * Submit a new approval request
   */
  static async submitApprovalRequest(data: SubmitApprovalRequestData): Promise<FacultyApprovalRequest> {
    try {
      const response = await apiPost('/faculty/approval-requests/submit/', data);
      if (!response.ok) {
        await handleApiError(response, 'submit approval request');
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      if (error instanceof FacultyApprovalError) {
        throw error;
      }
      console.error('Failed to submit approval request:', error);
      throw new FacultyApprovalError('Failed to submit approval request');
    }
  }

  /**
   * Process an approval request (approve/reject/request revision)
   */
  static async processApprovalRequest(
    requestId: string,
    data: ProcessApprovalData
  ): Promise<FacultyApprovalRequest> {
    try {
      const response = await apiPost(`/faculty/approval-requests/${requestId}/process/`, data);
      if (!response.ok) {
        await handleApiError(response, 'process approval request');
      }
      const result = await response.json();
      return result.data;
    } catch (error) {
      if (error instanceof FacultyApprovalError) {
        throw error;
      }
      console.error('Failed to process approval request:', error);
      throw new FacultyApprovalError('Failed to process approval request');
    }
  }
}