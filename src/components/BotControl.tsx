'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
// Import safety features (including TP types/functions now)
import {
    Position,
    StopLossConfig, checkStopLoss, formatStopLossMessage,
    TakeProfitConfig, checkTakeProfit, formatTakeProfitMessage // Ensure TP imports are here
} from '@/lib/safetyFeatures';
import useJupiterTrading, { SOL_MINT, USDC_MINT } from '@/lib/jupiter';
import useBotStore, { Trade } from '@/store/useBotStore'; // Import Zustand store and Trade type
// Import market data and analysis functions
import { findPoolAddress, fetchGeckoTerminalOhlcv } from '@/lib/marketData'; // Import fetch function
import {
    assessMarketStructure,
    checkTrendTrackerEntry,
    checkSmartRangeEntry,
    checkTrendTrackerExit, // Import exit check
    checkSmartRangeExit,  // Import exit check
    AnalysisResult // Import AnalysisResult type
} from '@/lib/marketAnalysis';


// BotControl component refactored to use Zustand store
const BotControl = () => {
  // Local state for UI feedback or component-specific logic
  const [stopLossTriggeredUI, setStopLossTriggeredUI] = useState(false);
  const [stopLossMessageUI, setStopLossMessageUI] = useState('');
  const tradingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isProcessingTrade, setIsProcessingTrade] = useState(false); // Local STATE for disabling buttons during trade (UI feedback)
  const isProcessingRef = useRef(false); // Ref to track actual processing lock (prevents loops)
  const [currentPoolAddress, setCurrentPoolAddress] = useState<string | null>(null); // Cache pool address
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null); // Store last analysis

  // --- Get state and actions from Zustand store ---
  const {
    status, settings, activePositions, tradeHistory, errorMessage,
    stopBot: storeStopBot, toggleTestMode: storeToggleTestMode,
    addPosition, removePosition, addTradeHistory, setError, setMarketCondition,
    setSettings: updateSettingsInStore, // Rename destructured action
  } = useBotStore((state) => ({
      status: state.status,
      settings: state.settings,
      activePositions: state.activePositions,
      tradeHistory: state.tradeHistory,
      errorMessage: state.errorMessage,
      // Select only needed actions
      stopBot: state.stopBot,
      toggleTestMode: state.toggleTestMode,
      addPosition: state.addPosition,
      removePosition: state.removePosition,
      addTradeHistory: state.addTradeHistory,
      setError: state.setError,
      setMarketCondition: state.setMarketCondition,
      setSettings: state.setSettings, // Add setSettings action
  }));

  // Destructure settings for easier access
  const {
    isTestMode, stopLossPercentage, takeProfitPercentage, maxRuns,
    runIntervalMinutes, compoundCapital, strategyType, amount, pair, action,
  } = settings;

  // Get wallet context
  const { publicKey, connected: isWalletConnected, sendTransaction } = useWallet();
  // Get Jupiter trading function
  const { executeTradeWithStrategy } = useJupiterTrading();

  // Ref to track mount status
  const isMountedRef = useRef(true);
  useEffect(() => {
      isMountedRef.current = true;
      return () => { isMountedRef.current = false; };
  }, []);


  // --- Core Logic Functions (useCallback for stability) ---

  const fetchCurrentPrice = useCallback(async (fetchPair: string): Promise<number | null> => {
    // Use local state for pool address cache
    const poolAddressToUse = currentPoolAddress ?? await findPoolAddress(fetchPair);
    if (!poolAddressToUse) {
        console.error(`Cannot fetch price for ${fetchPair}, pool address unknown.`);
        setError(`Pool address unknown for ${fetchPair}`);
        return null;
    }
    // Update local state only if it changed
    if (poolAddressToUse !== currentPoolAddress && isMountedRef.current) {
        setCurrentPoolAddress(poolAddressToUse);
    }

    try {
        const latestCandleData = await fetchGeckoTerminalOhlcv(poolAddressToUse, 'minute', 1, 1);
        const price = latestCandleData?.[0]?.close;
        if (typeof price === 'number') {
            return price;
        } else {
            console.warn(`Could not get latest close price for ${fetchPair} from GeckoTerminal.`);
            return null;
        }
    } catch (error: any) {
      console.error(`Error fetching current price for ${fetchPair} from GeckoTerminal:`, error.message);
      setError(`Failed to fetch price: ${error.message}`);
      return null;
    }
  }, [currentPoolAddress, setError]); // Dependency on local state cache

  const handleStopLoss = useCallback(async (position: Position, currentPrice: number): Promise<boolean> => {
    const latestSettings = useBotStore.getState().settings; // Get fresh settings
    const config: StopLossConfig = { enabled: true, percentage: latestSettings.stopLossPercentage };
    if (!checkStopLoss(position, currentPrice, config)) return false;

    const message = formatStopLossMessage(position, currentPrice, config);
    console.log(`STOP LOSS TRIGGERED: ${message}`);
    if (isMountedRef.current) {
        setStopLossTriggeredUI(true);
        setStopLossMessageUI(message);
    }

    if (!latestSettings.isTestMode) {
      if (isProcessingRef.current) return false;
      isProcessingRef.current = true;
      if (isMountedRef.current) setIsProcessingTrade(true);
      try {
        const exitAction = position.action === 'buy' ? 'sell' : 'buy';
        // Use 6 decimals for USDC amount
        const amountInSmallestUnit = (position.amount * Math.pow(10, 6)).toString();

        const result = await executeTradeWithStrategy(
          position.action === 'buy' ? SOL_MINT : USDC_MINT,
          position.action === 'buy' ? USDC_MINT : SOL_MINT,
          amountInSmallestUnit, 0.5, 'Stop Loss',
          publicKey, sendTransaction, publicKey?.toBase58() || null
        );
        if (result.success) {
          const exitTrade: Trade = { id: `sl-${Date.now()}`, timestamp: new Date().toISOString(), pair: position.pair, action: exitAction, amount: position.amount, price: currentPrice, strategy: 'Stop Loss', success: true, signature: result.signature };
          addTradeHistory(exitTrade);
          removePosition(position.id);
        } else { setError(`Stop loss trade failed: ${result.error}`); }
      } catch (error: any) { setError(`Error executing stop loss: ${error.message}`); }
      finally {
          isProcessingRef.current = false;
          if (isMountedRef.current) setIsProcessingTrade(false);
      }
    } else {
      const exitAction = position.action === 'buy' ? 'sell' : 'buy';
      const exitTrade: Trade = { id: `sl-sim-${Date.now()}`, timestamp: new Date().toISOString(), pair: position.pair, action: exitAction, amount: position.amount, price: currentPrice, strategy: 'Stop Loss', success: true, signature: 'simulated_stop_loss_' + Math.random().toString(36).substring(2, 9) };
      addTradeHistory(exitTrade);
      removePosition(position.id);
    }
    return true;
  }, [publicKey, sendTransaction, executeTradeWithStrategy, addTradeHistory, removePosition, setError, isMountedRef]); // Added isMountedRef

  const handleTakeProfit = useCallback(async (position: Position, currentPrice: number): Promise<boolean> => {
    const latestSettings = useBotStore.getState().settings; // Get fresh settings
    const config: TakeProfitConfig = { enabled: true, percentage: latestSettings.takeProfitPercentage };
    if (!checkTakeProfit(position, currentPrice, config)) return false;

    const message = formatTakeProfitMessage(position, currentPrice, config);
    console.log(`TAKE PROFIT TRIGGERED: ${message}`);
    // No specific UI state for TP needed currently

    if (!latestSettings.isTestMode) {
      if (isProcessingRef.current) return false;
      isProcessingRef.current = true;
      if (isMountedRef.current) setIsProcessingTrade(true);
      try {
        const exitAction = position.action === 'buy' ? 'sell' : 'buy';
        // Use 6 decimals for USDC amount
        const amountInSmallestUnit = (position.amount * Math.pow(10, 6)).toString();

        const result = await executeTradeWithStrategy(
          position.action === 'buy' ? SOL_MINT : USDC_MINT,
          position.action === 'buy' ? USDC_MINT : SOL_MINT,
          amountInSmallestUnit, 0.5, 'Take Profit',
          publicKey, sendTransaction, publicKey?.toBase58() || null
        );
        if (result.success) {
          const exitTrade: Trade = { id: `tp-${Date.now()}`, timestamp: new Date().toISOString(), pair: position.pair, action: exitAction, amount: position.amount, price: currentPrice, strategy: 'Take Profit', success: true, signature: result.signature };
          addTradeHistory(exitTrade);
          removePosition(position.id);
        } else { setError(`Take profit trade failed: ${result.error}`); }
      } catch (error: any) { setError(`Error executing take profit: ${error.message}`); }
      finally {
          isProcessingRef.current = false;
          if (isMountedRef.current) setIsProcessingTrade(false);
      }
    } else {
      const exitAction = position.action === 'buy' ? 'sell' : 'buy';
      const exitTrade: Trade = { id: `tp-sim-${Date.now()}`, timestamp: new Date().toISOString(), pair: position.pair, action: exitAction, amount: position.amount, price: currentPrice, strategy: 'Take Profit', success: true, signature: 'simulated_take_profit_' + Math.random().toString(36).substring(2, 9) };
      addTradeHistory(exitTrade);
      removePosition(position.id);
    }
    return true;
  }, [publicKey, sendTransaction, executeTradeWithStrategy, addTradeHistory, removePosition, setError, isMountedRef]); // Added isMountedRef

  const checkPositionsSLTP = useCallback(async (): Promise<boolean> => {
       const currentActivePositions = useBotStore.getState().activePositions;
       const currentPair = useBotStore.getState().settings.pair;
       const poolAddr = currentPoolAddress; // Use local state cache

       if (currentActivePositions.length === 0 || !poolAddr) return false;
       console.log("Checking SL/TP...");

       const currentPrice = await fetchCurrentPrice(currentPair); // Uses useCallback version

       if (currentPrice) {
           console.log(`Current price for SL/TP check: ${currentPrice}`);
           // Iterate over a copy in case the array is modified during the loop
           for (const position of [...currentActivePositions]) {
               // Check if position still exists in the store before processing
               if (!useBotStore.getState().activePositions.find(p => p.id === position.id)) continue;

               const tpTriggered = await handleTakeProfit(position, currentPrice); // Uses useCallback version
               if (tpTriggered) return true; // Exit early if TP hit

               // Check again if position still exists after potential TP trade
               if (!useBotStore.getState().activePositions.find(p => p.id === position.id)) continue;

               const slTriggered = await handleStopLoss(position, currentPrice); // Uses useCallback version
               if (slTriggered) return true; // Exit early if SL hit
           }
       } else {
           console.warn("Could not fetch current price for SL/TP check.");
       }
       return false; // No SL/TP triggered for any position
   }, [currentPoolAddress, fetchCurrentPrice, handleTakeProfit, handleStopLoss]); // Dependencies are stable callbacks/state

  const simulateTradeAction = useCallback((simAction: 'buy' | 'sell') => {
    const { amount: currentAmount, pair: currentPair, strategyType: currentStrategy } = useBotStore.getState().settings;
    console.log(`Simulating ${simAction} entry action...`);
    const simPrice = parseFloat((Math.random() * 100 + 50).toFixed(2));
    // Use the actual configured amount for simulation consistency
    const simAmount = currentAmount;

    const trade: Trade = {
        id: `sim-entry-${Date.now()}`, timestamp: new Date().toISOString(), pair: currentPair, action: simAction,
        amount: simAmount, price: simPrice, strategy: currentStrategy, success: true,
        signature: 'sim_entry_' + Math.random().toString(36).substring(2, 9),
    };
    addTradeHistory(trade);
    const newPosition: Position = {
        id: `pos-${Date.now()}`, pair: currentPair, entryPrice: simPrice, amount: simAmount,
        timestamp: trade.timestamp, action: simAction
    };
    addPosition(newPosition);
  }, [addPosition, addTradeHistory]); // Dependencies are stable store actions

  const executeRealTradeAction = useCallback(async (tradeAction: 'buy' | 'sell') => {
      const { amount: currentAmount, pair: currentPair, strategyType: currentStrategy } = useBotStore.getState().settings;
      const poolAddr = currentPoolAddress; // Use local state cache

      if (isProcessingRef.current || !poolAddr) {
          console.log("Execute trade skipped: Already processing or pool address missing.");
          return;
      }
      console.log(`Attempting real ${tradeAction} trade...`);
      isProcessingRef.current = true;
      if (isMountedRef.current) setIsProcessingTrade(true);
      try {
          const inputMint = tradeAction === 'buy' ? USDC_MINT : SOL_MINT;
          const outputMint = tradeAction === 'buy' ? SOL_MINT : USDC_MINT;
          // Assuming 6 decimals for USDC amount input
          const amountInSmallestUnit = (currentAmount * Math.pow(10, 6)).toString();

          const result = await executeTradeWithStrategy(
              inputMint, outputMint, amountInSmallestUnit, 0.5,
              currentStrategy, publicKey, sendTransaction, publicKey?.toBase58() || null
          );

          if (result.success && result.expectedOutputAmount && result.inputAmount) {
              // Calculate price based on actual amounts if available
              const inputAmountNum = parseFloat(result.inputAmount) / Math.pow(10, inputMint === USDC_MINT ? 6 : 9);
              const outputAmountNum = parseFloat(result.expectedOutputAmount) / Math.pow(10, outputMint === USDC_MINT ? 6 : 9);
              const approxPrice = inputAmountNum / outputAmountNum;

              const trade: Trade = {
                  id: `real-${Date.now()}`, timestamp: new Date().toISOString(), pair: currentPair, action: tradeAction,
                  amount: currentAmount, // Use configured amount for consistency
                  price: isNaN(approxPrice) ? 0 : approxPrice, strategy: currentStrategy, success: true, signature: result.signature
              };
              addTradeHistory(trade);
              const newPosition: Position = {
                  id: `pos-${Date.now()}`, pair: currentPair, entryPrice: isNaN(approxPrice) ? 0 : approxPrice, amount: currentAmount,
                  timestamp: trade.timestamp, action: tradeAction
              };
              addPosition(newPosition);
          } else {
              setError(`Trade execution failed: ${result.error || 'Unknown reason'}`);
              const failedTrade: Trade = {
                  id: `fail-${Date.now()}`, timestamp: new Date().toISOString(), pair: currentPair, action: tradeAction,
                  amount: currentAmount, price: 0, strategy: currentStrategy, success: false, error: result.error || 'Unknown reason'
              };
              addTradeHistory(failedTrade);
          }
      } catch (e: any) {
          console.error("Trade execution error:", e);
          setError(`Trade execution error: ${e.message}`);
      } finally {
          isProcessingRef.current = false;
          if (isMountedRef.current) setIsProcessingTrade(false);
      }
  }, [currentPoolAddress, executeTradeWithStrategy, publicKey, sendTransaction, addTradeHistory, addPosition, setError, isMountedRef]); // Stable dependencies

  // Define loopLogic using useCallback
  const loopLogic = useCallback(async () => {
      if (!isMountedRef.current || useBotStore.getState().status !== 'running') return;
      if (isProcessingRef.current) {
          console.log("Skipping loop iteration: Trade/Analysis in progress (ref lock).");
          return;
      }
      console.log("Trading loop iteration...");
      isProcessingRef.current = true;
      if (isMountedRef.current) setIsProcessingTrade(true); // UI state

      // Read necessary local state *inside* the function
      const currentAnalysis = analysisResult;
      const poolAddr = currentPoolAddress;
      let shouldEnterTrade = false;

      try {
          const { settings: currentSettings, activePositions: currentActivePositions } = useBotStore.getState();
          const { strategyType: currentStrategyType, action: currentAction, isTestMode: currentTestMode } = currentSettings;

          if (!poolAddr || !currentAnalysis) {
              console.error("Loop Logic Error: Missing pool address or analysis result.");
              setError("Internal error: Missing data for trading loop.");
              storeStopBot();
              return; // Exit before finally
          }

          // --- Check Strategy Exit / SL / TP ---
          if (currentActivePositions.length > 0) {
              const positionClosed = await checkPositionsSLTP(); // Uses useCallback version
              // Check if position was closed *during* SL/TP check and lock is still held
              if (isProcessingRef.current && useBotStore.getState().activePositions.length < currentActivePositions.length) {
                  console.log("Position closed by SL/TP/Strategy Exit during check.");
                  // Allow finally block to release lock, don't exit loop prematurely
              }
          }

          // Re-check lock and active positions before entry logic
          if (isProcessingRef.current && useBotStore.getState().activePositions.length === 0) {
              console.log("No active position. Checking entry conditions...");
              const fifteenMinData = await fetchGeckoTerminalOhlcv(poolAddr, 'minute', 15, 10); // Assumes fetch uses useCallback
              if (fifteenMinData && currentAnalysis) {
                  if (currentStrategyType === 'TrendTracker') {
                      shouldEnterTrade = checkTrendTrackerEntry(currentAnalysis, fifteenMinData); // Assumes check uses useCallback
                  } else if (currentStrategyType === 'SmartRange Scout') {
                      shouldEnterTrade = checkSmartRangeEntry(currentAnalysis, fifteenMinData); // Assumes check uses useCallback
                  }
              } else {
                  console.warn("Could not fetch recent 15min data or analysis result missing for entry check.");
              }
          } else if (isProcessingRef.current) {
              console.log("Position already active or SL/TP closed it, skipping entry check.");
          }

          // --- Execute Trade ---
          if (isProcessingRef.current && shouldEnterTrade) {
              console.log(`Entry conditions met for ${currentStrategyType}. Attempting trade...`);
              if (currentTestMode) {
                  simulateTradeAction(currentAction); // Assumes simulate uses useCallback
              } else {
                  // executeRealTradeAction handles its own lock internally now
                  await executeRealTradeAction(currentAction); // Assumes execute uses useCallback
              }
          } else if (isProcessingRef.current) {
              console.log("Entry conditions not met or position already open/closed.");
          }

      } catch (error: any) {
          console.error("Error during trading loop logic:", error);
          setError(`Loop error: ${error.message}`);
      } finally {
          // Ensure lock is always released
          isProcessingRef.current = false;
          if (isMountedRef.current) setIsProcessingTrade(false); // UI state
      }
  // Dependencies: Only stable functions/actions it calls directly.
  // Reads local state (analysisResult, currentPoolAddress) directly.
  // Reads store state (settings, activePositions) via getState().
  }, [setError, storeStopBot, checkPositionsSLTP, simulateTradeAction, executeRealTradeAction, isMountedRef, analysisResult, currentPoolAddress]); // Added back analysisResult/currentPoolAddress


  // Main Lifecycle Effect
  useEffect(() => {
    // Function for initial analysis (defined inside effect to capture current pair)
    const runInitialAnalysis = async (currentPair: string) => {
        if (!isMountedRef.current || isProcessingRef.current) {
             console.log("Analysis skipped: Component unmounted or already processing.");
             return;
        }
        console.log(`Starting initial market analysis for pair: ${currentPair}...`);
        isProcessingRef.current = true;
        if (isMountedRef.current) setIsProcessingTrade(true); // UI state

        try {
            const poolAddress = await findPoolAddress(currentPair);
            if (!isMountedRef.current) return;

            if (!poolAddress) {
                setError(`Could not find pool address for pair: ${currentPair}`);
                storeStopBot();
                return; // Exit before finally
            }
            // Set local state immediately
            if (isMountedRef.current) setCurrentPoolAddress(poolAddress);

            const result = await assessMarketStructure(poolAddress);
            if (!isMountedRef.current) return;

            // Set local state immediately
            if (isMountedRef.current) setAnalysisResult(result);

            // Now handle state transition based on result
            if (result.condition === 'Unclear') {
                console.log("Market condition unclear, bot will not start.");
                setError("Market condition unclear. Bot stopped.");
                if (isMountedRef.current) setMarketCondition(result.condition);
                storeStopBot();
            } else {
                console.log(`Initial analysis complete. Market Condition: ${result.condition}. Transitioning to running.`);
                // Set status directly in the store upon success
                useBotStore.setState({
                    status: 'running',
                    marketCondition: result.condition,
                });
            }
        } catch (error: any) {
            console.error("Error during initial analysis:", error);
            setError(`Analysis error: ${error.message}`);
            storeStopBot();
        } finally {
            isProcessingRef.current = false;
            if (isMountedRef.current) setIsProcessingTrade(false); // UI state
        }
    };

    // --- Effect Logic ---
    if (status === 'analyzing') {
        // Clear previous interval if any
        if (tradingIntervalRef.current) {
            clearInterval(tradingIntervalRef.current);
            tradingIntervalRef.current = null;
        }
        runInitialAnalysis(pair); // Pass current pair

    } else if (status === 'running') {
        // This block executes when status becomes 'running'.
        // Check local state for prerequisites set by runInitialAnalysis.
        const localAnalysisResult = analysisResult; // Read local state
        const localPoolAddress = currentPoolAddress; // Read local state

        if (!tradingIntervalRef.current && localPoolAddress && localAnalysisResult && localAnalysisResult.condition !== 'Unclear') {
            // Double-check processing lock as a safeguard
            if (!isProcessingRef.current) {
                console.log(`Setting up trading loop interval: ${settings.runIntervalMinutes} mins.`);
                loopLogic(); // Run first iteration immediately
                tradingIntervalRef.current = setInterval(loopLogic, settings.runIntervalMinutes * 60 * 1000);
            } else {
                 console.warn("Status is 'running' but processing lock is still held. Delaying interval setup.");
            }
        } else if (!tradingIntervalRef.current) {
             console.warn("Status is 'running' but prerequisites (pool/analysis/condition) not met. Stopping interval setup.");
             // Avoid stopping the bot here if analysis already failed.
        }
    } else if (status === 'stopped') {
        // Clear interval if running
        if (tradingIntervalRef.current) {
            clearInterval(tradingIntervalRef.current);
            tradingIntervalRef.current = null;
            console.log("Trading loop stopped.");
        }
    }

    // --- Cleanup ---
    return () => {
        // Clear interval on unmount or before effect re-runs
        if (tradingIntervalRef.current) {
            clearInterval(tradingIntervalRef.current);
            tradingIntervalRef.current = null;
            console.log("Cleaning up trading loop interval on effect cleanup.");
        }
    };
// Dependencies: status drives the main logic. pair triggers re-analysis.
// settings.runIntervalMinutes needed for setInterval. loopLogic is stable.
// analysisResult and currentPoolAddress are needed to check prerequisites in the 'running' block.
}, [status, pair, settings.runIntervalMinutes, loopLogic, setError, setMarketCondition, storeStopBot, analysisResult, currentPoolAddress]);


  // --- Event Handlers ---

  const handleStartBot = () => {
    if (!isWalletConnected || !publicKey) {
      alert("Please connect your Phantom wallet first");
      return;
    }
    // Reset local state
    setStopLossTriggeredUI(false);
    setStopLossMessageUI('');
    setAnalysisResult(null);
    setCurrentPoolAddress(null);
    // Reset processing flags just in case
    isProcessingRef.current = false;
    setIsProcessingTrade(false);
    // Reset store state and trigger analysis
    useBotStore.setState({ status: 'analyzing', currentRun: 0, errorMessage: null });
  };

  const handleStopBot = () => {
    storeStopBot(); // Sets status to 'stopped', useEffect clears interval
    // Also clear processing flags immediately on manual stop
    isProcessingRef.current = false;
    if (isMountedRef.current) setIsProcessingTrade(false);
  };

  const handleToggleTestMode = () => {
    if (status === 'running' || status === 'analyzing') {
        alert("Please stop the bot before changing test mode.");
        return;
    }
    storeToggleTestMode();
  };

  // Handler for SL/TP/Runs/Interval/Compounding changes
  const handleSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number | boolean = value;

    if (type === 'number') {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) return;
      if ((name === 'stopLossPercentage' || name === 'takeProfitPercentage') && parsedValue < 0) parsedValue = 0;
      if (name === 'maxRuns' && parsedValue < 1) parsedValue = 1;
      if (name === 'runIntervalMinutes' && parsedValue < 1) parsedValue = 1;
    } else if (type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
    }
    updateSettingsInStore({ [name]: parsedValue }); // Use renamed action
  };


  // --- JSX Rendering ---
  const isRunning = status === 'running' || status === 'analyzing';
  const lastTrade = tradeHistory.length > 0 ? tradeHistory[0] : null;

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
      <h2 className="text-xl font-bold text-white">Bot Control</h2>

      {/* Test Mode Toggle */}
      <div className="flex items-center">
        <label htmlFor="testModeToggle" className="mr-2 text-gray-300">Test Mode:</label>
        <button
          id="testModeToggle"
          onClick={handleToggleTestMode}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            isTestMode ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-500'
          } ${status !== 'stopped' ? 'opacity-50 cursor-not-allowed' : 'text-white'}`}
          disabled={status !== 'stopped'} // Disable if bot is not stopped
        >
          {isTestMode ? 'Enabled' : 'Disabled'}
        </button>
        {!isTestMode && status === 'stopped' && (
          <span className="ml-2 text-red-400 text-xs italic">Warning: Real trading active!</span>
        )}
         {status !== 'stopped' && (
          <span className="ml-2 text-yellow-400 text-xs italic">Stop bot to change mode</span>
        )}
      </div>

      {/* Stop Loss Input */}
      <div className="flex items-center">
         <label htmlFor="stopLossPercentage" className="mr-2 text-gray-300 whitespace-nowrap">Stop Loss (%):</label>
         <input
            type="number"
            id="stopLossPercentage"
            name="stopLossPercentage"
            value={stopLossPercentage}
            onChange={handleSettingChange}
            min="0"
            step="0.1"
            className="w-full bg-gray-700 text-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={isRunning}
         />
      </div>

       {/* Take Profit Input */}
       <div className="flex items-center">
         <label htmlFor="takeProfitPercentage" className="mr-2 text-gray-300 whitespace-nowrap">Take Profit (%):</label>
         <input
            type="number"
            id="takeProfitPercentage"
            name="takeProfitPercentage"
            value={takeProfitPercentage}
            onChange={handleSettingChange}
            min="0"
            step="0.1"
            className="w-full bg-gray-700 text-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={isRunning}
         />
      </div>

       {/* Max Runs Input */}
       <div className="flex items-center">
         <label htmlFor="maxRuns" className="mr-2 text-gray-300 whitespace-nowrap">Max Runs:</label>
         <input
            type="number"
            id="maxRuns"
            name="maxRuns"
            value={maxRuns}
            onChange={handleSettingChange}
            min="1"
            step="1"
            className="w-full bg-gray-700 text-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={isRunning}
         />
      </div>

       {/* Run Interval Input */}
       <div className="flex items-center">
         <label htmlFor="runIntervalMinutes" className="mr-2 text-gray-300 whitespace-nowrap">Run Interval (min):</label>
         <input
            type="number"
            id="runIntervalMinutes"
            name="runIntervalMinutes"
            value={runIntervalMinutes}
            onChange={handleSettingChange}
            min="1"
            step="1"
            className="w-full bg-gray-700 text-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            disabled={isRunning}
         />
      </div>

       {/* Compound Capital Toggle */}
       <div className="flex items-center">
         <label htmlFor="compoundCapital" className="mr-2 text-gray-300">Compound Capital:</label>
         <input
            type="checkbox"
            id="compoundCapital"
            name="compoundCapital"
            checked={compoundCapital}
            onChange={handleSettingChange}
            className="form-checkbox h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-offset-gray-800"
            disabled={isRunning}
         />
      </div>


      {/* Start/Stop Buttons */}
      <div className="flex space-x-4 pt-2">
        {status !== 'running' && status !== 'analyzing' ? (
          <button
            onClick={handleStartBot}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isWalletConnected || !publicKey || isProcessingTrade || status === 'error'}
          >
            {isProcessingTrade ? 'Processing...' : status === 'error' ? 'Error Occurred' : 'Start Trading'}
          </button>
        ) : (
          <button
            onClick={handleStopBot}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isProcessingTrade} // Still disable based on UI state
          >
            {status === 'analyzing' ? 'Stop Analysis' : 'Stop Trading'}
          </button>
        )}
      </div>

      {/* Status Indicator */}
      {status !== 'stopped' && (
        <div className="bg-gray-900 p-3 rounded-md text-center">
          <div className="flex items-center justify-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
                status === 'running' ? 'bg-green-500 animate-pulse' :
                status === 'analyzing' ? 'bg-yellow-500 animate-pulse' :
                status === 'error' ? 'bg-red-500' : 'bg-gray-500' // Should not happen if not stopped
            }`}></div>
            <span className="text-sm text-gray-300">
                Bot status: <span className="font-medium">{status}</span>
                {status === 'running' && ` (${strategyType})`}
            </span>
          </div>
        </div>
      )}

       {/* Error Message Display */}
       {status === 'error' && errorMessage && ( // Access errorMessage directly from store state
         <div className="mt-4 bg-red-900/50 p-3 rounded-md text-center">
             <p className="text-red-300 text-sm">{errorMessage}</p> {/* Access errorMessage directly */}
         </div>
       )}


      {/* Stop Loss Trigger Message */}
      {stopLossTriggeredUI && (
        <div className="mt-4 bg-red-900/50 p-3 rounded-md">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-red-300 text-sm">{stopLossMessageUI}</span>
          </div>
        </div>
      )}

      {/* Active Positions Display - Reads from Zustand */}
      {activePositions.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold mb-2 text-white">Active Positions</h3>
          <div className="bg-gray-900 p-3 rounded-md max-h-40 overflow-y-auto">
            {activePositions.map((position) => (
              <div key={position.id} className="border-b border-gray-700 py-2 last:border-0 text-xs">
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-gray-400">Pair: <span className="text-gray-200">{position.pair}</span></div>
                  <div className="text-gray-400">Action: <span className={position.action === 'buy' ? 'text-green-400' : 'text-red-400'}>{position.action}</span></div>
                  <div className="text-gray-400">Amount: <span className="text-gray-200">{position.amount}</span></div>
                  <div className="text-gray-400">Entry: <span className="text-gray-200">${position.entryPrice.toFixed(4)}</span></div>
                  <div className="text-gray-400">Stop Loss: <span className="text-gray-200">${(position.action === 'buy'
                    ? position.entryPrice * (1 - stopLossPercentage / 100)
                    : position.entryPrice * (1 + stopLossPercentage / 100)).toFixed(4)}</span></div>
                  <div className="text-gray-400">Time: <span className="text-gray-200">{new Date(position.timestamp).toLocaleTimeString()}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last Trade Display - Reads from Zustand */}
      {lastTrade && (
        <div className="mt-4">
          <h3 className="font-bold mb-2 text-white">Last Trade</h3>
          <div className="bg-gray-900 p-3 rounded-md text-xs">
            <div className="grid grid-cols-2 gap-1">
              <div className="text-gray-400">Pair: <span className="text-gray-200">{lastTrade.pair}</span></div>
              <div className="text-gray-400">Action: <span className={lastTrade.action === 'buy' ? 'text-green-400' : 'text-red-400'}>{lastTrade.action}</span></div>
              <div className="text-gray-400">Amount: <span className="text-gray-200">{lastTrade.amount}</span></div>
              {/* Format price for display */}
              <div className="text-gray-400">Price: <span className="text-gray-200">${Number(lastTrade.price).toFixed(4)}</span></div>
              <div className="text-gray-400">Status: <span className={lastTrade.success ? 'text-green-400' : 'text-red-400'}>{lastTrade.success ? 'Success' : 'Failed'}</span></div>
              <div className="text-gray-400">Time: <span className="text-gray-200">{new Date(lastTrade.timestamp).toLocaleTimeString()}</span></div>
              {lastTrade.signature && !lastTrade.signature.startsWith('sim') && (
                <div className="col-span-2">
                  <a
                    href={`https://solscan.io/tx/${lastTrade.signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    View on Solscan
                  </a>
                </div>
              )}
               {lastTrade.error && (
                 <div className="col-span-2 text-red-400">Error: {lastTrade.error}</div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Trades Display - Reads from Zustand */}
      {tradeHistory.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold mb-2 text-white">Recent Trades</h3>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {tradeHistory.map((trade) => (
              <div key={trade.id || trade.timestamp} className="bg-gray-900 p-2 rounded-md text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-300">{trade.pair} - {trade.action.toUpperCase()}</span>
                  <span className="text-gray-400">{new Date(trade.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between items-center">
                   {/* Format price for display */}
                  <span className="text-gray-300">{trade.amount} @ ${Number(trade.price).toFixed(4)}</span>
                  <span className={`font-semibold ${trade.success ? 'text-green-500' : 'text-red-500'}`}>
                    {trade.success ? 'Success' : 'Failed'}
                  </span>
                </div>
                {trade.signature && !trade.signature.startsWith('sim') && (
                  <div className="mt-1">
                    <a
                      href={`https://solscan.io/tx/${trade.signature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline text-xs"
                    >
                      View Tx
                    </a>
                  </div>
                )}
                 {trade.error && (
                   <div className="mt-1 text-red-400 text-xs">Error: {trade.error}</div>
                 )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BotControl;
