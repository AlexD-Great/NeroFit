"use client";

import { useMemo } from 'react';
import config, { NERO_CHAIN_CONFIG, AA_PLATFORM_CONFIG, CONTRACT_ADDRESSES } from '../config/nerowallet.config';

// NERO Configuration Hook following their high-level documentation
export const useConfig = () => {
  return useMemo(() => {
    console.log('NERO Config: Loading configuration...');
    console.log('Web3Auth Client ID available:', !!config.web3auth?.clientId);
    console.log('Chain ID:', NERO_CHAIN_CONFIG.chainId);
    console.log('RPC URL:', NERO_CHAIN_CONFIG.rpcUrl);
    
    return {
      // Web3Auth Configuration
      web3AuthClientId: config.web3auth?.clientId || '',
      web3AuthNetwork: config.web3auth?.network || 'testnet',
      
      // Chain Configuration
      chainId: NERO_CHAIN_CONFIG.chainId,
      chainName: NERO_CHAIN_CONFIG.chainName,
      rpcUrl: NERO_CHAIN_CONFIG.rpcUrl,
      currency: NERO_CHAIN_CONFIG.currency,
      explorer: NERO_CHAIN_CONFIG.explorer,
      
      // Account Abstraction Configuration
      bundlerRpc: AA_PLATFORM_CONFIG.bundlerRpc,
      paymasterRpc: AA_PLATFORM_CONFIG.paymasterRpc,
      paymasterAPIKey: config.aa?.paymasterAPIKey || '',
      
      // Contract Addresses
      entryPoint: CONTRACT_ADDRESSES.entryPoint,
      accountFactory: CONTRACT_ADDRESSES.accountFactory,
      
      // Full config object for advanced usage
      fullConfig: config,
    };
  }, []);
}; 