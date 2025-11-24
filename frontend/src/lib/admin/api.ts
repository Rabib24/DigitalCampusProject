import { apiGet, apiPost, apiDelete } from '@/lib/api';

// Admin Dashboard API Service

// Dashboard Overview
export const getAdminDashboardOverview = async () => {
  try {
    const response = await apiGet('/admin/dashboard/overview/');
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard overview');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching admin dashboard overview:', error);
    throw error;
  }
};

// User Management
export const getAdminUserManagement = async () => {
  try {
    const response = await apiGet('/admin/user-management/');
    if (!response.ok) {
      throw new Error('Failed to fetch user management data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching admin user management data:', error);
    throw error;
  }
};

// System Monitoring
export const getAdminSystemMonitoring = async () => {
  try {
    const response = await apiGet('/admin/system-monitoring/');
    if (!response.ok) {
      throw new Error('Failed to fetch system monitoring data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching admin system monitoring data:', error);
    throw error;
  }
};

// Permission Management
export const getAdminPermissionManagement = async () => {
  try {
    console.log('Fetching permission management data...');
    const response = await apiGet('/admin/permission-management/');
    console.log('Permission management response:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Permission management error response:', errorText);
      throw new Error(`Failed to fetch permission management data: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Permission management data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching admin permission management data:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: Unable to connect to the server. Please check your connection and try again.');
    }
    throw error;
  }
};

export const assignUserPermission = async (data: { user_id: string; permission_id: string; scope?: Record<string, unknown> }) => {
  try {
    const response = await apiPost('/admin/permission-management/', data);
    if (!response.ok) {
      throw new Error('Failed to assign user permission');
    }
    return await response.json();
  } catch (error) {
    console.error('Error assigning user permission:', error);
    throw error;
  }
};

export const removeUserPermission = async (data: { user_id: string; permission_id: string }) => {
  try {
    const response = await apiDelete('/admin/permission-management/', {
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to remove user permission');
    }
    return await response.json();
  } catch (error) {
    console.error('Error removing user permission:', error);
    throw error;
  }
};

// Course Management
export const getAdminCourseManagement = async () => {
  try {
    const response = await apiGet('/admin/course-management/');
    if (!response.ok) {
      throw new Error('Failed to fetch course management data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching admin course management data:', error);
    throw error;
  }
};

export const createCourse = async (data: Record<string, unknown>) => {
  try {
    const response = await apiPost('/admin/course-management/', data);
    if (!response.ok) {
      throw new Error('Failed to create course');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

// Faculty Management
export const getAdminFacultyManagement = async () => {
  try {
    const response = await apiGet('/admin/faculty-management/');
    if (!response.ok) {
      throw new Error('Failed to fetch faculty management data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching admin faculty management data:', error);
    throw error;
  }
};

// Student Management
export const getAdminStudentManagement = async () => {
  try {
    const response = await apiGet('/admin/student-management/');
    if (!response.ok) {
      throw new Error('Failed to fetch student management data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching admin student management data:', error);
    throw error;
  }
};

// Grade Management
export const getAdminGradeManagement = async () => {
  try {
    const response = await apiGet('/admin/grade-management/');
    if (!response.ok) {
      throw new Error('Failed to fetch grade management data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching admin grade management data:', error);
    throw error;
  }
};

export const saveGrade = async (data: Record<string, unknown>) => {
  try {
    const response = await apiPost('/admin/grade-management/', data);
    if (!response.ok) {
      throw new Error('Failed to save grade');
    }
    return await response.json();
  } catch (error) {
    console.error('Error saving grade:', error);
    throw error;
  }
};

// Reporting
export const getAdminReporting = async (reportType: string) => {
  try {
    const response = await apiGet(`/admin/reporting/?type=${reportType}`);
    if (!response.ok) {
      throw new Error('Failed to fetch report data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching admin report data:', error);
    throw error;
  }
};