export interface CampusActivity {
  id: string;
  title: string;
  description: string;
  type: 'club' | 'competition' | 'student-feature';
  organizerId: string;
  participants: string[];
  startDate: Date;
  endDate: Date;
  location: string;
  registrationDeadline: Date;
  maxParticipants: number;
  status: 'draft' | 'open' | 'closed' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export const campusActivityModelFields = [
  'id',
  'title',
  'description',
  'type',
  'organizerId',
  'participants',
  'startDate',
  'endDate',
  'location',
  'registrationDeadline',
  'maxParticipants',
  'status',
  'createdAt',
  'updatedAt',
  'tags'
];