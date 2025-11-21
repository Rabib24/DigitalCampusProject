export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  type: 'tuition' | 'fee' | 'scholarship' | 'grant';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  description: string;
  dueDate: Date;
  paidDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const paymentModelFields = [
  'id',
  'userId',
  'amount',
  'currency',
  'type',
  'status',
  'paymentMethod',
  'transactionId',
  'description',
  'dueDate',
  'paidDate',
  'createdAt',
  'updatedAt'
];