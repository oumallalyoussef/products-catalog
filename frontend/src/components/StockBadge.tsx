import { STOCK_STATUS_LABELS } from '../constants/products';
import type { StockStatus } from '../types/stock-status';

interface StockBadgeProps {
  readonly status: StockStatus;
}

export function StockBadge({ status }: StockBadgeProps) {
  return (
    <span className={`badge badge--${status}`}>
      {STOCK_STATUS_LABELS[status]}
    </span>
  );
}
