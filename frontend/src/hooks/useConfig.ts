"use client";

import { useMemo } from 'react';
import config from '../config/nerowallet.config';

// useConfig hook following NERO's high-level documentation exactly
export const useConfig = () => {
  return useMemo(() => {
    const currentChain = config.chains[0]; // Using first chain (testnet)
    
    return {
      // Chain configuration
      chainId: currentChain.chain.chainId,
      chainName: currentChain.chain.name,
      currency: currentChain.chain.currency,
      explorerUrl: currentChain.chain.explorerUrl,
      rpcUrl: currentChain.chain.rpcUrl,
      networkType: currentChain.chain.networkType,
      
      // AA configuration
      bundler: currentChain.aa.bundler,
      paymaster: currentChain.aa.paymaster,
      paymasterAPIKey: currentChain.aa.paymasterAPIKey,
      
      // Contract addresses
      entryPoint: currentChain.contracts.entryPoint,
      accountFactory: currentChain.contracts.accountFactory,
      
      // Web3Auth configuration
      web3auth: config.web3auth,
      
      // Full config for advanced usage
      fullConfig: config,
    };
  }, []);
}; 