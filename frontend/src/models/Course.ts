export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  instructorId: string;
  schedule: string;
  students: string[];
  assignments: string[];
  createdAt: Date;
  department: string;
  prerequisites: string[];
  syllabus: string;
  textbooks: string[];
  enrollmentLimit: number;
  waitlist: string[];
  startDate: Date;
  endDate: Date;
  gradingScale: Record<string, number>;
  categories: string[];
  materials: string[];
  announcements: string[];
}

export const courseModelFields = [
  'id',
  'code',
  'name',
  'description',
  'credits',
  'instructorId',
  'schedule',
  'students',
  'assignments',
  'createdAt',
  'department',
  'prerequisites',
  'syllabus',
  'textbooks',
  'enrollmentLimit',
  'waitlist',
  'startDate',
  'endDate',
  'gradingScale',
  'categories',
  'materials',
  'announcements'
];