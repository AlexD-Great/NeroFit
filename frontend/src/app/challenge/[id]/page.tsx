"use client";

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from '@/providers/ToastProvider';
import Header from '@/components/Header';

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
  const { user, primaryWallet } = useDynamicContext();
  const { showSuccess, showError, showInfo } = useToast();
  
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const [userProgress, setUserProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  const isAuthenticated = !!(user || primaryWallet);
  const challengeId = params?.id as string;

  // Fix hydration issues by ensuring client-side only rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

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
        progress: 60,
        completed: false,
        icon: '🚶‍♂️',
        tips: [
          'Start with a gentle warm-up',
          'Maintain a steady pace',
          'Stay hydrated',
          'Choose a safe, well-lit route',
          'Wear comfortable walking shoes'
        ],
        requirements: [
          'Complete 1 kilometer of walking',
          'Track your distance using a fitness app',
          'Submit proof of completion'
        ],
        estimatedTime: '10-15 minutes'
      },
      '2': {
        id: '2',
        title: '30-Minute Workout',
        description: 'Complete a 30-minute strength training session',
        longDescription: 'Strength training is essential for building muscle mass, improving bone density, and boosting metabolism. This 30-minute session will target major muscle groups and help you build functional strength for daily activities.',
        reward: 30,
        difficulty: 'Medium',
        category: 'Strength',
        timeLimit: '24 hours',
        progress: 0,
        completed: false,
        icon: '💪',
        tips: [
          'Warm up for 5 minutes before starting',
          'Focus on proper form over speed',
          'Rest 30-60 seconds between sets',
          'Stay hydrated throughout',
          'Cool down with light stretching'
        ],
        requirements: [
          'Complete 30 minutes of strength exercises',
          'Include upper and lower body movements',
          'Record your workout session'
        ],
        estimatedTime: '30 minutes'
      },
      '3': {
        id: '3',
        title: '15-Minute Meditation',
        description: 'Practice mindfulness for 15 minutes',
        longDescription: 'Meditation is a powerful practice for reducing stress, improving focus, and enhancing overall mental well-being. This 15-minute session will help you develop mindfulness skills and create a sense of inner calm.',
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
          'Don\'t judge your thoughts, just observe',
          'Start with shorter sessions if needed'
        ],
        requirements: [
          'Meditate for 15 continuous minutes',
          'Use a meditation app or timer',
          'Practice mindful breathing'
        ],
        estimatedTime: '15 minutes'
      },
      '4': {
        id: '4',
        title: 'Run 3km',
        description: 'Complete a 3 kilometer run',
        longDescription: 'Running is an excellent cardiovascular exercise that improves heart health, builds endurance, and burns calories. This 3km run challenge will help boost your fitness level and mental resilience.',
        reward: 25,
        difficulty: 'Medium',
        category: 'Cardio',
        timeLimit: '24 hours',
        progress: 0,
        completed: false,
        icon: '🏃‍♂️',
        tips: [
          'Start with a 5-minute warm-up walk',
          'Maintain a conversational pace',
          'Land on the middle of your foot',
          'Keep your arms relaxed',
          'Cool down with walking and stretching'
        ],
        requirements: [
          'Complete 3 kilometers of running',
          'Track your distance and time',
          'Submit your running data'
        ],
        estimatedTime: '15-25 minutes'
      },
      '5': {
        id: '5',
        title: '10,000 Steps',
        description: 'Reach 10,000 steps today',
        longDescription: 'The 10,000 steps challenge is a great way to increase your daily activity level. This goal encourages you to move more throughout the day, which can improve cardiovascular health and help maintain a healthy weight.',
        reward: 20,
        difficulty: 'Medium',
        category: 'Cardio',
        timeLimit: '24 hours',
        progress: 75,
        completed: false,
        icon: '👟',
        tips: [
          'Take the stairs instead of elevators',
          'Park further away from destinations',
          'Take walking breaks during work',
          'Walk while talking on the phone',
          'Use a step counter or smartphone app'
        ],
        requirements: [
          'Accumulate 10,000 steps in one day',
          'Track steps using a device or app',
          'Submit your step count'
        ],
        estimatedTime: 'Throughout the day'
      }
    };

    const foundChallenge = mockChallenges[challengeId];
    if (foundChallenge) {
      setChallenge(foundChallenge);
      setUserProgress(foundChallenge.progress);
    } else {
      showError('Challenge not found');
      router.push('/challenges');
    }
  }, [mounted, isAuthenticated, challengeId, router, showError]);

  const handleStartChallenge = async () => {
    if (!challenge) return;
    
    setIsLoading(true);
    showInfo('Starting challenge...');
    
    // Simulate API call
    setTimeout(() => {
      setUserProgress(10);
      setChallenge(prev => prev ? { ...prev, progress: 10 } : null);
      setIsLoading(false);
      showSuccess('Challenge started! Good luck!');
    }, 1000);
  };

  const handleCompleteChallenge = async () => {
    if (!challenge) return;

    setIsLoading(true);
    showInfo('Completing challenge...');
    
    // Simulate API call
    setTimeout(() => {
      setUserProgress(100);
      setChallenge(prev => prev ? { ...prev, progress: 100, completed: true } : null);
      setIsLoading(false);
      setShowCongrats(true);
      showSuccess(`Congratulations! You earned ${challenge.reward} FIT tokens!`);
    }, 1500);
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

  // Show loading state during hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white/70">Loading challenge...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-white/70 mb-6">Please log in to view challenges.</p>
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

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-white mb-4">Challenge Not Found</h2>
            <p className="text-white/70 mb-6">The challenge you&apos;re looking for doesn&apos;t exist.</p>
            <button
              onClick={() => router.push('/challenges')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
            >
              Browse Challenges
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <Header />
      
      {/* Congratulations Modal */}
      {showCongrats && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 max-w-md w-full text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-white mb-4">Congratulations!</h3>
            <p className="text-white/80 mb-6">
              You&apos;ve successfully completed the &ldquo;{challenge.title}&rdquo; challenge and earned {challenge.reward} FIT tokens!
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setShowCongrats(false)}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200"
              >
                Awesome!
              </button>
              <button
                onClick={() => router.push('/challenges')}
                className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200"
              >
                Browse More Challenges
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Button */}
          <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-white/70 hover:text-white mb-6 transition-colors"
          >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          <span>Back to Challenges</span>
          </button>
          
        {/* Challenge Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
          <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
              <div className="text-6xl">{challenge.icon}</div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{challenge.title}</h1>
                <p className="text-xl text-white/80">{challenge.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-400 mb-1">{challenge.reward} FIT</div>
              <div className="text-white/60 text-sm">Reward</div>
            </div>
          </div>

          {/* Challenge Badges */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className={`px-4 py-2 rounded-full border text-sm font-medium ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </div>
            <div className={`px-4 py-2 rounded-full border text-sm font-medium ${getCategoryColor(challenge.category)}`}>
              {challenge.category}
            </div>
            <div className="px-4 py-2 rounded-full border text-sm font-medium text-white/70 bg-white/10 border-white/20">
              ⏰ {challenge.estimatedTime}
          </div>
            <div className="px-4 py-2 rounded-full border text-sm font-medium text-white/70 bg-white/10 border-white/20">
              📅 {challenge.timeLimit}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
              <span className="text-white/70">Progress</span>
              <span className="text-white">{userProgress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${userProgress}%` }}
                  ></div>
                </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            {challenge.completed ? (
                  <div className="flex items-center space-x-2 text-green-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                <span className="font-semibold">Challenge Completed!</span>
              </div>
            ) : userProgress === 0 ? (
              <button
                onClick={handleStartChallenge}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                {isLoading ? 'Starting...' : 'Start Challenge'}
              </button>
            ) : (
              <button
                onClick={handleCompleteChallenge}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                {isLoading ? 'Completing...' : 'Complete Challenge'}
              </button>
            )}
            
            <button
              onClick={() => router.push('/challenges')}
              className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Browse More
            </button>
                </div>
              </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Challenge Details */}
          <div className="space-y-6">
            
            {/* Description */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">📝 Description</h3>
              <p className="text-white/80 leading-relaxed">{challenge.longDescription}</p>
            </div>

            {/* Requirements */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">✅ Requirements</h3>
              <ul className="space-y-2">
                {challenge.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-white/80">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tips and Info */}
          <div className="space-y-6">
            
            {/* Tips */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">💡 Tips for Success</h3>
              <ul className="space-y-3">
                {challenge.tips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-yellow-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-yellow-400 text-xs">💡</span>
                    </div>
                    <span className="text-white/80">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Challenge Stats */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">📊 Challenge Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-white/70">Difficulty Level</span>
                  <span className="text-white font-medium">{challenge.difficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Category</span>
                  <span className="text-white font-medium">{challenge.category}</span>
              </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Estimated Time</span>
                  <span className="text-white font-medium">{challenge.estimatedTime}</span>
            </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Time Limit</span>
                  <span className="text-white font-medium">{challenge.timeLimit}</span>
                  </div>
                <div className="flex justify-between">
                  <span className="text-white/70">FIT Reward</span>
                  <span className="text-yellow-400 font-bold">{challenge.reward} FIT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 