import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { PRODUCTS } from './products.data';

@Injectable()
export class ProductsRepository {
  findAll(): Product[] {
    return PRODUCTS;
  }
}
