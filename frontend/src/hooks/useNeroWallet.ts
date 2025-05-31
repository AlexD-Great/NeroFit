"use client";

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useConfig } from './useConfig';
import { Web3Auth } from '@web3auth/modal';
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';

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
  loginMethod: 'web3auth' | 'metamask' | null;
}

export interface NeroWalletActions {
  connect: () => Promise<void>;
  connectWithGoogle: () => Promise<void>;
  connectWithMetaMask: () => Promise<void>;
  disconnect: () => Promise<void>;
  getUserInfo: () => Promise<any>;
  getAccounts: () => Promise<string[]>;
  getBalance: () => Promise<string>;
  signMessage: (message: string) => Promise<string>;
  sendTransaction: (transaction: any) => Promise<string>;
}

// NERO Wallet with Web3Auth integration following their high-level pattern
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
    loginMethod: null,
  });

  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);

  // Hydration protection
  useEffect(() => {
    setState(prev => ({ ...prev, isMounted: true }));
  }, []);

  // Initialize Web3Auth
  useEffect(() => {
    if (state.isMounted && config.web3AuthClientId && config.web3AuthClientId !== 'your_web3auth_client_id_here') {
      initWeb3Auth();
    }
  }, [state.isMounted, config.web3AuthClientId]);

  // Check if wallet is already connected
  useEffect(() => {
    if (state.isMounted) {
      checkConnection();
    }
  }, [state.isMounted, web3auth]);

  const initWeb3Auth = async () => {
    try {
      console.log('NERO Wallet: Initializing Web3Auth...');
      
      // Validate client ID
      if (!config.web3AuthClientId || config.web3AuthClientId === 'your_web3auth_client_id_here') {
        console.log('NERO Wallet: No valid Web3Auth client ID found, skipping Web3Auth initialization');
        return;
      }
      
      const chainConfig = {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: `0x${config.chainId.toString(16)}`,
        rpcTarget: config.rpcUrl,
        displayName: config.chainName,
        blockExplorer: config.explorer,
        ticker: config.currency,
        tickerName: config.currency,
      };

      const privateKeyProvider = new EthereumPrivateKeyProvider({
        config: { chainConfig },
      });

      const web3AuthInstance = new Web3Auth({
        clientId: config.web3AuthClientId,
        web3AuthNetwork: WEB3AUTH_NETWORK.TESTNET,
        privateKeyProvider,
        uiConfig: {
          appName: 'NeroFit',
          theme: {
            primary: '#667eea'
          },
          mode: 'dark',
          logoLight: '/favicon.ico',
          logoDark: '/favicon.ico',
          defaultLanguage: 'en',
          loginGridCol: 3,
          primaryButton: 'socialLogin'
        },
      });

      // Configure OpenLogin adapter for social logins
      const openloginAdapter = new OpenloginAdapter({
        loginSettings: {
          mfaLevel: 'optional',
        },
        adapterSettings: {
          uxMode: 'popup',
          whiteLabel: {
            appName: 'NeroFit',
            logoLight: '/favicon.ico',
            logoDark: '/favicon.ico',
            defaultLanguage: 'en',
            mode: 'dark',
          },
        },
      });

      web3AuthInstance.configureAdapter(openloginAdapter);
      await web3AuthInstance.init();
      
      setWeb3auth(web3AuthInstance);
      console.log('NERO Wallet: Web3Auth initialized successfully');
    } catch (error) {
      console.error('NERO Wallet: Web3Auth initialization failed:', error);
      // Don't set web3auth to null, just continue without it
      // MetaMask fallback will be available
    }
  };

  const checkConnection = async () => {
    try {
      console.log('NERO Wallet: Checking existing connections...');
      
      // Check if user just logged out - if so, don't auto-reconnect
      if (typeof window !== 'undefined') {
        const logoutFlag = sessionStorage.getItem('nero-logout-flag');
        const manualLogout = localStorage.getItem('nero-manual-logout');
        
        // Prevent auto-reconnection if user manually logged out in this session
        if (logoutFlag === 'true' || manualLogout === 'true') {
          console.log('NERO Wallet: Manual logout detected, skipping auto-reconnection');
          // Clear the session flag but keep manual logout flag until user explicitly connects
          sessionStorage.removeItem('nero-logout-flag');
          return;
        }
      }
      
      // Check Web3Auth connection first
      if (web3auth && web3auth.connected) {
        console.log('NERO Wallet: Web3Auth appears connected, verifying...');
        
        try {
          const web3authProvider = web3auth.provider;
          if (web3authProvider) {
            const ethersProvider = new ethers.BrowserProvider(web3authProvider as any);
            const signer = await ethersProvider.getSigner();
            const address = await signer.getAddress();
            const user = await web3auth.getUserInfo();

            console.log('NERO Wallet: Web3Auth connection verified');
            console.log('Address:', address);
            console.log('User:', user);

            setState(prev => ({
              ...prev,
              isConnected: true,
              walletAddress: address,
              aaWalletAddress: address,
              provider: web3authProvider,
              signer,
              user,
              loginMethod: 'web3auth',
            }));
            return;
          }
        } catch (error) {
          console.log('NERO Wallet: Web3Auth connection verification failed:', error);
          // Clear invalid Web3Auth state
          if (web3auth && web3auth.connected) {
            try {
              await web3auth.logout();
            } catch (logoutError) {
              console.log('NERO Wallet: Failed to logout invalid Web3Auth session:', logoutError);
            }
          }
        }
      }

      // Check MetaMask connection - but only if user previously connected in this session
      if (typeof window !== 'undefined' && window.ethereum) {
        console.log('NERO Wallet: Checking MetaMask connection...');
        
        // Check if user has a stored connection preference for this session
        const hasStoredConnection = sessionStorage.getItem('nero-metamask-connected');
        
        if (hasStoredConnection) {
          try {
            // Use eth_accounts to check if already connected (no prompt)
            const accounts = await window.ethereum.request({ 
              method: 'eth_accounts' 
            }) as string[];
            
            console.log('NERO Wallet: MetaMask accounts check result:', accounts);
            
            if (accounts.length > 0) {
              console.log('NERO Wallet: MetaMask accounts found, auto-connecting...');
              
              const provider = new ethers.BrowserProvider(window.ethereum);
              const signer = await provider.getSigner();
              const address = await signer.getAddress();

              console.log('NERO Wallet: MetaMask auto-connection successful');
              console.log('Address:', address);

              setState(prev => ({
                ...prev,
                isConnected: true,
                walletAddress: address,
                aaWalletAddress: address,
                provider: window.ethereum,
                signer,
                user: { address },
                loginMethod: 'metamask',
              }));
              return;
            } else {
              console.log('NERO Wallet: No MetaMask accounts found, clearing stored connection');
              sessionStorage.removeItem('nero-metamask-connected');
            }
          } catch (error) {
            console.log('NERO Wallet: MetaMask connection check failed:', error);
            sessionStorage.removeItem('nero-metamask-connected');
          }
        } else {
          console.log('NERO Wallet: No stored MetaMask connection preference found');
        }
      }

      console.log('NERO Wallet: No existing connections found');
    } catch (error) {
      console.error('NERO Wallet: Error checking connections:', error);
    }
  };

  const connectWithGoogle = useCallback(async () => {
    console.log('NERO Wallet: Starting Google connection...');
    
    // Clear manual logout flag since user is explicitly connecting
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nero-manual-logout');
      sessionStorage.removeItem('nero-logout-flag');
    }
    
    if (!web3auth) {
      throw new Error('Web3Auth not initialized. Please check your configuration.');
    }

    if (!config.web3AuthClientId || config.web3AuthClientId === 'your_web3auth_client_id_here') {
      throw new Error('Web3Auth client ID not configured. Please set NEXT_PUBLIC_WEB3AUTH_CLIENT_ID in your environment variables.');
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('NERO Wallet: Connecting with Web3Auth...');
      
      const web3authProvider = await web3auth.connect();
      
      if (!web3authProvider) {
        throw new Error('Failed to connect with Web3Auth');
      }

      console.log('NERO Wallet: Web3Auth connected, getting user info...');
      
      const ethersProvider = new ethers.BrowserProvider(web3authProvider as any);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      const user = await web3auth.getUserInfo();

      console.log('NERO Wallet: Google connection successful!');
      console.log('Address:', address);
      console.log('User:', user);

      setState(prev => ({
        ...prev,
        isConnected: true,
        isLoading: false,
        walletAddress: address,
        aaWalletAddress: address,
        provider: web3authProvider,
        signer,
        user,
        loginMethod: 'web3auth',
        error: null,
      }));

    } catch (error: any) {
      console.error('NERO Wallet: Google connection failed:', error);
      
      let errorMessage = 'Failed to connect with Google';
      if (error.message.includes('User closed the modal') || error.message.includes('User cancelled')) {
        errorMessage = 'Connection cancelled by user. Please try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      throw error;
    }
  }, [web3auth, config.web3AuthClientId]);

  const connectWithMetaMask = useCallback(async () => {
    console.log('NERO Wallet: Starting MetaMask connection...');
    
    // Clear manual logout flag since user is explicitly connecting
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nero-manual-logout');
      sessionStorage.removeItem('nero-logout-flag');
      console.log('NERO Wallet: Cleared logout flags for explicit connection');
    }
    
    if (!window.ethereum) {
      const errorMessage = 'MetaMask not detected. Please install MetaMask browser extension.';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw new Error(errorMessage);
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Connection timeout. Please unlock MetaMask, check for popups, and try again.',
      }));
    }, 45000); // 45 second timeout

    try {
      console.log('NERO Wallet: Requesting MetaMask accounts...');
      
      // Request account access (this will prompt user)
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      }) as string[];
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask and try again.');
      }

      console.log('NERO Wallet: MetaMask accounts received, creating provider...');
      
      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      console.log('NERO Wallet: Checking/switching to NERO network...');
      
      // Try to switch to NERO network (non-blocking)
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${config.chainId.toString(16)}` }],
        });
        console.log('NERO Wallet: Successfully switched to NERO network');
      } catch (switchError: any) {
        console.log('NERO Wallet: Network switch failed, attempting to add network...');
        
        // If the chain hasn't been added to MetaMask, add it
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
          } catch (addError) {
            console.log('NERO Wallet: Failed to add network, but continuing with connection:', addError);
            // Continue with connection even if network switch fails
          }
        } else {
          console.log('NERO Wallet: Network switch failed, but continuing with connection:', switchError);
          // Continue with connection even if network switch fails
        }
      }

      clearTimeout(timeoutId);

      // Store connection preference for auto-reconnection
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('nero-metamask-connected', 'true');
      }

      console.log('NERO Wallet: MetaMask connection successful!');
      console.log('Address:', address);

      setState(prev => ({
        ...prev,
        isConnected: true,
        isLoading: false,
        walletAddress: address,
        aaWalletAddress: address,
        provider: window.ethereum,
        signer,
        user: { address },
        loginMethod: 'metamask',
        error: null,
      }));

    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error('NERO Wallet: MetaMask connection failed:', error);
      
      let errorMessage = 'Failed to connect with MetaMask';
      if (error.message.includes('User rejected') || error.message.includes('User denied')) {
        errorMessage = 'Connection rejected by user. Please try again and approve the connection.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Connection timeout. Please unlock MetaMask, check for popups, and try again.';
      } else if (error.code === 4001) {
        errorMessage = 'Connection rejected by user. Please try again and approve the connection.';
      } else if (error.code === -32002) {
        errorMessage = 'MetaMask is already processing a request. Please check MetaMask for pending requests.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      throw error;
    }
  }, [config]);

  // Default connect method (tries Google first if available, then MetaMask)
  const connect = useCallback(async () => {
    if (web3auth && config.web3AuthClientId) {
      await connectWithGoogle();
    } else {
      await connectWithMetaMask();
    }
  }, [web3auth, config.web3AuthClientId, connectWithGoogle, connectWithMetaMask]);

  const disconnect = useCallback(async () => {
    console.log('NERO Wallet: Disconnecting...');
    
    try {
      // Set logout flags to prevent auto-reconnection
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('nero-logout-flag', 'true');
        localStorage.setItem('nero-manual-logout', 'true');
        
        // Clear MetaMask connection preference
        sessionStorage.removeItem('nero-metamask-connected');
      }
      
      // Clear Web3Auth session
      if (state.loginMethod === 'web3auth' && web3auth && web3auth.connected) {
        console.log('NERO Wallet: Logging out from Web3Auth...');
        try {
          await web3auth.logout();
        } catch (logoutError) {
          console.log('NERO Wallet: Web3Auth logout failed, but continuing:', logoutError);
        }
      }

      // For MetaMask, we can't actually disconnect it, but we can clear our state
      if (state.loginMethod === 'metamask') {
        console.log('NERO Wallet: Clearing MetaMask connection state...');
        // Note: We can't actually disconnect MetaMask programmatically
        // The user would need to disconnect manually in MetaMask
      }

      // Clear Web3Auth related storage
      if (typeof window !== 'undefined') {
        const keysToRemove = [
          'Web3Auth-cachedAdapter',
          'openlogin_store',
          'Web3Auth-walletconnect',
          'walletconnect',
          'WALLETCONNECT_DEEPLINK_CHOICE',
        ];
        
        keysToRemove.forEach(key => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });
        
        console.log('NERO Wallet: Cleared Web3Auth storage');
      }

      // Reset all state immediately
      setState(prev => ({
        ...prev,
        isConnected: false,
        walletAddress: null,
        aaWalletAddress: null,
        provider: null,
        signer: null,
        user: null,
        error: null,
        loginMethod: null,
        isLoading: false,
      }));

      console.log('NERO Wallet: Disconnection complete');
    } catch (error) {
      console.error('Error during disconnect:', error);
      
      // Force reset state even if logout fails
      setState(prev => ({
        ...prev,
        isConnected: false,
        walletAddress: null,
        aaWalletAddress: null,
        provider: null,
        signer: null,
        user: null,
        error: null,
        loginMethod: null,
        isLoading: false,
      }));
    }
  }, [web3auth, state.loginMethod]);

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
    connectWithGoogle,
    connectWithMetaMask,
    disconnect,
    getUserInfo,
    getAccounts,
    getBalance,
    signMessage,
    sendTransaction,
  };
}; 