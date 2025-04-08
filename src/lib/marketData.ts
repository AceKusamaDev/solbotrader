import { RateLimiter } from 'limiter';

// --- Interfaces ---
// Example structure - adjust based on actual API response
interface OhlcvDataPoint {
  timestamp: number; // Unix timestamp (seconds)
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Structure for search results (adjust based on actual API response)
interface PoolSearchResult {
    id: string; // Pool address
    type: string; // Should be 'pool'
    attributes: {
        name: string; // e.g., "SOL / USDC"
        address: string; // Pool address again
        base_token_price_usd: string;
        quote_token_price_usd: string;
        // Add other relevant fields if needed
    };
    relationships?: { // Optional relationships to get token addresses
        base_token: { data: { id: string } };
        quote_token: { data: { id: string } };
    };
}

// Define timeframe types supported by GeckoTerminal API
type GeckoTerminalTimeframe = 'day' | 'hour' | 'minute';

// Define aggregate values based on timeframe
const TIMEFRAME_AGGREGATES = {
  day: 1,
  hour: [1, 4, 12], // Example aggregates for hourly
  minute: [1, 5, 15], // Example aggregates for minute
};

// Rate limiter: 30 requests per minute (GeckoTerminal free tier limit)
const limiter = new RateLimiter({ tokensPerInterval: 30, interval: 'minute' });

// Base URL for GeckoTerminal API v2
const GECKO_TERMINAL_API_BASE = 'https://api.geckoterminal.com/api/v2';

// --- Caching ---
// Simple in-memory cache for pool addresses { pairString: poolAddress }
const poolAddressCache = new Map<string, string>();
const CACHE_DURATION_MS = 60 * 60 * 1000; // Cache for 1 hour

// --- Functions ---

/**
 * Searches for a pool address on GeckoTerminal for a given pair string (e.g., "SOL/USDC").
 * Uses caching to avoid redundant searches.
 * Handles rate limiting.
 *
 * @param pairString The trading pair (e.g., "SOL/USDC").
 * @param network Solana network ('solana').
 * @returns Promise resolving to the pool address string or null if not found or error.
 */
export const findPoolAddress = async (
    pairString: string,
    network: string = 'solana'
): Promise<string | null> => {
    const cacheKey = `${network}:${pairString}`;
    const cached = poolAddressCache.get(cacheKey);
    if (cached) {
        console.log(`Cache hit for pool address: ${pairString}`);
        return cached;
    }

    console.log(`Searching for pool address for pair: ${pairString}`);
    // Wait for rate limiter token
    await limiter.removeTokens(1);

    const params = new URLSearchParams({
        query: pairString,
        network: network,
        include: 'base_token,quote_token', // Include token info if needed
        page: '1',
    });

    const url = `${GECKO_TERMINAL_API_BASE}/search/pools?${params.toString()}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`GeckoTerminal Search API error: ${response.status} ${response.statusText}`);
             try {
               const errorData = await response.json();
               console.error('GeckoTerminal Search error details:', errorData);
             } catch (e) { /* Ignore */ }
            return null;
        }

        const results = await response.json();

        // Find the most relevant pool (e.g., first result, or filter by DEX/liquidity later)
        const pool = results?.data?.find((item: PoolSearchResult) => item.type === 'pool');

        if (pool && pool.attributes?.address) {
            const poolAddress = pool.attributes.address;
            console.log(`Found pool address for ${pairString}: ${poolAddress}`);
            // Cache the result
            poolAddressCache.set(cacheKey, poolAddress);
            // Set timeout to clear cache entry after duration
            setTimeout(() => {
                poolAddressCache.delete(cacheKey);
                console.log(`Cache expired for pool address: ${pairString}`);
            }, CACHE_DURATION_MS);
            return poolAddress;
        } else {
            console.warn(`Pool address not found for pair: ${pairString}`);
            return null;
        }

    } catch (error: any) {
        console.error(`Error searching for pool address for ${pairString}:`, error.message);
        return null;
    }
};


/**
 * Fetches historical OHLCV data for a given Solana pool address from GeckoTerminal.
 * Handles rate limiting.
 *
 * @param poolAddress The pool address on Solana.
 * @param timeframe The candle timeframe ('day', 'hour', 'minute').
 * @param aggregate The aggregation period (e.g., 1 for daily, 1/5/15 for minutely).
 * @param limit Max number of data points (default 100, max 1000).
 * @param beforeTimestamp Fetch data before this Unix timestamp (seconds) for pagination.
 * @returns Promise resolving to an array of OHLCV data points or null on error.
 */
export const fetchGeckoTerminalOhlcv = async (
  poolAddress: string, // Network is assumed 'solana' now
  timeframe: GeckoTerminalTimeframe,
  aggregate: number,
  limit: number = 100,
  beforeTimestamp?: number
): Promise<OhlcvDataPoint[] | null> => {
  // Validate aggregate based on timeframe
  if (
    (timeframe === 'day' && aggregate !== 1) ||
    (timeframe === 'hour' && !TIMEFRAME_AGGREGATES.hour.includes(aggregate)) ||
    (timeframe === 'minute' && !TIMEFRAME_AGGREGATES.minute.includes(aggregate))
  ) {
    console.error(`Invalid aggregate value ${aggregate} for timeframe ${timeframe}`);
    return null;
  }

  // Wait for rate limiter token
  await limiter.removeTokens(1);

  const params = new URLSearchParams({
    aggregate: aggregate.toString(),
    limit: limit.toString(),
    currency: 'usd', // Fetch prices in USD
  });

  if (beforeTimestamp) {
    params.append('before_timestamp', beforeTimestamp.toString());
  }

  const network = 'solana'; // Hardcode network for this function
  const url = `${GECKO_TERMINAL_API_BASE}/networks/${network}/pools/${poolAddress}/ohlcv/${timeframe}?${params.toString()}`;

  // console.log(`Fetching GeckoTerminal OHLCV: ${url}`); // Reduce logging verbosity

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json;version=20240314' // Specify API version if needed
      }
    });

    if (!response.ok) {
      console.error(`GeckoTerminal API error: ${response.status} ${response.statusText}`);
      try {
        const errorData = await response.json();
        console.error('GeckoTerminal error details:', errorData);
      } catch (e) { /* Ignore if error response is not JSON */ }
      return null;
    }

    const data = await response.json();

    // Extract the OHLCV list - structure might vary, check API docs
    const ohlcvList = data?.data?.attributes?.ohlcv_list;

    if (!Array.isArray(ohlcvList)) {
      console.error('Unexpected API response structure:', data);
      return null;
    }

    // Format the data (assuming [timestamp, open, high, low, close, volume])
    const formattedData: OhlcvDataPoint[] = ohlcvList.map((candle: number[]) => ({
      timestamp: candle[0],
      open: candle[1],
      high: candle[2],
      low: candle[3],
      close: candle[4],
      volume: candle[5],
    }));

    // Return in ascending order (oldest first) if needed by indicators
    return formattedData.reverse();

  } catch (error: any) {
    console.error('Error fetching GeckoTerminal OHLCV:', error.message);
    return null;
  }
};

// TODO: Implement caching mechanism (e.g., using localStorage or a simple in-memory cache)
// TODO: Implement function to fetch data for multiple required timeframes respecting rate limits
// Example: fetchMultiTimeframeData(poolAddress, ['14d', '7d_hourly', '24h_15min'])
