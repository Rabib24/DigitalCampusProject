export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'emergency' | 'announcement' | 'notification';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  audience: 'campus' | 'department' | 'course' | 'individual';
  audienceIds: string[];
  channels: ('email' | 'sms' | 'push' | 'display')[];
  scheduledAt: Date;
  sentAt: Date;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export const alertModelFields = [
  'id',
  'title',
  'message',
  'type',
  'priority',
  'audience',
  'audienceIds',
  'channels',
  'scheduledAt',
  'sentAt',
  'status',
  'createdBy',
  'createdAt',
  'updatedAt'
];