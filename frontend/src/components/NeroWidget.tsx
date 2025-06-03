"use client";

import React from 'react';
import { useNeroContext } from '../providers/NeroProvider';

interface NeroWidgetProps {
  onConnect?: () => void;
}

const NeroWidget: React.FC<NeroWidgetProps> = ({ onConnect }) => {
  const { 
    isConnected, 
    isLoading, 
    walletAddress, 
    aaWalletAddress, 
    connect,
    disconnect,
    error,
    isMounted 
  } = useNeroContext();

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  const handleConnect = async () => {
    try {
      console.log('NeroWidget: Starting connection...');
      
      // This will open Web3Auth's built-in modal with all login options
      // including Google, Facebook, Email, SMS, Discord, Twitter, etc.
      await connect();
      
      console.log('NeroWidget: Connection successful, calling onConnect callback');
      
      // Call the optional onConnect callback
      if (onConnect) {
        onConnect();
      }
      
      // Small delay to ensure state propagation
      setTimeout(() => {
        console.log('NeroWidget: State should be updated now');
      }, 1000);
      
    } catch (error: any) {
      console.error('NeroWidget: Connection failed:', error);
      // Connection failed - error is handled by the hook
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error: any) {
      // Disconnect failed - error is handled by the hook
    }
  };

  if (isConnected && walletAddress) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Connected Successfully!</h3>
          <p className="text-white/70 text-sm">Your wallet is ready to use</p>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-white/60 text-xs uppercase tracking-wide mb-1">Wallet Address</div>
            <div className="text-white font-mono text-sm">{walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}</div>
          </div>
          {aaWalletAddress && aaWalletAddress !== walletAddress && (
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-white/60 text-xs uppercase tracking-wide mb-1">Smart Account</div>
              <div className="text-white font-mono text-sm">{aaWalletAddress.slice(0, 8)}...{aaWalletAddress.slice(-6)}</div>
            </div>
          )}
        </div>
        
        <button 
          onClick={handleDisconnect}
          disabled={isLoading}
          className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 hover:text-red-300 font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
              <span>Disconnecting...</span>
            </div>
          ) : (
            'Disconnect Wallet'
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl max-w-md w-full">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
          <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Connect to NeroFit</h2>
        <p className="text-white/70">Sign in with your preferred method to get started</p>
      </div>
      
      <div className="space-y-4">
        <button 
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span className="text-lg">Connecting...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              <span className="text-lg">Sign In</span>
            </div>
          )}
        </button>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-white/50 text-xs text-center">
          Secure authentication powered by Web3Auth
        </p>
      </div>
    </div>
  );
};

export default NeroWidget; 