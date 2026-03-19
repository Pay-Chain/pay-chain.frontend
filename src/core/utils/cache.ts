/**
 * Simple in-memory cache with TTL support
 * 
 * @example
 * const cache = new Cache<string>(5 * 60 * 1000) // 5 minutes TTL
 * cache.set('key', 'value')
 * const value = cache.get('key')
 */
export class Cache<T> {
  private cache: Map<string, { value: T; expiry: number }>
  private ttl: number

  constructor(ttl: number = 5 * 60 * 1000) { // Default 5 minutes
    this.cache = new Map()
    this.ttl = ttl
  }

  set(key: string, value: T): void {
    const expiry = Date.now() + this.ttl
    this.cache.set(key, { value, expiry })
  }

  get(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  has(key: string): boolean {
    const item = this.cache.get(key)
    
    if (!item) {
      return false
    }

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  // Get all non-expired keys
  keys(): string[] {
    const now = Date.now()
    const validKeys: string[] = []

    for (const [key, item] of this.cache.entries()) {
      if (now <= item.expiry) {
        validKeys.push(key)
      } else {
        this.cache.delete(key)
      }
    }

    return validKeys
  }

  // Get cache size (only non-expired items)
  size(): number {
    return this.keys().length
  }
}

// Global cache instances
export const apiCache = new Cache(5 * 60 * 1000) // 5 minutes
export const imageCache = new Cache(30 * 60 * 1000) // 30 minutes
export const userCache = new Cache(10 * 60 * 1000) // 10 minutes
