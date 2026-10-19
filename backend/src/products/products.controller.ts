import { Controller, Get, Query } from '@nestjs/common';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
import { PaginatedProductsDto } from './dto/paginated-products.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: GetProductsQueryDto): PaginatedProductsDto {
    return this.productsService.findAll(query);
  }
}
