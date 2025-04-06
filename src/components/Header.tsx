'use client';

import React, { useState, useEffect } from 'react';

// Updated Header component with proper Phantom wallet integration
const Header = () => {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [isPhantomAvailable, setIsPhantomAvailable] = useState(false);
  
  // Check if Phantom is available (only runs in browser)
  useEffect(() => {
    const checkPhantomAvailability = () => {
      if (typeof window !== 'undefined') {
        // Set a flag to indicate we've checked for Phantom
        setIsPhantomAvailable(window.phantom?.solana?.isPhantom || false);
      }
    };
    
    // Check immediately
    checkPhantomAvailability();
    
    // Also set up an event listener for when Phantom might be injected later
    if (typeof window !== 'undefined') {
      window.addEventListener('load', checkPhantomAvailability);
      
      // Clean up
      return () => {
        window.removeEventListener('load', checkPhantomAvailability);
      };
    }
  }, []);
  
  // Function to connect to Phantom wallet
  const connectWallet = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      // Double-check if Phantom is installed
      if (!window.phantom?.solana?.isPhantom) {
        alert("Phantom wallet is not installed. Please install it from https://phantom.app/");
        return;
      }
      
      // Connect to wallet
      const response = await window.phantom.solana.connect();
      const walletPublicKey = response.publicKey.toString();
      setPublicKey(walletPublicKey);
      setConnected(true);
      
      // Get balance (using proper error handling)
      try {
        const balanceResponse = await fetch(`https://api.mainnet-beta.solana.com`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getBalance",
            "params": [walletPublicKey]
          })
        });
        
        const balanceData = await balanceResponse.json();
        if (balanceData.result?.value) {
          setBalance(balanceData.result.value / 1000000000); // Convert lamports to SOL
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
        // Still consider connected even if balance fetch fails
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error);
    }
  };
  
  // Function to disconnect wallet
  const disconnectWallet = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      if (window.phantom?.solana) {
        await window.phantom.solana.disconnect();
        setConnected(false);
        setPublicKey(null);
        setBalance(null);
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };
  
  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window === 'undefined' || !window.phantom?.solana?.isPhantom) return;
      
      try {
        // Try to reconnect if already authorized
        const response = await window.phantom.solana.connect({ onlyIfTrusted: true });
        setPublicKey(response.publicKey.toString());
        setConnected(true);
        
        // Get balance
        try {
          const balanceResponse = await fetch(`https://api.mainnet-beta.solana.com`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              "jsonrpc": "2.0",
              "id": 1,
              "method": "getBalance",
              "params": [response.publicKey.toString()]
            })
          });
          
          const balanceData = await balanceResponse.json();
          if (balanceData.result?.value) {
            setBalance(balanceData.result.value / 1000000000); // Convert lamports to SOL
          }
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      } catch (error) {
        // This is expected if the wallet is not already connected
        console.log('Wallet not already connected:', error);
      }
    };
    
    // Only run this effect in the browser
    if (typeof window !== 'undefined' && window.phantom?.solana) {
      checkWalletConnection();
    }
  }, [isPhantomAvailable]);
  
  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">SolBotX</h1>
        {!connected && (
          <div className="ml-4 px-3 py-1 bg-yellow-600 text-white rounded-md">
            Connect Wallet to Start
          </div>
        )}
      </div>
      
      <div className="flex items-center">
        {connected && balance !== null && (
          <div className="mr-4 px-3 py-1 bg-gray-800 rounded-md">
            Balance: {balance.toFixed(4)} SOL
          </div>
        )}
        {connected && publicKey && (
          <div className="mr-4 px-3 py-1 bg-gray-800 rounded-md">
            {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
          </div>
        )}
        {!connected ? (
          <button 
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={!isPhantomAvailable}
          >
            {isPhantomAvailable ? 'Connect Wallet' : 'Phantom Not Detected'}
          </button>
        ) : (
          <button 
            onClick={disconnectWallet}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Disconnect
          </button>
        )}
      </div>
    </header>
  );
};

// Add type definition for Phantom wallet
declare global {
  interface Window {
    phantom?: {
      solana?: {
        isPhantom?: boolean;
        connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
        disconnect: () => Promise<void>;
      };
    };
  }
}

export default Header;
