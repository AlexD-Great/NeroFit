import React, { useState, useEffect } from 'react';
import { getSigner, getAAWalletAddress } from '../utils/aaUtils';
import { ethers } from 'ethers';

// Properly type the ethereum object
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      isMetaMask?: boolean;
      on?: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

interface WalletConnectProps {
  onWalletConnected?: (eoaAddress: string, aaAddress: string) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onWalletConnected }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [eoaAddress, setEoaAddress] = useState('');
  const [aaAddress, setAaAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        if (typeof window !== 'undefined' && window.ethereum) {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts && Array.isArray(accounts) && accounts.length > 0) {
            await connectWallet();
          }
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };
    
    checkWalletConnection();
    
    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum && window.ethereum.on) {
      const handleAccountsChanged = (...args: unknown[]) => {
        const accounts = args[0] as string[];
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          connectWallet();
        }
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        // Clean up event listeners
        if (window.ethereum && window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, []);
 
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get signer from wallet
      const signer = await getSigner();
      if (!signer) {
        throw new Error("Failed to get signer from wallet");
      }
      
      // Get EOA address
      const address = await signer.getAddress();
      setEoaAddress(address);
      
      // Get AA wallet address
      const aaWalletAddress = await getAAWalletAddress(signer);
      setAaAddress(aaWalletAddress);
      
      // Update state
      setIsConnected(true);
      
      // Call callback if provided
      if (onWalletConnected) {
        onWalletConnected(address, aaWalletAddress);
      }
      
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      setError(error.message || "Failed to connect wallet");
    } finally {
      setIsLoading(false);
    }
  };
  
  const disconnectWallet = () => {
    setIsConnected(false);
    setEoaAddress('');
    setAaAddress('');
    setError(null);
  };
  
  return (
    <div className="wallet-connect">
      {!isConnected ? (
        <div>
          <button 
            onClick={connectWallet} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isLoading ? "Connecting..." : "Connect Wallet"}
          </button>
          {error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-green-600 font-semibold">✓ Wallet Connected</div>
          <div className="text-sm">
            <div><strong>EOA:</strong> {eoaAddress.slice(0, 6)}...{eoaAddress.slice(-4)}</div>
            <div><strong>AA Wallet:</strong> {aaAddress.slice(0, 6)}...{aaAddress.slice(-4)}</div>
          </div>
          <button 
            onClick={disconnectWallet}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnect; 