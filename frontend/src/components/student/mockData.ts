// Temporary shared mock data for the Student dashboard.
// Later this can be replaced by real API calls or a data fetching layer.

export const mockDashboardMetrics = {
  cgpa: 3.45,
  completedCourses: 24,
  remainingCourses: 12,
  predictedGraduation: "Dec 2025",
  attendanceRate: 92,
  pendingAssignments: 2,
};

export const mockCourses = [
  {
    id: 1,
    code: "CS-203",
    name: "Data Structures and Algorithms",
    instructor: "Dr. Ahmed Khan",
    credits: 3,
    status: "Active",
    resources: 42,
    progress: 85,
  },
  {
    id: 2,
    code: "MA-101",
    name: "Calculus I",
    instructor: "Prof. Fatima Ali",
    credits: 4,
    status: "Active",
    resources: 38,
    progress: 78,
  },
  {
    id: 3,
    code: "EN-102",
    name: "English Literature",
    instructor: "Dr. Sarah Johnson",
    credits: 3,
    status: "Active",
    resources: 25,
    progress: 90,
  },
  {
    id: 4,
    code: "PH-203",
    name: "Physics II",
    instructor: "Prof. Hassan Malik",
    credits: 4,
    status: "Active",
    resources: 31,
    progress: 72,
  },
  {
    id: 5,
    code: "EC-101",
    name: "Principles of Economics",
    instructor: "Dr. Aisha Patel",
    credits: 3,
    status: "Active",
    resources: 29,
    progress: 88,
  },
];

export const mockAssignments = [
  {
    id: 1,
    title: "Data Structures Project - Binary Tree",
    course: "CS-203",
    dueDate: "2025-12-20",
    status: "pending" as const,
    priority: "high" as const,
  },
  {
    id: 2,
    title: "Essay: Global Economics Impact",
    course: "EC-101",
    dueDate: "2025-12-23",
    status: "pending" as const,
    priority: "medium" as const,
  },
  {
    id: 3,
    title: "Calculus Problem Set 5",
    course: "MA-101",
    dueDate: "2025-12-25",
    status: "submitted" as const,
    priority: "low" as const,
  },
  {
    id: 4,
    title: "Literature Analysis - Shakespeare",
    course: "EN-102",
    dueDate: "2025-12-22",
    status: "pending" as const,
    priority: "medium" as const,
  },
  {
    id: 5,
    title: "Physics Lab Report - Thermodynamics",
    course: "PH-203",
    dueDate: "2025-12-21",
    status: "submitted" as const,
    priority: "low" as const,
  },
];

export const mockCourseGrades = [
  { course: "CS-203", grade: "A-", points: 3.7, percentage: 92 },
  { course: "MA-101", grade: "B+", points: 3.3, percentage: 88 },
  { course: "EN-102", grade: "A", points: 4.0, percentage: 95 },
  { course: "PH-203", grade: "B", points: 3.0, percentage: 82 },
  { course: "EC-101", grade: "A-", points: 3.7, percentage: 91 },
];
