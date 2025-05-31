"use client";

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useConfig } from './useConfig';

export interface NeroWalletState {
  isConnected: boolean;
  isLoading: boolean;
  user: any;
  walletAddress: string | null;
  aaWalletAddress: string | null;
  provider: any;
  error: string | null;
  signer: ethers.Signer | null;
  isMounted: boolean;
}

export interface NeroWalletActions {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  getUserInfo: () => Promise<any>;
  getAccounts: () => Promise<string[]>;
  getBalance: () => Promise<string>;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (transaction: any) => Promise<string>;
}

// Simple wallet connection following NERO's high-level pattern
export const useNeroWallet = (): NeroWalletState & NeroWalletActions => {
  const config = useConfig();
  
  const [state, setState] = useState<NeroWalletState>({
    isConnected: false,
    isLoading: false,
    user: null,
    walletAddress: null,
    aaWalletAddress: null,
    provider: null,
    error: null,
    signer: null,
    isMounted: false,
  });

  // Hydration protection
  useEffect(() => {
    setState(prev => ({ ...prev, isMounted: true }));
  }, []);

  // Check if wallet is already connected
  useEffect(() => {
    if (state.isMounted) {
      checkConnection();
    }
  }, [state.isMounted]);

  const checkConnection = async () => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
      if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();

        setState(prev => ({
          ...prev,
          isConnected: true,
          walletAddress: address,
          aaWalletAddress: address, // For now, using same address
          provider: window.ethereum,
          signer,
        }));
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const connect = useCallback(async () => {
    console.log('NERO Wallet: Connecting...');
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    // Set up timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.error('NERO Wallet: Connection timeout after 45 seconds');
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Connection timeout. Please check MetaMask and try again.',
      }));
    }, 45000); // Increased to 45 seconds

    try {
      // Check if MetaMask is available
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
      }

      console.log('NERO Wallet: MetaMask detected, version:', window.ethereum.isMetaMask ? 'MetaMask' : 'Unknown');

      console.log('NERO Wallet: Requesting account access...');
      console.log('NERO Wallet: Please check MetaMask for connection popup...');
      
      // Add timeout for the account request specifically (longer timeout)
      const accountRequestPromise = window.ethereum.request({ method: 'eth_requestAccounts' });
      const accountTimeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('MetaMask connection timeout. Please unlock MetaMask and approve the connection request.')), 30000);
      });

      const accounts = await Promise.race([accountRequestPromise, accountTimeoutPromise]) as string[];
      console.log('NERO Wallet: Account access granted, accounts:', accounts);

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please make sure MetaMask is unlocked and has accounts.');
      }

      console.log('NERO Wallet: Creating provider and signer...');
      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      console.log('NERO Wallet: Provider created successfully');

      const signer = await provider.getSigner();
      console.log('NERO Wallet: Signer created successfully');

      const address = await signer.getAddress();
      console.log('NERO Wallet: Connected to address:', address);

      // Check current network
      const network = await provider.getNetwork();
      console.log('NERO Wallet: Current network:', Number(network.chainId));
      console.log('NERO Wallet: Target network:', config.chainId);

      // Try to switch to NERO network (but don't fail if it doesn't work)
      if (Number(network.chainId) !== config.chainId) {
        console.log('NERO Wallet: Attempting to switch to NERO network...');
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${config.chainId.toString(16)}` }],
          });
          console.log('NERO Wallet: Successfully switched to NERO network');
        } catch (switchError: any) {
          console.log('NERO Wallet: Switch failed, attempting to add network...');
          // If network doesn't exist, try to add it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: `0x${config.chainId.toString(16)}`,
                  chainName: config.chainName,
                  rpcUrls: [config.rpcUrl],
                  nativeCurrency: {
                    name: config.currency,
                    symbol: config.currency,
                    decimals: 18,
                  },
                  blockExplorerUrls: [config.explorer],
                }],
              });
              console.log('NERO Wallet: Successfully added and switched to NERO network');
            } catch (addError: any) {
              console.warn('NERO Wallet: Failed to add NERO network, continuing with current network:', addError.message);
              // Continue anyway - user can manually switch later
            }
          } else {
            console.warn('NERO Wallet: Failed to switch network, continuing with current network:', switchError.message);
            // Continue anyway - user can manually switch later
          }
        }
      }

      // Clear the timeout since we succeeded
      clearTimeout(timeoutId);

      console.log('NERO Wallet: Connection successful!');
      console.log('Address:', address);
      console.log('Network:', config.chainName, '(Chain ID:', config.chainId, ')');

      setState(prev => ({
        ...prev,
        isConnected: true,
        isLoading: false,
        walletAddress: address,
        aaWalletAddress: address, // For now, using same address - will be enhanced with proper AA
        provider: window.ethereum,
        signer,
        user: { address }, // Simple user object
        error: null,
      }));

    } catch (error: any) {
      // Clear the timeout
      clearTimeout(timeoutId);
      
      console.error('NERO Wallet: Connection failed:', error);
      
      let errorMessage = 'Failed to connect wallet';
      
      // Provide more specific error messages
      if (error.message.includes('User rejected') || error.message.includes('User denied')) {
        errorMessage = 'Connection rejected by user. Please try again and approve the connection.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Connection timeout. Please unlock MetaMask, check for popups, and try again.';
      } else if (error.message.includes('MetaMask')) {
        errorMessage = error.message;
      } else if (error.code === 4001) {
        errorMessage = 'Connection rejected by user. Please try again and approve the connection.';
      } else if (error.code === -32002) {
        errorMessage = 'MetaMask is already processing a request. Please check MetaMask for pending requests.';
      } else if (error.code === -32603) {
        errorMessage = 'MetaMask internal error. Please unlock MetaMask and try again.';
      } else {
        errorMessage = error.message || 'Failed to connect wallet. Please make sure MetaMask is unlocked.';
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      // Don't throw the error to prevent unhandled promise rejection
    }
  }, [config]);

  const disconnect = useCallback(async () => {
    console.log('NERO Wallet: Disconnecting...');
    setState(prev => ({
      ...prev,
      isConnected: false,
      walletAddress: null,
      aaWalletAddress: null,
      provider: null,
      signer: null,
      user: null,
      error: null,
    }));
  }, []);

  const getUserInfo = async () => {
    if (!state.walletAddress) {
      throw new Error('Wallet not connected');
    }
    return state.user;
  };

  const getAccounts = async () => {
    if (!state.walletAddress) {
      throw new Error('Wallet not connected');
    }
    return [state.walletAddress];
  };

  const getBalance = async () => {
    if (!state.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const provider = state.signer.provider;
      if (!provider) {
        throw new Error('Provider not available');
      }
      
      const balance = await provider.getBalance(state.walletAddress!);
      return ethers.formatEther(balance);
    } catch (error: any) {
      console.error('Error getting balance:', error);
      throw new Error('Failed to get balance');
    }
  };

  const signMessage = async (message: string) => {
    if (!state.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      return await state.signer.signMessage(message);
    } catch (error: any) {
      console.error('Error signing message:', error);
      throw new Error('Failed to sign message');
    }
  };

  const sendTransaction = async (transaction: any) => {
    if (!state.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = await state.signer.sendTransaction(transaction);
      return tx.hash;
    } catch (error: any) {
      console.error('Error sending transaction:', error);
      throw new Error('Failed to send transaction');
    }
  };

  return {
    ...state,
    connect,
    disconnect,
    getUserInfo,
    getAccounts,
    getBalance,
    signMessage,
    sendTransaction,
  };
}; 