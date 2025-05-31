"use client";

import React, { useState, useEffect } from 'react';
import { useNeroWallet } from '../hooks/useNeroWallet';
import { useConfig } from '../hooks/useConfig';

interface NeroWidgetProps {
  onConnect?: () => void;
  onDisconnect?: () => void;
}

// NERO Wallet Widget following their high-level documentation
export const NeroWidget: React.FC<NeroWidgetProps> = ({ onConnect, onDisconnect }) => {
  const [isMounted, setIsMounted] = useState(false);
  
  const { 
    isConnected, 
    isLoading, 
    walletAddress, 
    aaWalletAddress,
    user, 
    error, 
    connect, 
    disconnect 
  } = useNeroWallet();
  
  const config = useConfig();

  // Hydration protection
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleConnect = async () => {
    console.log('NeroWidget: Connect button clicked');
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.error('NeroWidget: Connection timeout after 30 seconds');
    }, 30000);

    try {
      await connect();
      clearTimeout(timeoutId);
      console.log('NeroWidget: Connection successful');
      onConnect?.();
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('NeroWidget: Connection failed:', error);
      // Error is already handled in the hook, no need to show additional error
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
      <div className="nero-widget">
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="nero-widget">
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">
            Connecting to NERO Wallet...
          </span>
        </div>
      </div>
    );
  }

  if (isConnected && walletAddress) {
    return (
      <div className="nero-widget">
        <div className="bg-white rounded-lg shadow-md p-4 max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              NERO Wallet Connected
            </h3>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-green-600">Connected</span>
            </div>
          </div>

          {/* Wallet Address */}
          <div className="space-y-3 mb-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">Wallet Address:</div>
              <div className="font-mono text-sm bg-gray-100 p-2 rounded border break-all">
                {walletAddress}
              </div>
            </div>
          </div>

          {/* Network Info */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600">
              Network: {config.chainName}
            </div>
            <div className="text-xs text-blue-500 mt-1">
              Chain ID: {config.chainId} | RPC: {config.rpcUrl}
            </div>
          </div>

          {/* Disconnect Button */}
          <button
            onClick={handleDisconnect}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Disconnect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="nero-widget">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Connect to NERO Wallet
          </h3>
          <p className="text-sm text-gray-600">
            Connect your wallet to access NERO Chain features
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm text-red-600">{error}</div>
          </div>
        )}

        {/* Connect Button */}
        <button
          onClick={handleConnect}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Connecting...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" clipRule="evenodd" />
              </svg>
              Connect Wallet
            </>
          )}
        </button>

        {/* Info Text */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Make sure you have MetaMask installed and are on the NERO Chain network
          </p>
        </div>
      </div>
    </div>
  );
};

export default NeroWidget; 