import { CATEGORIES, STOCK_STATUS_LABELS } from '../constants/products';
import { isStockStatus, StockStatus } from '../types/stock-status';

interface ProductFiltersProps {
  readonly category?: string;
  readonly stockStatus?: StockStatus;
  readonly onCategoryChange: (category?: string) => void;
  readonly onStockStatusChange: (stockStatus?: StockStatus) => void;
}

export function ProductFilters({
  category,
  stockStatus,
  onCategoryChange,
  onStockStatusChange,
}: ProductFiltersProps) {
  return (
    <div className="filters">
      <label className="filters__field">
        <span>Catégorie</span>
        <select
          value={category ?? ''}
          onChange={(event) => onCategoryChange(event.target.value || undefined)}
        >
          <option value="">Toutes</option>
          {CATEGORIES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </label>

      <label className="filters__field">
        <span>Stock</span>
        <select
          value={stockStatus ?? ''}
          onChange={(event) =>
            onStockStatusChange(
              isStockStatus(event.target.value) ? event.target.value : undefined,
            )
          }
        >
          <option value="">Tous</option>
          {Object.values(StockStatus).map((status) => (
            <option key={status} value={status}>
              {STOCK_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
