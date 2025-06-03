"use client";

import { useState, useEffect } from 'react';
import { useNeroContext } from "@/providers/NeroProvider";
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { 
  mockChallenges, 
  mockUserStats, 
  Challenge, 
  UserStats 
} from '@/data/mockData';

export default function ChallengesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, primaryWallet } = useNeroContext();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const isAuthenticated = !!(user || primaryWallet);

  // Hydration protection
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load challenges data when component mounts
  useEffect(() => {
    if (!isMounted) {
      return;
    }

    console.log('Challenges: Loading data');
    setChallenges(mockChallenges);
  }, [isMounted]);

  useEffect(() => {
    let filtered = challenges;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(challenge => challenge.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(challenge => challenge.difficulty === selectedDifficulty);
    }

    // Filter by completion status
    if (selectedStatus !== 'All') {
      if (selectedStatus === 'Completed') {
        filtered = filtered.filter(challenge => challenge.completed);
      } else if (selectedStatus === 'Active') {
        filtered = filtered.filter(challenge => !challenge.completed);
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(challenge =>
        challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        challenge.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredChallenges(filtered);
  }, [challenges, selectedCategory, selectedDifficulty, selectedStatus, searchTerm]);

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

  const categories = ['All', 'Cardio', 'Strength', 'Wellness', 'Endurance'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const statuses = ['All', 'Active', 'Completed'];

  const completedChallenges = challenges.filter(c => c.completed).length;
  const totalRewards = challenges.filter(c => c.completed).reduce((sum, c) => sum + c.reward, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🏆 Fitness Challenges</h1>
          <p className="text-xl text-white/80 mb-6">
            Complete challenges to earn FIT tokens and improve your health
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-white">{challenges.length}</div>
              <div className="text-white/70">Total Challenges</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-green-400">{completedChallenges}</div>
              <div className="text-white/70">Completed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-yellow-400">{totalRewards}</div>
              <div className="text-white/70">FIT Earned</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-white/70 text-sm font-medium mb-2">Search Challenges</label>
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {categories.map(category => (
                  <option key={category} value={category} className="bg-gray-800">
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty} className="bg-gray-800">
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status} className="bg-gray-800">
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        {filteredChallenges.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Challenges Found</h3>
            <p className="text-white/70">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => router.push(`/challenge/${challenge.id}`)}
              >
                
                {/* Challenge Header */}
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

                {/* Challenge Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className={`px-3 py-1 rounded-full border text-sm ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </div>
                    <div className={`px-3 py-1 rounded-full border text-sm ${getCategoryColor(challenge.category)}`}>
                      {challenge.category}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-white/70">
                    <span>⏰ {challenge.estimatedTime}</span>
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

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/challenge/${challenge.id}`);
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-200 font-medium"
                >
                  {challenge.completed ? 'View Details' : 'Start Challenge'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        {!isAuthenticated && (
          <div className="text-center mt-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Your Fitness Journey?</h3>
              <p className="text-white/70 mb-6">
                Connect your wallet or sign in to start completing challenges and earning FIT tokens!
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