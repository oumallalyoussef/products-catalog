import { Product } from '../entities/product.entity';

export class PaginatedProductsDto {
  readonly data: Product[];
  readonly page: number;
  readonly limit: number;
  readonly total: number; //nombre de produits
  readonly totalPages: number; //nombre de pages
}
