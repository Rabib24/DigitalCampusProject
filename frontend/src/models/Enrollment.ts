export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: Date;
  status: 'enrolled' | 'dropped' | 'completed' | 'waitlisted';
  grade?: string;
}

export const enrollmentModelFields = [
  'id',
  'studentId',
  'courseId',
  'enrollmentDate',
  'status',
  'grade'
];