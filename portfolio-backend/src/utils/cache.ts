type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

class InMemoryCache<T> {
  private cache: CacheEntry<T> | null = null;
  private ttl: number;

  constructor(ttlSeconds: number) {
    this.ttl = ttlSeconds * 1000;
  }

  get(): T | null {
    if (!this.cache) return null;

    const isExpired = Date.now() - this.cache.timestamp > this.ttl;
    if (isExpired) {
      this.cache = null;
      return null;
    }

    return this.cache.data;
  }

  set(data: T) {
    this.cache = {
      data,
      timestamp: Date.now(),
    };
  }

  clear() {
    this.cache = null;
  }
}

export default InMemoryCache;
