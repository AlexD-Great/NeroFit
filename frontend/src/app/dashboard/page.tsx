"use client";

import { useState, useEffect } from 'react';
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

interface Challenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Cardio' | 'Strength' | 'Wellness' | 'Endurance';
  progress: number;
  completed: boolean;
  icon: string;
  estimatedTime: string;
}

interface UserStats {
  totalTokens: number;
  challengesCompleted: number;
  currentStreak: number;
  weeklyWorkouts: number;
  totalDistance: number;
  totalMinutes: number;
  rank: number;
}

interface RecentActivity {
  id: string;
  type: 'challenge' | 'workout' | 'badge';
  title: string;
  description: string;
  reward: number;
  timestamp: string;
  icon: string;
}

export default function DashboardPage() {
  const { user, primaryWallet } = useDynamicContext();
  const router = useRouter();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('week');

  const isAuthenticated = !!(user || primaryWallet);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Mock user stats
    const mockStats: UserStats = {
      totalTokens: 420,
      challengesCompleted: 15,
      currentStreak: 5,
      weeklyWorkouts: 3,
      totalDistance: 25.5,
      totalMinutes: 180,
      rank: 25
    };

    // Mock active challenges
    const mockChallenges: Challenge[] = [
      {
        id: '1',
        title: 'Walk 1km',
        description: 'Take a 1 kilometer walk today',
        reward: 10,
        difficulty: 'Easy',
        category: 'Cardio',
        progress: 60,
        completed: false,
        icon: '🚶‍♂️',
        estimatedTime: '10-15 minutes'
      },
      {
        id: '2',
        title: '30-Minute Workout',
        description: 'Complete a 30-minute strength training session',
        reward: 30,
        difficulty: 'Medium',
        category: 'Strength',
        progress: 0,
        completed: false,
        icon: '💪',
        estimatedTime: '30 minutes'
      },
      {
        id: '3',
        title: '15-Minute Meditation',
        description: 'Practice mindfulness for 15 minutes',
        reward: 12,
        difficulty: 'Easy',
        category: 'Wellness',
        progress: 0,
        completed: false,
        icon: '🧘‍♀️',
        estimatedTime: '15 minutes'
      }
    ];

    // Mock recent activity
    const mockActivity: RecentActivity[] = [
      {
        id: '1',
        type: 'challenge',
        title: 'Completed "Drink 8 Glasses of Water"',
        description: 'Wellness challenge completed',
        reward: 15,
        timestamp: '2 hours ago',
        icon: '💧'
      },
      {
        id: '2',
        type: 'badge',
        title: 'Earned "Consistency King" badge',
        description: 'Maintained a 5-day streak',
        reward: 5,
        timestamp: '1 day ago',
        icon: '🏆'
      },
      {
        id: '3',
        type: 'workout',
        title: 'Completed morning run',
        description: '3km run in the park',
        reward: 25,
        timestamp: '2 days ago',
        icon: '🏃‍♂️'
      }
    ];

    setUserStats(mockStats);
    setActiveChallenges(mockChallenges);
    setRecentActivity(mockActivity);
  }, [isAuthenticated, user, primaryWallet, router]);

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

  const handleStartWorkout = () => {
    // Navigate to a workout selection or start a quick workout
    router.push('/challenges?category=Strength');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
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
            <p className="text-white/70">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="text-white/60 text-sm">+25 this week</div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white/70 text-sm font-medium">Challenges</h3>
              <span className="text-2xl">🏆</span>
            </div>
            <div className="text-3xl font-bold text-green-400 mb-1">{userStats.challengesCompleted}</div>
            <div className="text-white/60 text-sm">Completed</div>
          </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Active Challenges */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">🚀 Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleStartWorkout}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span className="text-xl">💪</span>
                  <span>Start Workout</span>
                </button>
                <button
                  onClick={handleViewAllChallenges}
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span className="text-xl">🎯</span>
                  <span>View Challenges</span>
                </button>
              </div>
            </div>

            {/* Active Challenges */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">🎯 Active Challenges</h3>
                <button
                  onClick={handleViewAllChallenges}
                  className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
                >
                  View all →
                </button>
              </div>
              
              <div className="space-y-4">
                {activeChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                    onClick={() => handleStartChallenge(challenge.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{challenge.icon}</span>
                        <div>
                          <h4 className="text-white font-semibold">{challenge.title}</h4>
                          <p className="text-white/70 text-sm">{challenge.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 font-semibold">{challenge.reward} FIT</div>
                        <div className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </div>
                      </div>
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
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-white/60 text-sm">⏰ {challenge.estimatedTime}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartChallenge(challenge.id);
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded-lg text-sm transition-colors"
                      >
                        {challenge.progress > 0 ? 'Continue' : 'Start'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">📈 Weekly Progress</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{userStats.weeklyWorkouts}</div>
                  <div className="text-white/70 text-sm">Workouts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{userStats.totalDistance}km</div>
                  <div className="text-white/70 text-sm">Distance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{userStats.totalMinutes}min</div>
                  <div className="text-white/70 text-sm">Active Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">85%</div>
                  <div className="text-white/70 text-sm">Goal Progress</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Recent Activity */}
          <div className="space-y-8">
            
            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">🕒 Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                    <span className="text-xl">{activity.icon}</span>
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm">{activity.title}</div>
                      <div className="text-white/60 text-xs">{activity.description}</div>
                      <div className="text-white/50 text-xs mt-1">{activity.timestamp}</div>
                    </div>
                    <div className="text-yellow-400 font-semibold text-sm">+{activity.reward}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Goals */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">🎯 Today's Goals</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🚶‍♂️</span>
                    <span className="text-white text-sm">Walk 10,000 steps</span>
                  </div>
                  <div className="text-green-400 text-sm">7,500 / 10,000</div>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">💧</span>
                    <span className="text-white text-sm">Drink 8 glasses</span>
                  </div>
                  <div className="text-blue-400 text-sm">6 / 8</div>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">🧘‍♀️</span>
                    <span className="text-white text-sm">Meditate 15 min</span>
                  </div>
                  <div className="text-yellow-400 text-sm">0 / 15</div>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>

            {/* Motivational Quote */}
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
              <div className="text-center">
                <div className="text-3xl mb-3">💪</div>
                <blockquote className="text-white font-medium mb-2">
                  "The only bad workout is the one that didn't happen."
                </blockquote>
                <cite className="text-white/60 text-sm">- Unknown</cite>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 