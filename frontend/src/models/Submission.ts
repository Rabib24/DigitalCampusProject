export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  submittedAt: Date;
  grade?: number;
  feedback?: string;
  attachments: string[];
  lateSubmission: boolean;
  revisionHistory: string[];
}

export const submissionModelFields = [
  'id',
  'assignmentId',
  'studentId',
  'content',
  'submittedAt',
  'grade',
  'feedback',
  'attachments',
  'lateSubmission',
  'revisionHistory'
];