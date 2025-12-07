import { apiGet } from '@/lib/api';

// Faculty Course Roster API Service

// Get class roster for a specific course
export const getCourseRoster = async (courseId: string) => {
  try {
    const response = await apiGet(`/faculty/courses/${courseId}/roster/`);
    if (!response.ok) {
      throw new Error('Failed to fetch course roster');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching roster for course ${courseId}:`, error);
    throw error;
  }
};