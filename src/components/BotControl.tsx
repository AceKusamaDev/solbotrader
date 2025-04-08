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
  const [isProcessingTrade, setIsProcessingTrade] = useState(false); // Local state for disabling buttons during trade
  const [currentPoolAddress, setCurrentPoolAddress] = useState<string | null>(null); // Cache pool address
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null); // Store last analysis

  // --- Get state and actions from Zustand store ---
  // Only select actions needed for handlers, read state inside loopLogic via getState()
  const {
    status, // Needed for effect dependencies and JSX
    settings, // Needed for JSX display and handlers
    activePositions, // Needed for JSX display
    tradeHistory, // Needed for JSX display
    errorMessage, // Needed for JSX display
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
    setMarketCondition,
  } = useBotStore((state) => ({
      status: state.status,
      settings: state.settings, // Keep settings for UI binding
      activePositions: state.activePositions, // Keep for UI binding
      tradeHistory: state.tradeHistory, // Keep for UI binding
      errorMessage: state.errorMessage, // Keep for UI binding
      startBot: state.startBot,
      stopBot: state.stopBot,
      toggleTestMode: state.toggleTestMode,
      addPosition: state.addPosition,
      removePosition: state.removePosition,
      addTradeHistory: state.addTradeHistory,
      setError: state.setError,
      setRunning: state.setRunning,
      setAnalyzing: state.setAnalyzing,
      setSettings: state.setSettings,
      setMarketCondition: state.setMarketCondition,
  }));

  // Destructure settings for easier access in JSX and handlers
  const {
    isTestMode,
    stopLossPercentage,
    takeProfitPercentage,
    maxRuns,
    runIntervalMinutes,
    compoundCapital,
    strategyType,
    amount,
    pair,
    action,
  } = settings;

  // Get wallet context
  const { publicKey, connected: isWalletConnected, sendTransaction } = useWallet();
  // Get Jupiter trading function
  const { executeTradeWithStrategy } = useJupiterTrading();

  // Ref to track mount status - Moved up
  const isMountedRef = useRef(true);
  useEffect(() => {
      isMountedRef.current = true;
      return () => { isMountedRef.current = false; }; // Set to false on unmount
  }, []);


  // --- Core Logic Functions ---

  // Fetch current price (using GeckoTerminal 1-min candle close)
  const fetchCurrentPrice = useCallback(async (fetchPair: string): Promise<number | null> => {
    const poolAddress = currentPoolAddress ?? await findPoolAddress(fetchPair);
    if (!poolAddress) {
        console.error(`Cannot fetch price for ${fetchPair}, pool address unknown.`);
        setError(`Pool address unknown for ${fetchPair}`);
        return null;
    }
    if (poolAddress !== currentPoolAddress) setCurrentPoolAddress(poolAddress);

    try {
        const latestCandleData = await fetchGeckoTerminalOhlcv(poolAddress, 'minute', 1, 1);
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
  }, [currentPoolAddress, setError]); // Depends on currentPoolAddress state


  const handleStopLoss = useCallback(async (position: Position, currentPrice: number): Promise<boolean> => {
    // Read latest settings directly from store inside the handler
    const latestSettings = useBotStore.getState().settings;
    const currentStopLossConfig: StopLossConfig = { enabled: true, percentage: latestSettings.stopLossPercentage };

    if (!checkStopLoss(position, currentPrice, currentStopLossConfig)) return false;

    const message = formatStopLossMessage(position, currentPrice, currentStopLossConfig);
    console.log(`STOP LOSS TRIGGERED: ${message}`);
    setStopLossTriggeredUI(true); // Update local UI state
    setStopLossMessageUI(message);

    if (!latestSettings.isTestMode) { // Use latest setting
      try {
        setIsProcessingTrade(true);
        const exitAction = position.action === 'buy' ? 'sell' : 'buy';
        const amountInSmallestUnit = (position.amount * Math.pow(10, 9)).toString(); // Assuming 9 decimals

        const result = await executeTradeWithStrategy(
          position.action === 'buy' ? SOL_MINT : USDC_MINT, // Determine mints based on position action
          position.action === 'buy' ? USDC_MINT : SOL_MINT,
          amountInSmallestUnit, 0.5, 'Stop Loss',
          publicKey, sendTransaction, publicKey?.toBase58() || null
        );
        if (result.success) {
          const exitTrade: Trade = {
            id: `sl-${Date.now()}`, timestamp: new Date().toISOString(), pair: position.pair,
            action: exitAction, amount: position.amount, price: currentPrice,
            strategy: 'Stop Loss', success: true, signature: result.signature,
          };
          addTradeHistory(exitTrade);
          removePosition(position.id);
        } else { setError(`Stop loss trade failed: ${result.error}`); }
      } catch (error: any) { setError(`Error executing stop loss: ${error.message}`); }
      finally { if (isMountedRef.current) setIsProcessingTrade(false); } // Check mount status - isMountedRef is now declared above
    } else {
      const exitAction = position.action === 'buy' ? 'sell' : 'buy';
      const exitTrade: Trade = {
        id: `sl-sim-${Date.now()}`, timestamp: new Date().toISOString(), pair: position.pair,
        action: exitAction, amount: position.amount, price: currentPrice,
        strategy: 'Stop Loss', success: true,
        signature: 'simulated_stop_loss_' + Math.random().toString(36).substring(2, 9),
      };
      addTradeHistory(exitTrade);
      removePosition(position.id);
    }
    return true; // SL triggered
  }, [publicKey, sendTransaction, executeTradeWithStrategy, addTradeHistory, removePosition, setError]); // Add dependencies

  const handleTakeProfit = useCallback(async (position: Position, currentPrice: number): Promise<boolean> => {
    const latestSettings = useBotStore.getState().settings;
    const currentTakeProfitConfig: TakeProfitConfig = { enabled: true, percentage: latestSettings.takeProfitPercentage };

    if (!checkTakeProfit(position, currentPrice, currentTakeProfitConfig)) return false;

    const message = formatTakeProfitMessage(position, currentPrice, currentTakeProfitConfig);
    console.log(`TAKE PROFIT TRIGGERED: ${message}`);

    if (!latestSettings.isTestMode) {
      try {
        setIsProcessingTrade(true);
        const exitAction = position.action === 'buy' ? 'sell' : 'buy';
        const amountInSmallestUnit = (position.amount * Math.pow(10, 9)).toString();

        const result = await executeTradeWithStrategy(
          position.action === 'buy' ? SOL_MINT : USDC_MINT,
          position.action === 'buy' ? USDC_MINT : SOL_MINT,
          amountInSmallestUnit, 0.5, 'Take Profit',
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
      finally { if (isMountedRef.current) setIsProcessingTrade(false); } // Check mount status - isMountedRef is now declared above
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
  }, [publicKey, sendTransaction, executeTradeWithStrategy, addTradeHistory, removePosition, setError, isMountedRef]); // Add dependencies, including isMountedRef

   // Check Stop Loss and Take Profit for all active positions
   const checkPositionsSLTP = useCallback(async (): Promise<boolean> => {
       const currentActivePositions = useBotStore.getState().activePositions; // Get latest state
       const currentPair = useBotStore.getState().settings.pair; // Get latest pair
       const poolAddr = currentPoolAddress; // Use state pool address

       if (currentActivePositions.length === 0 || !poolAddr) return false;
       console.log("Checking SL/TP...");

       const currentPrice = await fetchCurrentPrice(currentPair);

       if (currentPrice) {
           console.log(`Current price for SL/TP check: ${currentPrice}`);
           for (const position of [...currentActivePositions]) { // Iterate over latest positions
               const tpTriggered = await handleTakeProfit(position, currentPrice);
               if (tpTriggered) return true;
               const slTriggered = await handleStopLoss(position, currentPrice);
               if (slTriggered) return true;
           }
       } else {
           console.warn("Could not fetch current price for SL/TP check.");
       }
       return false;
   }, [currentPoolAddress, fetchCurrentPrice, handleTakeProfit, handleStopLoss]); // Dependencies

  // Simulate a single trade action (entry only for now)
  const simulateTradeAction = useCallback((simAction: 'buy' | 'sell') => {
    const { amount: currentAmount, pair: currentPair, strategyType: currentStrategy } = useBotStore.getState().settings;
    console.log(`Simulating ${simAction} entry action...`);
    const simPrice = parseFloat((Math.random() * 100 + 50).toFixed(2));
    const simAmount = parseFloat((Math.random() * currentAmount).toFixed(3));

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
  }, [addPosition, addTradeHistory]); // Dependencies

  // Execute a real trade based on strategy decision (entry only for now)
  const executeRealTradeAction = useCallback(async (tradeAction: 'buy' | 'sell') => {
      const { amount: currentAmount, pair: currentPair, strategyType: currentStrategy } = useBotStore.getState().settings;
      const poolAddr = currentPoolAddress; // Use state pool address

      if (isProcessingTrade || !poolAddr) return;
      console.log(`Attempting real ${tradeAction} trade...`);
      setIsProcessingTrade(true);
      try {
          const inputMint = tradeAction === 'buy' ? USDC_MINT : SOL_MINT;
          const outputMint = tradeAction === 'buy' ? SOL_MINT : USDC_MINT;
          const amountInSmallestUnit = (currentAmount * Math.pow(10, 9)).toString();

          const result = await executeTradeWithStrategy(
              inputMint, outputMint, amountInSmallestUnit, 0.5,
              currentStrategy, publicKey, sendTransaction, publicKey?.toBase58() || null
          );

          if (result.success && result.expectedOutputAmount) {
              const approxPrice = parseFloat(result.inputAmount || '0') / parseFloat(result.expectedOutputAmount);
              const trade: Trade = {
                  id: `real-${Date.now()}`, timestamp: new Date().toISOString(), pair: currentPair, action: tradeAction,
                  amount: currentAmount, price: isNaN(approxPrice) ? 0 : approxPrice, strategy: currentStrategy, success: true, signature: result.signature
              };
              addTradeHistory(trade);
              const newPosition: Position = {
                  id: `pos-${Date.now()}`, pair: currentPair, entryPrice: isNaN(approxPrice) ? 0 : approxPrice, amount: currentAmount,
                  timestamp: trade.timestamp, action: tradeAction
              };
              addPosition(newPosition);
          } else {
              setError(`Trade execution failed: ${result.error}`);
              const failedTrade: Trade = {
                  id: `fail-${Date.now()}`, timestamp: new Date().toISOString(), pair: currentPair, action: tradeAction,
                  amount: currentAmount, price: 0, strategy: currentStrategy, success: false, error: result.error
              };
              addTradeHistory(failedTrade);
          }
      } catch (e: any) { setError(`Trade execution error: ${e.message}`); }
      finally { if (isMountedRef.current) setIsProcessingTrade(false); } // Check mount status - isMountedRef is now declared above
  }, [currentPoolAddress, executeTradeWithStrategy, publicKey, sendTransaction, addTradeHistory, addPosition, setError, isProcessingTrade, isMountedRef]); // Dependencies


  // --- Combined Bot Lifecycle Effect ---

  useEffect(() => {
    // isMountedRef setup is now done in its own effect above
    let analysisRunning = false; // Local flag to prevent concurrent analysis runs

    // Function to perform the core trading loop logic
    const loopLogic = async () => {
        if (!isMountedRef.current || useBotStore.getState().status !== 'running') return;
        if (isProcessingTrade) {
            console.log("Skipping loop iteration: Trade/Analysis in progress.");
            return;
        }
        console.log("Trading loop iteration...");
        setIsProcessingTrade(true);

        const { settings: currentSettings, activePositions: currentActivePositions } = useBotStore.getState();
        const { strategyType: currentStrategyType, action: currentAction, isTestMode: currentTestMode } = currentSettings;
        const currentAnalysis = analysisResult; // Use analysis result from component state
        const poolAddr = currentPoolAddress; // Use pool address from component state

        if (!poolAddr || !currentAnalysis) {
            console.error("Missing pool address or analysis result for loop logic.");
            setError("Internal error: Missing data for trading loop.");
            storeStopBot();
            setIsProcessingTrade(false);
            return;
        }

        // --- Check Strategy Exit / SL / TP ---
        if (currentActivePositions.length > 0) {
            const positionClosed = await checkPositionsSLTP();
            if (useBotStore.getState().activePositions.length === 0 && currentActivePositions.length > 0) {
                console.log("Position closed by SL/TP/Strategy Exit.");
                setIsProcessingTrade(false);
                return;
            }
        }

        // --- Check Entry Conditions ---
        let shouldEnterTrade = false;
        if (useBotStore.getState().activePositions.length === 0) {
            console.log("No active position. Checking entry conditions...");
            const fifteenMinData = await fetchGeckoTerminalOhlcv(poolAddr, 'minute', 15, 10);
            if (fifteenMinData && currentAnalysis) {
                if (currentStrategyType === 'TrendTracker') {
                    shouldEnterTrade = checkTrendTrackerEntry(currentAnalysis, fifteenMinData);
                } else if (currentStrategyType === 'SmartRange Scout') {
                    shouldEnterTrade = checkSmartRangeEntry(currentAnalysis, fifteenMinData);
                }
            } else {
                console.warn("Could not fetch recent 15min data or analysis result missing for entry check.");
            }
        } else {
            console.log("Position already active, skipping entry check.");
        }

        // --- Execute Trade ---
        if (shouldEnterTrade) {
            console.log(`Entry conditions met for ${currentStrategyType}. Attempting trade...`);
            if (currentTestMode) {
                simulateTradeAction(currentAction);
            } else {
                await executeRealTradeAction(currentAction);
            }
        } else {
            console.log("Entry conditions not met or position already open.");
        }

        setIsProcessingTrade(false);
      };

    // --- Effect Logic ---
    if (status === 'analyzing' && !analysisRunning) {
        analysisRunning = true;
        const runInitialAnalysis = async () => {
            if (!isMountedRef.current) return;
            console.log("Starting initial market analysis...");
            setIsProcessingTrade(true); // Use local state for processing flag
            const poolAddress = await findPoolAddress(pair);
            if (!isMountedRef.current) { analysisRunning = false; return; }

            if (!poolAddress) {
                setError(`Could not find pool address for pair: ${pair}`);
                storeStopBot(); // Stop via store action
                if (isMountedRef.current) setIsProcessingTrade(false);
                analysisRunning = false;
                return;
            }
            if (isMountedRef.current) setCurrentPoolAddress(poolAddress);

            const result = await assessMarketStructure(poolAddress);
            if (!isMountedRef.current) { analysisRunning = false; return; }

            // --- MODIFICATION START ---
            // Set results but DO NOT transition to 'running' here
            setAnalysisResult(result);
            setMarketCondition(result.condition);

            if (result.condition === 'Unclear') {
                console.log("Market condition unclear, bot will not start.");
                setError("Market condition unclear. Bot stopped.");
                storeStopBot(); // Stop via store action
            } else {
                 console.log(`Initial analysis complete. Market Condition: ${result.condition}. Ready to run.`);
                 // Let the next effect handle the transition based on analysisResult
            }
            // --- MODIFICATION END ---

            if (isMountedRef.current) setIsProcessingTrade(false);
            analysisRunning = false;
        };
        runInitialAnalysis();

    } else if (status === 'running') {
        // Setup interval ONLY if poolAddress and analysisResult are available
        if (!tradingIntervalRef.current && currentPoolAddress && analysisResult && analysisResult.condition !== 'Unclear') {
            console.log(`Setting up trading loop interval: ${settings.runIntervalMinutes} mins.`);
            loopLogic(); // Run first iteration
            tradingIntervalRef.current = setInterval(loopLogic, settings.runIntervalMinutes * 60 * 1000);
        } else if (!currentPoolAddress || !analysisResult || analysisResult.condition === 'Unclear') {
             console.warn("Cannot start trading loop: Missing pool address or valid analysis result.");
             storeStopBot(); // Stop if prerequisites aren't met
        }
    } else if (status === 'stopped') {
        if (tradingIntervalRef.current) {
            clearInterval(tradingIntervalRef.current);
            tradingIntervalRef.current = null;
            console.log("Trading loop stopped.");
        }
    }

    // Cleanup
    return () => {
        isMountedRef.current = false;
        if (tradingIntervalRef.current) {
            clearInterval(tradingIntervalRef.current);
            tradingIntervalRef.current = null;
            console.log("Cleaning up trading loop interval.");
        }
    };
  // Depend on status, pair, currentPoolAddress, analysisResult to ensure loop setup has prerequisites
  // Also include functions called within the effect if they rely on props/state or aren't stable references
  // REMOVED loopLogic from dependencies as it's defined inside
  }, [status, pair, currentPoolAddress, analysisResult, settings.runIntervalMinutes, storeStopBot, setMarketCondition, setError, checkPositionsSLTP, simulateTradeAction, executeRealTradeAction, isProcessingTrade]); // Added dependencies


  // --- NEW Effect to handle transition from Analyzing to Running ---
  useEffect(() => {
    if (status === 'analyzing' && analysisResult && analysisResult.condition !== 'Unclear' && currentPoolAddress) {
        console.log("Analysis complete and valid, transitioning to running state.");
        useBotStore.setState({ status: 'running' });
    }
  }, [status, analysisResult, currentPoolAddress]); // Depends on these states


  // --- Event Handlers ---

  const handleStartBot = () => {
    if (!isWalletConnected || !publicKey) {
      alert("Please connect your Phantom wallet first");
      return;
    }
    setStopLossTriggeredUI(false);
    setStopLossMessageUI('');
    // setError(undefined); // Remove this - setError likely expects a string
    setAnalysisResult(null);
    setCurrentPoolAddress(null); // Reset pool address on start
    // Set state including clearing the error message
    useBotStore.setState({ status: 'analyzing', currentRun: 0, errorMessage: null });
  };

  const handleStopBot = () => {
    storeStopBot(); // Sets status to 'stopped', useEffect clears interval
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
    setSettings({ [name]: parsedValue });
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
