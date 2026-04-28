import type { Product } from "./Product";

export type Category = {
  id?: number,
  publicKey?: string,
  name: string,
  flagState?: boolean,
  flagVisible?: boolean,
  createDate?: Date,
  lastUpdate?: Date,
  listProducts?: Array<Product>
};
