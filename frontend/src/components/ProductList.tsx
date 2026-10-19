import type { Product } from '../types/product';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  readonly products: readonly Product[];
  readonly isRefreshing: boolean;
}

export function ProductList({ products, isRefreshing }: ProductListProps) {
  return (
    <div className={`grid ${isRefreshing ? 'grid--refreshing' : ''}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
