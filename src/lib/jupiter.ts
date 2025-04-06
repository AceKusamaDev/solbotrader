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
      let errorBody = `Status: ${response.status} ${response.statusText}`;
      try {
        const jsonError = await response.json();
        errorBody = JSON.stringify(jsonError);
      } catch (e) {
        // Ignore if response body is not JSON
      }
      console.error('Jupiter quote API error response:', errorBody);
      throw new Error(`Jupiter quote API error: ${errorBody}`);
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
      let errorBody = `Status: ${response.status} ${response.statusText}`;
      try {
        const jsonError = await response.json();
        errorBody = JSON.stringify(jsonError);
      } catch (e) {
        // Ignore if response body is not JSON
      }
      console.error('Jupiter swap API error response:', errorBody);
      throw new Error(`Jupiter swap API error: ${errorBody}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error preparing Jupiter swap transaction:', error);
    throw error;
  }
};

// Execute swap transaction
// Renamed parameter from swapTransaction to swapResponseData for clarity
export const executeJupiterSwap = async (swapResponseData: any, wallet: any, connection: Connection) => { 
  try {
    let transaction;
    const base64Transaction = swapResponseData.swapTransaction; // Get the base64 string directly

    // Check if the base64 string exists
    if (base64Transaction && typeof base64Transaction === 'string') {
      // Deserialize the VersionedTransaction
      const serializedTransaction = Buffer.from(base64Transaction, 'base64');
      transaction = VersionedTransaction.deserialize(serializedTransaction);
    } else {
      // Log the unexpected structure and throw error
      console.error('Unexpected swap response structure or missing swapTransaction field:', swapResponseData);
      throw new Error('Invalid transaction format received from Jupiter API');
    }

    // Sign and send transaction
    let signature;
    try {
      signature = await wallet.sendTransaction(transaction, connection);
      console.log('Transaction sent, signature:', signature);
    } catch (signError) {
      console.error('Error signing/sending transaction:', signError);
      throw signError; // Re-throw the specific error
    }

    // Wait for confirmation
    let confirmation;
    try {
      confirmation = await connection.confirmTransaction(signature, 'confirmed');
      console.log('Transaction confirmed:', confirmation);
    } catch (confirmError) {
      console.error('Error confirming transaction:', confirmError);
      // Optionally, you might want to handle confirmation errors differently
      // For now, we'll re-throw
      throw confirmError;
    }

    return {
      signature,
      confirmation,
    };
  } catch (error) {
    // Log the full error object for better debugging
    console.error('Full error object during Jupiter swap execution:', error);
    // Keep the original error throwing behavior
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
          // Attempt to connect silently if already trusted by the user
          const response = await window.phantom.solana.connect({ onlyIfTrusted: true });
          // If connect succeeds, the wallet is connected and trusted
          setWalletPublicKey(response.publicKey.toString());
          setIsWalletConnected(true);
          setWallet(window.phantom.solana);
        } catch (error) {
          // Handle error (e.g., wallet not connected or user rejected connection)
          // We can log this, but essentially means the wallet isn't connected for our purposes here.
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
      // Log the full error object for better debugging
      console.error('Full error object during trade execution:', error);
      return {
        success: false,
        // Provide more detail if available, otherwise keep original message
        error: error instanceof Error ? error.message : JSON.stringify(error),
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
