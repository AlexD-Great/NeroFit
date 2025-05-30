"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, primaryWallet } = useDynamicContext();
  const router = useRouter();

  useEffect(() => {
    if (!user && !primaryWallet) {
      router.push('/login');
    }
  }, [user, primaryWallet, router]);

  if (!user && !primaryWallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user?.firstName || user?.email || primaryWallet?.address?.slice(0, 6) || 'User'}!
          </h1>
          <p className="text-gray-300">Ready to earn some FIT tokens?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Wallet Info */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Wallet Status</h3>
            {primaryWallet ? (
              <div className="space-y-2">
                <p className="text-green-400 text-sm">✓ Connected</p>
                <p className="text-gray-300 text-xs font-mono">
                  {primaryWallet.address?.slice(0, 6)}...{primaryWallet.address?.slice(-4)}
                </p>
                <p className="text-gray-400 text-xs">
                  {primaryWallet.connector?.name || 'Unknown Wallet'}
                </p>
              </div>
            ) : user ? (
              <div className="space-y-2">
                <p className="text-blue-400 text-sm">✓ Social Login</p>
                <p className="text-gray-300 text-xs">
                  {user.email}
                </p>
                <p className="text-gray-400 text-xs">Connect wallet to claim tokens</p>
              </div>
            ) : (
              <p className="text-yellow-400 text-sm">No connection</p>
            )}
          </div>

          {/* FIT Tokens */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">FIT Tokens</h3>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-purple-400">0 FIT</p>
              <p className="text-gray-400 text-sm">Start working out to earn!</p>
            </div>
          </div>

          {/* Workouts */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Workouts</h3>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-blue-400">0</p>
              <p className="text-gray-400 text-sm">Completed this week</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Start Workout
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              View Challenges
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 