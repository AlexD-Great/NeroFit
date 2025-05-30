"use client";

import { useWallet } from '@/providers/WalletProvider';
import { useToast } from '@/providers/ToastProvider';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Cardio' | 'Strength' | 'Wellness' | 'Endurance';
  timeLimit: string;
  progress: number;
  completed: boolean;
  icon: string;
}

interface UserStats {
  totalChallengesCompleted: number;
  totalTokensEarned: number;
  currentStreak: number;
  rank: number;
  level: number;
}

interface LeaderboardEntry {
  rank: number;
  address: string;
  displayName: string;
  tokensEarned: number;
  challengesCompleted: number;
}

interface ChallengeHistory {
  id: string;
  title: string;
  completedAt: string;
  tokensEarned: number;
  category: string;
}

export default function Dashboard() {
  const { walletAddress, isConnected, fitTokens, connectWallet } = useWallet();
  const { showSuccess, showError } = useToast();
  const router = useRouter();
  
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalChallengesCompleted: 0,
    totalTokensEarned: 0,
    currentStreak: 0,
    rank: 0,
    level: 1
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [challengeHistory, setChallengeHistory] = useState<ChallengeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'challenges' | 'profile' | 'leaderboard' | 'history'>('challenges');

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockChallenges: Challenge[] = [
      {
        id: '1',
        title: 'Walk 1km',
        description: 'Take a 1 kilometer walk today',
        reward: 10,
        difficulty: 'Easy',
        category: 'Cardio',
        timeLimit: '24 hours',
        progress: 0,
        completed: false,
        icon: '🚶‍♂️'
      },
      {
        id: '2',
        title: 'Run 3km',
        description: 'Complete a 3 kilometer run',
        reward: 25,
        difficulty: 'Medium',
        category: 'Cardio',
        timeLimit: '24 hours',
        progress: 60,
        completed: false,
        icon: '🏃‍♂️'
      },
      {
        id: '3',
        title: 'Drink 8 Glasses of Water',
        description: 'Stay hydrated throughout the day',
        reward: 15,
        difficulty: 'Easy',
        category: 'Wellness',
        timeLimit: '24 hours',
        progress: 100,
        completed: true,
        icon: '💧'
      },
      {
        id: '4',
        title: '30-Minute Workout',
        description: 'Complete a 30-minute strength training session',
        reward: 30,
        difficulty: 'Medium',
        category: 'Strength',
        timeLimit: '24 hours',
        progress: 0,
        completed: false,
        icon: '💪'
      },
      {
        id: '5',
        title: '10,000 Steps',
        description: 'Reach 10,000 steps today',
        reward: 20,
        difficulty: 'Medium',
        category: 'Cardio',
        timeLimit: '24 hours',
        progress: 75,
        completed: false,
        icon: '👟'
      },
      {
        id: '6',
        title: '15-Minute Meditation',
        description: 'Practice mindfulness for 15 minutes',
        reward: 12,
        difficulty: 'Easy',
        category: 'Wellness',
        timeLimit: '24 hours',
        progress: 0,
        completed: false,
        icon: '🧘‍♀️'
      }
    ];

    const mockStats: UserStats = {
      totalChallengesCompleted: 47,
      totalTokensEarned: 1250,
      currentStreak: 7,
      rank: 23,
      level: 8
    };

    const mockLeaderboard: LeaderboardEntry[] = [
      { rank: 1, address: '0x1234...5678', displayName: 'FitnessPro', tokensEarned: 2500, challengesCompleted: 89 },
      { rank: 2, address: '0x2345...6789', displayName: 'RunnerX', tokensEarned: 2350, challengesCompleted: 82 },
      { rank: 3, address: '0x3456...7890', displayName: 'HealthGuru', tokensEarned: 2200, challengesCompleted: 78 },
      { rank: 4, address: '0x4567...8901', displayName: 'CardioKing', tokensEarned: 2100, challengesCompleted: 75 },
      { rank: 5, address: '0x5678...9012', displayName: 'WellnessQueen', tokensEarned: 1980, challengesCompleted: 71 }
    ];

    const mockHistory: ChallengeHistory[] = [
      { id: '1', title: 'Walk 1km', completedAt: '2024-01-15T10:30:00Z', tokensEarned: 10, category: 'Cardio' },
      { id: '2', title: 'Drink 8 Glasses', completedAt: '2024-01-15T09:15:00Z', tokensEarned: 15, category: 'Wellness' },
      { id: '3', title: '30-Min Workout', completedAt: '2024-01-14T18:45:00Z', tokensEarned: 30, category: 'Strength' },
      { id: '4', title: '10,000 Steps', completedAt: '2024-01-14T16:20:00Z', tokensEarned: 20, category: 'Cardio' },
      { id: '5', title: 'Meditation', completedAt: '2024-01-13T07:00:00Z', tokensEarned: 12, category: 'Wellness' }
    ];

    setChallenges(mockChallenges);
    setUserStats(mockStats);
    setLeaderboard(mockLeaderboard);
    setChallengeHistory(mockHistory);
  }, []);

  const handleClaimReward = async (challengeId: string) => {
    if (!isConnected) {
      showError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const challenge = challenges.find(c => c.id === challengeId);
      if (challenge) {
        setChallenges(prev => 
          prev.map(c => 
            c.id === challengeId 
              ? { ...c, completed: true, progress: 100 }
              : c
          )
        );
        showSuccess(`Successfully claimed ${challenge.reward} FIT tokens!`);
      }
    } catch {
      showError('Failed to claim reward. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Cardio': return 'text-blue-400 bg-blue-400/20';
      case 'Strength': return 'text-purple-400 bg-purple-400/20';
      case 'Wellness': return 'text-green-400 bg-green-400/20';
      case 'Endurance': return 'text-orange-400 bg-orange-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 18v1a2 2 0 01-2 2H5a2 2 0 01-2-2v-1m18-2H3a2 2 0 00-2 2v1a2 2 0 002 2h16a2 2 0 002-2v-1a2 2 0 00-2-2zM6 12l6 6 6-6M12 3v15"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-white/70 mb-6">
            Connect your wallet to access your fitness dashboard and start earning FIT tokens
          </p>
          <button
            onClick={connectWallet}
            className="btn-primary w-full"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Welcome back!</h1>
              <p className="text-white/70">Ready to crush today&apos;s challenges?</p>
            </div>
            
            {/* Floating Token Display */}
            <div className="float-animation">
              <div className="card bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">F</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{fitTokens}</div>
                    <div className="text-sm text-white/70">FIT Tokens</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Info */}
          <div className="card bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">Wallet Connected</span>
                <span className="text-white/70">{walletAddress ? formatAddress(walletAddress) : ''}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-white/70">
                <span>Level {userStats.level}</span>
                <span>Rank #{userStats.rank}</span>
                <span>{userStats.currentStreak} day streak 🔥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/10 rounded-lg p-1">
            {[
              { key: 'challenges', label: 'Challenges', icon: '🎯' },
              { key: 'profile', label: 'Profile', icon: '👤' },
              { key: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
              { key: 'history', label: 'History', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'challenges' | 'profile' | 'leaderboard' | 'history')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all ${
                  activeTab === tab.key
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'challenges' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="card hover:scale-105 transition-transform">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{challenge.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{challenge.title}</h3>
                      <p className="text-white/70 text-sm">{challenge.description}</p>
                    </div>
                  </div>
                  {challenge.completed && (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-1 rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                    <span className={`px-2 py-1 rounded-full ${getCategoryColor(challenge.category)}`}>
                      {challenge.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>⏰ {challenge.timeLimit}</span>
                    <span className="text-yellow-400 font-semibold">{challenge.reward} FIT</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Progress</span>
                      <span className="text-white">{challenge.progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${challenge.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => router.push(`/challenge/${challenge.id}`)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                  {challenge.completed ? (
                    <button
                      onClick={() => handleClaimReward(challenge.id)}
                      disabled={isLoading}
                      className="flex-1 btn-primary disabled:opacity-50"
                    >
                      {isLoading ? 'Claiming...' : 'Claim Reward'}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex-1 bg-gray-500/20 text-gray-400 py-2 px-4 rounded-lg cursor-not-allowed"
                    >
                      Complete First
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-2xl font-bold text-white mb-6">Profile Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">{userStats.totalChallengesCompleted}</div>
                    <div className="text-white/70">Challenges Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400">{userStats.totalTokensEarned}</div>
                    <div className="text-white/70">Total FIT Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400">{userStats.currentStreak}</div>
                    <div className="text-white/70">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">#{userStats.rank}</div>
                    <div className="text-white/70">Global Rank</div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-bold text-white mb-4">Achievements</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                    <div className="text-2xl">🏃‍♂️</div>
                    <div>
                      <div className="text-white font-medium">First Steps</div>
                      <div className="text-white/70 text-sm">Complete your first challenge</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                    <div className="text-2xl">🔥</div>
                    <div>
                      <div className="text-white font-medium">Week Warrior</div>
                      <div className="text-white/70 text-sm">Maintain a 7-day streak</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg opacity-50">
                    <div className="text-2xl">💎</div>
                    <div>
                      <div className="text-white font-medium">Diamond Hands</div>
                      <div className="text-white/70 text-sm">Earn 1000 FIT tokens</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold text-white mb-4">Wallet Information</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <span className="text-white/70">Address</span>
                  <span className="text-white font-mono">{walletAddress ? formatAddress(walletAddress) : 'Not connected'}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <span className="text-white/70">FIT Balance</span>
                  <span className="text-white font-bold">{fitTokens} FIT</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <span className="text-white/70">Network</span>
                  <span className="text-white">Nero Testnet</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                  <span className="text-white/70">Status</span>
                  <span className="text-green-400 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Connected
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="card">
            <h3 className="text-2xl font-bold text-white mb-6">🏆 Global Leaderboard</h3>
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div 
                  key={entry.rank} 
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                    walletAddress && entry.address === walletAddress 
                      ? 'bg-purple-500/20 border border-purple-500/30' 
                      : 'bg-white/10 hover:bg-white/15'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      entry.rank === 1 ? 'bg-yellow-500 text-black' :
                      entry.rank === 2 ? 'bg-gray-400 text-black' :
                      entry.rank === 3 ? 'bg-orange-600 text-white' :
                      'bg-white/20 text-white'
                    }`}>
                      {entry.rank}
                    </div>
                    <div>
                      <div className="text-white font-medium">{entry.displayName}</div>
                      <div className="text-white/70 text-sm">{formatAddress(entry.address)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{entry.tokensEarned} FIT</div>
                    <div className="text-white/70 text-sm">{entry.challengesCompleted} challenges</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="card">
            <h3 className="text-2xl font-bold text-white mb-6">📊 Challenge History</h3>
            <div className="space-y-3">
              {challengeHistory.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-4 bg-white/10 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-medium">{entry.title}</div>
                      <div className="text-white/70 text-sm">{formatDate(entry.completedAt)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold">+{entry.tokensEarned} FIT</div>
                    <div className="text-white/70 text-sm">{entry.category}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 