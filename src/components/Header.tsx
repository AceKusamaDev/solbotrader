'use client';

import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import dynamic from 'next/dynamic';

// Dynamically import WalletMultiButton to avoid SSR issues
const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

// Header component using Wallet Adapter context and UI components
const Header = () => {
  const { connected, publicKey } = useWallet(); // Get state from adapter context

  // Note: Balance fetching is removed for simplicity, 
  // it can be added back using the adapter's connection if needed.

  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">SolBotX</h1>
        {!connected && (
          <div className="ml-4 px-3 py-1 bg-yellow-600 text-white rounded-md text-sm">
            Connect Wallet to Start
          </div>
        )}
      </div>
      
      <div className="flex items-center">
        {/* Render the WalletMultiButton component */}
        {/* It handles connect/disconnect logic and displays wallet info */}
        <WalletMultiButton style={{ height: '40px', fontSize: '14px' }} /> 
      </div>
    </header>
  );
};

// Remove the manual Phantom type definition as it's handled by the adapter
// declare global { ... }

export default Header;
