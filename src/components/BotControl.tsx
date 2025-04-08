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
    AnalysisResult // Import AnalysisResult type
} from '@/lib/marketAnalysis';


// BotControl component refactored to use Zustand store
const BotControl = () => {
  // Local state for UI feedback or component-specific logic
  const [stopLossTriggeredUI, setStopLossTriggeredUI] = useState(false);
  const [stopLossMessageUI, setStopLossMessageUI] = useState('');
  // Add local state for TP message display if needed
  // const [takeProfitTriggeredUI, setTakeProfitTriggeredUI] = useState(false);
  // const [takeProfitMessageUI, setTakeProfitMessageUI] = useState('');
  const tradingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isProcessingTrade, setIsProcessingTrade] = useState(false); // Local state for disabling buttons during trade
  const [currentPoolAddress, setCurrentPoolAddress] = useState<string | null>(null); // Cache pool address
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null); // Store last analysis

  // --- Get state and actions from Zustand store ---
  const {
    status,
    settings,
    activePositions,
    tradeHistory,
    errorMessage, // Get error message from store state
    marketCondition, // Get market condition
    startBot: storeStartBot,
    stopBot: storeStopBot,
    toggleTestMode: storeToggleTestMode,
    addPosition,
    removePosition,
    addTradeHistory,
    setError,
    setRunning,
    setAnalyzing,
    setSettings,
    setMarketCondition, // Action to update market condition
  } = useBotStore((state) => state);

  // Destructure settings for easier access
  const {
    isTestMode,
    stopLossPercentage,
    takeProfitPercentage, // Destructure TP setting
    maxRuns,
    runIntervalMinutes,
    compoundCapital,
    strategyType,
    amount,
    pair,
    action, // Default action from settings
  } = settings;

  // Get wallet context
  const { publicKey, connected: isWalletConnected, sendTransaction } = useWallet();
  // Get Jupiter trading function
  const { executeTradeWithStrategy } = useJupiterTrading();

  // --- Effects ---

  // Effect to clear interval on unmount or when bot stops
  useEffect(() => {
    if (status === 'stopped' && tradingIntervalRef.current) {
      clearInterval(tradingIntervalRef.current);
      tradingIntervalRef.current = null;
    }
    return () => {
      if (tradingIntervalRef.current) {
        clearInterval(tradingIntervalRef.current);
      }
    };
  }, [status]);

  // Effect to run initial analysis when bot starts
  useEffect(() => {
    const runInitialAnalysis = async () => {
      if (status === 'analyzing') {
        console.log("Starting initial market analysis...");
        setIsProcessingTrade(true); // Indicate analysis is in progress
        const poolAddress = currentPoolAddress ?? await findPoolAddress(pair); // Use cache or find
        if (!poolAddress) {
          setError(`Could not find pool address for pair: ${pair}`);
          storeStopBot(); // Stop if pool not found
          setIsProcessingTrade(false);
          return;
        }
        if (!currentPoolAddress) setCurrentPoolAddress(poolAddress); // Store if newly found

        const result = await assessMarketStructure(poolAddress);
        setAnalysisResult(result); // Store analysis result locally
        setMarketCondition(result.condition); // Update store

        if (result.condition === 'Unclear') {
          console.log("Market condition unclear, bot will not start trading loop.");
           setError("Market condition unclear. Bot stopped.");
           storeStopBot();
        } else {
          console.log(`Initial analysis complete. Market Condition: ${result.condition}. Starting trading loop.`);
          setRunning(); // Set status to running to trigger the trading loop useEffect
        }
        setIsProcessingTrade(false);
      }
    };
    runInitialAnalysis();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, pair]); // Rerun analysis if status becomes 'analyzing' or pair changes


  // Effect to handle the main trading loop based on status
  useEffect(() => {
    if (status === 'running' && !tradingIntervalRef.current && currentPoolAddress && analysisResult) {
      console.log(`Starting trading loop (Test Mode: ${isTestMode}). Interval: ${runIntervalMinutes} mins.`);

      const loopLogic = async () => {
        console.log("Trading loop iteration...");
        if (isProcessingTrade) {
            console.log("Skipping loop iteration: Trade/Analysis in progress.");
            return;
        }
        setIsProcessingTrade(true); // Lock for this iteration

        // --- Check SL/TP First ---
        let positionClosed = false;
        if (activePositions.length > 0) {
            positionClosed = await checkPositionsSLTP(); // Check returns true if a position was closed
            // If SL/TP closed the position, activePositions in store is updated
            // We need to get the latest state *after* the check
             if (useBotStore.getState().activePositions.length === 0 && activePositions.length > 0) {
                 console.log("Position closed by SL/TP.");
                 // TODO: Handle run count incrementing here?
                 setIsProcessingTrade(false);
                 return; // Skip trying to open a new trade this iteration
             }
        }

        // --- Re-assess Market Condition Periodically? (Optional) ---
        // Could add logic here, e.g., every N loops

        // --- Check Entry Conditions ---
        let shouldEnterTrade = false;
        // Only check entry if no position exists *after* SL/TP check
        if (useBotStore.getState().activePositions.length === 0) {
            // Fetch latest 15-min data for entry check
            const fifteenMinData = await fetchGeckoTerminalOhlcv(currentPoolAddress, 'minute', 15, 10); // Fetch recent data

            if (fifteenMinData && analysisResult) { // Ensure analysisResult is still valid
                 if (strategyType === 'TrendTracker') {
                    shouldEnterTrade = checkTrendTrackerEntry(analysisResult, fifteenMinData);
                 } else if (strategyType === 'SmartRange Scout') {
                    shouldEnterTrade = checkSmartRangeEntry(analysisResult, fifteenMinData);
                 }
            } else {
                console.warn("Could not fetch recent 15min data for entry check.");
            }
        }

        // --- Execute Trade ---
        if (shouldEnterTrade) {
            console.log(`Entry conditions met for ${strategyType}. Attempting trade...`);
            if (isTestMode) {
                simulateTradeAction(action); // Pass the intended action
            } else {
                await executeRealTradeAction(action); // Pass the intended action
            }
            // TODO: Handle run count incrementing after successful entry/exit cycle?
        } else {
            console.log("Entry conditions not met or position already open.");
        }

        setIsProcessingTrade(false); // Re-enable buttons
      };

      // Initial run + Interval
      loopLogic(); // Run immediately on start
      tradingIntervalRef.current = setInterval(loopLogic, runIntervalMinutes * 60 * 1000);

    } else if (status !== 'running' && tradingIntervalRef.current) {
      // Clear interval if status is not 'running' anymore
      clearInterval(tradingIntervalRef.current);
      tradingIntervalRef.current = null;
      console.log("Trading loop stopped.");
    }
    // Dependencies
  }, [status, isTestMode, runIntervalMinutes, currentPoolAddress, analysisResult, activePositions.length, pair, action, strategyType, amount]); // Add relevant dependencies


  // --- Event Handlers ---

  const handleStartBot = () => {
    if (!isWalletConnected || !publicKey) {
      alert("Please connect your Phantom wallet first");
      return;
    }
    setStopLossTriggeredUI(false); // Reset local UI state
    setStopLossMessageUI('');
    storeStartBot(); // Sets status to 'analyzing', triggers the analysis useEffect
  };

  const handleStopBot = () => {
    storeStopBot(); // Sets status to 'stopped', useEffect clears interval
  };

  const handleToggleTestMode = () => {
    storeToggleTestMode(); // Store action handles the check
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
    setSettings({ [name]: parsedValue });
  };


  // --- Core Logic Functions ---

  const handleStopLoss = async (position: Position, currentPrice: number): Promise<boolean> => {
    const currentStopLossConfig: StopLossConfig = { enabled: true, percentage: stopLossPercentage };
    if (!checkStopLoss(position, currentPrice, currentStopLossConfig)) return false;

    const message = formatStopLossMessage(position, currentPrice, currentStopLossConfig);
    console.log(`STOP LOSS TRIGGERED: ${message}`);
    setStopLossTriggeredUI(true);
    setStopLossMessageUI(message);

    if (!isTestMode) {
      try {
        setIsProcessingTrade(true);
        const exitAction = position.action === 'buy' ? 'sell' : 'buy';
        const [base, quote] = position.pair.split('/');
        // TODO: Get mints dynamically based on pair/tokens
        const inputMint = position.action === 'buy' ? SOL_MINT : USDC_MINT;
        const outputMint = position.action === 'buy' ? USDC_MINT : SOL_MINT;
        // TODO: Get decimals dynamically
        const amountInSmallestUnit = (position.amount * Math.pow(10, 9)).toString();

        const result = await executeTradeWithStrategy(
          inputMint, outputMint, amountInSmallestUnit, 0.5, 'Stop Loss',
          publicKey, sendTransaction, publicKey?.toBase58() || null
        );
        if (result.success) {
          const exitTrade: Trade = {
            id: `sl-${Date.now()}`, timestamp: new Date().toISOString(), pair: position.pair,
            action: exitAction, amount: position.amount, price: currentPrice,
            strategy: 'Stop Loss', success: true, signature: result.signature,
          };
          addTradeHistory(exitTrade);
          removePosition(position.id); // Remove position from store
        } else { setError(`Stop loss trade failed: ${result.error}`); }
      } catch (error: any) { setError(`Error executing stop loss: ${error.message}`); }
      finally { setIsProcessingTrade(false); }
    } else {
      const exitAction = position.action === 'buy' ? 'sell' : 'buy';
      const exitTrade: Trade = {
        id: `sl-sim-${Date.now()}`, timestamp: new Date().toISOString(), pair: position.pair,
        action: exitAction, amount: position.amount, price: currentPrice,
        strategy: 'Stop Loss', success: true,
        signature: 'simulated_stop_loss_' + Math.random().toString(36).substring(2, 9),
      };
      addTradeHistory(exitTrade);
      removePosition(position.id); // Remove position from store
    }
    return true; // SL triggered
  };

  const handleTakeProfit = async (position: Position, currentPrice: number): Promise<boolean> => {
    const currentTakeProfitConfig: TakeProfitConfig = { enabled: true, percentage: takeProfitPercentage };
    if (!checkTakeProfit(position, currentPrice, currentTakeProfitConfig)) return false;

    const message = formatTakeProfitMessage(position, currentPrice, currentTakeProfitConfig);
    console.log(`TAKE PROFIT TRIGGERED: ${message}`);
    // Add local UI state update if needed: setTakeProfitTriggeredUI(true); setTakeProfitMessageUI(message);

    if (!isTestMode) {
      try {
        setIsProcessingTrade(true);
        const exitAction = position.action === 'buy' ? 'sell' : 'buy';
        const [base, quote] = position.pair.split('/');
        const inputMint = position.action === 'buy' ? SOL_MINT : USDC_MINT;
        const outputMint = position.action === 'buy' ? USDC_MINT : SOL_MINT; // Corrected: Sell SOL for USDC
        const amountInSmallestUnit = (position.amount * Math.pow(10, 9)).toString();

        const result = await executeTradeWithStrategy(
          inputMint, outputMint, amountInSmallestUnit, 0.5, 'Take Profit',
          publicKey, sendTransaction, publicKey?.toBase58() || null
        );
        if (result.success) {
          const exitTrade: Trade = {
            id: `tp-${Date.now()}`, timestamp: new Date().toISOString(), pair: position.pair,
            action: exitAction, amount: position.amount, price: currentPrice,
            strategy: 'Take Profit', success: true, signature: result.signature,
          };
          addTradeHistory(exitTrade);
          removePosition(position.id);
        } else { setError(`Take profit trade failed: ${result.error}`); }
      } catch (error: any) { setError(`Error executing take profit: ${error.message}`); }
      finally { setIsProcessingTrade(false); }
    } else {
      const exitAction = position.action === 'buy' ? 'sell' : 'buy';
      const exitTrade: Trade = {
        id: `tp-sim-${Date.now()}`, timestamp: new Date().toISOString(), pair: position.pair,
        action: exitAction, amount: position.amount, price: currentPrice,
        strategy: 'Take Profit', success: true,
        signature: 'simulated_take_profit_' + Math.random().toString(36).substring(2, 9),
      };
      addTradeHistory(exitTrade);
      removePosition(position.id);
    }
    return true; // TP triggered
  };

  // Simulate a single trade action (entry or exit)
  const simulateTradeAction = (simAction: 'buy' | 'sell') => { // Accept action
    console.log(`Simulating ${simAction} action...`);
    const simPrice = parseFloat((Math.random() * 100 + 50).toFixed(2));
    const simAmount = parseFloat((Math.random() * amount).toFixed(3)); // Use amount from settings

    const trade: Trade = {
        id: `sim-entry-${Date.now()}`, timestamp: new Date().toISOString(), pair, action: simAction,
        amount: simAmount, price: simPrice, strategy: strategyType, success: true,
        signature: 'sim_entry_' + Math.random().toString(36).substring(2, 9),
    };
    addTradeHistory(trade);
    const newPosition: Position = {
        id: `pos-${Date.now()}`, pair, entryPrice: simPrice, amount: simAmount,
        timestamp: trade.timestamp, action: simAction
    };
    addPosition(newPosition);
  };

  // Execute a real trade based on strategy decision
  const executeRealTradeAction = async (tradeAction: 'buy' | 'sell') => {
      if (isProcessingTrade || !currentPoolAddress) return; // Need pool address
      console.log(`Attempting real ${tradeAction} trade...`);
      setIsProcessingTrade(true);
      try {
          // TODO: Get mints dynamically based on pair
          const inputMint = tradeAction === 'buy' ? USDC_MINT : SOL_MINT;
          const outputMint = tradeAction === 'buy' ? SOL_MINT : USDC_MINT;
          // TODO: Get decimals dynamically
          const amountInSmallestUnit = (amount * Math.pow(10, 9)).toString(); // Use amount from settings

          const result = await executeTradeWithStrategy(
              inputMint, outputMint, amountInSmallestUnit, 0.5, // 0.5% slippage
              strategyType, publicKey, sendTransaction, publicKey?.toBase58() || null
          );

          if (result.success && result.expectedOutputAmount) { // Assuming execute returns price info
              // TODO: Need a reliable way to get execution price post-trade
              const approxPrice = parseFloat(result.inputAmount || '0') / parseFloat(result.expectedOutputAmount); // Very rough estimate
              const trade: Trade = {
                  id: `real-${Date.now()}`, timestamp: new Date().toISOString(), pair, action: tradeAction,
                  amount: amount, price: isNaN(approxPrice) ? 0 : approxPrice, strategy: strategyType, success: true, signature: result.signature
              };
              addTradeHistory(trade);
              const newPosition: Position = {
                  id: `pos-${Date.now()}`, pair, entryPrice: isNaN(approxPrice) ? 0 : approxPrice, amount: amount,
                  timestamp: trade.timestamp, action: tradeAction
              };
              addPosition(newPosition);
          } else {
              setError(`Trade execution failed: ${result.error}`);
              const failedTrade: Trade = {
                  id: `fail-${Date.now()}`, timestamp: new Date().toISOString(), pair, action: tradeAction,
                  amount: amount, price: 0, strategy: strategyType, success: false, error: result.error
              };
              addTradeHistory(failedTrade);
          }
      } catch (e: any) { setError(`Trade execution error: ${e.message}`); }
      finally { setIsProcessingTrade(false); }
  };

   // Check Stop Loss and Take Profit for all active positions
   const checkPositionsSLTP = async (): Promise<boolean> => { // Return true if a position was closed
       if (activePositions.length === 0 || !currentPoolAddress) return false;
       console.log("Checking SL/TP...");

       const currentPrice = await fetchCurrentPrice(pair); // Use pair from settings

       if (currentPrice) {
           console.log(`Current price for SL/TP check: ${currentPrice}`);
           for (const position of [...activePositions]) { // Iterate over a copy
               // Check TP first. If it triggers and closes the position, return true.
               const tpTriggered = await handleTakeProfit(position, currentPrice);
               if (tpTriggered) return true; // Position closed by TP, stop checking this iteration

               // If TP didn't trigger, check SL. If it triggers, return true.
               const slTriggered = await handleStopLoss(position, currentPrice);
               if (slTriggered) return true; // Position closed by SL, stop checking this iteration
           }
       } else {
           console.warn("Could not fetch current price for SL/TP check.");
       }
       return false; // No position closed
   };


  // Fetch current price (using GeckoTerminal 1-min candle close)
  const fetchCurrentPrice = async (fetchPair: string): Promise<number | null> => {
    // console.log(`Fetching current price for ${fetchPair} using GeckoTerminal`); // Reduce verbosity
    const poolAddress = currentPoolAddress ?? await findPoolAddress(fetchPair);
    if (!poolAddress) {
        console.error("Cannot fetch price, pool address unknown.");
        return null;
    }
    if (poolAddress !== currentPoolAddress) setCurrentPoolAddress(poolAddress); // Cache if found now

    try {
        const latestCandle = await fetchGeckoTerminalOhlcv(poolAddress, 'minute', 1, 1);
        const price = latestCandle?.[0]?.close;
        if (price) {
            // console.log(`Latest close price: ${price}`);
            return price;
        } else {
            console.warn("Could not get latest close price from GeckoTerminal.");
            return null;
        }
    } catch (error: any) {
      console.error('Error fetching current price from GeckoTerminal:', error.message);
      return null;
    }
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
            disabled={isProcessingTrade}
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
