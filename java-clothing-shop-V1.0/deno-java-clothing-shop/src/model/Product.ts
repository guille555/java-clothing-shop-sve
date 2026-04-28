import type { Category } from "./Category";

export type Product = {
  publicKey?: string,
  name: string,
  unitPrice?: number,
  ammount?: number,
  flagState?: boolean,
  flagVisible?: boolean,
  createDate?: Date,
  lastUpdate?: Date,
  category?: Category
};
