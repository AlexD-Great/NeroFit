"use client";

import NeroWidget from "@/components/NeroWidget";
import { useNeroContext } from "@/providers/NeroProvider";
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

export default function LoginPage() {
  const { user, isConnected, walletAddress, isLoading, primaryWallet } = useNeroContext();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // Hydration protection
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Simple authentication check and redirect
  useEffect(() => {
    if (!isMounted || isLoading) {
      return;
    }

    // Enhanced authentication check - check multiple indicators
    const isAuthenticated = !!(
      user || 
      primaryWallet?.address || 
      (isConnected && walletAddress)
    );
    
    console.log('Login: Authentication check:', {
      isMounted,
      isLoading,
      isConnected,
      user: !!user,
      userEmail: user?.email,
      userName: user?.name,
      primaryWallet: primaryWallet?.address,
      walletAddress,
      isAuthenticated,
      timestamp: new Date().toISOString()
    });

    if (isAuthenticated) {
      console.log('Login: User is authenticated, redirecting to dashboard');
      // Use replace to prevent back navigation to login page
      router.replace('/dashboard');
    }
  }, [isMounted, isConnected, primaryWallet?.address, walletAddress, isLoading, router, user]);

  const handleConnect = useCallback(() => {
    console.log('Login: Connection callback triggered');
    
    // No need to force refresh - let React handle the state updates
    // The useEffect above will detect the authentication change and redirect
    console.log('Login: Waiting for authentication state to update...');
  }, []);

  // Don't render anything until mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl mb-8">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            NeroFit
          </h1>
          
          <p className="text-xl text-white/80 mb-12 max-w-md mx-auto">
            Your fitness journey on the blockchain. Earn rewards, track progress, and achieve your goals.
          </p>
        </div>

        {/* NERO Widget */}
        <div className="flex justify-center">
          <NeroWidget onConnect={handleConnect} />
        </div>

        {/* Footer */}
        <div className="text-center pt-8">
          <p className="text-white/40 text-sm">
            Powered by NERO Chain • Secure • Decentralized
          </p>
        </div>
      </div>
    </div>
  );
} 