import { Injectable } from '@nestjs/common';
import { ICacheService } from './cache.interface';

@Injectable()
export class InMemoryCacheService implements ICacheService {
  private readonly store = new Map<string, unknown>();

  get<T>(key: string): T | undefined {
    return this.store.get(key) as T | undefined;
  }

  set<T>(key: string, value: T): void {
    this.store.set(key, value);
  }

  clear(): void {
    this.store.clear();
  }
}
