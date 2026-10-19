import { useEffect, useState } from 'react';
import { fetchProducts } from '../api/products-api';
import { DEFAULT_PAGE_SIZE } from '../constants/products';
import type { PaginatedProducts } from '../types/paginated-products';
import type { ProductsFilters } from '../types/products-filters';
import type { StockStatus } from '../types/stock-status';

interface FetchResult {
  readonly requestedFor: ProductsFilters;
  readonly products?: PaginatedProducts;
  readonly error?: string;
}

export function useProducts() {
  const [filters, setFilters] = useState<ProductsFilters>({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
  });
  const [result, setResult] = useState<FetchResult | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchProducts(filters, controller.signal)
      .then((products) => setResult({ requestedFor: filters, products }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        const message =
          error instanceof Error ? error.message : 'Erreur inconnue';
        setResult({ requestedFor: filters, error: message });
      });

    // Annule la requête obsolète si les filtres changent avant la réponse
    return () => controller.abort();
  }, [filters]);

  // Une requête est en cours tant que le dernier résultat ne correspond pas aux filtres actuels
  const isLoading = result?.requestedFor !== filters;
  const error = isLoading ? null : (result?.error ?? null);
  const products = result?.products ?? null;

  const setPage = (page: number) =>
    setFilters((previous) => ({ ...previous, page }));

  // Un changement de filtre revient toujours à la première page
  const setCategory = (category?: string) =>
    setFilters((previous) => ({ ...previous, category, page: 1 }));

  const setStockStatus = (stock_status?: StockStatus) =>
    setFilters((previous) => ({ ...previous, stock_status, page: 1 }));

  return {
    filters,
    products,
    isLoading,
    error,
    setPage,
    setCategory,
    setStockStatus,
  };
}
