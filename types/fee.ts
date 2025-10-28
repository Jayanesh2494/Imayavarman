export interface Fee {
  _id: string;
  studentId: string;
  amount: number;
  dueDate?: string;
  paidDate?: string;
  status: 'pending' | 'paid' | 'overdue';
  paymentMethod?: string;
  transactionId?: string;
  month?: string;
  year?: number;
}

export interface CreateFeeData {
  studentId: string;
  amount: number;
  dueDate?: string;
  month?: string;
  year?: number;
}
