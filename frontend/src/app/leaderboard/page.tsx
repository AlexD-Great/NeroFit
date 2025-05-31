"use client";

import { useState, useEffect } from 'react';
import { useNeroContext } from "@/providers/NeroProvider";
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { 
  mockLeaderboardUsers, 
  mockUserStats,
  currentUser
} from '@/data/mockData';

interface LeaderboardUser {
  id: string;
  name: string;
  walletAddress: string;
  totalTokens: number;
  challengesCompleted: number;
  rank: number;
  avatar: string;
  joinedDate: string;
  lastActive: string;
  badges: string[];
  streak: number;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const { user, primaryWallet } = useNeroContext();
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([]);
  const [timeFilter, setTimeFilter] = useState<'weekly' | 'monthly' | 'all-time'>('all-time');
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardUser | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!(user || primaryWallet);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Use mock data
    setLeaderboardUsers(mockLeaderboardUsers);
    
    // Set current user rank using centralized data
    if (isAuthenticated) {
      const currentUserData: LeaderboardUser = {
        id: 'current',
        name: user?.firstName || 'You',
        walletAddress: primaryWallet?.address || '0x0000...0000',
        totalTokens: mockUserStats.totalTokens, // Use centralized data
        challengesCompleted: mockUserStats.challengesCompleted, // Use centralized data
        rank: mockUserStats.rank, // Use centralized data
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName || 'You')}&background=667eea&color=fff&size=40`,
        joinedDate: '2024-03-10',
        lastActive: '2024-03-15',
        badges: ['🌟', '💪'],
        streak: mockUserStats.currentStreak // Use centralized data
      };
      setCurrentUserRank(currentUserData);
    }
  }, [isAuthenticated, user, primaryWallet, router]);

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
                  className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                    timeFilter === filter.key
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
                    src={currentUserRank.avatar}
                    alt="Your avatar"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="text-white font-semibold">{currentUserRank.name}</div>
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
          {leaderboardUsers.slice(0, 3).map((user, index) => (
            <div
              key={user.id}
              className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border text-center ${
                index === 0 ? 'border-yellow-400/50 transform scale-105' :
                index === 1 ? 'border-gray-300/50' :
                'border-orange-400/50'
              }`}
            >
              <div className="text-4xl mb-2">{getRankIcon(user.rank)}</div>
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full mx-auto mb-3"
              />
              <h3 className="text-xl font-bold text-white mb-1">{user.name}</h3>
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
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <h3 className="text-2xl font-bold text-white">Full Rankings</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-white/70 font-medium">Rank</th>
                  <th className="px-6 py-4 text-left text-white/70 font-medium">User</th>
                  <th className="px-6 py-4 text-left text-white/70 font-medium">FIT Tokens</th>
                  <th className="px-6 py-4 text-left text-white/70 font-medium">Challenges</th>
                  <th className="px-6 py-4 text-left text-white/70 font-medium">Streak</th>
                  <th className="px-6 py-4 text-left text-white/70 font-medium">Badges</th>
                  <th className="px-6 py-4 text-left text-white/70 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className={`text-lg font-bold ${getRankColor(user.rank)}`}>
                        {getRankIcon(user.rank)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="text-white font-medium">{user.name}</div>
                          <div className="text-white/60 text-sm">
                            {user.walletAddress.slice(0, 8)}...{user.walletAddress.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-yellow-400 font-bold">{user.totalTokens}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{user.challengesCompleted}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`font-medium ${getStreakColor(user.streak)}`}>
                        🔥 {user.streak}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-1">
                        {user.badges.map((badge, badgeIndex) => (
                          <span key={badgeIndex} className="text-lg">{badge}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white/70 text-sm">{formatDate(user.joinedDate)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-white mb-1">{leaderboardUsers.length}</div>
            <div className="text-white/70">Active Users</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-white mb-1">
              {leaderboardUsers.reduce((sum, user) => sum + user.challengesCompleted, 0)}
            </div>
            <div className="text-white/70">Total Challenges Completed</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold text-white mb-1">
              {leaderboardUsers.reduce((sum, user) => sum + user.totalTokens, 0).toLocaleString()}
            </div>
            <div className="text-white/70">Total FIT Distributed</div>
          </div>
        </div>

        {/* Call to Action */}
        {!isAuthenticated && (
          <div className="text-center mt-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Join the Competition!</h3>
              <p className="text-white/70 mb-6">
                Connect your wallet to start completing challenges and climb the leaderboard!
              </p>
              <button
                onClick={() => router.push('/login')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 