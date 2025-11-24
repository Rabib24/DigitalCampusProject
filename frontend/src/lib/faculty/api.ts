import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';

// Faculty Dashboard API Service

// Dashboard Overview
export const getFacultyDashboardOverview = async () => {
  try {
    console.log("Making request to /faculty/dashboard/overview/");
    const response = await apiGet('/faculty/dashboard/overview/');
    console.log("Received response from /faculty/dashboard/overview/:", response.status, response.statusText);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("Error data from /faculty/dashboard/overview/:", errorData);
      
      // Handle specific error cases
      if (response.status === 403) {
        throw new Error("Insufficient permissions to access dashboard overview");
      }
      
      const errorMessage = errorData.message || `Failed to fetch dashboard overview: ${response.status} ${response.statusText}`;
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log("Parsed JSON data from /faculty/dashboard/overview/:", data);
    return data;
  } catch (error) {
    console.error('Error fetching faculty dashboard overview:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: Unable to connect to the server. Please check your connection and try again.');
    }
    throw error;
  }
};

// Courses
export const getFacultyCourses = async () => {
  try {
    const response = await apiGet('/faculty/courses/');
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching faculty courses:', error);
    throw error;
  }
};

export const getFacultyCourseDetail = async (courseId: number) => {
  try {
    const response = await apiGet(`/faculty/courses/${courseId}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch course details');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching course ${courseId} details:`, error);
    throw error;
  }
};

export const createFacultyCourse = async (courseData: Record<string, unknown>) => {
  try {
    const response = await apiPost('/faculty/courses/', courseData);
    if (!response.ok) {
      throw new Error('Failed to create course');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const updateFacultyCourse = async (courseId: number, courseData: Record<string, unknown>) => {
  try {
    const response = await apiPut(`/faculty/courses/${courseId}/`, courseData);
    if (!response.ok) {
      throw new Error('Failed to update course');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating course ${courseId}:`, error);
    throw error;
  }
};

export const deleteFacultyCourse = async (courseId: number) => {
  try {
    const response = await apiDelete(`/faculty/courses/${courseId}/`);
    if (!response.ok) {
      throw new Error('Failed to delete course');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error deleting course ${courseId}:`, error);
    throw error;
  }
};

// Assignments
export const getFacultyAssignments = async () => {
  try {
    const response = await apiGet('/faculty/assignments/');
    if (!response.ok) {
      throw new Error('Failed to fetch assignments');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching faculty assignments:', error);
    throw error;
  }
};

export const getFacultyAssignmentDetail = async (assignmentId: number) => {
  try {
    const response = await apiGet(`/faculty/assignments/${assignmentId}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch assignment details');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching assignment ${assignmentId} details:`, error);
    throw error;
  }
};

export const createFacultyAssignment = async (assignmentData: Record<string, unknown>) => {
  try {
    const response = await apiPost('/faculty/assignments/', assignmentData);
    if (!response.ok) {
      throw new Error('Failed to create assignment');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating assignment:', error);
    throw error;
  }
};

export const updateFacultyAssignment = async (assignmentId: number, assignmentData: Record<string, unknown>) => {
  try {
    const response = await apiPut(`/faculty/assignments/${assignmentId}/`, assignmentData);
    if (!response.ok) {
      throw new Error('Failed to update assignment');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating assignment ${assignmentId}:`, error);
    throw error;
  }
};

export const deleteFacultyAssignment = async (assignmentId: number) => {
  try {
    const response = await apiDelete(`/faculty/assignments/${assignmentId}/`);
    if (!response.ok) {
      throw new Error('Failed to delete assignment');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error deleting assignment ${assignmentId}:`, error);
    throw error;
  }
};

// Gradebook
export const getFacultyGradebook = async (courseId: number) => {
  try {
    const response = await apiGet(`/faculty/courses/${courseId}/gradebook/`);
    if (!response.ok) {
      throw new Error('Failed to fetch gradebook');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching gradebook for course ${courseId}:`, error);
    throw error;
  }
};

export const updateStudentGrade = async (gradeId: number, gradeData: Record<string, unknown>) => {
  try {
    const response = await apiPut(`/faculty/grades/${gradeId}/`, gradeData);
    if (!response.ok) {
      throw new Error('Failed to update grade');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating grade ${gradeId}:`, error);
    throw error;
  }
};

// Advising
export const getFacultyAdvisees = async () => {
  try {
    const response = await apiGet('/faculty/advising/advisees/');
    if (!response.ok) {
      throw new Error('Failed to fetch advisees');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching faculty advisees:', error);
    throw error;
  }
};

export const getFacultyAdviseeDetail = async (studentId: number) => {
  try {
    const response = await apiGet(`/faculty/advising/advisees/${studentId}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch advisee details');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching advisee ${studentId} details:`, error);
    throw error;
  }
};

// Research
export const getFacultyResearchProjects = async () => {
  try {
    const response = await apiGet('/faculty/research/projects/');
    if (!response.ok) {
      throw new Error('Failed to fetch research projects');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching faculty research projects:', error);
    throw error;
  }
};

export const getFacultyResearchProjectDetail = async (projectId: string) => {
  try {
    const response = await apiGet(`/faculty/research/projects/${projectId}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch research project details');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching research project ${projectId} details:`, error);
    throw error;
  }
};

export const createFacultyResearchProject = async (projectData: Record<string, unknown>) => {
  try {
    const response = await apiPost('/faculty/research/projects/create/', projectData);
    if (!response.ok) {
      throw new Error('Failed to create research project');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating research project:', error);
    throw error;
  }
};

export const updateFacultyResearchProject = async (projectId: string, projectData: Record<string, unknown>) => {
  try {
    const response = await apiPut(`/faculty/research/projects/${projectId}/update/`, projectData);
    if (!response.ok) {
      throw new Error('Failed to update research project');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating research project ${projectId}:`, error);
    throw error;
  }
};

export const deleteFacultyResearchProject = async (projectId: string) => {
  try {
    const response = await apiDelete(`/faculty/research/projects/${projectId}/delete/`);
    if (!response.ok) {
      throw new Error('Failed to delete research project');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error deleting research project ${projectId}:`, error);
    throw error;
  }
};

export const addPublicationToResearchProject = async (projectId: string, publicationData: Record<string, unknown>) => {
  try {
    const response = await apiPost(`/faculty/research/projects/${projectId}/publications/add/`, publicationData);
    if (!response.ok) {
      throw new Error('Failed to add publication to research project');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error adding publication to research project ${projectId}:`, error);
    throw error;
  }
};

export const addMilestoneToResearchProject = async (projectId: string, milestoneData: Record<string, unknown>) => {
  try {
    const response = await apiPost(`/faculty/research/projects/${projectId}/milestones/add/`, milestoneData);
    if (!response.ok) {
      throw new Error('Failed to add milestone to research project');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error adding milestone to research project ${projectId}:`, error);
    throw error;
  }
};

export const getResearchProjectMilestones = async (projectId: string) => {
  try {
    // This would be implemented when we have a proper backend endpoint
    // For now, we'll return mock data
    return {
      success: true,
      milestones: [] as Record<string, unknown>[]
    };
  } catch (error) {
    console.error(`Error fetching milestones for project ${projectId}:`, error);
    throw error;
  }
};

export const updateResearchProjectMilestone = async (projectId: string, milestoneId: string, milestoneData: Record<string, unknown>) => {
  try {
    // This would be implemented when we have a proper backend endpoint
    // For now, we'll just return mock data
    return {
      success: true,
      message: 'Milestone updated successfully'
    };
  } catch (error) {
    console.error(`Error updating milestone ${milestoneId} for project ${projectId}:`, error);
    throw error;
  }
};

export const deleteResearchProjectMilestone = async (projectId: string, milestoneId: string) => {
  try {
    // This would be implemented when we have a proper backend endpoint
    // For now, we'll just return mock data
    return {
      success: true,
      message: 'Milestone deleted successfully'
    };
  } catch (error) {
    console.error(`Error deleting milestone ${milestoneId} for project ${projectId}:`, error);
    throw error;
  }
};

// Grant Applications
export const getFacultyGrantApplications = async () => {
  try {
    const response = await apiGet('/faculty/grants/list/');
    if (!response.ok) {
      throw new Error('Failed to fetch grant applications');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching faculty grant applications:', error);
    throw error;
  }
};

export const getFacultyGrantApplicationDetail = async (grantId: string) => {
  try {
    const response = await apiGet(`/faculty/grants/${grantId}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch grant application details');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching grant application ${grantId} details:`, error);
    throw error;
  }
};

export const createFacultyGrantApplication = async (grantData: Record<string, unknown>) => {
  try {
    const response = await apiPost('/faculty/grants/create/', grantData);
    if (!response.ok) {
      throw new Error('Failed to create grant application');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating grant application:', error);
    throw error;
  }
};

export const updateFacultyGrantApplication = async (grantId: string, grantData: Record<string, unknown>) => {
  try {
    const response = await apiPut(`/faculty/grants/${grantId}/update/`, grantData);
    if (!response.ok) {
      throw new Error('Failed to update grant application');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating grant application ${grantId}:`, error);
    throw error;
  }
};

export const deleteFacultyGrantApplication = async (grantId: string) => {
  try {
    const response = await apiDelete(`/faculty/grants/${grantId}/delete/`);
    if (!response.ok) {
      throw new Error('Failed to delete grant application');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error deleting grant application ${grantId}:`, error);
    throw error;
  }
};

export const uploadGrantDocument = async (grantId: string, documentData: Record<string, unknown>) => {
  try {
    const response = await apiPost(`/faculty/grants/${grantId}/documents/upload/`, documentData);
    if (!response.ok) {
      throw new Error('Failed to upload grant document');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error uploading document for grant ${grantId}:`, error);
    throw error;
  }
};

export const getGrantTracking = async (grantId: string) => {
  try {
    const response = await apiGet(`/faculty/grants/${grantId}/tracking/`);
    if (!response.ok) {
      throw new Error('Failed to fetch grant tracking information');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching tracking information for grant ${grantId}:`, error);
    throw error;
  }
};

// Analytics
export const getFacultyAnalytics = async () => {
  try {
    const response = await apiGet('/faculty/analytics/');
    if (!response.ok) {
      throw new Error('Failed to fetch analytics');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching faculty analytics:', error);
    throw error;
  }
};

// Recordings
export const getFacultyRecordings = async () => {
  try {
    const response = await apiGet('/faculty/recordings/');
    if (!response.ok) {
      throw new Error('Failed to fetch recordings');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching faculty recordings:', error);
    throw error;
  }
};

export const getFacultyRecordingDetail = async (recordingId: string) => {
  try {
    const response = await apiGet(`/faculty/recordings/${recordingId}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch recording details');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching recording ${recordingId} details:`, error);
    throw error;
  }
};

export const createFacultyRecording = async (recordingData: Record<string, unknown>) => {
  try {
    const response = await apiPost('/faculty/recordings/create/', recordingData);
    if (!response.ok) {
      throw new Error('Failed to create recording');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating recording:', error);
    throw error;
  }
};

export const updateFacultyRecording = async (recordingId: string, recordingData: Record<string, unknown>) => {
  try {
    const response = await apiPut(`/faculty/recordings/${recordingId}/update/`, recordingData);
    if (!response.ok) {
      throw new Error('Failed to update recording');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating recording ${recordingId}:`, error);
    throw error;
  }
};

export const deleteFacultyRecording = async (recordingId: string) => {
  try {
    const response = await apiDelete(`/faculty/recordings/${recordingId}/delete/`);
    if (!response.ok) {
      throw new Error('Failed to delete recording');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error deleting recording ${recordingId}:`, error);
    throw error;
  }
};

export const incrementRecordingViewCount = async (recordingId: string) => {
  try {
    const response = await apiPost(`/faculty/recordings/${recordingId}/view/`, {});
    if (!response.ok) {
      throw new Error('Failed to increment view count');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error incrementing view count for recording ${recordingId}:`, error);
    throw error;
  }
};

export const incrementRecordingDownloadCount = async (recordingId: string) => {
  try {
    const response = await apiPost(`/faculty/recordings/${recordingId}/download/`, {});
    if (!response.ok) {
      throw new Error('Failed to increment download count');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error incrementing download count for recording ${recordingId}:`, error);
    throw error;
  }
};

// Publication Management
export const getFacultyPublications = async () => {
  try {
    const response = await apiGet('/faculty/publications/list/');
    if (!response.ok) {
      throw new Error('Failed to fetch publications');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching faculty publications:', error);
    throw error;
  }
};

export const getFacultyPublicationDetail = async (publicationId: string) => {
  try {
    const response = await apiGet(`/faculty/publications/${publicationId}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch publication details');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching publication ${publicationId} details:`, error);
    throw error;
  }
};

export const createFacultyPublication = async (publicationData: Record<string, unknown>) => {
  try {
    const response = await apiPost('/faculty/publications/create/', publicationData);
    if (!response.ok) {
      throw new Error('Failed to create publication');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating publication:', error);
    throw error;
  }
};

export const updateFacultyPublication = async (publicationId: string, publicationData: Record<string, unknown>) => {
  try {
    const response = await apiPut(`/faculty/publications/${publicationId}/update/`, publicationData);
    if (!response.ok) {
      throw new Error('Failed to update publication');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating publication ${publicationId}:`, error);
    throw error;
  }
};

export const deleteFacultyPublication = async (publicationId: string) => {
  try {
    const response = await apiDelete(`/faculty/publications/${publicationId}/delete/`);
    if (!response.ok) {
      throw new Error('Failed to delete publication');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error deleting publication ${publicationId}:`, error);
    throw error;
  }
};

export const searchFacultyPublications = async (searchData: Record<string, unknown>) => {
  try {
    const response = await apiPost('/faculty/publications/search/', searchData);
    if (!response.ok) {
      throw new Error('Failed to search publications');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching publications:', error);
    throw error;
  }
};

// Ethics Management
export const getFacultyEthicsApplications = async () => {
  try {
    const response = await apiGet('/faculty/ethics/list/');
    if (!response.ok) {
      throw new Error('Failed to fetch ethics applications');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching faculty ethics applications:', error);
    throw error;
  }
};

export const getFacultyEthicsApplicationDetail = async (applicationId: string) => {
  try {
    const response = await apiGet(`/faculty/ethics/${applicationId}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch ethics application details');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ethics application ${applicationId} details:`, error);
    throw error;
  }
};

export const createFacultyEthicsApplication = async (applicationData: Record<string, unknown>) => {
  try {
    const response = await apiPost('/faculty/ethics/create/', applicationData);
    if (!response.ok) {
      throw new Error('Failed to create ethics application');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating ethics application:', error);
    throw error;
  }
};

export const updateFacultyEthicsApplication = async (applicationId: string, applicationData: Record<string, unknown>) => {
  try {
    const response = await apiPut(`/faculty/ethics/${applicationId}/update/`, applicationData);
    if (!response.ok) {
      throw new Error('Failed to update ethics application');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating ethics application ${applicationId}:`, error);
    throw error;
  }
};

export const deleteFacultyEthicsApplication = async (applicationId: string) => {
  try {
    const response = await apiDelete(`/faculty/ethics/${applicationId}/delete/`);
    if (!response.ok) {
      throw new Error('Failed to delete ethics application');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error deleting ethics application ${applicationId}:`, error);
    throw error;
  }
};

export const uploadEthicsDocument = async (applicationId: string, documentData: Record<string, unknown>) => {
  try {
    const response = await apiPost(`/faculty/ethics/${applicationId}/documents/upload/`, documentData);
    if (!response.ok) {
      throw new Error('Failed to upload ethics document');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error uploading document for ethics application ${applicationId}:`, error);
    throw error;
  }
};

export const searchFacultyEthicsApplications = async (searchData: Record<string, unknown>) => {
  try {
    const response = await apiPost('/faculty/ethics/search/', searchData);
    if (!response.ok) {
      throw new Error('Failed to search ethics applications');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching ethics applications:', error);
    throw error;
  }
};

// Research Collaboration Management
export const getFacultyCollaborations = async () => {
  try {
    const response = await apiGet('/faculty/collaborations/list/');
    if (!response.ok) {
      throw new Error('Failed to fetch collaborations');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching faculty collaborations:', error);
    throw error;
  }
};

export const getFacultyCollaborationDetail = async (collaborationId: string) => {
  try {
    const response = await apiGet(`/faculty/collaborations/${collaborationId}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch collaboration details');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching collaboration ${collaborationId} details:`, error);
    throw error;
  }
};

export const createFacultyCollaboration = async (collaborationData: Record<string, unknown>) => {
  try {
    const response = await apiPost('/faculty/collaborations/create/', collaborationData);
    if (!response.ok) {
      throw new Error('Failed to create collaboration');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating collaboration:', error);
    throw error;
  }
};

export const updateFacultyCollaboration = async (collaborationId: string, collaborationData: Record<string, unknown>) => {
  try {
    const response = await apiPut(`/faculty/collaborations/${collaborationId}/update/`, collaborationData);
    if (!response.ok) {
      throw new Error('Failed to update collaboration');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error updating collaboration ${collaborationId}:`, error);
    throw error;
  }
};

export const deleteFacultyCollaboration = async (collaborationId: string) => {
  try {
    const response = await apiDelete(`/faculty/collaborations/${collaborationId}/delete/`);
    if (!response.ok) {
      throw new Error('Failed to delete collaboration');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error deleting collaboration ${collaborationId}:`, error);
    throw error;
  }
};

export const addCollaboratorToCollaboration = async (collaborationId: string, collaboratorData: Record<string, unknown>) => {
  try {
    const response = await apiPost(`/faculty/collaborations/${collaborationId}/collaborators/add/`, collaboratorData);
    if (!response.ok) {
      throw new Error('Failed to add collaborator');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error adding collaborator to collaboration ${collaborationId}:`, error);
    throw error;
  }
};

export const removeCollaboratorFromCollaboration = async (collaborationId: string, collaboratorId: string) => {
  try {
    const response = await apiDelete(`/faculty/collaborations/${collaborationId}/collaborators/${collaboratorId}/remove/`);
    if (!response.ok) {
      throw new Error('Failed to remove collaborator');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error removing collaborator ${collaboratorId} from collaboration ${collaborationId}:`, error);
    throw error;
  }
};

export const uploadCollaborationDocument = async (collaborationId: string, documentData: Record<string, unknown>) => {
  try {
    const response = await apiPost(`/faculty/collaborations/${collaborationId}/documents/upload/`, documentData);
    if (!response.ok) {
      throw new Error('Failed to upload collaboration document');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error uploading document for collaboration ${collaborationId}:`, error);
    throw error;
  }
};

export const sendCollaborationMessage = async (collaborationId: string, messageData: Record<string, unknown>) => {
  try {
    const response = await apiPost(`/faculty/collaborations/${collaborationId}/messages/send/`, messageData);
    if (!response.ok) {
      throw new Error('Failed to send collaboration message');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error sending message to collaboration ${collaborationId}:`, error);
    throw error;
  }
};

// Faculty Profile and Settings
export const getFacultyProfile = async () => {
  try {
    const response = await apiGet('/faculty/profile/');
    if (!response.ok) {
      throw new Error('Failed to fetch faculty profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching faculty profile:', error);
    throw error;
  }
};

export const updateFacultyProfile = async (profileData: Record<string, unknown>) => {
  try {
    const response = await apiPut('/faculty/profile/update/', profileData);
    if (!response.ok) {
      throw new Error('Failed to update faculty profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating faculty profile:', error);
    throw error;
  }
};

export const getFacultySettings = async () => {
  try {
    const response = await apiGet('/faculty/settings/');
    if (!response.ok) {
      throw new Error('Failed to fetch faculty settings');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching faculty settings:', error);
    throw error;
  }
};

export const updateFacultySettings = async (settingsData: Record<string, unknown>) => {
  try {
    const response = await apiPut('/faculty/settings/update/', settingsData);
    if (!response.ok) {
      throw new Error('Failed to update faculty settings');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating faculty settings:', error);
    throw error;
  }
};
