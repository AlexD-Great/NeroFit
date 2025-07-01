"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import Header from '@/components/Header';
import { useUser } from '@/providers/UserProvider';
import { LeaderboardUser } from '@/lib/api';

export default function LeaderboardPage() {
  const router = useRouter();
  const { user, primaryWallet } = useDynamicContext();
  const {
    leaderboard,
    userStats,
    user: apiUser,
    loading,
    errors,
    fetchLeaderboard
  } = useUser();

  const [timeFilter, setTimeFilter] = useState<'weekly' | 'monthly' | 'all-time'>('all-time');
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardUser | null>(null);

  const isAuthenticated = !!(user || primaryWallet);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Fetch leaderboard data
    fetchLeaderboard();
  }, [isAuthenticated, user, primaryWallet, router, fetchLeaderboard]);

  useEffect(() => {
    if (apiUser && userStats && leaderboard.length > 0) {
      // Find current user in leaderboard or create entry
      const currentUserData: LeaderboardUser = {
        _id: apiUser._id,
        walletAddress: apiUser.walletAddress,
        username: apiUser.username,
        totalTokens: userStats.totalTokens,
        challengesCompleted: userStats.challengesCompleted,
        rank: userStats.rank,
        profilePicture: apiUser.profilePicture,
        badges: [], // Will be populated from userBadges if needed
        streak: userStats.currentStreak,
        lastActive: apiUser.lastActive
      };
      setCurrentUserRank(currentUserData);
    }
  }, [apiUser, userStats, leaderboard]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-300';
      case 3: return 'text-orange-400';
      default: return 'text-white/70';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-red-400';
    if (streak >= 20) return 'text-orange-400';
    if (streak >= 10) return 'text-yellow-400';
    return 'text-green-400';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-white/70 mb-6">Please log in to view the leaderboard.</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading.leaderboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white/70">Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (errors.leaderboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
            <p className="text-white/70 mb-6">{errors.leaderboard}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🏆 Leaderboard</h1>
          <p className="text-xl text-white/80 mb-6">
            See how you rank against other fitness enthusiasts
          </p>
        </div>

        {/* Time Filter */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-1 border border-white/20">
            <div className="flex space-x-1">
              {[
                { key: 'all-time', label: 'All Time' },
                { key: 'monthly', label: 'This Month' },
                { key: 'weekly', label: 'This Week' }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setTimeFilter(filter.key as 'weekly' | 'monthly' | 'all-time')}
                  className={`px-6 py-2 rounded-lg transition-all duration-200 ${timeFilter === filter.key
                      ? 'bg-purple-600 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current User Rank (if authenticated) */}
        {currentUserRank && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/50 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Your Ranking</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className={`text-2xl font-bold ${getRankColor(currentUserRank.rank)}`}>
                    #{currentUserRank.rank}
                  </div>
                  <img
                    src={currentUserRank.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserRank.username || 'User')}&background=667eea&color=fff&size=40`}
                    alt="Your avatar"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="text-white font-semibold">{currentUserRank.username || 'You'}</div>
                    <div className="text-white/60 text-sm">
                      {currentUserRank.walletAddress.slice(0, 8)}...{currentUserRank.walletAddress.slice(-6)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-yellow-400 font-bold text-lg">{currentUserRank.totalTokens} FIT</div>
                <div className="text-white/70 text-sm">{currentUserRank.challengesCompleted} challenges</div>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {leaderboard.slice(0, 3).map((user, index) => (
            <div
              key={user._id}
              className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border text-center ${index === 0 ? 'border-yellow-400/50 transform scale-105' :
                  index === 1 ? 'border-gray-300/50' :
                    'border-orange-400/50'
                }`}
            >
              <div className="text-4xl mb-2">{getRankIcon(user.rank)}</div>
              <img
                src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=667eea&color=fff&size=40`}
                alt={user.username || 'User'}
                className="w-16 h-16 rounded-full mx-auto mb-3"
              />
              <h3 className="text-xl font-bold text-white mb-1">{user.username || 'Anonymous'}</h3>
              <div className="text-white/60 text-sm mb-3">
                {user.walletAddress.slice(0, 8)}...{user.walletAddress.slice(-6)}
              </div>
              <div className="text-yellow-400 font-bold text-2xl mb-1">{user.totalTokens}</div>
              <div className="text-white/70 text-sm mb-3">FIT Tokens</div>
              <div className="flex justify-center space-x-1 mb-3">
                {user.badges.map((badge, badgeIndex) => (
                  <span key={badgeIndex} className="text-lg">{badge}</span>
                ))}
              </div>
              <div className={`text-sm ${getStreakColor(user.streak)}`}>
                🔥 {user.streak} day streak
              </div>
            </div>
          ))}
        </div>

        {/* Full Leaderboard */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
          <div className="p-6 border-b border-white/20">
            <h3 className="text-xl font-bold text-white">Full Leaderboard</h3>
          </div>
          <div className="divide-y divide-white/10">
            {leaderboard.map((user, index) => (
              <div
                key={user._id}
                className={`p-6 hover:bg-white/5 transition-colors ${currentUserRank?._id === user._id ? 'bg-purple-500/20 border-l-4 border-purple-500' : ''
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`text-xl font-bold ${getRankColor(user.rank)} min-w-[3rem]`}>
                      {getRankIcon(user.rank)}
                    </div>
                    <img
                      src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'User')}&background=667eea&color=fff&size=40`}
                      alt={user.username || 'User'}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="text-white font-semibold">{user.username || 'Anonymous'}</div>
                      <div className="text-white/60 text-sm">
                        {user.walletAddress.slice(0, 8)}...{user.walletAddress.slice(-6)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">{user.totalTokens} FIT</div>
                      <div className="text-white/70 text-sm">{user.challengesCompleted} challenges</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm ${getStreakColor(user.streak)}`}>
                        🔥 {user.streak}
                      </div>
                      <div className="text-white/60 text-xs">streak</div>
                    </div>
                    <div className="text-white/60 text-sm">
                      {formatDate(user.lastActive)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 