import { LRUCache } from 'lru-cache';

const memPool = new Map();

interface Cache {
  set(key: string, value: unknown, ttl?: number): Cache;
  get(key: string): unknown;
  has(key: string): boolean;
  delete(key: string): boolean;
  clear(): void;
}

export const lruMemCache = (bank: string = 'default'): Cache => {
  if (!memPool.has(bank)) {
    const newCache = new LRUCache({
      max: 100,
      ttl: 2 * 1000,
      updateAgeOnGet: true
    });

    memPool.set(bank, newCache);
  }

  const cache = memPool.get(bank);

  return {
    set: (key, val, ttl) => cache.set(key, val, ttl),
    get: (key) => cache.get(key),
    has: (key) => cache.has(key),
    delete: (key) => cache.delete(key),
    clear: () => cache.clear()
  };
};
