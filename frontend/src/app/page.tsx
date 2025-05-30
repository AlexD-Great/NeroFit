"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function OnboardingPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Hero Section */}
        <div className="mb-12">
          <div className="float-animation mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            NeroFit
          </h1>
          
          <p className="text-2xl md:text-3xl text-white/90 mb-4 font-light">
            Welcome to the Future of Fitness
          </p>
          
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Join the revolutionary fitness challenge where your healthy lifestyle earns you real rewards on the Nero blockchain
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="card text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Earn FIT Tokens</h3>
            <p className="text-white/70">Complete daily challenges and earn cryptocurrency rewards</p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Daily Challenges</h3>
            <p className="text-white/70">Take on exciting fitness challenges tailored to your goals</p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Gasless Transactions</h3>
            <p className="text-white/70">Claim rewards without paying gas fees thanks to our paymaster</p>
          </div>
        </div>

        {/* Challenge Preview */}
        <div className="card mb-12 text-left max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">🎯 Today&apos;s Challenge Preview</h3>
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-6 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">Walk 1km Challenge</h4>
                <p className="text-white/70">Walk 1 kilometer today and earn 10 FIT tokens</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-400">10</div>
                <div className="text-sm text-white/70">FIT Tokens</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="space-y-4">
          <button
            onClick={handleGetStarted}
            className="btn-primary text-xl px-12 py-4 pulse-glow"
          >
            Start Your Fitness Journey
          </button>
          
          <p className="text-white/60 text-sm">
            Connect your wallet and start earning rewards today
          </p>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400">1000+</div>
            <div className="text-sm text-white/70">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">50K+</div>
            <div className="text-sm text-white/70">Tokens Earned</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">24/7</div>
            <div className="text-sm text-white/70">Challenges</div>
          </div>
        </div>
      </div>
    </div>
  );
}
