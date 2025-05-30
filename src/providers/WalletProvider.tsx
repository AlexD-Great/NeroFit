"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import apiService, { UserData } from '../services/api';

interface WalletContextType {
  walletAddress: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  fitTokens: number;
  userData: UserData | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshUserData: () => Promise<void>;
  isBackendConnected: boolean;
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
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [fitTokens, setFitTokens] = useState(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Check backend health on mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const isHealthy = await apiService.healthCheck();
        setIsBackendConnected(isHealthy);
        if (!isHealthy) {
          console.warn('Backend is not responding. Some features may not work.');
        }
      } catch (error) {
        console.error('Failed to check backend health:', error);
        setIsBackendConnected(false);
      }
    };

    checkBackendHealth();
  }, []);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setIsConnected(true);
            await fetchUserData(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          await fetchUserData(accounts[0]);
        } else {
          disconnectWallet();
        }
      };

      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  const fetchUserData = async (address: string) => {
    if (!isBackendConnected) {
      // Fallback to mock data if backend is not available
      const mockData: UserData = {
        fitTokens: '125',
        challengeCompleted: true,
        totalChallengesCompleted: 47,
        totalTokensEarned: 1250,
        currentStreak: 7,
        rank: 23,
        level: 8,
      };
      setUserData(mockData);
      setFitTokens(parseInt(mockData.fitTokens));
      return;
    }

    try {
      const data = await apiService.getUserData(address);
      setUserData(data);
      setFitTokens(parseInt(data.fitTokens) || 0);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Fallback to mock data on error
      const mockData: UserData = {
        fitTokens: '125',
        challengeCompleted: true,
        totalChallengesCompleted: 47,
        totalTokensEarned: 1250,
        currentStreak: 7,
        rank: 23,
        level: 8,
      };
      setUserData(mockData);
      setFitTokens(parseInt(mockData.fitTokens));
    }
  };

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      throw new Error('MetaMask is not installed');
    }

    setIsConnecting(true);
    try {
      // Request account access
      const accounts = await (window as any).ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];
      setWalletAddress(address);
      setIsConnected(true);

      // Connect to backend if available
      if (isBackendConnected) {
        try {
          // Create a message to sign for verification
          const message = `Connect to NeroFit at ${new Date().toISOString()}`;
          const provider = new ethers.BrowserProvider((window as any).ethereum);
          const signer = await provider.getSigner();
          const signature = await signer.signMessage(message);

          // Send connection request to backend
          const response = await apiService.connectWallet(address, signature, message);
          console.log('Backend connection successful:', response);
        } catch (backendError) {
          console.warn('Backend connection failed, continuing with frontend-only mode:', backendError);
        }
      }

      // Fetch user data
      await fetchUserData(address);

    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsConnected(false);
    setFitTokens(0);
    setUserData(null);
  };

  const refreshUserData = async () => {
    if (walletAddress) {
      await fetchUserData(walletAddress);
    }
  };

  const value: WalletContextType = {
    walletAddress,
    isConnected,
    isConnecting,
    fitTokens,
    userData,
    connectWallet,
    disconnectWallet,
    refreshUserData,
    isBackendConnected,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}; 