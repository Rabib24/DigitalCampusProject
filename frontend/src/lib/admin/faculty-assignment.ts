import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';

export interface Faculty {
  employee_id: string;
  first_name: string;
  last_name: string;
  department: string;
  title: string;
  email: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  instructor_id: string;
  enrollment_limit: number;
  start_date: string;
  end_date: string;
}

export interface CourseWithFaculty {
  course_id: string;
  course_code: string;
  course_name: string;
  assigned_faculty: {
    faculty_id: string;
    faculty_name: string;
    department: string;
    title: string;
  } | null;
}

export interface AssignFacultyData {
  course_id: string;
  faculty_id: string;
}

// Admin Faculty Assignment API Service
export class AdminFacultyAssignmentService {
  // Get all faculty members
  static async getAllFaculty(): Promise<Faculty[]> {
    try {
      // This would typically be a separate endpoint, but for now we'll mock it
      // In a real implementation, this would call an actual API endpoint
      return [];
    } catch (error) {
      console.error('Failed to fetch faculty:', error);
      throw new Error('Failed to fetch faculty');
    }
  }

  // Get all courses
  static async getAllCourses(): Promise<Course[]> {
    try {
      // This would typically be a separate endpoint, but for now we'll mock it
      // In a real implementation, this would call an actual API endpoint
      return [];
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      throw new Error('Failed to fetch courses');
    }
  }

  // Get faculty assigned to a specific course
  static async getCourseFaculty(courseId: string): Promise<CourseWithFaculty> {
    try {
      const response = await apiGet(`/admin-dashboard/courses/${courseId}/faculty/`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Failed to fetch course faculty:', error);
      throw new Error('Failed to fetch course faculty');
    }
  }

  // Assign faculty to a course
  static async assignFacultyToCourse(data: AssignFacultyData): Promise<any> {
    try {
      const response = await apiPost(`/admin-dashboard/enrollment/faculty-assignment/`, data);
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to assign faculty to course');
      }
      return result;
    } catch (error) {
      console.error('Failed to assign faculty to course:', error);
      throw new Error('Failed to assign faculty to course');
    }
  }

  // Update faculty assignment for a course
  static async updateCourseFaculty(courseId: string, facultyId: string): Promise<any> {
    try {
      const response = await apiPut(`/admin-dashboard/courses/${courseId}/faculty/update/`, { faculty_id: facultyId });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to update course faculty');
      }
      return result;
    } catch (error) {
      console.error('Failed to update course faculty:', error);
      throw new Error('Failed to update course faculty');
    }
  }

  // Remove faculty assignment from a course
  static async removeFacultyFromCourse(courseId: string): Promise<any> {
    try {
      const response = await apiDelete(`/admin-dashboard/courses/${courseId}/faculty/remove/`);
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to remove faculty from course');
      }
      return result;
    } catch (error) {
      console.error('Failed to remove faculty from course:', error);
      throw new Error('Failed to remove faculty from course');
    }
  }
}