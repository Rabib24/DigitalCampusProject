export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  isRead: boolean;
  createdAt: Date;
}

export const notificationModelFields = [
  'id',
  'userId',
  'title',
  'message',
  'type',
  'isRead',
  'createdAt'
];