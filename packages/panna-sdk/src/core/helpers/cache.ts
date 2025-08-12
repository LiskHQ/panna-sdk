import { LRUCache } from 'lru-cache';

const MAX_ITEMS_PER_CACHE = 100;
const DEFAULT_CACHE_TTL_SEC = 6;

const memCachePool = new Map();

interface Cache {
  set(key: string, value: unknown, ttl?: number): Cache;
  get(key: string): unknown;
  has(key: string): boolean;
  delete(key: string): boolean;
  clear(): void;
}

export const newLruMemCache = (
  bank: string = 'default',
  ttlSec: number = DEFAULT_CACHE_TTL_SEC
): Cache => {
  if (!memCachePool.has(bank)) {
    const newCache = new LRUCache({
      max: MAX_ITEMS_PER_CACHE,
      ttl: ttlSec * 1000, // ms
      updateAgeOnGet: true
    });

    memCachePool.set(bank, newCache);
  }

  const cache = memCachePool.get(bank);

  return {
    set: (key, val, ttl) => {
      cache.set(key, val, ttl);
      return cache;
    },
    get: (key) => cache.get(key),
    has: (key) => cache.has(key),
    delete: (key) => cache.delete(key),
    clear: () => cache.clear()
  };
};
