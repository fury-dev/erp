import { Price } from '..';

export type Product = {
  id: string;
  versionId: number;
  name: string;
  image: String | undefined;
  distributorPrice: Price;
  sellerPrice: Price;
  size?: string[];
  inStock: boolean;
  createdAt?: string;
  updatedAt?: string;
};
