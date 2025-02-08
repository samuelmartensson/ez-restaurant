using Microsoft.Extensions.Caching.Memory;

public class CacheService(IMemoryCache memoryCache)
{
    private readonly IMemoryCache memoryCache = memoryCache;
    private readonly TimeSpan _defaultCacheDuration = TimeSpan.FromMinutes(2);  // Default cache duration

    // Retrieve data from the cache or fetch it if it's not cached
    public T GetOrAdd<T>(string key, Func<T> fetchData, bool use = true)
    {
        if (memoryCache.TryGetValue(key, out T? cachedData) && use)
        {
            // Return cached data if it exists
            return cachedData;
        }
        else
        {
            // Fetch new data if not cached
            var data = fetchData();

            // Cache the new data with an expiration time
            memoryCache.Set(key, data, _defaultCacheDuration);
            return data;
        }
    }

    // Clear cache for a specific key
    public void Remove(string key)
    {
        memoryCache.Remove(key);
    }

    // Clear all cached items (use cautiously)
    public void ClearAll()
    {
        // Note: To clear all, you need to track the keys yourself,
        // or you can manually iterate and remove.
    }
}
