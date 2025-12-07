import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';

// Faculty Course Enrollment Management API Service

// Get all enrollments for a specific course
export const getCourseEnrollments = async (courseId: string) => {
  try {
    const response = await apiGet(`/faculty/courses/${courseId}/enrollments/`);
    if (!response.ok) {
      throw new Error('Failed to fetch course enrollments');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching enrollments for course ${courseId}:`, error);
    throw error;
  }
};

// Add a student to a course
export const addStudentToCourse = async (courseId: string, studentId: string) => {
  try {
    const response = await apiPost(`/faculty/courses/${courseId}/enroll/`, {
      student_id: studentId
    });
    if (!response.ok) {
      throw new Error('Failed to add student to course');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error adding student ${studentId} to course ${courseId}:`, error);
    throw error;
  }
};

// Remove a student from a course
export const removeStudentFromCourse = async (courseId: string, studentId: string) => {
  try {
    const response = await apiDelete(`/faculty/courses/${courseId}/enrollments/${studentId}/remove/`);
    if (!response.ok) {
      throw new Error('Failed to remove student from course');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error removing student ${studentId} from course ${courseId}:`, error);
    throw error;
  }
};

// Bulk enroll students in a course
export const bulkEnrollStudents = async (courseId: string, studentIds: string[]) => {
  try {
    const response = await apiPost(`/faculty/courses/${courseId}/bulk-enroll/`, {
      student_ids: studentIds
    });
    if (!response.ok) {
      throw new Error('Failed to bulk enroll students');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error bulk enrolling students in course ${courseId}:`, error);
    throw error;
  }
};

// Manage course enrollment (add, remove, update status)
export const manageCourseEnrollment = async (
  courseId: string, 
  action: 'add' | 'remove' | 'update_status', 
  studentId: string, 
  status?: string
) => {
  try {
    const requestData: any = {
      action,
      student_id: studentId
    };
    
    if (status) {
      requestData.status = status;
    }
    
    const response = await apiPost(`/faculty/courses/${courseId}/enrollment/`, requestData);
    if (!response.ok) {
      throw new Error('Failed to manage course enrollment');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error managing enrollment for student ${studentId} in course ${courseId}:`, error);
    throw error;
  }
};