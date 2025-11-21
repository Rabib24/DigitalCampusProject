export interface FinancialAid {
  id: string;
  studentId: string;
  type: 'scholarship' | 'grant' | 'loan' | 'work-study';
  amount: number;
  status: 'applied' | 'awarded' | 'rejected' | 'disbursed';
  applicationDate: Date;
  awardDate: Date;
  disbursementSchedule: {
    date: Date;
    amount: number;
  }[];
  requirements: string[];
  documents: string[];
  comments: string;
  academicYear: string;
}

export const financialAidModelFields = [
  'id',
  'studentId',
  'type',
  'amount',
  'status',
  'applicationDate',
  'awardDate',
  'disbursementSchedule',
  'requirements',
  'documents',
  'comments',
  'academicYear'
];