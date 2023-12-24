import { Price } from '../items';

export type Expense = {
  id: string;
  versionId: string;
  expenseType: string;
  amount: Price;
  cashInBank: Price;
  cashInHand: Price;
  pnl: Price;
  createdAt: string;
  updatedAt: string;
};
