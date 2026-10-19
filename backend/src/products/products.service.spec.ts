import { Test } from '@nestjs/testing';
import { CACHE_SERVICE } from '../common/cache/cache.constants';
import { InMemoryCacheService } from '../common/cache/in-memory-cache.service';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { Product } from './entities/product.entity';
import { StockStatusEnum } from './enums/stock-status.enum';
import { ProductsRepository } from './repositories/products.repository';
import { ProductsService } from './products.service';

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Laptop',
    category: 'Electronics',
    price: 1000,
    stock_status: StockStatusEnum.InStock,
  },
  {
    id: 2,
    name: 'Mouse',
    category: 'Electronics',
    price: 20,
    stock_status: StockStatusEnum.LowStock,
  },
  {
    id: 3,
    name: 'T-Shirt',
    category: 'Clothing',
    price: 15,
    stock_status: StockStatusEnum.InStock,
  },
  {
    id: 4,
    name: 'Jeans',
    category: 'Clothing',
    price: 60,
    stock_status: StockStatusEnum.OutOfStock,
  },
  {
    id: 5,
    name: 'Coffee',
    category: 'Food',
    price: 9,
    stock_status: StockStatusEnum.InStock,
  },
];

const buildQuery = (overrides: Partial<GetProductsQueryDto> = {}) =>
  Object.assign(new GetProductsQueryDto(), overrides);

describe('ProductsService', () => {
  let service: ProductsService;
  let findAll: jest.Mock<Product[], []>;

  beforeEach(async () => {
    findAll = jest.fn<Product[], []>().mockReturnValue(PRODUCTS);

    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: ProductsRepository, useValue: { findAll } },
        { provide: CACHE_SERVICE, useClass: InMemoryCacheService },
      ],
    }).compile();

    service = moduleRef.get(ProductsService);
  });

  describe('filtering', () => {
    it('returns every product when no filter is given', () => {
      const result = service.findAll(buildQuery());

      expect(result.total).toBe(5);
      expect(result.data).toHaveLength(5);
    });

    it('filters by category', () => {
      const result = service.findAll(buildQuery({ category: 'Clothing' }));

      expect(result.data.map((product) => product.id)).toEqual([3, 4]);
      expect(result.total).toBe(2);
    });

    it('filters by stock status', () => {
      const result = service.findAll(
        buildQuery({ stock_status: StockStatusEnum.InStock }),
      );

      expect(result.data.map((product) => product.id)).toEqual([1, 3, 5]);
    });

    it('combines category and stock status filters', () => {
      const result = service.findAll(
        buildQuery({
          category: 'Electronics',
          stock_status: StockStatusEnum.LowStock,
        }),
      );

      expect(result.data.map((product) => product.id)).toEqual([2]);
    });

    it('returns an empty page when nothing matches', () => {
      const result = service.findAll(buildQuery({ category: 'Books' }));

      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });
  });

  describe('pagination', () => {
    it('returns the requested page', () => {
      const result = service.findAll(buildQuery({ page: 2, limit: 2 }));

      expect(result.data.map((product) => product.id)).toEqual([3, 4]);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(2);
    });

    it('rounds the number of pages up', () => {
      const result = service.findAll(buildQuery({ limit: 2 }));

      expect(result.totalPages).toBe(3);
    });

    it('returns a partial last page', () => {
      const result = service.findAll(buildQuery({ page: 3, limit: 2 }));

      expect(result.data.map((product) => product.id)).toEqual([5]);
    });

    it('returns no data beyond the last page but keeps the total', () => {
      const result = service.findAll(buildQuery({ page: 10, limit: 2 }));

      expect(result.data).toEqual([]);
      expect(result.total).toBe(5);
    });

    it('paginates the filtered list, not the full list', () => {
      const result = service.findAll(
        buildQuery({ category: 'Electronics', limit: 1 }),
      );

      expect(result.total).toBe(2);
      expect(result.totalPages).toBe(2);
      expect(result.data).toHaveLength(1);
    });
  });

  describe('caching', () => {
    it('serves a repeated query from the cache', () => {
      const first = service.findAll(buildQuery({ page: 1, limit: 2 }));
      const second = service.findAll(buildQuery({ page: 1, limit: 2 }));

      expect(second).toEqual(first);
      expect(findAll).toHaveBeenCalledTimes(1);
    });

    it('does not share cache entries between different queries', () => {
      service.findAll(buildQuery({ page: 1, limit: 2 }));
      service.findAll(buildQuery({ page: 2, limit: 2 }));
      service.findAll(buildQuery({ page: 1, limit: 2, category: 'Food' }));

      expect(findAll).toHaveBeenCalledTimes(3);
    });
  });
});
