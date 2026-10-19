export const StockStatus = {
  InStock: 'in_stock',
  LowStock: 'low_stock',
  OutOfStock: 'out_of_stock',
} as const;

export type StockStatus = (typeof StockStatus)[keyof typeof StockStatus];

export function isStockStatus(value: string): value is StockStatus {
  return (Object.values(StockStatus) as string[]).includes(value);
}
