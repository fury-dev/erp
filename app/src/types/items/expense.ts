import { Price } from '../items';

export type Expense = {
  id: string;
  versionId: number;
  expenseId?: number;
  expenseType: 'PERSONAL' | 'ORDER' | 'DELIVERY_CHARGES' | 'OTHERS';
  amount: Price;
  cashInBank: Price;
  cashInHand: Price;
  pnl: Price;
  operationType: 'CREDIT' | 'DEBIT';
  note: string;
  createdAt: string;
  updatedAt: string;
};
