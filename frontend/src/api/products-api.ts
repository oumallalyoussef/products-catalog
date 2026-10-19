import type { PaginatedProducts } from '../types/paginated-products';
import type { ProductsFilters } from '../types/products-filters';

const API_URL: string = import.meta.env.VITE_API_URL;

function buildQueryString(filters: ProductsFilters): string {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  });

  return params.toString();
}

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { message?: string | string[] };
    const message = Array.isArray(body.message)
      ? body.message.join(', ')
      : body.message;

    return message ?? response.statusText;
  } catch {
    return response.statusText;
  }
}

export async function fetchProducts(
  filters: ProductsFilters,
  signal?: AbortSignal,
): Promise<PaginatedProducts> {
  const response = await fetch(
    `${API_URL}/products?${buildQueryString(filters)}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }

  return (await response.json()) as PaginatedProducts;
}
