import { InMemoryCacheService } from './in-memory-cache.service';

describe('InMemoryCacheService', () => {
  let cache: InMemoryCacheService;

  beforeEach(() => {
    cache = new InMemoryCacheService();
  });

  it('returns undefined for an unknown key', () => {
    expect(cache.get('unknown')).toBeUndefined();
  });

  it('returns the value stored under a key', () => {
    cache.set('key', { value: 42 });

    expect(cache.get('key')).toEqual({ value: 42 });
  });

  it('overwrites the value when the same key is set twice', () => {
    cache.set('key', 'first');
    cache.set('key', 'second');

    expect(cache.get('key')).toBe('second');
  });

  it('keeps values of different keys independent', () => {
    cache.set('a', 1);
    cache.set('b', 2);

    expect(cache.get('a')).toBe(1);
    expect(cache.get('b')).toBe(2);
  });

  it('removes every entry on clear', () => {
    cache.set('a', 1);
    cache.set('b', 2);

    cache.clear();

    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBeUndefined();
  });
});
