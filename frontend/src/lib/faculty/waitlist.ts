import { apiGet, apiPost } from '@/lib/api';

// Faculty Course Waitlist Management API Service

// Get all waitlisted students for a specific course
export const getCourseWaitlist = async (courseId: string) => {
  try {
    const response = await apiGet(`/faculty/courses/${courseId}/waitlist/`);
    if (!response.ok) {
      throw new Error('Failed to fetch course waitlist');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching waitlist for course ${courseId}:`, error);
    throw error;
  }
};

// Manage course waitlist (approve or reject waitlisted students)
export const manageWaitlist = async (
  courseId: string, 
  action: 'approve' | 'reject', 
  studentIds: string[]
) => {
  try {
    const response = await apiPost(`/faculty/courses/${courseId}/waitlist/manage/`, {
      action,
      student_ids: studentIds
    });
    if (!response.ok) {
      throw new Error('Failed to manage waitlist');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error managing waitlist for course ${courseId}:`, error);
    throw error;
  }
};