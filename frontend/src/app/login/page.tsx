"use client";

import NeroWidget from "@/components/NeroWidget";
import { useNeroContext } from "@/providers/NeroProvider";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { user, isConnected, walletAddress } = useNeroContext();
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard if user is authenticated
    if (isConnected && (user || walletAddress)) {
      console.log('Login: User authenticated, redirecting to dashboard');
      console.log('isConnected:', isConnected, 'user:', user, 'walletAddress:', walletAddress);
      router.push('/dashboard');
    }
  }, [isConnected, user, walletAddress, router]);

  const handleConnect = () => {
    console.log('Login: Connection successful, checking redirect...');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl mb-6">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Welcome to NeroFit
          </h1>
          
          <p className="text-lg text-white/70 mb-8">
            Connect your wallet or sign in to start earning FIT tokens
          </p>
        </div>

        {/* NERO Widget */}
        <div className="flex justify-center">
          <NeroWidget onConnect={handleConnect} />
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Earn FIT Tokens</h3>
                <p className="text-white/60 text-sm">Complete challenges and earn crypto rewards</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Gasless Transactions</h3>
                <p className="text-white/60 text-sm">No gas fees thanks to our paymaster</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Daily Challenges</h3>
                <p className="text-white/60 text-sm">New fitness challenges every day</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-white/50 text-sm">
            Secure authentication powered by NERO & Web3Auth
          </p>
        </div>
      </div>
    </div>
  );
} 