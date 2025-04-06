'use client';

import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { useState, useEffect } from 'react';

// Constants for Jupiter API
const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v6/quote';
const JUPITER_SWAP_API = 'https://quote-api.jup.ag/v6/swap';

// Token constants
export const SOL_MINT = 'So11111111111111111111111111111111111111112';
export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

// Interface for quote parameters
interface QuoteParams {
  inputMint: string;
  outputMint: string;
  amount: string;
  slippageBps: number;
}

// Interface for swap parameters
interface SwapParams {
  quoteResponse: any;
  userPublicKey: string;
}

// Get quote from Jupiter
export const getJupiterQuote = async (params: QuoteParams) => {
  try {
    const { inputMint, outputMint, amount, slippageBps } = params;
    
    const queryParams = new URLSearchParams({
      inputMint,
      outputMint,
      amount,
      slippageBps: slippageBps.toString(),
    });
    
    const response = await fetch(`${JUPITER_QUOTE_API}?${queryParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Jupiter quote API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Jupiter quote:', error);
    throw error;
  }
};

// Prepare swap transaction
export const prepareJupiterSwapTransaction = async (params: SwapParams) => {
  try {
    const { quoteResponse, userPublicKey } = params;
    
    const response = await fetch(JUPITER_SWAP_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quoteResponse,
        userPublicKey,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Jupiter swap API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error preparing Jupiter swap transaction:', error);
    throw error;
  }
};

// Execute swap transaction
export const executeJupiterSwap = async (swapTransaction: any, wallet: any, connection: Connection) => {
  try {
    let transaction;
    
    // Handle different transaction formats
    if (swapTransaction.versionedTransaction) {
      // Handle versioned transaction
      const serializedTransaction = Buffer.from(swapTransaction.versionedTransaction, 'base64');
      transaction = VersionedTransaction.deserialize(serializedTransaction);
    } else if (swapTransaction.transaction) {
      // Handle legacy transaction
      const serializedTransaction = Buffer.from(swapTransaction.transaction, 'base64');
      transaction = Transaction.from(serializedTransaction);
    } else {
      throw new Error('Invalid transaction format received from Jupiter');
    }
    
    // Sign and send transaction
    const signature = await wallet.sendTransaction(transaction, connection);
    
    // Wait for confirmation
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');
    
    return {
      signature,
      confirmation,
    };
  } catch (error) {
    console.error('Error executing Jupiter swap:', error);
    throw error;
  }
};

// Hook for trading functionality
const useJupiterTrading = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletPublicKey, setWalletPublicKey] = useState<string | null>(null);
  const [wallet, setWallet] = useState<any>(null);
  
  // Check if wallet is connected
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window !== 'undefined' && window.phantom?.solana) {
        try {
          // Check if already connected
          const isPhantomConnected = window.phantom.solana.isConnected;
          
          if (isPhantomConnected) {
            const response = await window.phantom.solana.connect({ onlyIfTrusted: true });
            setWalletPublicKey(response.publicKey.toString());
            setIsWalletConnected(true);
            setWallet(window.phantom.solana);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };
    
    checkWalletConnection();
    
    // Set up event listener for wallet connection changes
    const handleWalletConnectionChange = () => {
      checkWalletConnection();
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('phxAccountChanged', handleWalletConnectionChange);
      window.addEventListener('phxDisconnected', () => {
        setIsWalletConnected(false);
        setWalletPublicKey(null);
        setWallet(null);
      });
      window.addEventListener('phxConnected', () => {
        checkWalletConnection();
      });
      
      return () => {
        window.removeEventListener('phxAccountChanged', handleWalletConnectionChange);
        window.removeEventListener('phxDisconnected', () => {
          setIsWalletConnected(false);
          setWalletPublicKey(null);
          setWallet(null);
        });
        window.removeEventListener('phxConnected', checkWalletConnection);
      };
    }
  }, []);
  
  // Execute trade with strategy
  const executeTradeWithStrategy = async (
    inputToken: string,
    outputToken: string,
    amount: string,
    slippage: number,
    strategy: string
  ) => {
    if (!isWalletConnected || !walletPublicKey || !wallet) {
      return {
        success: false,
        error: 'Wallet not connected',
      };
    }
    
    try {
      // Create connection to Solana
      const connection = new Connection(
        process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com', 
        'confirmed'
      );
      
      // Apply strategy parameters (this would be expanded based on strategy type)
      const slippageBps = slippage * 100; // Convert percentage to basis points
      
      // Get quote from Jupiter
      console.log(`Getting quote for ${amount} ${inputToken} to ${outputToken} with ${slippage}% slippage`);
      const quoteResponse = await getJupiterQuote({
        inputMint: inputToken,
        outputMint: outputToken,
        amount,
        slippageBps,
      });
      
      console.log('Quote received:', quoteResponse);
      
      // Prepare swap transaction
      console.log('Preparing swap transaction...');
      const swapResponse = await prepareJupiterSwapTransaction({
        quoteResponse,
        userPublicKey: walletPublicKey,
      });
      
      console.log('Swap transaction prepared:', swapResponse);
      
      // Execute swap
      console.log('Executing swap...');
      const result = await executeJupiterSwap(swapResponse, wallet, connection);
      
      console.log('Swap executed:', result);
      
      return {
        success: true,
        signature: result.signature,
        inputAmount: amount,
        expectedOutputAmount: quoteResponse.outAmount,
        strategy,
      };
    } catch (error) {
      console.error('Trade execution error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
  
  return {
    executeTradeWithStrategy,
    isWalletConnected,
    walletPublicKey,
  };
};

export default useJupiterTrading;
