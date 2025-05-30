"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

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
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
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

  const checkWalletConnection = useCallback(async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          
          // Store wallet connection state for AuthProvider
          localStorage.setItem('walletConnected', 'true');
          localStorage.setItem('walletAddress', accounts[0]);
          
          await fetchUserData(accounts[0]);
        } else {
          // Clear localStorage if no accounts found
          localStorage.removeItem('walletConnected');
          localStorage.removeItem('walletAddress');
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
        localStorage.removeItem('walletConnected');
        localStorage.removeItem('walletAddress');
      }
    }
  }, [fetchUserData]);

  // Check if wallet is already connected on page load
  useEffect(() => {
    checkWalletConnection();
  }, [checkWalletConnection]);

  const connectWallet = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please make sure MetaMask is unlocked.');
      }

      const address = accounts[0];
      setWalletAddress(address);
      setIsConnected(true);
      
      // Store wallet connection state for AuthProvider
      localStorage.setItem('walletConnected', 'true');
      localStorage.setItem('walletAddress', address);

      // Register wallet with backend
      await registerWallet(address);
      await fetchUserData(address);

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      console.error('Wallet connection error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress(null);
    setFitTokens(0);
    setError(null);
    
    // Clear wallet connection state from localStorage
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
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
    if (!walletAddress) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/claim-tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });

      if (!response.ok) {
        throw new Error('Failed to claim tokens');
      }

      const data = await response.json();
      
      // Update local token count
      await fetchUserData(walletAddress);
      
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
    isConnected,
    walletAddress,
    fitTokens,
    connectWallet,
    disconnectWallet,
    claimTokens,
    isLoading,
    error,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}; 