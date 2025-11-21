export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Date;
  points: number;
  type: 'homework' | 'quiz' | 'exam' | 'project' | 'discussion';
  submissions: string[];
  createdAt: Date;
  startDate: Date;
  allowLateSubmission: boolean;
  latePenalty: number;
  maxSubmissions: number;
  attachments: string[];
  rubric: string;
  visibleToStudents: boolean;
  category: string;
  weight: number;
}

export const assignmentModelFields = [
  'id',
  'courseId',
  'title',
  'description',
  'dueDate',
  'points',
  'type',
  'submissions',
  'createdAt',
  'startDate',
  'allowLateSubmission',
  'latePenalty',
  'maxSubmissions',
  'attachments',
  'rubric',
  'visibleToStudents',
  'category',
  'weight'
];