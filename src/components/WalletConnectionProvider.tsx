'use client';

import React from 'react';

// Simplified WalletConnectionProvider that doesn't use @solana libraries
export default function WalletConnectionProvider({ children }: { children: React.ReactNode }) {
  // This is just a wrapper component now - all wallet functionality is in Header.tsx
  return (
    <>{children}</>
  );
}
