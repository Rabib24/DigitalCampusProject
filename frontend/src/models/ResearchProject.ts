export interface ResearchProject {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  collaborators: string[];
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'archived';
  startDate: Date;
  endDate: Date;
  budget: number;
  ethicsApproval: boolean;
  publications: string[];
  documents: string[];
  milestones: {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    status: 'pending' | 'in_progress' | 'completed';
    completionDate?: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export const researchProjectModelFields = [
  'id',
  'title',
  'description',
  'ownerId',
  'collaborators',
  'status',
  'startDate',
  'endDate',
  'budget',
  'ethicsApproval',
  'publications',
  'documents',
  'milestones',
  'createdAt',
  'updatedAt'
];