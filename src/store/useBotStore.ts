import { create } from 'zustand';
import { Position } from '@/lib/safetyFeatures'; // Assuming Position is defined here

// Define types for state
type BotStatus = 'stopped' | 'running' | 'analyzing' | 'error';
type MarketCondition = 'Uptrend' | 'Ranging' | 'Unclear';
type StrategyType = 'TrendTracker' | 'SmartRange Scout';

// Export the Trade interface
export interface Trade {
  id: string;
  timestamp: string;
  pair: string;
  action: 'buy' | 'sell';
  amount: number;
  price: number; // Ensure price is number
  strategy: string;
  success: boolean;
  signature?: string;
  error?: string;
  pnl?: number; // Optional PnL for closed trades
}

interface BotSettings {
  strategyType: StrategyType;
  amount: number;
  pair: string; // e.g., "SOL/USDC"
  stopLossPercentage: number; // User-defined SL
  takeProfitPercentage: number; // User-defined TP
  maxRuns: number; // Max number of trade cycles (entry + exit)
  runIntervalMinutes: number; // Interval between runs
  compoundCapital: boolean; // Reinvest profits
  isTestMode: boolean;
  action: 'buy' | 'sell'; // Add the action field
}

interface BotState {
  status: BotStatus;
  settings: BotSettings;
  marketCondition: MarketCondition;
  activePositions: Position[];
  tradeHistory: Trade[];
  currentRun: number;
  lastAnalysisTime: number | null;
  errorMessage: string | null;

  // Actions
  setSettings: (newSettings: Partial<BotSettings>) => void;
  startBot: () => void;
  stopBot: () => void;
  setAnalyzing: () => void;
  setRunning: () => void;
  setError: (message: string) => void;
  setMarketCondition: (condition: MarketCondition) => void;
  addPosition: (position: Position) => void;
  removePosition: (positionId: string) => void;
  updatePositionPrice: (positionId: string, currentPrice: number) => void; // For PnL calculation
  addTradeHistory: (trade: Trade) => void;
  incrementRun: () => void;
  resetRuns: () => void;
  setLastAnalysisTime: (time: number) => void;
  toggleTestMode: () => void;
}

// Define the store
const useBotStore = create<BotState>((set, get) => ({
  status: 'stopped',
  settings: {
    strategyType: 'TrendTracker',
    amount: 0.1, // Default amount
    pair: 'SOL/USDC',
    stopLossPercentage: 2.5, // Default SL
    takeProfitPercentage: 5, // Default TP
    maxRuns: 1, // Default runs
    runIntervalMinutes: 5, // Default interval
    compoundCapital: false, // Default compounding
    isTestMode: true, // Default to test mode
    action: 'buy', // Default action
  },
  marketCondition: 'Unclear',
  activePositions: [],
  tradeHistory: [],
  currentRun: 0,
  lastAnalysisTime: null,
  errorMessage: null,

  // --- Actions ---
  setSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),

  startBot: () => set({ status: 'analyzing', currentRun: 0, errorMessage: null }), // Start in analyzing state

  stopBot: () => set({ status: 'stopped', errorMessage: null }),

  setAnalyzing: () => set({ status: 'analyzing' }),

  setRunning: () => set({ status: 'running' }),

  setError: (message) => set({ status: 'error', errorMessage: message }),

  setMarketCondition: (condition) => set({ marketCondition: condition }),

  addPosition: (position) =>
    set((state) => ({
      activePositions: [...state.activePositions, position],
    })),

  removePosition: (positionId) =>
    set((state) => ({
      activePositions: state.activePositions.filter((p) => p.id !== positionId),
    })),

  // Basic update for PnL - might need refinement based on Position structure
  updatePositionPrice: (positionId, currentPrice) =>
    set((state) => ({
      activePositions: state.activePositions.map((p) =>
        p.id === positionId ? { ...p, /* currentPrice: currentPrice */ } : p // Placeholder for actual update logic if needed
      ),
    })),

  addTradeHistory: (trade) =>
    set((state) => ({
      // Keep only the latest, e.g., 50 trades
      tradeHistory: [trade, ...state.tradeHistory].slice(0, 50),
    })),

  incrementRun: () => set((state) => ({ currentRun: state.currentRun + 1 })),

  resetRuns: () => set({ currentRun: 0 }),

  setLastAnalysisTime: (time) => set({ lastAnalysisTime: time }),

  toggleTestMode: () =>
    set((state) => {
      if (state.status !== 'stopped') {
        console.warn('Cannot change test mode while bot is running.');
        return {}; // Prevent changing mode while running
      }
      return { settings: { ...state.settings, isTestMode: !state.settings.isTestMode } };
    }),
}));

export default useBotStore;
