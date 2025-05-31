"use client";

import { useMemo } from 'react';
import config from '../config/nerowallet.config';

// useConfig hook following NERO's high-level documentation pattern
export const useConfig = () => {
  return useMemo(() => {
    console.log('useConfig: Loading configuration...');
    console.log('useConfig: Raw config:', config);
    
    const configData = {
      // Direct access to RPC URL for read operations
      rpcUrl: config.rpcUrl,
      
      // Chain information
      chainId: parseInt(config.chains[0].chain.chainId, 16), // Convert hex to decimal
      chainName: config.chains[0].chain.chainName,
      currency: config.chains[0].chain.nativeCurrency.symbol,
      explorer: config.chains[0].chain.blockExplorerUrls[0],
      
      // Web3Auth configuration
      web3AuthClientId: config.web3auth.clientId,
      
      // AA Platform configuration
      bundler: config.aa.bundler,
      paymaster: config.aa.paymaster,
      paymasterAPIKey: config.aa.paymasterAPIKey,
      
      // Full config object for advanced usage
      fullConfig: config,
    };
    
    console.log('useConfig: Processed config:', configData);
    return configData;
  }, []);
}; 