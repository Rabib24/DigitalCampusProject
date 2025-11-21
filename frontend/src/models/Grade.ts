export interface Grade {
  id: string;
  studentId: string;
  courseId: string;
  assignmentId: string;
  value: number;
  maxPoints: number;
  letterGrade: string;
  weight: number;
  category: string;
  graderId: string;
  comments: string;
  createdAt: Date;
}

export const gradeModelFields = [
  'id',
  'studentId',
  'courseId',
  'assignmentId',
  'value',
  'maxPoints',
  'letterGrade',
  'weight',
  'category',
  'graderId',
  'comments',
  'createdAt'
];