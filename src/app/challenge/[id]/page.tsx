"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useWallet } from '../../../providers/WalletProvider';
import { useToast } from '../../../providers/ToastProvider';
import apiService, { Challenge } from '../../../services/api';

export default function ChallengePage() {
  const router = useRouter();
  const params = useParams();
  const { walletAddress, isConnected, refreshUserData, isBackendConnected } = useWallet();
  const { showSuccess, showError, showInfo } = useToast();
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    const loadChallenge = async () => {
      try {
        const challenges = await apiService.getChallenges();
        const foundChallenge = challenges.find(c => c.id === params.id);
        
        if (foundChallenge) {
          setChallenge(foundChallenge);
        } else {
          showError('Challenge not found');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error loading challenge:', error);
        showError('Failed to load challenge');
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      loadChallenge();
    }
  }, [params.id, showError, router]);

  const handleCompleteChallenge = async () => {
    if (!isConnected || !walletAddress || !challenge) {
      showError('Please connect your wallet first');
      return;
    }

    setIsCompleting(true);
    try {
      if (isBackendConnected) {
        // Use backend API for completing challenge
        const response = await apiService.completeChallenge(walletAddress, challenge.id);
        
        if (response.success) {
          setChallenge(prev => prev ? { ...prev, completed: true, progress: 100 } : null);
          setShowCongrats(true);
          showSuccess(response.message);
        } else {
          throw new Error('Failed to complete challenge');
        }
      } else {
        // Fallback to frontend-only simulation
        await new Promise(resolve => setTimeout(resolve, 2000));
        setChallenge(prev => prev ? { ...prev, completed: true, progress: 100 } : null);
        setShowCongrats(true);
        showSuccess('Challenge completed successfully! (Demo mode)');
        showInfo('Backend not connected - using demo mode');
      }
    } catch (error) {
      console.error('Error completing challenge:', error);
      showError('Failed to complete challenge. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  const handleClaimReward = async () => {
    if (!isConnected || !walletAddress || !challenge) {
      showError('Please connect your wallet first');
      return;
    }

    setIsClaiming(true);
    try {
      if (isBackendConnected) {
        // Use backend API for claiming tokens
        const response = await apiService.claimTokens(walletAddress, challenge.id);
        
        if (response.success) {
          await refreshUserData();
          showSuccess(`Successfully claimed ${challenge.reward} FIT tokens!`);
          
          if (response.sponsoredTransaction) {
            showInfo('Transaction sponsored by Nero Paymaster - no gas fees!');
          }
          
          setShowCongrats(false);
          router.push('/dashboard');
        } else {
          throw new Error('Failed to claim tokens');
        }
      } else {
        // Fallback to frontend-only simulation
        await new Promise(resolve => setTimeout(resolve, 2000));
        showSuccess(`Successfully claimed ${challenge.reward} FIT tokens! (Demo mode)`);
        showInfo('Backend not connected - using demo mode');
        setShowCongrats(false);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      showError('Failed to claim reward. Please try again.');
    } finally {
      setIsClaiming(false);
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

  const getChallengeDetails = (challengeId: string) => {
    const details = {
      '1': {
        longDescription: 'Take a refreshing 1-kilometer walk to boost your cardiovascular health and earn FIT tokens. Walking is one of the simplest yet most effective forms of exercise.',
        tips: [
          'Start with a comfortable pace',
          'Choose a scenic route to stay motivated',
          'Track your distance using a fitness app',
          'Stay hydrated throughout your walk'
        ],
        requirements: [
          'Complete 1 kilometer of walking',
          'Maintain consistent pace',
          'Track your progress',
          'Submit completion proof'
        ]
      },
      '2': {
        longDescription: 'Challenge yourself with a 3-kilometer run to improve your endurance and cardiovascular fitness. This medium-intensity challenge will help you build stamina.',
        tips: [
          'Warm up with 5 minutes of light jogging',
          'Maintain steady breathing throughout',
          'Cool down with stretching exercises',
          'Listen to your body and adjust pace if needed'
        ],
        requirements: [
          'Complete 3 kilometers of running',
          'Maintain running pace (no walking breaks)',
          'Record your time and route',
          'Submit completion verification'
        ]
      },
      '3': {
        longDescription: 'Stay properly hydrated by drinking 8 glasses of water throughout the day. Proper hydration is essential for optimal body function and fitness performance.',
        tips: [
          'Start your day with a glass of water',
          'Set reminders to drink water regularly',
          'Use a marked water bottle to track intake',
          'Add lemon or cucumber for flavor variety'
        ],
        requirements: [
          'Drink 8 full glasses (64oz) of water',
          'Spread intake throughout the day',
          'Track each glass consumed',
          'Complete within 24 hours'
        ]
      },
      '4': {
        longDescription: 'Complete a comprehensive 30-minute strength training session to build muscle, improve bone density, and boost your metabolism.',
        tips: [
          'Focus on proper form over heavy weights',
          'Include both upper and lower body exercises',
          'Rest 30-60 seconds between sets',
          'Cool down with light stretching'
        ],
        requirements: [
          'Complete 30 minutes of strength training',
          'Include at least 5 different exercises',
          'Maintain proper form throughout',
          'Record exercises and sets completed'
        ]
      },
      '5': {
        longDescription: 'Achieve the daily goal of 10,000 steps to improve your overall health and fitness. This challenge encourages consistent movement throughout the day.',
        tips: [
          'Take the stairs instead of elevators',
          'Park further away from destinations',
          'Take walking breaks during work',
          'Use a step counter or fitness tracker'
        ],
        requirements: [
          'Reach 10,000 steps in one day',
          'Steps can be accumulated throughout the day',
          'Use a reliable step tracking method',
          'Submit step count verification'
        ]
      },
      '6': {
        longDescription: 'Practice mindfulness and mental wellness with a 15-minute meditation session. Mental health is just as important as physical fitness.',
        tips: [
          'Find a quiet, comfortable space',
          'Use guided meditation apps if needed',
          'Focus on your breathing',
          'Don&apos;t worry about perfect concentration'
        ],
        requirements: [
          'Complete 15 minutes of meditation',
          'Maintain focused attention',
          'Use proper meditation posture',
          'Record session completion'
        ]
      }
    };
    
    return details[challengeId as keyof typeof details] || {
      longDescription: 'Complete this fitness challenge to earn FIT tokens and improve your health.',
      tips: ['Stay consistent', 'Listen to your body', 'Track your progress', 'Stay motivated'],
      requirements: ['Complete the challenge', 'Submit verification', 'Claim your reward']
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md mx-auto text-center">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white/70">Loading challenge...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Challenge Not Found</h2>
          <p className="text-white/70 mb-6">The requested challenge could not be found.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const challengeDetails = getChallengeDetails(challenge.id);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors mb-6"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 12H5m7-7l-7 7 7 7"/>
            </svg>
            <span>Back to Dashboard</span>
          </button>

          {!isBackendConnected && (
            <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-sm">⚠️ Running in demo mode - backend not connected</p>
            </div>
          )}
        </div>

        {/* Challenge Header */}
        <div className="card mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-6xl">{challenge.icon}</div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{challenge.title}</h1>
                <p className="text-white/70 text-lg">{challengeDetails.longDescription}</p>
              </div>
            </div>
            {challenge.completed && (
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className={`inline-block px-4 py-2 rounded-full ${getDifficultyColor(challenge.difficulty)} mb-2`}>
                {challenge.difficulty}
              </div>
              <div className="text-white/70 text-sm">Difficulty</div>
            </div>
            <div className="text-center">
              <div className={`inline-block px-4 py-2 rounded-full ${getCategoryColor(challenge.category)} mb-2`}>
                {challenge.category}
              </div>
              <div className="text-white/70 text-sm">Category</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-2">{challenge.reward} FIT</div>
              <div className="text-white/70 text-sm">Reward</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/70">Progress</span>
              <span className="text-white">{challenge.progress}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${challenge.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Tips for Success */}
          <div className="card">
            <h3 className="text-xl font-bold text-white mb-4">💡 Tips for Success</h3>
            <div className="space-y-3">
              {challengeDetails.tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-400 text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="text-white/80">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="card">
            <h3 className="text-xl font-bold text-white mb-4">📋 Requirements</h3>
            <div className="space-y-3">
              {challengeDetails.requirements.map((requirement, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-5 h-5 border-2 border-white/30 rounded flex-shrink-0 mt-0.5"></div>
                  <p className="text-white/80">{requirement}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 text-center">
          {!challenge.completed ? (
            <button
              onClick={handleCompleteChallenge}
              disabled={isCompleting || !isConnected}
              className="btn-primary text-lg px-8 py-4 disabled:opacity-50"
            >
              {isCompleting ? 'Completing Challenge...' : 'Complete Challenge'}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="text-green-400 font-semibold text-lg">✅ Challenge Completed!</div>
              <button
                onClick={() => setShowCongrats(true)}
                className="btn-primary text-lg px-8 py-4"
              >
                Claim Reward
              </button>
            </div>
          )}
          
          {!isConnected && (
            <p className="text-white/70 text-sm mt-4">Connect your wallet to complete challenges</p>
          )}
        </div>

        {/* Congratulations Modal */}
        {showCongrats && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="card max-w-md mx-auto text-center animate-scale-in">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-white mb-4">Congratulations!</h2>
              <p className="text-white/70 mb-6">
                You&apos;ve successfully completed the {challenge.title} challenge!
              </p>
              <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-lg p-4 mb-6">
                <div className="text-3xl font-bold text-yellow-400">{challenge.reward} FIT</div>
                <div className="text-white/70">Tokens Ready to Claim</div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowCongrats(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  Later
                </button>
                <button
                  onClick={handleClaimReward}
                  disabled={isClaiming}
                  className="flex-1 btn-primary py-3 px-4 disabled:opacity-50"
                >
                  {isClaiming ? 'Claiming...' : 'Claim Now'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 