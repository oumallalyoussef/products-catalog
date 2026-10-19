import { Inject, Injectable } from '@nestjs/common';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { PaginatedProductsDto } from './dto/paginated-products.dto';
import { Product } from './entities/product.entity';
import { ProductsRepository } from './repositories/products.repository';
import { CACHE_SERVICE } from '../common/cache/cache.constants';
import type { ICacheService } from '../common/cache/cache.interface';
@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    @Inject(CACHE_SERVICE) private readonly cache: ICacheService,
  ) {}

  findAll(query: GetProductsQueryDto): PaginatedProductsDto {
    const key = `${query.page}:${query.limit}:${query.category}:${query.stock_status}`;
    const cached = this.cache.get<PaginatedProductsDto>(key);
    if (cached) {
      return cached;
    }
    const filtered = this.filter(query);
    const data = this.paginate(filtered, query.page, query.limit);
    const total = filtered.length;

    const result: PaginatedProductsDto = {
      data,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };

    this.cache.set(key, result);

    return result;
  }

  private filter(query: GetProductsQueryDto): Product[] {
    return this.productsRepository.findAll().filter((product) => {
      if (query.category && product.category !== query.category) {
        return false;
      }
      if (query.stock_status && product.stock_status !== query.stock_status) {
        return false;
      }
      return true;
    });
  }

  private paginate(items: Product[], page: number, limit: number): Product[] {
    const start = (page - 1) * limit;
    const end = start + limit;

    return items.slice(start, end);
  }
}
