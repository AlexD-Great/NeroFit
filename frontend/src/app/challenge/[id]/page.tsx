"use client";

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useWallet } from '@/providers/WalletProvider';
import { useToast } from '@/providers/ToastProvider';

interface Challenge {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  reward: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Cardio' | 'Strength' | 'Wellness' | 'Endurance';
  timeLimit: string;
  progress: number;
  completed: boolean;
  icon: string;
  tips: string[];
  requirements: string[];
  estimatedTime: string;
}

export default function ChallengePage() {
  const params = useParams();
  const router = useRouter();
  const { isConnected, fitTokens } = useWallet();
  const { showSuccess, showError, showInfo } = useToast();
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [userProgress, setUserProgress] = useState(0);

  useEffect(() => {
    // Mock challenge data - in real app this would come from API
    const mockChallenges: Record<string, Challenge> = {
      '1': {
        id: '1',
        title: 'Walk 1km',
        description: 'Take a 1 kilometer walk today',
        longDescription: 'Walking is one of the best low-impact exercises you can do. This challenge encourages you to take a brisk 1-kilometer walk, which typically takes 10-15 minutes. Walking helps improve cardiovascular health, strengthens bones, and boosts mental well-being.',
        reward: 10,
        difficulty: 'Easy',
        category: 'Cardio',
        timeLimit: '24 hours',
        progress: 0,
        completed: false,
        icon: '🚶‍♂️',
        tips: [
          'Wear comfortable walking shoes',
          'Start with a 5-minute warm-up walk',
          'Maintain a steady pace throughout',
          'Stay hydrated during your walk',
          'Track your distance using a fitness app'
        ],
        requirements: [
          'Complete 1 kilometer of walking',
          'Maintain an average pace of 4-6 km/h',
          'Submit proof via fitness tracker or app'
        ],
        estimatedTime: '10-15 minutes'
      },
      '2': {
        id: '2',
        title: 'Run 3km',
        description: 'Complete a 3 kilometer run',
        longDescription: 'Running 3km is a great cardiovascular workout that builds endurance and burns calories. This moderate-distance run is perfect for intermediate fitness levels and helps improve your overall stamina and heart health.',
        reward: 25,
        difficulty: 'Medium',
        category: 'Cardio',
        timeLimit: '24 hours',
        progress: 60,
        completed: false,
        icon: '🏃‍♂️',
        tips: [
          'Warm up with 5-10 minutes of light jogging',
          'Pace yourself - aim for a conversational pace',
          'Focus on your breathing rhythm',
          'Cool down with walking and stretching',
          'Listen to your body and rest if needed'
        ],
        requirements: [
          'Complete 3 kilometers of running',
          'Maintain a consistent running pace',
          'Submit GPS tracking data'
        ],
        estimatedTime: '15-25 minutes'
      },
      '3': {
        id: '3',
        title: 'Drink 8 Glasses of Water',
        description: 'Stay hydrated throughout the day',
        longDescription: 'Proper hydration is essential for optimal body function. Drinking 8 glasses (about 2 liters) of water daily helps maintain energy levels, supports digestion, regulates body temperature, and keeps your skin healthy.',
        reward: 15,
        difficulty: 'Easy',
        category: 'Wellness',
        timeLimit: '24 hours',
        progress: 100,
        completed: true,
        icon: '💧',
        tips: [
          'Start your day with a glass of water',
          'Keep a water bottle with you',
          'Set reminders to drink water regularly',
          'Add lemon or cucumber for flavor',
          'Monitor your urine color as a hydration indicator'
        ],
        requirements: [
          'Drink 8 glasses (250ml each) of water',
          'Spread consumption throughout the day',
          'Log your water intake'
        ],
        estimatedTime: 'Throughout the day'
      },
      '4': {
        id: '4',
        title: '30-Minute Workout',
        description: 'Complete a 30-minute strength training session',
        longDescription: 'Strength training is crucial for building muscle mass, increasing bone density, and boosting metabolism. This 30-minute session should include exercises targeting major muscle groups for a comprehensive workout.',
        reward: 30,
        difficulty: 'Medium',
        category: 'Strength',
        timeLimit: '24 hours',
        progress: 0,
        completed: false,
        icon: '💪',
        tips: [
          'Warm up with 5 minutes of light cardio',
          'Focus on proper form over heavy weights',
          'Include exercises for all major muscle groups',
          'Rest 30-60 seconds between sets',
          'Cool down with stretching'
        ],
        requirements: [
          'Complete 30 minutes of strength training',
          'Include upper and lower body exercises',
          'Maintain proper form throughout'
        ],
        estimatedTime: '30 minutes'
      },
      '5': {
        id: '5',
        title: '10,000 Steps',
        description: 'Reach 10,000 steps today',
        longDescription: 'The 10,000 steps challenge is a popular fitness goal that promotes daily physical activity. This target helps ensure you stay active throughout the day and can significantly improve your cardiovascular health and overall fitness.',
        reward: 20,
        difficulty: 'Medium',
        category: 'Cardio',
        timeLimit: '24 hours',
        progress: 75,
        completed: false,
        icon: '👟',
        tips: [
          'Take the stairs instead of elevators',
          'Park farther away from destinations',
          'Take walking breaks during work',
          'Walk while talking on the phone',
          'Use a step counter or fitness tracker'
        ],
        requirements: [
          'Accumulate 10,000 steps in one day',
          'Steps can be from any activity',
          'Verify with a fitness tracker or app'
        ],
        estimatedTime: 'Throughout the day'
      },
      '6': {
        id: '6',
        title: '15-Minute Meditation',
        description: 'Practice mindfulness for 15 minutes',
        longDescription: 'Meditation is a powerful practice for mental wellness that reduces stress, improves focus, and promotes emotional well-being. This 15-minute session will help you develop mindfulness and inner peace.',
        reward: 12,
        difficulty: 'Easy',
        category: 'Wellness',
        timeLimit: '24 hours',
        progress: 0,
        completed: false,
        icon: '🧘‍♀️',
        tips: [
          'Find a quiet, comfortable space',
          'Sit in a comfortable position',
          'Focus on your breath',
          'Use a meditation app for guidance',
          'Don&apos;t worry about &quot;perfect&quot; meditation'
        ],
        requirements: [
          'Meditate for 15 continuous minutes',
          'Practice mindfulness or breathing exercises',
          'Complete in a quiet environment'
        ],
        estimatedTime: '15 minutes'
      }
    };

    const challengeData = mockChallenges[params.id as string];
    if (challengeData) {
      setChallenge(challengeData);
      setUserProgress(challengeData.progress);
    }
  }, [params.id]);

  const handleStartChallenge = () => {
    if (!isConnected) {
      showError('Please connect your wallet first');
      return;
    }
    showInfo('Challenge started! Good luck!');
    // In real app, this would start tracking the challenge
  };

  const handleCompleteChallenge = () => {
    if (!challenge) return;
    
    setUserProgress(100);
    setChallenge(prev => prev ? { ...prev, progress: 100, completed: true } : null);
    setShowCongrats(true);
    showSuccess('Congratulations! Challenge completed!');
  };

  const handleClaimReward = async () => {
    if (!isConnected || !challenge) {
      showError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call to claim reward
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showSuccess(`Successfully claimed ${challenge.reward} FIT tokens!`);
      setShowCongrats(false);
      
      // In real app, this would update the user's token balance
    } catch {
      showError('Failed to claim reward. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'Hard': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Cardio': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      case 'Strength': return 'text-purple-400 bg-purple-400/20 border-purple-400/30';
      case 'Wellness': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'Endurance': return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-white mb-2">Challenge Not Found</h2>
          <p className="text-white/70 mb-6">The challenge you&apos;re looking for doesn&apos;t exist.</p>
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

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 12H5m7-7l-7 7 7 7"/>
            </svg>
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full border ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </div>
            <div className={`px-3 py-1 rounded-full border ${getCategoryColor(challenge.category)}`}>
              {challenge.category}
            </div>
          </div>
        </div>

        {/* Challenge Header */}
        <div className="card mb-8">
          <div className="flex items-start space-x-6">
            <div className="text-6xl">{challenge.icon}</div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">{challenge.title}</h1>
              <p className="text-xl text-white/80 mb-4">{challenge.description}</p>
              <p className="text-white/70 leading-relaxed">{challenge.longDescription}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Challenge Details */}
          <div className="space-y-6">
            
            {/* Progress */}
            <div className="card">
              <h3 className="text-xl font-bold text-white mb-4">Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Completion</span>
                  <span className="text-white font-semibold">{userProgress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${userProgress}%` }}
                  ></div>
                </div>
                {userProgress === 100 && (
                  <div className="flex items-center space-x-2 text-green-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span className="font-medium">Challenge Completed!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Challenge Info */}
            <div className="card">
              <h3 className="text-xl font-bold text-white mb-4">Challenge Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Reward</span>
                  <span className="text-yellow-400 font-bold text-lg">{challenge.reward} FIT</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Time Limit</span>
                  <span className="text-white">{challenge.timeLimit}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Estimated Time</span>
                  <span className="text-white">{challenge.estimatedTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Category</span>
                  <span className="text-white">{challenge.category}</span>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="card">
              <h3 className="text-xl font-bold text-white mb-4">Requirements</h3>
              <ul className="space-y-2">
                {challenge.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/80">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tips and Actions */}
          <div className="space-y-6">
            
            {/* Tips */}
            <div className="card">
              <h3 className="text-xl font-bold text-white mb-4">💡 Tips for Success</h3>
              <ul className="space-y-3">
                {challenge.tips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-yellow-400 text-xs font-bold">{index + 1}</span>
                    </div>
                    <span className="text-white/80">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="card">
              <h3 className="text-xl font-bold text-white mb-4">Actions</h3>
              <div className="space-y-4">
                
                {!challenge.completed && userProgress < 100 && (
                  <>
                    <button
                      onClick={handleStartChallenge}
                      className="w-full btn-primary"
                      disabled={!isConnected}
                    >
                      {isConnected ? 'Start Challenge' : 'Connect Wallet to Start'}
                    </button>
                    
                    {/* Simulate Progress Button (for demo) */}
                    <button
                      onClick={handleCompleteChallenge}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-colors"
                    >
                      🎯 Complete Challenge (Demo)
                    </button>
                  </>
                )}

                {challenge.completed && (
                  <button
                    onClick={handleClaimReward}
                    disabled={isLoading}
                    className="w-full btn-primary disabled:opacity-50"
                  >
                    {isLoading ? 'Claiming Reward...' : `Claim ${challenge.reward} FIT Tokens`}
                  </button>
                )}

                <div className="text-center text-white/60 text-sm">
                  {!isConnected && 'Connect your wallet to participate in challenges'}
                  {isConnected && !challenge.completed && 'Complete the challenge to earn FIT tokens'}
                  {isConnected && challenge.completed && 'Claim your reward using gasless transactions'}
                </div>
              </div>
            </div>

            {/* Wallet Status */}
            {isConnected && (
              <div className="card bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white font-medium">Wallet Connected</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{fitTokens} FIT</div>
                    <div className="text-white/70 text-sm">Current Balance</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Congratulations Modal */}
      {showCongrats && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card max-w-md mx-auto text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">Congratulations!</h2>
            <p className="text-white/80 mb-6">
              You&apos;ve successfully completed the <strong>{challenge.title}</strong> challenge!
            </p>
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-lg p-4 mb-6 border border-yellow-400/30">
              <div className="text-2xl font-bold text-yellow-400">{challenge.reward} FIT Tokens</div>
              <div className="text-white/70">Ready to claim</div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCongrats(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleClaimReward}
                disabled={isLoading}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                {isLoading ? 'Claiming...' : 'Claim Reward'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 