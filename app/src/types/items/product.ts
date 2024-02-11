import { Price } from '..';

export type ProductSchema = {
  id: string;
  versionId: number;
  name: string;
  distributorPrice: Price;
  sellerPrice: Price;
  size?: string[];
  productSchemaId?: number;
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
  productId?: number;
  size: string;
  quantity?: string;
  inStock: boolean;
  createdAt?: string;
  updatedAt?: string;
};
