"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNeroContext } from './NeroProvider';

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string | null;
  fitTokens: number;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  claimTokens: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const neroContext = useNeroContext();
  const [fitTokens, setFitTokens] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nerofit.onrender.com';

  const fetchUserData = useCallback(async (address: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user-data/${address}`);
      if (response.ok) {
        const data = await response.json();
        setFitTokens(data.fitTokens || 0);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [API_BASE_URL]);

  // Sync with NERO wallet state
  useEffect(() => {
    if (neroContext.walletAddress) {
      fetchUserData(neroContext.walletAddress);
    } else {
      setFitTokens(0);
    }
  }, [neroContext.walletAddress, fetchUserData]);

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await neroContext.connect();
      
      if (neroContext.walletAddress) {
        // Register wallet with backend
        await registerWallet(neroContext.walletAddress);
        await fetchUserData(neroContext.walletAddress);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      console.error('Wallet connection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await neroContext.disconnect();
      setFitTokens(0);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect wallet';
      setError(errorMessage);
      console.error('Wallet disconnection error:', err);
    }
  };

  const registerWallet = async (address: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/connect-wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: address }),
      });

      if (!response.ok) {
        throw new Error('Failed to register wallet');
      }

      const data = await response.json();
      console.log('Wallet registered:', data);
    } catch (error) {
      console.error('Error registering wallet:', error);
      // Don't throw here as this is not critical for wallet connection
    }
  };

  const claimTokens = async () => {
    if (!neroContext.walletAddress) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/claim-tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: neroContext.walletAddress }),
      });

      if (!response.ok) {
        throw new Error('Failed to claim tokens');
      }

      const data = await response.json();
      
      // Update local token count
      await fetchUserData(neroContext.walletAddress);
      
      console.log('Tokens claimed:', data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to claim tokens';
      setError(errorMessage);
      console.error('Error claiming tokens:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const value: WalletContextType = {
    isConnected: neroContext.isConnected,
    walletAddress: neroContext.walletAddress,
    fitTokens,
    connectWallet,
    disconnectWallet,
    claimTokens,
    isLoading: isLoading || neroContext.isLoading,
    error: error || neroContext.error,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}; 