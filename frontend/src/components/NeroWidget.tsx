"use client";

import React from 'react';
import { useNeroContext } from '../providers/NeroProvider';

const NeroWidget: React.FC = () => {
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
    return <div>Loading...</div>;
  }

  const handleConnect = async () => {
    try {
      // This will open Web3Auth's built-in modal with all login options
      // including Google, Facebook, Email, SMS, Discord, Twitter, etc.
      await connect();
    } catch (error: any) {
      console.error('NeroWidget: Connection failed:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error: any) {
      console.error('NeroWidget: Disconnect failed:', error);
    }
  };

  if (isConnected && walletAddress) {
    return (
      <div className="nero-widget connected">
        <div className="wallet-info">
          <div className="wallet-address">
            <strong>Wallet:</strong> {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </div>
          {aaWalletAddress && (
            <div className="aa-wallet-address">
              <strong>AA Wallet:</strong> {aaWalletAddress.slice(0, 6)}...{aaWalletAddress.slice(-4)}
            </div>
          )}
        </div>
        <button 
          onClick={handleDisconnect}
          className="disconnect-button"
          disabled={isLoading}
        >
          {isLoading ? 'Disconnecting...' : 'Disconnect'}
        </button>
      </div>
    );
  }

  return (
    <div className="nero-widget">
      <div className="connect-section">
        {/* Single Web3Auth Modal Button - Opens Web3Auth's official modal */}
        <button 
          onClick={handleConnect}
          className="web3auth-button"
          disabled={isLoading}
        >
          {isLoading ? 'Connecting...' : 'Connect with Web3Auth'}
        </button>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Instructions */}
        <div className="instructions">
          <p><strong>Web3Auth Modal</strong> provides multiple login options:</p>
          <ul>
            <li>🔐 Social Login: Google, Facebook, Twitter, Discord</li>
            <li>📧 Email & SMS authentication</li>
            <li>🔗 Wallet Connect for hardware wallets</li>
            <li>🦊 MetaMask and other browser wallets</li>
          </ul>
          <p>Choose your preferred method when the modal opens.</p>
        </div>
      </div>
      
      <style jsx>{`
        .nero-widget {
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: white;
          max-width: 400px;
          margin: 0 auto;
        }
        
        .connect-section {
          text-align: center;
        }
        
        .web3auth-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 16px 24px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          transition: background-color 0.2s;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .web3auth-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        
        .web3auth-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .wallet-info {
          margin-bottom: 15px;
          text-align: left;
        }
        
        .wallet-address, .aa-wallet-address {
          margin-bottom: 8px;
          font-family: monospace;
          font-size: 14px;
        }
        
        .disconnect-button {
          background: #dc3545;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .disconnect-button:hover:not(:disabled) {
          background: #c82333;
        }
        
        .disconnect-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .error-message {
          color: #dc3545;
          font-size: 14px;
          margin-top: 10px;
          padding: 8px;
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 4px;
        }
        
        .instructions {
          margin-top: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 6px;
          text-align: left;
          font-size: 14px;
        }
        
        .instructions p {
          margin: 8px 0;
        }
        
        .instructions ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        
        .instructions li {
          margin: 5px 0;
        }
      `}</style>
    </div>
  );
};

export default NeroWidget; 