import { Price } from '..';

export type Product = {
  id: string;
  versionId: number;
  name: string;
  image: string | undefined;
  distributorPrice: Price;
  sellerPrice: Price;
  size?: string[];
  productId?: Number;
  inStock: boolean;
  createdAt?: string;
  updatedAt?: string;
};
