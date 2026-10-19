import type { Product } from './product';

export interface PaginatedProducts {
  readonly data: Product[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
}
