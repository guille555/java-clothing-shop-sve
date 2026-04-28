import type { SaleItem } from "./SaleItem";

export type Sale = {
  publicKey?: string,
  flagState?: boolean,
  flagVisible?: boolean,
  createDate?: Date,
  listSaleDetails?: Array<SaleItem>
};
