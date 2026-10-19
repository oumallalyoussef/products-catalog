import type { StockStatus } from './stock-status';

export interface ProductsFilters {
  readonly page?: number;
  readonly limit?: number;
  readonly category?: string;
  readonly stock_status?: StockStatus;
}
