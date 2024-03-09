import { Expense } from './items/expense';
import { Order } from './items/order';
import { Product, ProductSchema } from './items/product';

export type ITEMS = 'order' | 'expense' | 'product' | 'productSchema';

export type Price = {
  currency: TCurrency;
  amount: number;
};

export type TCurrency = 'INR' | 'USD' | 'STER';
export type TItems = Order | Product | Expense | ProductSchema;
export type TAccent = 'DARK' | 'LIGHT';
