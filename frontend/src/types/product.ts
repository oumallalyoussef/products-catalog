import type { StockStatus } from './stock-status';

export interface Product {
  readonly id: number;
  readonly name: string;
  readonly category: string;
  readonly price: number;
  readonly stock_status: StockStatus;
}
