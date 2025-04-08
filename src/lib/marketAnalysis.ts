import { fetchGeckoTerminalOhlcv } from './marketData';
import { EMA, RSI, MACD, BollingerBands } from 'technicalindicators';
import { Position } from '@/lib/safetyFeatures'; // Import Position type

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
      fetchGeckoTerminalOhlcv(poolAddress, 'day', 1, DAILY_CANDLE_COUNT),
      fetchGeckoTerminalOhlcv(poolAddress, 'hour', 1, HOURLY_CANDLE_COUNT),
      fetchGeckoTerminalOhlcv(poolAddress, 'minute', 15, FIFTEEN_MIN_CANDLE_COUNT),
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
  // Keep other price arrays if needed for other indicators
  // const highPrices = data.map(d => d.high);
  // const lowPrices = data.map(d => d.low);
  // const openPrices = data.map(d => d.open);
  // const volume = data.map(d => d.volume);

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

  // Return the latest values
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
  const dailyIndicators = calculateIndicators(daily);
  const hourlyIndicators = calculateIndicators(hourly);
  const fifteenMinIndicators = calculateIndicators(fifteenMin);

  console.log("Daily Indicators:", dailyIndicators);
  console.log("Hourly Indicators:", hourlyIndicators);
  console.log("15-Min Indicators:", fifteenMinIndicators);


  // --- Market Condition Logic ---
  let determinedCondition: MarketCondition = 'Unclear'; // Default to Unclear

  // --- Trend Analysis (Daily & Hourly) ---
  const dailyEmaShort = dailyIndicators.latestEmaShort;
  const dailyEmaLong = dailyIndicators.latestEmaLong;
  const hourlyRsi = hourlyIndicators.latestRsi;

  const isDailyTrendingUp = dailyEmaShort && dailyEmaLong && dailyEmaShort > dailyEmaLong;

  // --- Ranging Analysis (Hourly Bollinger Bands & RSI) ---
  const hourlyBbands = hourlyIndicators.latestBbands;
  let isHourlyRanging = false;
  if (hourlyBbands && hourlyRsi) {
      const bandWidth = (hourlyBbands.upper - hourlyBbands.lower) / hourlyBbands.middle;
      if (bandWidth < 0.1 && hourlyRsi > 40 && hourlyRsi < 60) { // Example thresholds
          isHourlyRanging = true;
      }
  }

  // --- Determine Condition ---
  if (isDailyTrendingUp) {
      if (hourlyRsi && hourlyRsi > 50) { // Confirming with RSI > 50
          determinedCondition = 'Uptrend';
      } else {
          determinedCondition = 'Unclear'; // Weak confirmation
      }
  } else if (isHourlyRanging) {
      determinedCondition = 'Ranging';
  } else {
      determinedCondition = 'Unclear'; // Default if not clearly Uptrend or Ranging
  }

  console.log(`Determined Market Condition: ${determinedCondition}`);

  return {
      condition: determinedCondition,
      indicators: { // Pass calculated indicators for strategy checks
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

    console.log("Checking TrendTracker Entry Conditions...");

    // --- Get Indicators ---
    const indicators = analysisResult.indicators;
    const fifteenMinIndicators = calculateIndicators(currentFifteenMinData); // Calculate 15min indicators

    if (!indicators || !indicators.dailyEMA || !indicators.hourlyRSI || !fifteenMinIndicators.latestMacd || !fifteenMinIndicators.latestRsi) {
        console.log("TrendTracker Reject: Missing required indicator data.");
        return false;
    }

    // 1. EMA Crossover Check (Daily) - Already confirmed by 'Uptrend' condition, but double-check
    const isDailyEMACrossedUp = indicators.dailyEMA.short && indicators.dailyEMA.long && indicators.dailyEMA.short > indicators.dailyEMA.long;
    if (!isDailyEMACrossedUp) {
        console.log("TrendTracker Reject: Daily EMA check failed.");
        return false;
    }

    // 2. RSI Check (Hourly & 15-min)
    // Hourly RSI > 50 (already checked in assessMarketStructure for Uptrend condition)
    // 15-min RSI > 50 (confirming short-term momentum)
    if (!indicators.hourlyRSI || indicators.hourlyRSI <= 50) {
         console.log(`TrendTracker Reject: Hourly RSI (${indicators.hourlyRSI}) not > 50.`);
         return false;
    }
     if (!fifteenMinIndicators.latestRsi || fifteenMinIndicators.latestRsi <= 50) {
         console.log(`TrendTracker Reject: 15min RSI (${fifteenMinIndicators.latestRsi}) not > 50.`);
         return false;
     }

    // 3. MACD Check (15-min) - MACD line > signal line
    const macdCheck = fifteenMinIndicators.latestMacd; // Use 15min MACD
    if (!macdCheck || !macdCheck.MACD || !macdCheck.signal || macdCheck.MACD <= macdCheck.signal) {
        console.log("TrendTracker Reject: 15min MACD line not above signal line.");
        return false;
    }

    // 4. Support/Resistance Break Check (Placeholder)
    // TODO: Implement S/R detection (e.g., using pivot points or recent highs/lows on daily/hourly)
    // TODO: Check if current price (e.g., currentFifteenMinData[currentFifteenMinData.length - 1].close) broke above a resistance level
    console.log("TrendTracker S/R Break Check: Placeholder - Not Implemented.");

    // 5. Volume Confirmation (Placeholder)
    // TODO: Implement volume analysis on breakout
    console.log("TrendTracker Volume Check: Placeholder - Not Implemented.");


    // If all implemented checks pass:
    console.log("TrendTracker Entry Conditions Met (Based on available checks).");
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
    // - Optional oscillator confirmation (e.g., Stochastic) - TBD

    console.log("Checking SmartRange Scout Entry Conditions...");

    // --- Condition Checks ---
    // Calculate indicators specifically for the 15-min timeframe provided
    const fifteenMinIndicators = calculateIndicators(currentFifteenMinData);
    const currentPrice = currentFifteenMinData[currentFifteenMinData.length - 1]?.close;
    const bbands = fifteenMinIndicators.latestBbands; // Get latest BBands values { middle, upper, lower, pb }
    const rsi = fifteenMinIndicators.latestRsi; // Get latest RSI value

    if (!currentPrice || !bbands || !rsi) {
        console.log("SmartRange Reject: Insufficient 15min indicator data.");
        return false;
    }

    // 1. Bollinger Band Check: Price near or below lower band
    // Consider adding a small tolerance, e.g., price <= bbands.lower * 1.001
    const isNearLowerBand = currentPrice <= bbands.lower;
    if (!isNearLowerBand) {
        console.log(`SmartRange Reject: Price (${currentPrice.toFixed(4)}) not near lower BB (${bbands.lower.toFixed(4)}).`);
        return false;
    }

    // 2. RSI Check: RSI oversold
    const isRSIOversold = rsi < 35; // Use a configurable threshold?
    if (!isRSIOversold) {
        console.log(`SmartRange Reject: 15min RSI (${rsi.toFixed(2)}) not oversold (< 35).`);
        return false;
    }

    // 3. Support Level Confirmation (Placeholder)
    // TODO: Implement S/R detection based on daily/hourly data
    // TODO: Check if currentPrice is within a tolerance range of a detected support level
    console.log("SmartRange Support Check: Placeholder - Not Implemented.");


    // If all implemented checks pass:
    console.log("SmartRange Scout Entry Conditions Met (Based on available checks).");
    return true; // Allow entry if BB and RSI conditions met (pending S/R)
};

/**
 * Checks if TrendTracker exit conditions are met.
 * @param position The active position.
 * @param analysisResult The result from assessMarketStructure.
 * @param currentFifteenMinData The latest 15-min candle data.
 */
export const checkTrendTrackerExit = (
    position: Position, // Need position info (entry price, etc.)
    analysisResult: AnalysisResult,
    currentFifteenMinData: OhlcvDataPoint[]
): boolean => {
    if (analysisResult.condition === 'Ranging' || analysisResult.condition === 'Unclear') {
        console.log("TrendTracker Exit: Market condition changed from Uptrend.");
        return true; // Exit if market is no longer clearly trending up
    }

    // TODO: Implement specific TrendTracker exit logic
    // - Trailing Stop Loss?
    // - Price crosses below a key EMA (e.g., daily EMA long)?
    // - RSI drops below a certain level (e.g., 50 or 40)?
    // - MACD crossover downwards?

    console.log("Checking TrendTracker Exit Conditions (Placeholder)...");
    return false; // Placeholder - don't exit yet
};

/**
 * Checks if SmartRange Scout exit conditions are met.
 * @param position The active position.
 * @param analysisResult The result from assessMarketStructure.
 * @param currentFifteenMinData The latest 15-min candle data.
 */
export const checkSmartRangeExit = (
    position: Position, // Need position info (entry price, etc.)
    analysisResult: AnalysisResult,
    currentFifteenMinData: OhlcvDataPoint[]
): boolean => {
     if (analysisResult.condition === 'Uptrend' || analysisResult.condition === 'Unclear') {
        console.log("SmartRange Exit: Market condition changed from Ranging.");
        return true; // Exit if market is no longer clearly ranging
    }

    // TODO: Implement specific SmartRange Scout exit logic
    // - Price reaches range high or midpoint (needs range detection)?
    // - RSI becomes overbought (e.g., > 70)?
    // - Price breaks support (handled by SL)?

    console.log("Checking SmartRange Exit Conditions (Placeholder)...");
    return false; // Placeholder - don't exit yet
};
