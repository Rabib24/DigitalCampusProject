import { apiGet } from '@/lib/api';

export interface EnrollmentReportSummary {
  total_courses: number;
  total_active_enrollments: number;
  total_waitlisted: number;
  total_dropped: number;
  total_completed: number;
  enrollment_by_status: Array<{
    status: string;
    count: number;
  }>;
  top_courses: Array<{
    course_id: string;
    course_code: string;
    course_name: string;
    department: string;
    enrollment_count: number;
  }>;
}

export interface EnrollmentReportByDepartment {
  report_type: 'by_department';
  filter_department: string | null;
  departments: Array<{
    department: string;
    course_count: number;
    total_enrollments: number;
  }>;
}

export interface EnrollmentReportBySemester {
  report_type: 'by_semester';
  semesters: Array<{
    semester: string;
    enrollment_count: number;
  }>;
}

export interface EnrollmentReportWaitlist {
  report_type: 'waitlist';
  waitlist_data: Array<{
    course_id: string;
    course_code: string;
    course_name: string;
    waitlist_count: number;
  }>;
}

export interface EnrollmentReportCourseDetail {
  report_type: 'course_detail';
  course: {
    id: string;
    code: string;
    name: string;
    department: string;
    instructor_id: string;
    enrollment_limit: number;
    current_enrollment: number;
    available_seats: number;
    waitlisted_count: number;
  };
  enrollment_stats: {
    active: number;
    waitlisted: number;
    dropped: number;
    completed: number;
  };
  students: Array<{
    student_id: string;
    student_name: string;
    enrollment_date: string;
    grade: string;
  }>;
}

// Admin Enrollment Reporting API Service
export class AdminEnrollmentReportingService {
  // Get enrollment summary report
  static async getEnrollmentSummaryReport(department?: string): Promise<EnrollmentReportSummary> {
    try {
      let url = '/admin-dashboard/enrollment/reports/?type=summary';
      if (department) {
        url += `&department=${encodeURIComponent(department)}`;
      }
      
      const response = await apiGet(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch enrollment summary report:', error);
      throw new Error('Failed to fetch enrollment summary report');
    }
  }

  // Get enrollment by department report
  static async getEnrollmentByDepartmentReport(department?: string): Promise<EnrollmentReportByDepartment> {
    try {
      let url = '/admin-dashboard/enrollment/reports/?type=by_department';
      if (department) {
        url += `&department=${encodeURIComponent(department)}`;
      }
      
      const response = await apiGet(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch enrollment by department report:', error);
      throw new Error('Failed to fetch enrollment by department report');
    }
  }

  // Get enrollment by semester report
  static async getEnrollmentBySemesterReport(): Promise<EnrollmentReportBySemester> {
    try {
      const response = await apiGet('/admin-dashboard/enrollment/reports/?type=by_semester');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch enrollment by semester report:', error);
      throw new Error('Failed to fetch enrollment by semester report');
    }
  }

  // Get waitlist report
  static async getWaitlistReport(): Promise<EnrollmentReportWaitlist> {
    try {
      const response = await apiGet('/admin-dashboard/enrollment/reports/?type=waitlist');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch waitlist report:', error);
      throw new Error('Failed to fetch waitlist report');
    }
  }

  // Get detailed course report
  static async getCourseDetailReport(courseId: string): Promise<EnrollmentReportCourseDetail> {
    try {
      const response = await apiGet(`/admin-dashboard/enrollment/reports/?type=course_detail&course_id=${encodeURIComponent(courseId)}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch course detail report:', error);
      throw new Error('Failed to fetch course detail report');
    }
  }
}