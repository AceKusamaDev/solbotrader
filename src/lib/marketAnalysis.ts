import { fetchGeckoTerminalOhlcv } from './marketData';
import { EMA, RSI, MACD, BollingerBands } from 'technicalindicators';

// Define types (consider moving to a shared types file)
interface OhlcvDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

type MarketCondition = 'Uptrend' | 'Ranging' | 'Unclear';

// Export the interface
export interface AnalysisResult {
  condition: MarketCondition;
  // Add relevant indicator values or signals if needed later
  // Allow for undefined values as indicators might not always calculate
  indicators?: {
    dailyEMA?: { short: number | undefined; long: number | undefined };
    hourlyRSI?: number | undefined;
    // Use ReturnType to correctly infer the MACD output type, allow undefined
    fifteenMinMACD?: ReturnType<typeof MACD['calculate']>[number] | undefined;
    // Add others as needed, allowing undefined
  };
}

// --- Configuration ---
const DAILY_CANDLE_COUNT = 14;
const HOURLY_CANDLE_COUNT = 7 * 24; // 7 days
const FIFTEEN_MIN_CANDLE_COUNT = 24 * 4; // 24 hours

// Indicator Settings (Example - tune these)
const EMA_SHORT_PERIOD = 12;
const EMA_LONG_PERIOD = 26;
const RSI_PERIOD = 14;
const MACD_FAST_PERIOD = 12;
const MACD_SLOW_PERIOD = 26;
const MACD_SIGNAL_PERIOD = 9;
const BBANDS_PERIOD = 20;
const BBANDS_STDDEV = 2;

/**
 * Fetches multi-timeframe data for a given pool address.
 * Handles potential null responses from the fetch function.
 * TODO: Implement proper error handling and retries if needed.
 * TODO: Implement caching.
 */
const fetchAllTimeframes = async (poolAddress: string): Promise<{
  daily: OhlcvDataPoint[] | null;
  hourly: OhlcvDataPoint[] | null;
  fifteenMin: OhlcvDataPoint[] | null;
}> => {
  console.log(`Fetching all timeframes for pool: ${poolAddress}`);
  try {
    // Fetch data concurrently respecting rate limits (limiter is in fetch function)
    const [dailyData, hourlyData, fifteenMinData] = await Promise.all([
      fetchGeckoTerminalOhlcv(poolAddress, 'day', 1, DAILY_CANDLE_COUNT), // Remove undefined network arg
      fetchGeckoTerminalOhlcv(poolAddress, 'hour', 1, HOURLY_CANDLE_COUNT), // Remove undefined network arg
      fetchGeckoTerminalOhlcv(poolAddress, 'minute', 15, FIFTEEN_MIN_CANDLE_COUNT), // Remove undefined network arg
    ]);

    console.log(`Fetched Daily: ${dailyData?.length}, Hourly: ${hourlyData?.length}, 15-Min: ${fifteenMinData?.length}`);

    return {
      daily: dailyData,
      hourly: hourlyData,
      fifteenMin: fifteenMinData,
    };
  } catch (error) {
    console.error("Error fetching multi-timeframe data:", error);
    return { daily: null, hourly: null, fifteenMin: null };
  }
};

/**
 * Calculates indicators based on OHLCV data.
 * Requires data to be sorted oldest to newest.
 */
const calculateIndicators = (data: OhlcvDataPoint[]) => {
  if (!data || data.length === 0) {
    return {}; // Return empty object if no data
  }

  const closePrices = data.map(d => d.close);
  const highPrices = data.map(d => d.high);
  const lowPrices = data.map(d => d.low);
  const openPrices = data.map(d => d.open);
  const volume = data.map(d => d.volume);

  // Ensure enough data points for calculations
  const indicators = {
    emaShort: closePrices.length >= EMA_SHORT_PERIOD ? EMA.calculate({ period: EMA_SHORT_PERIOD, values: closePrices }) : [],
    emaLong: closePrices.length >= EMA_LONG_PERIOD ? EMA.calculate({ period: EMA_LONG_PERIOD, values: closePrices }) : [],
    rsi: closePrices.length >= RSI_PERIOD ? RSI.calculate({ period: RSI_PERIOD, values: closePrices }) : [],
    macd: closePrices.length >= MACD_SLOW_PERIOD ? MACD.calculate({
      values: closePrices,
      fastPeriod: MACD_FAST_PERIOD,
      slowPeriod: MACD_SLOW_PERIOD,
      signalPeriod: MACD_SIGNAL_PERIOD,
      SimpleMAOscillator: false, // Use EMA for MACD
      SimpleMASignal: false,   // Use EMA for Signal line
    }) : [],
    bbands: closePrices.length >= BBANDS_PERIOD ? BollingerBands.calculate({
        period: BBANDS_PERIOD,
        values: closePrices,
        stdDev: BBANDS_STDDEV
    }) : [],
    // Add other indicators as needed
  };

  // Return the latest values or the full series as needed
  return {
     latestEmaShort: indicators.emaShort[indicators.emaShort.length - 1],
     latestEmaLong: indicators.emaLong[indicators.emaLong.length - 1],
     latestRsi: indicators.rsi[indicators.rsi.length - 1],
     latestMacd: indicators.macd[indicators.macd.length - 1], // MACD object { MACD, signal, histogram }
     latestBbands: indicators.bbands[indicators.bbands.length - 1], // BBands object { middle, upper, lower, pb }
  };
};


/**
 * Assesses the market structure based on multi-timeframe data and indicators.
 * This is the core logic that needs careful implementation based on the strategy.
 *
 * @param poolAddress The pool address to analyze.
 * @returns Promise resolving to the determined market condition.
 */
export const assessMarketStructure = async (poolAddress: string): Promise<AnalysisResult> => {
  const { daily, hourly, fifteenMin } = await fetchAllTimeframes(poolAddress);

  // --- Basic Checks ---
  if (!daily || !hourly || !fifteenMin || daily.length < DAILY_CANDLE_COUNT || hourly.length < 2 || fifteenMin.length < 2) {
     console.warn("Insufficient data for market analysis.");
     return { condition: 'Unclear' };
  }

  // --- Calculate Indicators ---
  // Note: Ensure data is sorted oldest to newest before passing to indicators
  const dailyIndicators = calculateIndicators(daily);
  const hourlyIndicators = calculateIndicators(hourly);
  const fifteenMinIndicators = calculateIndicators(fifteenMin);

  console.log("Daily Indicators:", dailyIndicators);
  console.log("Hourly Indicators:", hourlyIndicators);
  console.log("15-Min Indicators:", fifteenMinIndicators);


  // --- Market Condition Logic (Placeholder - Needs Implementation) ---
  // This is where the core logic from Task 1c goes.
  // Analyze trends, S/R, indicator confirmations across timeframes.

  let determinedCondition: MarketCondition = 'Unclear';

  // Example Placeholder Logic:
  // 1. Check Daily Trend (e.g., using EMAs)
  const dailyTrendUp = dailyIndicators.latestEmaShort && dailyIndicators.latestEmaLong && dailyIndicators.latestEmaShort > dailyIndicators.latestEmaLong;
  const dailyTrendDown = dailyIndicators.latestEmaShort && dailyIndicators.latestEmaLong && dailyIndicators.latestEmaShort < dailyIndicators.latestEmaLong;

  // 2. Check Hourly Confirmation (e.g., RSI > 50 for uptrend)
  const hourlyConfirmUp = hourlyIndicators.latestRsi && hourlyIndicators.latestRsi > 55;
  const hourlyConfirmDown = hourlyIndicators.latestRsi && hourlyIndicators.latestRsi < 45;

  // 3. Check for Ranging (e.g., Bollinger Bands relatively narrow on hourly/daily?)
  //    This requires more complex logic (e.g., band width calculation)

  if (dailyTrendUp && hourlyConfirmUp) {
      determinedCondition = 'Uptrend';
  } else if (dailyTrendDown && hourlyConfirmDown) {
      // We don't have a downtrend strategy yet, but could identify it
      determinedCondition = 'Unclear'; // Or 'Downtrend' if needed later
  } else {
      // Add ranging detection logic here
      // If not clearly trending, assume ranging or unclear for now
      // Example: Check if price is oscillating between BBands on hourly
      const hourlyPrice = hourly[hourly.length - 1].close;
      const hourlyBbands = hourlyIndicators.latestBbands;
      if (hourlyBbands && hourlyPrice < hourlyBbands.upper && hourlyPrice > hourlyBbands.lower) {
          // Potentially ranging, but needs more confirmation (e.g., RSI near 50)
          if (hourlyIndicators.latestRsi && hourlyIndicators.latestRsi > 40 && hourlyIndicators.latestRsi < 60) {
              determinedCondition = 'Ranging';
          }
      }
  }

  console.log(`Determined Market Condition: ${determinedCondition}`);

  return {
      condition: determinedCondition,
      // Optionally return key indicator values used for the decision
      indicators: {
          dailyEMA: { short: dailyIndicators.latestEmaShort, long: dailyIndicators.latestEmaLong },
          hourlyRSI: hourlyIndicators.latestRsi,
          fifteenMinMACD: fifteenMinIndicators.latestMacd,
      }
   };
};

// --- Strategy Execution Logic (To be called from BotControl) ---

/**
 * Checks if TrendTracker entry conditions are met.
 * @param analysisResult The result from assessMarketStructure.
 * @param currentFifteenMinData The latest 15-min candle data.
 */
export const checkTrendTrackerEntry = (
    analysisResult: AnalysisResult,
    currentFifteenMinData: OhlcvDataPoint[]
): boolean => {
    if (analysisResult.condition !== 'Uptrend') return false;

    // TODO: Implement specific TrendTracker entry logic based on Task 1c/1e
    // - EMA crossovers (using analysisResult.indicators.dailyEMA?)
    // - RSI + MACD alignment (using hourly/15min indicators?)
    // - SR breaks with volume (needs S/R detection + volume analysis)

    console.log("Checking TrendTracker Entry Conditions (Placeholder)...");
    // Placeholder: Return true for now if condition is Uptrend
    return true;
};

/**
 * Checks if SmartRange Scout entry conditions are met.
 * @param analysisResult The result from assessMarketStructure.
 * @param currentFifteenMinData The latest 15-min candle data.
 */
export const checkSmartRangeEntry = (
    analysisResult: AnalysisResult,
    currentFifteenMinData: OhlcvDataPoint[]
): boolean => {
    if (analysisResult.condition !== 'Ranging') return false;

    // TODO: Implement specific SmartRange Scout entry logic based on Task 1c/1e
    // - Bollinger/RSI oversold at support (needs S/R detection + BBands/RSI values)
    // - Optional oscillator confirmation

    console.log("Checking SmartRange Scout Entry Conditions (Placeholder)...");
     // Placeholder: Check if 15min RSI is oversold
     const fifteenMinIndicators = calculateIndicators(currentFifteenMinData);
     if (fifteenMinIndicators.latestRsi && fifteenMinIndicators.latestRsi < 35) { // Example threshold
         console.log("SmartRange Scout: 15min RSI oversold condition met.");
         return true;
     }

    return false;
};
