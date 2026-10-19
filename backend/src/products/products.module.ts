import { Module } from '@nestjs/common';
import { ProductsRepository } from './repositories/products.repository';
import { CacheModule } from '../common/cache/cache.module';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

@Module({
  providers: [ProductsRepository, ProductsService],
  imports: [CacheModule],
  controllers: [ProductsController],
})
export class ProductsModule {}
