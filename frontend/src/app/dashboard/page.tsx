"use client";

import { useState, useEffect } from 'react';
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import UserRegistration from '@/components/UserRegistration';
import { useUser } from '@/providers/UserProvider';
import { UserChallenge } from '@/lib/api';

type TabType = 'overview' | 'active' | 'completed';

export default function DashboardPage() {
  const { user, primaryWallet } = useDynamicContext();
  const router = useRouter();
  const {
    user: apiUser,
    userStats,
    challenges,
    userChallenges,
    loading,
    errors,
    startChallenge,
    completeChallenge,
    claimChallengeReward,
    updateChallengeProgress,
    createActivity,
    fetchUserStats,
    fetchUserChallenges,
    fetchChallenges,
    initializeUser
  } = useUser();

  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [claimingTokens, setClaimingTokens] = useState<string | null>(null);
  const [updatingProgress, setUpdatingProgress] = useState<string | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const isAuthenticated = !!(user || primaryWallet);

  // Only initialize user if not loading and not registered
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (primaryWallet?.address && !apiUser && !loading.user && !errors.user) {
      setShowRegistration(true);
    } else {
      setShowRegistration(false);
    }
  }, [isAuthenticated, user, primaryWallet, router, apiUser, loading.user, errors.user]);

  // After registration, re-initialize user and fetch data
  useEffect(() => {
    if (registrationComplete && primaryWallet?.address) {
      initializeUser(primaryWallet.address).then(() => {
        if (apiUser?._id) {
          fetchUserStats(apiUser._id);
          fetchUserChallenges(apiUser._id);
          fetchChallenges();
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationComplete, primaryWallet?.address]);

  // Fetch user data only if user exists and not registering
  useEffect(() => {
    if (apiUser?._id && !showRegistration) {
      fetchUserStats(apiUser._id);
      fetchUserChallenges(apiUser._id);
      fetchChallenges();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUser?._id, showRegistration]);

  const handleRegistrationComplete = () => {
    setShowRegistration(false);
    setRegistrationComplete(true);
  };

  const getUserDisplayName = () => {
    if (apiUser?.username) return apiUser.username;
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

  const handleStartChallenge = async (challengeId: string) => {
    if (!apiUser?._id) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      await startChallenge(challengeId);
      await createActivity({
        userId: apiUser._id,
        type: 'challenge',
        title: `Started challenge`,
        description: `Started a new fitness challenge`,
        reward: 0,
        icon: '🎯'
      });
      router.push(`/challenge/${challengeId}`);
    } catch (error) {
      console.error('Failed to start challenge:', error);
      alert('Failed to start challenge. Please try again.');
    }
  };

  const handleViewAllChallenges = () => {
    router.push('/challenges');
  };

  const handleClaimTokens = async (userChallengeId: string, reward: number) => {
    if (!apiUser?._id) {
      alert('Please connect your wallet first');
      return;
    }

    setClaimingTokens(userChallengeId);

    try {
      await claimChallengeReward(userChallengeId);
      await createActivity({
        userId: apiUser._id,
        type: 'challenge',
        title: `Claimed ${reward} FIT tokens`,
        description: `Successfully claimed tokens from completed challenge`,
        reward: reward,
        icon: '💰'
      });

      // Refresh user stats after claiming
      await fetchUserStats(apiUser._id);
      await fetchUserChallenges(apiUser._id);

      alert(`Successfully claimed ${reward} FIT tokens!`);
    } catch (error) {
      console.error('Failed to claim tokens:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to claim tokens: ${errorMessage}`);
    } finally {
      setClaimingTokens(null);
    }
  };

  const handleUpdateProgress = async (userChallengeId: string, progress: number) => {
    if (!apiUser?._id) return;

    setUpdatingProgress(userChallengeId);

    try {
      await updateChallengeProgress(userChallengeId, progress);

      // If progress reaches 100%, complete the challenge
      if (progress >= 100) {
        await completeChallenge(userChallengeId);
        await createActivity({
          userId: apiUser._id,
          type: 'challenge',
          title: `Completed challenge`,
          description: `Successfully completed a fitness challenge`,
          reward: 0,
          icon: '✅'
        });
      }

      // Refresh data
      await fetchUserStats(apiUser._id);
      await fetchUserChallenges(apiUser._id);
    } catch (error) {
      console.error('Failed to update progress:', error);
      alert('Failed to update progress. Please try again.');
    } finally {
      setUpdatingProgress(null);
    }
  };

  // Get user's active and completed challenges
  const activeUserChallenges = userChallenges.filter(uc => !uc.completed);
  const completedUserChallenges = userChallenges.filter(uc => uc.completed);
  const claimableUserChallenges = completedUserChallenges.filter(uc => uc.completed && !uc.claimed);

  // Get challenge details for user challenges
  const getChallengeDetails = (userChallenge: UserChallenge) => {
    return challenges.find(c => c._id === userChallenge.challengeId) || userChallenge.challenge;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊', count: null },
    { id: 'active', label: 'Active', icon: '🎯', count: activeUserChallenges.length },
    { id: 'completed', label: 'Completed', icon: '✅', count: completedUserChallenges.length }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (showRegistration) {
    return <UserRegistration onComplete={handleRegistrationComplete} />;
  }

  if (loading.user || loading.stats || loading.challenges) {
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

  // Show errors if any
  if (errors.user || errors.stats || errors.challenges) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
            <p className="text-white/70 mb-6">
              {errors.user || errors.stats || errors.challenges}
            </p>
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Claimable Tokens Alert */}
            {userStats?.claimableTokens && userStats.claimableTokens > 0 && (
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

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Total FIT</p>
                    <p className="text-3xl font-bold text-yellow-400">{userStats?.totalTokens || 0}</p>
                  </div>
                  <span className="text-3xl">💰</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Challenges</p>
                    <p className="text-3xl font-bold text-green-400">{userStats?.challengesCompleted || 0}</p>
                  </div>
                  <span className="text-3xl">🏆</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Current Streak</p>
                    <p className={`text-3xl font-bold ${getStreakColor(userStats?.currentStreak || 0)}`}>
                      {userStats?.currentStreak || 0}
                    </p>
                  </div>
                  <span className="text-3xl">🔥</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm">Rank</p>
                    <p className="text-3xl font-bold text-purple-400">#{userStats?.rank || 'N/A'}</p>
                  </div>
                  <span className="text-3xl">👑</span>
                </div>
              </div>
            </div>

            {/* Available Challenges */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Available Challenges</h2>
                <button
                  onClick={handleViewAllChallenges}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  View All →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.slice(0, 6).map((challenge) => {
                  const userChallenge = userChallenges.find(uc => uc.challengeId === challenge._id);
                  const isStarted = !!userChallenge;

                  return (
                    <div key={challenge._id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl">{challenge.icon}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-2">{challenge.title}</h3>
                      <p className="text-white/70 text-sm mb-4">{challenge.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-yellow-400 font-semibold">{challenge.reward} FIT</span>
                        <span className="text-white/60 text-sm">{challenge.estimatedTime}</span>
                      </div>

                      {isStarted && userChallenge ? (
                        <div className="space-y-3">
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${userChallenge.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-white/70">{userChallenge.progress}% complete</span>
                            <button
                              onClick={() => handleUpdateProgress(userChallenge._id, Math.min(userChallenge.progress + 25, 100))}
                              disabled={updatingProgress === userChallenge._id}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs transition-colors disabled:opacity-50"
                            >
                              {updatingProgress === userChallenge._id ? 'Updating...' : 'Update Progress'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartChallenge(challenge._id)}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200"
                        >
                          Start Challenge
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'active':
        return (
          <div className="space-y-6">
            {activeUserChallenges.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-white mb-2">No Active Challenges</h3>
                <p className="text-white/70 mb-6">Start a challenge to begin earning FIT tokens!</p>
                <button
                  onClick={() => setActiveTab('overview')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  Browse Challenges
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeUserChallenges.map((userChallenge) => {
                  const challenge = getChallengeDetails(userChallenge);
                  if (!challenge) return null;

                  return (
                    <div key={userChallenge._id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl">{challenge.icon}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-2">{challenge.title}</h3>
                      <p className="text-white/70 text-sm mb-4">{challenge.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-yellow-400 font-semibold">{challenge.reward} FIT</span>
                        <span className="text-white/60 text-sm">{challenge.estimatedTime}</span>
                      </div>

                      <div className="space-y-3">
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${userChallenge.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/70">{userChallenge.progress}% complete</span>
                          <button
                            onClick={() => handleUpdateProgress(userChallenge._id, Math.min(userChallenge.progress + 25, 100))}
                            disabled={updatingProgress === userChallenge._id}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs transition-colors disabled:opacity-50"
                          >
                            {updatingProgress === userChallenge._id ? 'Updating...' : 'Update Progress'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'completed':
        return (
          <div className="space-y-6">
            {completedUserChallenges.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-white mb-2">No Completed Challenges</h3>
                <p className="text-white/70 mb-6">Complete your first challenge to start earning FIT tokens!</p>
                <button
                  onClick={() => setActiveTab('overview')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  Browse Challenges
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedUserChallenges.map((userChallenge) => {
                  const challenge = getChallengeDetails(userChallenge);
                  if (!challenge) return null;

                  return (
                    <div key={userChallenge._id} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl">{challenge.icon}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-green-400 text-2xl">✅</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-2">{challenge.title}</h3>
                      <p className="text-white/70 text-sm mb-4">{challenge.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-yellow-400 font-semibold">{challenge.reward} FIT</span>
                        <span className="text-white/60 text-sm">
                          {userChallenge.completedDate ? new Date(userChallenge.completedDate).toLocaleDateString() : 'Completed'}
                        </span>
                      </div>

                      {userChallenge.completed && !userChallenge.claimed ? (
                        <button
                          onClick={() => handleClaimTokens(userChallenge._id, challenge.reward)}
                          disabled={claimingTokens === userChallenge._id}
                          className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50"
                        >
                          {claimingTokens === userChallenge._id ? 'Claiming...' : `Claim ${challenge.reward} FIT`}
                        </button>
                      ) : (
                        <div className="text-center">
                          <span className="text-green-400 font-semibold">✓ Claimed</span>
                        </div>
                      )}
                    </div>
                  );
                })}
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome back, {getUserDisplayName()}! 👋
          </h1>
          <p className="text-xl text-white/80">
            Ready to crush your fitness goals and earn FIT tokens?
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-1 border border-white/20">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 ${activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
} 