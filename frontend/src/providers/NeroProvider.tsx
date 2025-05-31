"use client";

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
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
  
  // Local state to ensure proper synchronization
  const [contextState, setContextState] = useState({
    isConnected: false,
    walletAddress: null as string | null,
    primaryWallet: null as { address: string; connector?: { name: string } } | null,
  });

  // Sync wallet state with context state
  useEffect(() => {
    console.log('NeroProvider: Wallet state changed:', {
      isConnected: wallet.isConnected,
      walletAddress: wallet.walletAddress,
      loginMethod: wallet.loginMethod,
      isMounted: wallet.isMounted
    });

    // Only update if wallet is mounted to avoid hydration issues
    if (wallet.isMounted) {
      const newPrimaryWallet = wallet.walletAddress ? {
        address: wallet.walletAddress,
        connector: { name: wallet.loginMethod === 'web3auth' ? 'Web3Auth' : 'MetaMask' }
      } : null;

      setContextState({
        isConnected: wallet.isConnected,
        walletAddress: wallet.walletAddress,
        primaryWallet: newPrimaryWallet,
      });

      console.log('NeroProvider: Context state updated:', {
        isConnected: wallet.isConnected,
        walletAddress: wallet.walletAddress,
        primaryWallet: newPrimaryWallet,
      });
    }
  }, [wallet.isConnected, wallet.walletAddress, wallet.loginMethod, wallet.isMounted]);

  // Enhanced disconnect that properly clears all state and navigates
  const handleLogOut = async () => {
    console.log('NeroProvider: Starting logout process...');
    
    try {
      // Set logout flags immediately to prevent auto-reconnection
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('nero-logout-flag', 'true');
        localStorage.setItem('nero-logout-timestamp', Date.now().toString());
        localStorage.setItem('nero-manual-logout', 'true');
      }
      
      // Clear context state immediately
      setContextState({
        isConnected: false,
        walletAddress: null,
        primaryWallet: null,
      });
      
      // Call wallet disconnect
      await wallet.disconnect();
      
      // Clear any additional app-specific storage
      if (typeof window !== 'undefined') {
        // Clear Web3Auth related storage more thoroughly
        const keysToRemove = [
          'Web3Auth-cachedAdapter',
          'openlogin_store',
          'Web3Auth-walletconnect',
          'walletconnect',
          'WALLETCONNECT_DEEPLINK_CHOICE',
          'Web3Auth-torus-app',
          'Web3Auth-torus-user',
          'Web3Auth-torus-wallet',
          'Web3Auth-torus-private-key',
          'Web3Auth-torus-public-key',
          'Web3Auth-torus-ed25519-private-key',
          'Web3Auth-torus-ed25519-public-key',
          'Web3Auth-torus-secp256k1-private-key',
          'Web3Auth-torus-secp256k1-public-key',
        ];
        
        // Remove specific keys
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });
        
        // Clear any other wallet-related storage with broader patterns
        Object.keys(localStorage).forEach(key => {
          const lowerKey = key.toLowerCase();
          if (lowerKey.includes('web3auth') || 
              lowerKey.includes('openlogin') || 
              lowerKey.includes('wallet') ||
              lowerKey.includes('nero') ||
              lowerKey.includes('auth') ||
              lowerKey.includes('torus') ||
              lowerKey.includes('metamask')) {
            // Don't remove our logout flags
            if (key !== 'nero-logout-timestamp' && key !== 'nero-manual-logout') {
              localStorage.removeItem(key);
            }
          }
        });
        
        // Clear sessionStorage as well
        Object.keys(sessionStorage).forEach(key => {
          const lowerKey = key.toLowerCase();
          if (lowerKey.includes('web3auth') || 
              lowerKey.includes('openlogin') || 
              lowerKey.includes('wallet') ||
              lowerKey.includes('nero') ||
              lowerKey.includes('auth') ||
              lowerKey.includes('torus') ||
              lowerKey.includes('metamask')) {
            // Don't remove our logout flag
            if (key !== 'nero-logout-flag') {
              sessionStorage.removeItem(key);
            }
          }
        });
        
        console.log('NeroProvider: Cleared all storage thoroughly');
        
        // Small delay to ensure state is cleared
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log('NeroProvider: Logout completed successfully');
      
      // Navigate to home page instead of login to avoid redirect loops
      if (typeof window !== 'undefined') {
        // Use replace to avoid back button issues
        window.location.replace('/');
      }
      
    } catch (error) {
      console.error('NeroProvider: Error during logout:', error);
      
      // Force navigation even if logout fails
      if (typeof window !== 'undefined') {
        // Clear storage even if disconnect failed
        localStorage.clear();
        sessionStorage.clear();
        sessionStorage.setItem('nero-logout-flag', 'true');
        localStorage.setItem('nero-logout-timestamp', Date.now().toString());
        localStorage.setItem('nero-manual-logout', 'true');
        window.location.replace('/');
      }
    }
  };

  const contextValue: NeroContextType = {
    // Use context state for critical authentication properties
    isConnected: contextState.isConnected,
    walletAddress: contextState.walletAddress,
    primaryWallet: contextState.primaryWallet,
    
    // Use wallet state for other properties
    isLoading: wallet.isLoading,
    aaWalletAddress: wallet.aaWalletAddress,
    user: wallet.user,
    error: wallet.error,
    
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
    handleLogOut,
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