import { Expense } from './items/expense';
import { Order } from './items/order';
import { Product } from './items/product';

export type ITEMS = 'order' | 'expense' | 'product';

export type Price = {
  currency: TCurrency;
  amount: number;
};

export type TCurrency = 'INR' | 'USD' | 'STER';
export type TItems = Order | Product | Expense;
