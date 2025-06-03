"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useNeroWallet, UseNeroWalletReturn } from '../hooks/useNeroWallet';

// Extended interface for compatibility with existing codebase
interface NeroContextType extends UseNeroWalletReturn {
  // Legacy compatibility properties
  primaryWallet?: {
    address: string;
    connector: {
      name: string;
    };
  } | null;
  
  // Legacy compatibility methods
  setShowAuthFlow?: (show: boolean) => void;
  handleLogOut?: () => Promise<void>;
}

const NeroContext = createContext<NeroContextType | undefined>(undefined);

interface NeroProviderProps {
  children: ReactNode;
}

export const NeroProvider: React.FC<NeroProviderProps> = ({ children }) => {
  const neroWallet = useNeroWallet();

  // Create primaryWallet for compatibility with existing codebase
  const primaryWallet = neroWallet.isConnected && neroWallet.walletAddress ? {
    address: neroWallet.walletAddress,
    connector: {
      name: 'Web3Auth'
    }
  } : null;

  // Legacy compatibility methods
  const setShowAuthFlow = (show: boolean) => {
    // This is a no-op since Web3Auth handles its own modal
  };

  const handleLogOut = async () => {
    await neroWallet.disconnect();
  };

  const contextValue: NeroContextType = {
    ...neroWallet,
    primaryWallet,
    setShowAuthFlow,
    handleLogOut,
  };

  return (
    <NeroContext.Provider value={contextValue}>
      {children}
    </NeroContext.Provider>
  );
};

export const useNeroContext = (): NeroContextType => {
  const context = useContext(NeroContext);
  if (context === undefined) {
    throw new Error('useNeroContext must be used within a NeroProvider');
  }
  return context;
};

export default NeroProvider; 