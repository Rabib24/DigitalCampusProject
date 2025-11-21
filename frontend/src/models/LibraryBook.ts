export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  callNumber: string;
  borrowerId: string;
  checkoutDate: Date;
  dueDate: Date;
  returnDate: Date;
  status: 'available' | 'checkedout' | 'overdue' | 'reserved';
  location: string;
  fines: number;
  renewalCount: number;
}

export const libraryBookModelFields = [
  'id',
  'title',
  'author',
  'isbn',
  'callNumber',
  'borrowerId',
  'checkoutDate',
  'dueDate',
  'returnDate',
  'status',
  'location',
  'fines',
  'renewalCount'
];