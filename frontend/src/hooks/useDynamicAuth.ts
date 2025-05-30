"use client";

import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core';
import { useRouter } from 'next/navigation';
import { useMemo, useCallback } from 'react';

interface UserMetadata {
  avatar?: string;
  [key: string]: unknown;
}

export function useDynamicAuth() {
  const { primaryWallet, user, setShowAuthFlow } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  const router = useRouter();

  const connectWallet = useCallback(() => {
    setShowAuthFlow(true);
  }, [setShowAuthFlow]);

  const disconnectWallet = useCallback(() => {
    // Dynamic handles disconnection internally
    // Redirect to homepage after logout
    router.push('/');
  }, [router]);

  const getUserInfo = useMemo(() => {
    if (user) {
      return {
        id: user.userId,
        email: user.email,
        name: user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}` 
          : user.email?.split('@')[0] || 'User',
        avatar: (user.metadata as UserMetadata)?.avatar || null,
        authMethod: 'social' as const,
      };
    } else if (primaryWallet) {
      const address = primaryWallet.address;
      return {
        id: address,
        email: null,
        name: `${address.slice(0, 6)}...${address.slice(-4)}`,
        avatar: null,
        authMethod: 'wallet' as const,
      };
    }
    return null;
  }, [user, primaryWallet]);

  const getWalletInfo = useMemo(() => {
    if (!primaryWallet) return null;
    
    return {
      address: primaryWallet.address,
      balance: null, // We'll add balance fetching later if needed
      chainId: primaryWallet.chain,
      chainName: 'Connected',
    };
  }, [primaryWallet]);

  return useMemo(() => ({
    // Authentication state
    isLoggedIn,
    isConnected: !!primaryWallet,
    user: getUserInfo,
    
    // Wallet info
    wallet: getWalletInfo,
    primaryWallet,
    
    // Actions
    connectWallet,
    disconnectWallet,
    refetchBalance: () => {}, // Placeholder
    
    // Chain info (simplified)
    chain: { id: 689, name: 'Nero Testnet' },
  }), [isLoggedIn, primaryWallet, getUserInfo, getWalletInfo, connectWallet, disconnectWallet]);
} 