"use client";

import React, { useState, useEffect } from 'react';
import { useNeroWallet } from '../hooks/useNeroWallet';
import { useConfig } from '../hooks/useConfig';

interface NeroWidgetProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
}

// NERO Wallet Widget with Google Auth following their high-level documentation
export const NeroWidget: React.FC<NeroWidgetProps> = ({ onConnect, onDisconnect }) => {
  const [isMounted, setIsMounted] = useState(false);
  
  const { 
    isConnected, 
    isLoading, 
    walletAddress, 
    aaWalletAddress,
    user, 
    error, 
    loginMethod,
    connect,
    connectWithGoogle,
    connectWithMetaMask,
    disconnect 
  } = useNeroWallet();
  
  const config = useConfig();

  // Hydration protection
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Call onConnect callback when connection state changes
  useEffect(() => {
    if (isMounted && isConnected && walletAddress && onConnect) {
      console.log('NeroWidget: Connection state changed, calling onConnect callback');
      onConnect();
    }
  }, [isMounted, isConnected, walletAddress, onConnect]);

  // Call onDisconnect callback when disconnection happens
  useEffect(() => {
    if (isMounted && !isConnected && !walletAddress && onDisconnect) {
      console.log('NeroWidget: Disconnection detected, calling onDisconnect callback');
      onDisconnect();
    }
  }, [isMounted, isConnected, walletAddress, onDisconnect]);

  const handleGoogleConnect = async () => {
    try {
      await connectWithGoogle();
      console.log('NeroWidget: Google connection successful');
      if (onConnect) {
        onConnect();
      }
    } catch (error) {
      console.error('NeroWidget: Google connection failed:', error);
      // Error is already handled by the hook
    }
  };

  const handleMetaMaskConnect = async () => {
    try {
      await connectWithMetaMask();
      console.log('NeroWidget: MetaMask connection successful');
      if (onConnect) {
        onConnect();
      }
    } catch (error) {
      console.error('NeroWidget: MetaMask connection failed:', error);
      // Error is already handled by the hook
    }
  };

  const handleDisconnect = async () => {
    console.log('NeroWidget: Disconnect button clicked');
    try {
      await disconnect();
      onDisconnect?.();
    } catch (error) {
      console.error('NeroWidget: Disconnection failed:', error);
    }
  };

  // Don't render until mounted (hydration protection)
  if (!isMounted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
            <span className="ml-2 text-sm text-white/70">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            <span className="ml-3 text-white font-medium">Connecting to NERO...</span>
          </div>
        </div>
      </div>
    );
  }

  if (isConnected && walletAddress) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
          {/* Success Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Successfully Connected!</h3>
            <p className="text-white/70 text-sm">Your wallet is connected to NERO Chain</p>
          </div>

          {/* User Info */}
          {user && (user.name || user.email) && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-400/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : '👤'}
                  </span>
                </div>
                <div>
                  <div className="text-white font-medium">
                    {loginMethod === 'web3auth' ? '🔐 Social Login' : '🦊 MetaMask'}
                  </div>
                  {user.name && (
                    <div className="text-white/80 text-sm">{user.name}</div>
                  )}
                  {user.email && (
                    <div className="text-white/60 text-xs">{user.email}</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Wallet Address */}
          <div className="mb-6">
            <div className="text-white/80 text-sm mb-2 font-medium">Wallet Address</div>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600/30">
              <div className="font-mono text-sm text-white/90 break-all">
                {walletAddress}
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(walletAddress)}
                className="mt-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                📋 Copy Address
              </button>
            </div>
          </div>

          {/* Network Info */}
          <div className="mb-6 p-3 bg-blue-500/10 rounded-lg border border-blue-400/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-blue-400 font-medium text-sm">Connected to {config.chainName}</div>
                <div className="text-blue-300/70 text-xs">Chain ID: {config.chainId}</div>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Disconnect Button */}
          <button
            onClick={handleDisconnect}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
          >
            Disconnect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Connect to NERO</h3>
          <p className="text-white/70 text-sm">Choose your preferred connection method</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-400/30 rounded-xl">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <div>
                <div className="text-red-400 font-medium text-sm">Connection Failed</div>
                <div className="text-red-300/80 text-xs mt-1">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Connection Options */}
        <div className="space-y-4">
          {/* Google Sign-In Button */}
          {config.web3AuthClientId ? (
            <button
              onClick={handleGoogleConnect}
              disabled={isLoading}
              className="w-full bg-white hover:bg-gray-50 disabled:bg-gray-100 text-gray-800 font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-center group"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-3"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Gasless</span>
                </>
              )}
            </button>
          ) : (
            <div className="p-4 bg-blue-500/10 border border-blue-400/30 rounded-xl">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <div>
                  <div className="text-blue-400 font-medium text-sm">Enable Social Login</div>
                  <div className="text-blue-300/80 text-xs mt-1">
                    Add NEXT_PUBLIC_WEB3AUTH_CLIENT_ID to enable Google sign-in with gasless transactions
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Divider */}
          {config.web3AuthClientId && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-gray-900 text-white/60">or</span>
              </div>
            </div>
          )}

          {/* MetaMask Connect Button */}
          <button
            onClick={handleMetaMaskConnect}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-300 disabled:to-orange-400 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 12.65c-.77.29-1.6.45-2.46.45-3.31 0-6-2.69-6-6 0-.86.16-1.69.45-2.46C12.5 3.61 10.45 3 8.25 3 4.25 3 1 6.25 1 10.25S4.25 17.5 8.25 17.5c2.2 0 4.25-.61 6.2-1.64.29.77.45 1.6.45 2.46 0 3.31 2.69 6 6 6s6-2.69 6-6c0-2.2-.61-4.25-1.64-6.2z"/>
                </svg>
                Connect with MetaMask
              </>
            )}
          </button>
        </div>

        {/* Info Text */}
        <div className="mt-6 text-center">
          <p className="text-white/50 text-xs leading-relaxed">
            {config.web3AuthClientId 
              ? 'Google login provides gasless transactions. MetaMask gives you full wallet control.'
              : 'Make sure MetaMask is installed and connected to NERO Chain network.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default NeroWidget; 