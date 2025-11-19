// Faculty-specific TypeScript types and interfaces

export interface FacultyProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  title: string;
  officeLocation?: string;
  officeHours?: string;
  phoneNumber?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface FacultyCourse {
  id: string;
  code: string;
  name: string;
  semester: string;
  year: number;
  credits: number;
  department: string;
  studentCount: number;
  syllabusStatus: 'draft' | 'published' | 'archived';
}

export interface FacultyAssignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  maxPoints: number;
  submissionCount: number;
  gradedCount: number;
  status: 'draft' | 'published' | 'closed';
}

export interface FacultyNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'announcement' | 'assignment' | 'grading' | 'advising' | 'research';
}

export interface FacultySetting {
  key: string;
  value: string | boolean | number;
}

export interface FacultyResearchProject {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'proposal' | 'in-progress' | 'completed' | 'published';
  collaborators: string[];
}

export interface FacultyAdvisee {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  program: string;
  year: number;
  gpa: number;
  lastMeeting?: string;
}

export interface FacultyAnalyticsData {
  courseUtilization: {
    courseId: string;
    courseName: string;
    enrollment: number;
    engagementScore: number;
  }[];
  attendanceRates: {
    courseId: string;
    courseName: string;
    rate: number;
  }[];
  performanceMetrics: {
    courseId: string;
    averageGrade: number;
    passRate: number;
  }[];
}