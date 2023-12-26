import { Price } from '../items';
import { Product } from './product';

export type Order = {
  id: string;
  versionId: string;
  orderId: Number;
  customerName: string;
  orderDate: string;
  orderType: 'COD' | 'PREPAID';
  amount: Price;
  productId: string;
  product?: Product;
  status: 'PENDING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  paymentStatus: boolean;
  deliveryDate: string;
  createdAt: string;
  updatedAt: string;
};
