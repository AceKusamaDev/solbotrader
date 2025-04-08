'use client';

// Safety features for the SolBotX trading bot
export interface Position {
  id: string;
  pair: string;
  entryPrice: number;
  amount: number;
  timestamp: string;
  action: 'buy' | 'sell';
}

export interface StopLossConfig {
  enabled: boolean;
  percentage: number; // Percentage drop/rise that triggers stop loss
}

export interface TakeProfitConfig {
    enabled: boolean;
    percentage: number; // Percentage rise/drop that triggers take profit
}

// Default stop loss configuration
export const DEFAULT_STOP_LOSS_CONFIG: StopLossConfig = {
  enabled: true, // Defaulting to true based on previous code, consider making it false
  percentage: 2.5
};

// Default take profit configuration
export const DEFAULT_TAKE_PROFIT_CONFIG: TakeProfitConfig = {
    enabled: true, // Defaulting to true, consider making it false
    percentage: 5.0
};


// Check if stop loss should be triggered
export const checkStopLoss = (
  position: Position,
  currentPrice: number,
  stopLossConfig: StopLossConfig // Require config to be passed
): boolean => {
  if (!stopLossConfig.enabled || !currentPrice) {
    return false;
  }

  // For long positions (buy), trigger stop loss if price drops below threshold
  if (position.action === 'buy') {
    const stopLossThreshold = position.entryPrice * (1 - stopLossConfig.percentage / 100);
    return currentPrice <= stopLossThreshold;
  }

  // For short positions (sell), trigger stop loss if price rises above threshold
  if (position.action === 'sell') {
    const stopLossThreshold = position.entryPrice * (1 + stopLossConfig.percentage / 100);
    return currentPrice >= stopLossThreshold;
  }

  return false;
};

// Check if take profit should be triggered
export const checkTakeProfit = (
    position: Position,
    currentPrice: number,
    takeProfitConfig: TakeProfitConfig // Require config to be passed
): boolean => {
    if (!takeProfitConfig.enabled || !currentPrice) {
        return false;
    }

    // For long positions (buy), trigger take profit if price rises above threshold
    if (position.action === 'buy') {
        const takeProfitThreshold = position.entryPrice * (1 + takeProfitConfig.percentage / 100);
        return currentPrice >= takeProfitThreshold;
    }

    // For short positions (sell), trigger take profit if price drops below threshold
    if (position.action === 'sell') {
        const takeProfitThreshold = position.entryPrice * (1 - takeProfitConfig.percentage / 100);
        return currentPrice <= takeProfitThreshold;
    }

    return false;
};


// Format stop loss message
export const formatStopLossMessage = (
  position: Position,
  currentPrice: number,
  stopLossConfig: StopLossConfig // Require config
): string => {
  const direction = position.action === 'buy' ? 'dropped' : 'increased';
  const threshold = position.action === 'buy'
    ? position.entryPrice * (1 - stopLossConfig.percentage / 100)
    : position.entryPrice * (1 + stopLossConfig.percentage / 100);

  return `Stop loss triggered for ${position.pair}: Price ${direction} to ${currentPrice.toFixed(4)} (${stopLossConfig.percentage}% from entry ${position.entryPrice.toFixed(4)})`;
};

// Format take profit message
export const formatTakeProfitMessage = (
    position: Position,
    currentPrice: number,
    takeProfitConfig: TakeProfitConfig // Require config
): string => {
    const direction = position.action === 'buy' ? 'increased' : 'dropped';
    const threshold = position.action === 'buy'
        ? position.entryPrice * (1 + takeProfitConfig.percentage / 100)
        : position.entryPrice * (1 - takeProfitConfig.percentage / 100);

    return `Take profit triggered for ${position.pair}: Price ${direction} to ${currentPrice.toFixed(4)} (${takeProfitConfig.percentage}% from entry ${position.entryPrice.toFixed(4)})`;
};


// Calculate potential loss at stop loss point (might not be needed)
export const calculatePotentialLoss = (
  position: Position,
  stopLossConfig: StopLossConfig
): number => {
  const stopLossPrice = position.action === 'buy'
    ? position.entryPrice * (1 - stopLossConfig.percentage / 100)
    : position.entryPrice * (1 + stopLossConfig.percentage / 100);

  const loss = position.action === 'buy'
    ? (stopLossPrice - position.entryPrice) * position.amount
    : (position.entryPrice - stopLossPrice) * position.amount;

  return Math.abs(loss);
};

// Calculate potential profit at take profit point (might not be needed)
export const calculatePotentialProfit = (
    position: Position,
    takeProfitConfig: TakeProfitConfig
): number => {
    const takeProfitPrice = position.action === 'buy'
        ? position.entryPrice * (1 + takeProfitConfig.percentage / 100)
        : position.entryPrice * (1 - takeProfitConfig.percentage / 100);

    const profit = position.action === 'buy'
        ? (takeProfitPrice - position.entryPrice) * position.amount
        : (position.entryPrice - takeProfitPrice) * position.amount;

    return profit; // Profit can be positive or negative if TP is set aggressively
};
