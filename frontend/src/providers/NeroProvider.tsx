"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useNeroWallet } from '../hooks/useNeroWallet';
import { useSendUserOp } from '../hooks/useSendUserOp';
import { useConfig } from '../hooks/useConfig';

// NERO Context following their high-level documentation pattern
interface NeroContextType {
  // Wallet state
  isConnected: boolean;
  isLoading: boolean;
  walletAddress: string | null;
  aaWalletAddress: string | null;
  user: any;
  error: string | null;
  
  // Legacy compatibility for existing codebase
  primaryWallet: {
    address: string;
    connector?: { name: string };
  } | null;
  
  // Wallet actions
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  getUserInfo: () => Promise<any>;
  getAccounts: () => Promise<string[]>;
  getBalance: () => Promise<string>;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (transaction: any) => Promise<string>;
  
  // UserOp actions (NERO's high-level pattern)
  execute: (operation: any) => Promise<string>;
  waitForUserOpResult: () => Promise<any>;
  userOpLoading: boolean;
  userOpError: string | null;
  userOpHash: string | null;
  
  // Configuration
  config: any;
  
  // Legacy compatibility methods
  setShowAuthFlow?: (show: boolean) => void;
  handleLogOut?: () => Promise<void>;
}

const NeroContext = createContext<NeroContextType | undefined>(undefined);

interface NeroProviderProps {
  children: ReactNode;
}

// NERO Provider following their high-level documentation
export const NeroProvider: React.FC<NeroProviderProps> = ({ children }) => {
  const wallet = useNeroWallet();
  const userOp = useSendUserOp();
  const config = useConfig();

  // Create primaryWallet object for compatibility with existing codebase
  const primaryWallet = wallet.walletAddress ? {
    address: wallet.walletAddress,
    connector: { name: 'MetaMask' }
  } : null;

  const contextValue: NeroContextType = {
    // Wallet state
    isConnected: wallet.isConnected,
    isLoading: wallet.isLoading,
    walletAddress: wallet.walletAddress,
    aaWalletAddress: wallet.aaWalletAddress,
    user: wallet.user,
    error: wallet.error,
    
    // Legacy compatibility
    primaryWallet,
    
    // Wallet actions
    connect: wallet.connect,
    disconnect: wallet.disconnect,
    getUserInfo: wallet.getUserInfo,
    getAccounts: wallet.getAccounts,
    getBalance: wallet.getBalance,
    signMessage: wallet.signMessage,
    sendTransaction: wallet.sendTransaction,
    
    // UserOp actions (NERO's high-level pattern)
    execute: userOp.execute,
    waitForUserOpResult: userOp.waitForUserOpResult,
    userOpLoading: userOp.isLoading,
    userOpError: userOp.error,
    userOpHash: userOp.userOpHash,
    
    // Configuration
    config,
    
    // Legacy compatibility methods
    setShowAuthFlow: () => {}, // No-op for compatibility
    handleLogOut: wallet.disconnect,
  };

  return (
    <NeroContext.Provider value={contextValue}>
      {children}
    </NeroContext.Provider>
  );
};

// Hook to use NERO context
export const useNeroContext = () => {
  const context = useContext(NeroContext);
  if (context === undefined) {
    throw new Error('useNeroContext must be used within a NeroProvider');
  }
  return context;
};

export default NeroProvider; 