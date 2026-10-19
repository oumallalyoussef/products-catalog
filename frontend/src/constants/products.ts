import { StockStatus } from '../types/stock-status';

export const CATEGORIES: readonly string[] = [
  'Electronics',
  'Clothing',
  'Food',
  'Books',
  'Home',
];

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  [StockStatus.InStock]: 'En stock',
  [StockStatus.LowStock]: 'Stock faible',
  [StockStatus.OutOfStock]: 'Rupture',
};

export const DEFAULT_PAGE_SIZE = 12;
