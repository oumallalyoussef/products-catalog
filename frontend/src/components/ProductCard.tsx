import type { Product } from '../types/product';
import { formatPrice } from '../utils/format-price';
import { StockBadge } from './StockBadge';

interface ProductCardProps {
  readonly product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="card">
      <p className="card__category">{product.category}</p>
      <h2 className="card__name">{product.name}</h2>
      <div className="card__footer">
        <span className="card__price">{formatPrice(product.price)}</span>
        <StockBadge status={product.stock_status} />
      </div>
    </article>
  );
}
