import { Price } from '..';

export type ProductSchema = {
  id: string;
  versionId: number;
  name: string;
  distributorPrice: Price;
  sellerPrice: Price;
  size?: string[];
  productSchemaId?: Number;
  inStock: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type Product = {
  id: string;
  versionId: number;
  name: string;
  image: string;
  productSchemaId?: string;
  productSchema?: ProductSchema;
  price: Price;
  productId?: Number;
  size: string;
  quantity?: string;
  inStock: boolean;
  createdAt?: string;
  updatedAt?: string;
};
