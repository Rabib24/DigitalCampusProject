import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';

export interface EnrollmentPeriod {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  student_group: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateEnrollmentPeriodData {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  student_group: string;
  is_active: boolean;
}

export interface UpdateEnrollmentPeriodData {
  name?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  student_group?: string;
  is_active?: boolean;
}

// Admin Enrollment Periods API Service
export class AdminEnrollmentPeriodsService {
  // Get all enrollment periods
  static async getEnrollmentPeriods(): Promise<EnrollmentPeriod[]> {
    try {
      const response = await apiGet('/student/admin/enrollment/periods/list/');
      const data = await response.json();
      return data.enrollment_periods || [];
    } catch (error) {
      console.error('Failed to fetch enrollment periods:', error);
      throw new Error('Failed to fetch enrollment periods');
    }
  }

  // Get a specific enrollment period
  static async getEnrollmentPeriod(id: string): Promise<EnrollmentPeriod> {
    try {
      const response = await apiGet(`/student/admin/enrollment/periods/${id}/`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Failed to fetch enrollment period:', error);
      throw new Error('Failed to fetch enrollment period');
    }
  }

  // Create a new enrollment period
  static async createEnrollmentPeriod(data: CreateEnrollmentPeriodData): Promise<EnrollmentPeriod> {
    try {
      const response = await apiPost('/student/admin/enrollment/periods/', data);
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to create enrollment period');
      }
      return result.data;
    } catch (error) {
      console.error('Failed to create enrollment period:', error);
      throw new Error('Failed to create enrollment period');
    }
  }

  // Update an enrollment period
  static async updateEnrollmentPeriod(id: string, data: UpdateEnrollmentPeriodData): Promise<EnrollmentPeriod> {
    try {
      const response = await apiPut(`/student/admin/enrollment/periods/${id}/`, data);
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to update enrollment period');
      }
      return result.data;
    } catch (error) {
      console.error('Failed to update enrollment period:', error);
      throw new Error('Failed to update enrollment period');
    }
  }

  // Delete an enrollment period
  static async deleteEnrollmentPeriod(id: string): Promise<void> {
    try {
      const response = await apiDelete(`/student/admin/enrollment/periods/${id}/`);
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to delete enrollment period');
      }
    } catch (error) {
      console.error('Failed to delete enrollment period:', error);
      throw new Error('Failed to delete enrollment period');
    }
  }
}