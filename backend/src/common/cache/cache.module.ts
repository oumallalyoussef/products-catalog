import { Module } from '@nestjs/common';
import { InMemoryCacheService } from './in-memory-cache.service';
import { CACHE_SERVICE } from './cache.constants';

@Module({
  providers: [{ provide: CACHE_SERVICE, useClass: InMemoryCacheService }],
  exports: [CACHE_SERVICE],
})
export class CacheModule {}
