import { Redis } from '@upstash/redis';

// Only instantiate Redis if the environment variables are present.
// This allows the build to pass locally even if Upstash isn't configured yet.
export const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
export const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis = (redisUrl && redisToken) 
  ? new Redis({
      url: redisUrl,
      token: redisToken,
    })
  : null;

/**
 * Fallback memory cache for local testing / development
 * if Upstash is not fully configured.
 */
const localMemoryCache = new Map<string, any>();

export async function getCachedData<T>(key: string, fetchFn: () => Promise<T>, ttlSeconds: number = 30): Promise<T> {
  // If Redis is configured, use it for global Edge caching
  if (redis) {
    const cached = await redis.get<T>(key);
    if (cached) return cached;
    
    // Cache miss, fetch fresh data
    const freshData = await fetchFn();
    await redis.setex(key, ttlSeconds, freshData);
    return freshData;
  }
  
  // Fallback to local memory map
  if (localMemoryCache.has(key)) {
    return localMemoryCache.get(key) as T;
  }
  const freshData = await fetchFn();
  localMemoryCache.set(key, freshData);
  setTimeout(() => localMemoryCache.delete(key), ttlSeconds * 1000); // Expiration
  return freshData;
}
