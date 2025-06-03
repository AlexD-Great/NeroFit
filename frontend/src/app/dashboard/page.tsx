"use client";

import { useNeroContext } from "@/providers/NeroProvider";
import { useWallet } from "@/providers/WalletProvider";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { 
  mockChallenges, 
  mockUserStats, 
  Challenge, 
  UserStats 
} from '@/data/mockData';

type TabType = 'overview' | 'active' | 'completed';

export default function DashboardPage() {
  const { user, primaryWallet, isLoading, isConnected, walletAddress } = useNeroContext();
  const { claimTokens } = useWallet();
  const router = useRouter();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [allChallenges, setAllChallenges] = useState<Challenge[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [claimingTokens, setClaimingTokens] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Hydration protection
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load dashboard data when component mounts
  useEffect(() => {
    if (!isMounted) {
      return;
    }

    console.log('Dashboard: Loading data');
    setUserStats(mockUserStats);
    setAllChallenges(mockChallenges);
  }, [isMounted]);

  const getUserDisplayName = () => {
    if (user?.firstName) return user.firstName;
    if (user?.email) return user.email.split('@')[0];
    if (primaryWallet?.address) return `${primaryWallet.address.slice(0, 6)}...${primaryWallet.address.slice(-4)}`;
    return 'User';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'Hard': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-red-400';
    if (streak >= 20) return 'text-orange-400';
    if (streak >= 10) return 'text-yellow-400';
    return 'text-green-400';
  };

  const handleStartChallenge = (challengeId: string) => {
    router.push(`/challenge/${challengeId}`);
  };

  const handleViewAllChallenges = () => {
    router.push('/challenges');
  };

  const handleClaimTokens = async (challengeId: string, reward: number) => {
    setClaimingTokens(challengeId);
    
    try {
      const walletAddress = primaryWallet?.address;
      
      if (!walletAddress) {
        throw new Error('No wallet address found');
      }

      // Call the actual API through WalletProvider
      await claimTokens();
      
      // Update challenge to mark as claimed
      const updatedChallenges = allChallenges.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, claimable: false }
          : challenge
      );
      setAllChallenges(updatedChallenges);
      
      // Update user stats
      if (userStats) {
        setUserStats({
          ...userStats,
          totalTokens: userStats.totalTokens + reward,
          claimableTokens: userStats.claimableTokens - reward
        });
      }
      
      // Show success message
      alert(`Successfully claimed ${reward} FIT tokens!`);
      
    } catch (error) {
      console.error('Failed to claim tokens:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to claim tokens: ${errorMessage}`);
    } finally {
      setClaimingTokens(null);
    }
  };

  // Don't render anything until mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Show loading if we're checking authentication or redirecting
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white/70">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white/70">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  const activeChallenges = allChallenges.filter(c => !c.completed);
  const completedChallenges = allChallenges.filter(c => c.completed);
  const claimableChallenges = completedChallenges.filter(c => c.claimable);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊', count: null },
    { id: 'active', label: 'Active', icon: '🎯', count: activeChallenges.length },
    { id: 'completed', label: 'Completed', icon: '✅', count: completedChallenges.length }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Claimable Tokens Alert */}
            {userStats.claimableTokens > 0 && (
              <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">💰</span>
                    <div>
                      <h3 className="text-xl font-bold text-yellow-400">Tokens Ready to Claim!</h3>
                      <p className="text-white/70">You have {userStats.claimableTokens} FIT tokens waiting to be claimed from completed challenges.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('completed')}
                    className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                  >
                    Claim Now
                  </button>
                </div>
              </div>
            )}

            {/* Today's Goals */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">🎯 Today&apos;s Goals</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Complete 2 challenges</span>
                  <span className="text-green-400 font-semibold">1/2</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/80">Earn 50 FIT tokens</span>
                  <span className="text-yellow-400 font-semibold">{userStats.totalTokens + userStats.claimableTokens}/50</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${Math.min(((userStats.totalTokens + userStats.claimableTokens) / 50) * 100, 100)}%` }}></div>
                </div>
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">📈 Weekly Progress</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{userStats.weeklyWorkouts}</div>
                  <div className="text-white/60 text-sm">Workouts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{userStats.totalDistance}km</div>
                  <div className="text-white/60 text-sm">Distance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{userStats.totalMinutes}min</div>
                  <div className="text-white/60 text-sm">Active Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{userStats.totalTokens}</div>
                  <div className="text-white/60 text-sm">FIT Claimed</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'active':
        return (
          <div className="space-y-6">
            {activeChallenges.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-white mb-2">No Active Challenges</h3>
                <p className="text-white/60 mb-6">Start a new challenge to begin earning FIT tokens!</p>
                <button
                  onClick={handleViewAllChallenges}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  Browse Challenges
                </button>
              </div>
            ) : (
              activeChallenges.map((challenge) => (
                <div key={challenge.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{challenge.icon}</span>
                      <div>
                        <h4 className="text-lg font-bold text-white">{challenge.title}</h4>
                        <p className="text-white/60 text-sm">{challenge.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold text-lg">{challenge.reward} FIT</div>
                      <div className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(challenge.difficulty)}`}>
                        {challenge.difficulty}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/70">Progress</span>
                      <span className="text-white/70">{challenge.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${challenge.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-white/60 text-sm">
                      <span className="mr-4">⏱️ {challenge.estimatedTime}</span>
                      <span>📅 {challenge.timeLimit}</span>
                    </div>
                    <button
                      onClick={() => handleStartChallenge(challenge.id)}
                      className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                    >
                      {challenge.progress > 0 ? 'Continue' : 'Start'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        );

      case 'completed':
        return (
          <div className="space-y-6">
            {completedChallenges.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-white mb-2">No Completed Challenges</h3>
                <p className="text-white/60 mb-6">Complete your first challenge to see it here!</p>
                <button
                  onClick={() => setActiveTab('active')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  View Active Challenges
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6 text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">🎉 Great Job!</h3>
                  <p className="text-white/70">
                    You&apos;ve completed {completedChallenges.length} challenges! 
                    {claimableChallenges.length > 0 && (
                      <span className="text-yellow-400 font-semibold">
                        {' '}Claim {userStats.claimableTokens} FIT tokens below.
                      </span>
                    )}
                  </p>
                </div>
                {completedChallenges.map((challenge) => (
                  <div key={challenge.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 relative">
                    <div className="absolute top-4 right-4">
                      <div className={`text-white text-xs px-2 py-1 rounded-full font-semibold ${
                        challenge.claimable ? 'bg-yellow-500' : 'bg-green-500'
                      }`}>
                        {challenge.claimable ? '💰 CLAIMABLE' : '✅ CLAIMED'}
                      </div>
                    </div>
                    
                    <div className="flex items-start justify-between mb-4 pr-24">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{challenge.icon}</span>
                        <div>
                          <h4 className="text-lg font-bold text-white">{challenge.title}</h4>
                          <p className="text-white/60 text-sm">{challenge.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-lg ${challenge.claimable ? 'text-yellow-400' : 'text-green-400'}`}>
                          {challenge.claimable ? `${challenge.reward} FIT` : `+${challenge.reward} FIT`}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="w-full bg-green-500 rounded-full h-2"></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-white/60 text-sm">
                        <span className="mr-4">⏱️ {challenge.estimatedTime}</span>
                        <span className="mr-4">🏆 {challenge.category}</span>
                      </div>
                      <div className="flex space-x-2">
                        {challenge.claimable && (
                          <button
                            onClick={() => handleClaimTokens(challenge.id, challenge.reward)}
                            disabled={claimingTokens === challenge.id}
                            className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm flex items-center space-x-2"
                          >
                            {claimingTokens === challenge.id ? (
                              <>
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                <span>Claiming...</span>
                              </>
                            ) : (
                              <>
                                <span>💰</span>
                                <span>Claim {challenge.reward} FIT</span>
                              </>
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleStartChallenge(challenge.id)}
                          className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {getUserDisplayName()}! 👋
          </h1>
          <p className="text-xl text-white/80">Ready to crush your fitness goals today?</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white/70 text-sm font-medium">FIT Tokens</h3>
              <span className="text-2xl">💰</span>
              </div>
            <div className="text-3xl font-bold text-yellow-400 mb-1">{userStats.totalTokens}</div>
            <div className="text-white/60 text-sm">
              {userStats.claimableTokens > 0 ? (
                <span className="text-yellow-400">+{userStats.claimableTokens} claimable</span>
            ) : (
                `From ${userStats.challengesCompleted} challenges`
            )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('completed')}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200 text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white/70 text-sm font-medium">Challenges</h3>
              <span className="text-2xl">🏆</span>
            </div>
            <div className="text-3xl font-bold text-green-400 mb-1">{userStats.challengesCompleted}</div>
            <div className="text-white/60 text-sm hover:text-green-400 transition-colors">
              Completed • Click to view →
            </div>
          </button>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white/70 text-sm font-medium">Current Streak</h3>
              <span className="text-2xl">🔥</span>
            </div>
            <div className={`text-3xl font-bold mb-1 ${getStreakColor(userStats.currentStreak)}`}>
              {userStats.currentStreak}
            </div>
            <div className="text-white/60 text-sm">Days in a row</div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white/70 text-sm font-medium">Global Rank</h3>
              <span className="text-2xl">📊</span>
            </div>
            <div className="text-3xl font-bold text-purple-400 mb-1">#{userStats.rank}</div>
            <div className="text-white/60 text-sm">
              <button 
                onClick={() => router.push('/leaderboard')}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                View leaderboard →
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-2 border border-white/20">
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activeTab === tab.id ? 'bg-white/20' : 'bg-white/10'
                    }`}>
                      {tab.count}
                    </span>
                  )}
            </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {renderTabContent()}
        </div>

      </div>
    </div>
  );
} 