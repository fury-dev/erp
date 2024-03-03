import { Price } from '../items';
import { Product } from './product';

export type Order = {
  id: string;
  versionId: number;
  orderId?: number;
  customerName: string;
  orderDate: string;
  orderType: 'CASH_ON_DELIVERY' | 'PREPAID';
  amount: Price;
  productId: string;
  product?: Product;
  status: 'PENDING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  paymentStatus: boolean;
  deliveryDate: string;
  createdAt?: string;
  updatedAt?: string;
  location?: {
    address: string;
    pincode: number;
    city: string;
    state: string;
    country: string;
  };
  geoLocation?: GeolocationPosition | null;
};
