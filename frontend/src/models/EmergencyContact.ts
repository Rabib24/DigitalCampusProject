export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const emergencyContactModelFields = [
  'id',
  'userId',
  'name',
  'relationship',
  'phone',
  'email',
  'isPrimary',
  'createdAt',
  'updatedAt'
];