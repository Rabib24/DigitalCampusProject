import { apiGet } from '@/lib/api';

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
  is_current?: boolean;
}

// Student Enrollment Periods API Service
export class StudentEnrollmentPeriodsService {
  // Get current enrollment period
  static async getCurrentEnrollmentPeriod(): Promise<EnrollmentPeriod | null> {
    try {
      const response = await apiGet('/student/admin/enrollment/periods/list/');
      const data = await response.json();
      
      if (data.enrollment_periods && Array.isArray(data.enrollment_periods)) {
        // Find the current active enrollment period
        const currentPeriod = data.enrollment_periods.find((period: EnrollmentPeriod) => 
          period.is_active && 
          new Date(period.start_date) <= new Date() && 
          new Date(period.end_date) >= new Date()
        );
        
        return currentPeriod || null;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to fetch current enrollment period:', error);
      return null;
    }
  }

  // Get all active enrollment periods
  static async getActiveEnrollmentPeriods(): Promise<EnrollmentPeriod[]> {
    try {
      const response = await apiGet('/student/admin/enrollment/periods/list/');
      const data = await response.json();
      
      if (data.enrollment_periods && Array.isArray(data.enrollment_periods)) {
        // Filter for active periods
        return data.enrollment_periods.filter((period: EnrollmentPeriod) => period.is_active);
      }
      
      return [];
    } catch (error) {
      console.error('Failed to fetch active enrollment periods:', error);
      return [];
    }
  }

  // Check if enrollment is currently open
  static async isEnrollmentOpen(): Promise<boolean> {
    try {
      const currentPeriod = await this.getCurrentEnrollmentPeriod();
      return currentPeriod !== null;
    } catch (error) {
      console.error('Failed to check if enrollment is open:', error);
      return false;
    }
  }
}