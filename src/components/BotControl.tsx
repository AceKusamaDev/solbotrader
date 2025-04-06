'use client';

import React, { useState, useEffect } from 'react';
import { DEFAULT_STOP_LOSS_CONFIG, Position, checkStopLoss, formatStopLossMessage } from '@/lib/safetyFeatures';
import useJupiterTrading, { SOL_MINT, USDC_MINT } from '@/lib/jupiter.ts';

// Define StrategyParams interface
export interface StrategyParams {
  type: string;
  indicators: Array<{
    type: string;
    parameters: any;
  }>;
  amount: number;
  pair: string;
  action: 'buy' | 'sell';
}

// BotControl component with real trading functionality
const BotControl = ({ strategyParams }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isTestMode, setIsTestMode] = useState(true);
  const [lastTrade, setLastTrade] = useState(null);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [activePositions, setActivePositions] = useState<Position[]>([]);
  const [stopLossConfig, setStopLossConfig] = useState(DEFAULT_STOP_LOSS_CONFIG);
  const [stopLossTriggered, setStopLossTriggered] = useState(false);
  const [stopLossMessage, setStopLossMessage] = useState('');
  const [tradingInterval, setTradingInterval] = useState<NodeJS.Timeout | null>(null);
  const [isProcessingTrade, setIsProcessingTrade] = useState(false);
  
  // Get Jupiter trading functions
  const { executeTradeWithStrategy, isWalletConnected, walletPublicKey } = useJupiterTrading();
  
  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (tradingInterval) {
        clearInterval(tradingInterval);
      }
    };
  }, [tradingInterval]);
  
  // Function to start trading bot
  const startBot = async () => {
    if (!isWalletConnected || !walletPublicKey) {
      alert("Please connect your Phantom wallet first");
      return;
    }
    
    setIsRunning(true);
    setStopLossTriggered(false);
    setStopLossMessage('');
    
    if (isTestMode) {
      simulateTrading();
    } else {
      // Real trading mode
      startRealTrading();
    }
  };
  
  // Function to stop trading bot
  const stopBot = () => {
    setIsRunning(false);
    if (tradingInterval) {
      clearInterval(tradingInterval);
      setTradingInterval(null);
    }
  };
  
  // Function to toggle test mode
  const toggleTestMode = () => {
    if (isRunning) {
      alert("Please stop the bot before changing modes");
      return;
    }
    setIsTestMode(!isTestMode);
  };
  
  // Function to handle stop loss
  const handleStopLoss = async (position: Position, currentPrice: number) => {
    if (checkStopLoss(position, currentPrice, stopLossConfig)) {
      // Stop loss triggered
      const message = formatStopLossMessage(position, currentPrice, stopLossConfig);
      console.log(message);
      
      if (!isTestMode) {
        // Execute real exit trade for stop loss
        try {
          setIsProcessingTrade(true);
          
          // Determine token mints based on pair
          const [baseCurrency, quoteCurrency] = position.pair.split('/');
          const inputMint = position.action === 'buy' ? SOL_MINT : USDC_MINT;
          const outputMint = position.action === 'buy' ? USDC_MINT : SOL_MINT;
          
          // Execute opposite action for exit
          const exitAction = position.action === 'buy' ? 'sell' : 'buy';
          
          // Convert amount to lamports/smallest unit
          const amountInSmallestUnit = (position.amount * 1000000000).toString(); // For SOL to lamports
          
          // Execute trade with Jupiter
          const result = await executeTradeWithStrategy(
            inputMint,
            outputMint,
            amountInSmallestUnit,
            stopLossConfig.slippage,
            'Stop Loss'
          );
          
          if (result.success) {
            // Create exit trade record
            const now = new Date();
            const exitTrade = {
              timestamp: now.toISOString(),
              pair: position.pair,
              action: exitAction,
              amount: position.amount,
              price: currentPrice.toFixed(2),
              strategy: 'Stop Loss',
              success: true,
              signature: result.signature,
            };
            
            // Update trade history
            setLastTrade(exitTrade);
            setTradeHistory(prev => [exitTrade, ...prev].slice(0, 10));
            
            // Remove position from active positions
            setActivePositions(prev => prev.filter(p => p.id !== position.id));
            
            // Set stop loss message
            setStopLossTriggered(true);
            setStopLossMessage(message);
          } else {
            console.error('Stop loss trade failed:', result.error);
          }
        } catch (error) {
          console.error('Error executing stop loss:', error);
        } finally {
          setIsProcessingTrade(false);
        }
      } else {
        // Test mode - simulate exit trade
        const exitAction = position.action === 'buy' ? 'sell' : 'buy';
        const now = new Date();
        const exitTrade = {
          timestamp: now.toISOString(),
          pair: position.pair,
          action: exitAction,
          amount: position.amount,
          price: currentPrice.toFixed(2),
          strategy: 'Stop Loss',
          success: true,
          signature: 'simulated_stop_loss_' + Math.random().toString(36).substring(2, 15),
        };
        
        // Update trade history
        setLastTrade(exitTrade);
        setTradeHistory(prev => [exitTrade, ...prev].slice(0, 10));
        
        // Remove position from active positions
        setActivePositions(prev => prev.filter(p => p.id !== position.id));
        
        // Set stop loss message
        setStopLossTriggered(true);
        setStopLossMessage(message);
      }
      
      return true;
    }
    return false;
  };
  
  // Simulate trading activity for demonstration (test mode only)
  const simulateTrading = () => {
    const interval = setInterval(() => {
      if (!isRunning) {
        clearInterval(interval);
        return;
      }
      
      const now = new Date();
      const action = Math.random() > 0.5 ? 'buy' : 'sell';
      const price = parseFloat((Math.random() * 100 + 50).toFixed(2));
      const amount = parseFloat((Math.random() * strategyParams.amount).toFixed(3));
      
      // Create simulated trade
      const trade = {
        timestamp: now.toISOString(),
        pair: strategyParams.pair,
        action,
        amount,
        price,
        strategy: strategyParams.type,
        success: Math.random() > 0.1, // 90% success rate
        signature: 'simulated_tx_' + Math.random().toString(36).substring(2, 15),
      };
      
      // Update trade history
      setLastTrade(trade);
      setTradeHistory(prev => [trade, ...prev].slice(0, 10));
      
      // If trade is successful, add to active positions
      if (trade.success) {
        const newPosition: Position = {
          id: `pos-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          pair: trade.pair,
          entryPrice: price,
          amount,
          timestamp: trade.timestamp,
          action: action as 'buy' | 'sell',
        };
        
        setActivePositions(prev => [...prev, newPosition]);
      }
      
      // Check stop loss for all active positions
      setActivePositions(prev => {
        const updatedPositions = [...prev];
        
        // Simulate price movement for each position
        for (const position of [...updatedPositions]) {
          // Simulate current price with some random movement
          const priceMovement = (Math.random() * 6) - 3; // -3% to +3%
          const currentPrice = position.entryPrice * (1 + priceMovement / 100);
          
          // Check if stop loss should be triggered
          handleStopLoss(position, currentPrice);
        }
        
        return updatedPositions.filter(p => 
          !handleStopLoss(p, p.entryPrice * (1 - (Math.random() * 5) / 100))
        );
      });
      
    }, 10000); // Simulate a trade every 10 seconds
    
    setTradingInterval(interval);
  };
  
  // Start real trading with Jupiter
  const startRealTrading = async () => {
    if (!isWalletConnected || !walletPublicKey) {
      alert("Please connect your Phantom wallet first");
      return;
    }
    
    // Execute initial trade based on strategy parameters
    await executeRealTrade();
    
    // Set up interval for periodic trading
    const interval = setInterval(async () => {
      if (!isRunning) {
        clearInterval(interval);
        return;
      }
      
      // Execute trade based on strategy
      await executeRealTrade();
      
      // Check stop loss for all active positions
      const currentPrice = await fetchCurrentPrice(strategyParams.pair);
      
      if (currentPrice) {
        for (const position of [...activePositions]) {
          await handleStopLoss(position, currentPrice);
        }
      }
      
    }, 60000); // Execute a trade every minute
    
    setTradingInterval(interval);
  };
  
  // Execute a real trade using Jupiter
  const executeRealTrade = async () => {
    if (isProcessingTrade) return;
    
    try {
      setIsProcessingTrade(true);
      
      // Determine token mints based on pair
      const [baseCurrency, quoteCurrency] = strategyParams.pair.split('/');
      const inputMint = strategyParams.action === 'buy' ? USDC_MINT : SOL_MINT;
      const outputMint = strategyParams.action === 'buy' ? SOL_MINT : USDC_MINT;
      
      // Convert amount to lamports/smallest unit
      const amountInSmallestUnit = (strategyParams.amount * 1000000000).toString(); // For SOL to lamports
      
      console.log(`Executing real trade: ${strategyParams.action} ${strategyParams.amount} ${strategyParams.pair}`);
      
      // Execute trade with Jupiter
      const result = await executeTradeWithStrategy(
        inputMint,
        outputMint,
        amountInSmallestUnit,
        0.5, // 0.5% slippage
        strategyParams.type
      );
      
      console.log('Trade result:', result);
      
      if (result.success) {
        // Get current price
        const currentPrice = await fetchCurrentPrice(strategyParams.pair) || 
                            parseFloat((Math.random() * 100 + 50).toFixed(2)); // Fallback to random price
        
        // Create trade record
        const now = new Date();
        const trade = {
          timestamp: now.toISOString(),
          pair: strategyParams.pair,
          action: strategyParams.action,
          amount: strategyParams.amount,
          price: currentPrice.toFixed(2),
          strategy: strategyParams.type,
          success: true,
          signature: result.signature,
        };
        
        // Update trade history
        setLastTrade(trade);
        setTradeHistory(prev => [trade, ...prev].slice(0, 10));
        
        // Add to active positions
        const newPosition: Position = {
          id: `pos-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          pair: trade.pair,
          entryPrice: currentPrice,
          amount: strategyParams.amount,
          timestamp: trade.timestamp,
          action: strategyParams.action as 'buy' | 'sell',
        };
        
        setActivePositions(prev => [...prev, newPosition]);
      } else {
        // Handle failed trade
        console.error('Trade failed:', result.error);
        
        // Create failed trade record
        const now = new Date();
        const failedTrade = {
          timestamp: now.toISOString(),
          pair: strategyParams.pair,
          action: strategyParams.action,
          amount: strategyParams.amount,
          price: '0',
          strategy: strategyParams.type,
          success: false,
          error: result.error,
        };
        
        // Update trade history
        setLastTrade(failedTrade);
        setTradeHistory(prev => [failedTrade, ...prev].slice(0, 10));
      }
    } catch (error) {
      console.error('Error executing trade:', error);
    } finally {
      setIsProcessingTrade(false);
    }
  };
  
  // Fetch current price for a trading pair
  const fetchCurrentPrice = async (pair: string) => {
    try {
      // In a real implementation, this would fetch the current price from an API
      // For now, we'll use a simple fetch to CoinGecko for SOL price
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const data = await response.json();
      
      if (data && data.solana && data.solana.usd) {
        return data.solana.usd;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching price:', error);
      return null;
    }
  };
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Bot Control</h2>
      
      <div className="flex items-center mb-4">
        <span className="mr-2">Test Mode:</span>
        <button 
          onClick={toggleTestMode}
          className={`px-3 py-1 rounded-md ${isTestMode ? 'bg-green-600' : 'bg-gray-600'}`}
          disabled={isRunning}
        >
          {isTestMode ? 'Enabled' : 'Disabled'}
        </button>
        {!isTestMode && (
          <span className="ml-2 text-red-500 text-sm">Warning: Real trading enabled!</span>
        )}
      </div>
      
      <div className="flex items-center mb-4">
        <span className="mr-2">Stop Loss (2.5%):</span>
        <button 
          onClick={() => setStopLossConfig({...stopLossConfig, enabled: !stopLossConfig.enabled})}
          className={`px-3 py-1 rounded-md ${stopLossConfig.enabled ? 'bg-green-600' : 'bg-gray-600'}`}
        >
          {stopLossConfig.enabled ? 'Enabled' : 'Disabled'}
        </button>
      </div>
      
      <div className="flex space-x-4 mb-6">
        {!isRunning ? (
          <button 
            onClick={startBot}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            disabled={!isWalletConnected || isProcessingTrade}
          >
            {isProcessingTrade ? 'Processing...' : 'Start Trading'}
          </button>
        ) : (
          <button 
            onClick={stopBot}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            disabled={isProcessingTrade}
          >
            Stop Trading
          </button>
        )}
      </div>
      
      {isRunning && (
        <div className="bg-gray-900 p-4 rounded-md">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span>Bot is running with {strategyParams.type} strategy</span>
          </div>
        </div>
      )}
      
      {stopLossTriggered && (
        <div className="mt-4 bg-red-900/50 p-4 rounded-md">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-red-300">{stopLossMessage}</span>
          </div>
        </div>
      )}
      
      {activePositions.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Active Positions</h3>
          <div className="bg-gray-900 p-3 rounded-md">
            {activePositions.map((position) => (
              <div key={position.id} className="border-b border-gray-700 py-2 last:border-0">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Pair: {position.pair}</div>
                  <div>Action: <span className={position.action === 'buy' ? 'text-green-500' : 'text-red-500'}>{position.action}</span></div>
                  <div>Amount: {position.amount}</div>
                  <div>Entry Price: ${position.entryPrice.toFixed(2)}</div>
                  <div>Stop Loss: ${(position.action === 'buy' 
                    ? position.entryPrice * (1 - stopLossConfig.percentage / 100) 
                    : position.entryPrice * (1 + stopLossConfig.percentage / 100)).toFixed(2)}</div>
                  <div>Time: {new Date(position.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {lastTrade && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Last Trade</h3>
          <div className="bg-gray-900 p-3 rounded-md">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Pair: {lastTrade.pair}</div>
              <div>Action: <span className={lastTrade.action === 'buy' ? 'text-green-500' : 'text-red-500'}>{lastTrade.action}</span></div>
              <div>Amount: {lastTrade.amount}</div>
              <div>Price: ${lastTrade.price}</div>
              <div>Status: {lastTrade.success ? 'Success' : 'Failed'}</div>
              <div>Time: {new Date(lastTrade.timestamp).toLocaleTimeString()}</div>
              {lastTrade.signature && (
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
            </div>
          </div>
        </div>
      )}
      
      {tradeHistory.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Recent Trades</h3>
          <div className="max-h-40 overflow-y-auto">
            {tradeHistory.map((trade, index) => (
              <div key={index} className="bg-gray-900 p-2 rounded-md mb-2 text-xs">
                <div className="flex justify-between">
                  <span>{trade.pair} - {trade.action.toUpperCase()}</span>
                  <span>{new Date(trade.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{trade.amount} @ ${trade.price}</span>
                  <span className={trade.success ? 'text-green-500' : 'text-red-500'}>
                    {trade.success ? 'Success' : 'Failed'}
                  </span>
                </div>
                {trade.signature && (
                  <div className="mt-1">
                    <a 
                      href={`https://solscan.io/tx/${trade.signature}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline text-xs"
                    >
                      View on Solscan
                    </a>
                  </div>
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
