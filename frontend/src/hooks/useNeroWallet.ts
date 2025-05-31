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

export type UseNeroWalletReturn = NeroWalletState & NeroWalletActions;

// useNeroWallet hook following NERO's high-level documentation exactly
export const useNeroWallet = (): UseNeroWalletReturn => {
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

  const [web3auth, setWeb3auth] = useState<any>(null);

  // Initialize Web3Auth following NERO's exact pattern
  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        setState(prev => ({ ...prev, isMounted: true }));

        // Dynamic import to avoid SSR issues
        const { Web3Auth } = await import('@web3auth/modal');
        const { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } = await import('@web3auth/base');

        // Initialize Web3Auth with basic configuration
        const web3authInstance = new Web3Auth({
          clientId: config.web3auth.clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          uiConfig: {
            appName: config.web3auth.uiConfig.appName,
            theme: { primary: config.web3auth.uiConfig.theme.primary },
            mode: "dark",
            logoLight: "https://web3auth.io/images/w3a-L-Favicon-1.svg",
            logoDark: "https://web3auth.io/images/w3a-D-Favicon-1.svg",
            defaultLanguage: "en",
            loginGridCol: 3,
            primaryButton: "externalLogin",
          },
        });

        // Initialize Web3Auth
        await web3authInstance.init();
        setWeb3auth(web3authInstance);

        // Check if already connected
        if (web3authInstance.connected) {
          await handleWeb3AuthConnection(web3authInstance);
        }

      } catch (error) {
        console.error('NERO: Error initializing Web3Auth:', error);
        setState(prev => ({ 
          ...prev, 
          error: 'Failed to initialize authentication',
          isMounted: true 
        }));
      }
    };

    initWeb3Auth();
  }, [config]);

  // Handle Web3Auth connection
  const handleWeb3AuthConnection = async (web3authInstance: any) => {
    try {
      const provider = web3authInstance.provider;
      if (!provider) throw new Error('No provider available');

      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      const user = await web3authInstance.getUserInfo();

      // Check if we're on the correct network (NERO Chain)
      const network = await ethersProvider.getNetwork();
      const neroChainId = 689; // NERO Chain testnet ID
      
      if (Number(network.chainId) !== neroChainId) {
        console.log('NERO: Switching to NERO Chain...');
        try {
          // Try to switch to NERO Chain
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x2b1' }], // 689 in hex
          });
        } catch (switchError: any) {
          // If the chain hasn't been added to the wallet, add it
          if (switchError.code === 4902) {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x2b1',
                chainName: 'NERO Chain Testnet',
                nativeCurrency: {
                  name: 'NERO',
                  symbol: 'NERO',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc-testnet.nerochain.io'],
                blockExplorerUrls: ['https://testnet.neroscan.io'],
              }],
            });
          } else {
            console.warn('NERO: Could not switch to NERO Chain, continuing anyway');
          }
        }
      }

      setState(prev => ({
        ...prev,
        isConnected: true,
        user,
        walletAddress: address,
        aaWalletAddress: address, // For now, use same address
        provider: ethersProvider,
        signer,
        error: null,
      }));

      console.log('NERO: Successfully connected with Web3Auth');
    } catch (error: any) {
      console.error('NERO: Web3Auth connection failed:', error);
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Failed to connect with Web3Auth' 
      }));
    }
  };

  // Connect using Web3Auth's built-in modal - this is the ONLY connect method
  const connect = useCallback(async () => {
    if (!web3auth) {
      throw new Error('Web3Auth not initialized');
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Use Web3Auth's built-in modal - this will show all login options
      // including Google, Facebook, Email, SMS, etc.
      await web3auth.connect();
      await handleWeb3AuthConnection(web3auth);
    } catch (error: any) {
      console.error('NERO: Web3Auth connection failed:', error);
      setState(prev => ({ 
        ...prev, 
        error: error.message || 'Failed to connect' 
      }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [web3auth]);

  const disconnect = useCallback(async () => {
    try {
      console.log('NERO: Disconnecting wallet...');

      if (web3auth && web3auth.connected) {
        await web3auth.logout();
      }

      // Clear all storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('Web3Auth-cachedAdapter');
        localStorage.removeItem('openlogin_store');
        localStorage.removeItem('walletconnect');
        sessionStorage.clear();
      }

      setState({
        isConnected: false,
        isLoading: false,
        user: null,
        walletAddress: null,
        aaWalletAddress: null,
        provider: null,
        error: null,
        signer: null,
        isMounted: true,
      });

      console.log('NERO: Wallet disconnected successfully');
      
      // Force page refresh to ensure clean state
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (error) {
      console.error('NERO: Error during disconnect:', error);
    }
  }, [web3auth]);

  const getUserInfo = useCallback(async () => {
    if (web3auth && web3auth.connected) {
      return await web3auth.getUserInfo();
    }
    if (!state.signer) throw new Error('Wallet not connected');
    
    const address = await state.signer.getAddress();
    return { address };
  }, [state.signer, web3auth]);

  const getAccounts = useCallback(async () => {
    if (!state.walletAddress) throw new Error('Wallet not connected');
    return [state.walletAddress];
  }, [state.walletAddress]);

  const getBalance = useCallback(async () => {
    if (!state.signer) throw new Error('Wallet not connected');
    
    const balance = await state.signer.provider?.getBalance(state.walletAddress!);
    return ethers.formatEther(balance || '0');
  }, [state.signer, state.walletAddress]);

  const signMessage = useCallback(async (message: string) => {
    if (!state.signer) throw new Error('Wallet not connected');
    return await state.signer.signMessage(message);
  }, [state.signer]);

  const sendTransaction = useCallback(async (transaction: any) => {
    if (!state.signer) throw new Error('Wallet not connected');
    const tx = await state.signer.sendTransaction(transaction);
    return tx.hash;
  }, [state.signer]);

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