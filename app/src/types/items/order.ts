import { Price } from '../items';
import { Product } from './product';

export type Order = {
  id: string;
  versionId: string;
  customerName: string;
  orderDate: string;
  orderType: string;
  amount: Price;
  productId: string;
  product?: Product;
  status: string;
  paymentStatus: boolean;
  deliveryDate: string;
  createdAt: string;
  updatedAt: string;
};
