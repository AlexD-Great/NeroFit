"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import Header from '@/components/Header';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  avatar: string;
  joinedDate: string;
  lastActive: string;
  totalTokens: number;
  challengesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  rank: number;
  badges: Badge[];
  preferences: UserPreferences;
  stats: UserStats;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedDate: string;
}

interface UserPreferences {
  notifications: boolean;
  emailUpdates: boolean;
  publicProfile: boolean;
  theme: 'dark' | 'light';
}

interface UserStats {
  totalDistance: number;
  totalWorkouts: number;
  totalMeditation: number;
  favoriteCategory: string;
  averageDaily: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, primaryWallet, handleLogOut } = useDynamicContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    notifications: true,
    emailUpdates: true,
    publicProfile: true
  });

  const isAuthenticated = !!(user || primaryWallet);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Mock user profile data
    const mockProfile: UserProfile = {
      id: 'user-1',
      name: user?.firstName || 'Fitness Enthusiast',
      email: user?.email || 'user@example.com',
      walletAddress: primaryWallet?.address || '0x0000...0000',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName || 'User')}&background=667eea&color=fff&size=120`,
      joinedDate: '2024-03-10',
      lastActive: '2024-03-15',
      totalTokens: 420,
      challengesCompleted: 15,
      currentStreak: 5,
      longestStreak: 12,
      rank: 25,
      badges: [
        {
          id: '1',
          name: 'First Steps',
          icon: '🌟',
          description: 'Completed your first challenge',
          earnedDate: '2024-03-10'
        },
        {
          id: '2',
          name: 'Strength Builder',
          icon: '💪',
          description: 'Completed 5 strength challenges',
          earnedDate: '2024-03-12'
        },
        {
          id: '3',
          name: 'Consistency King',
          icon: '🔥',
          description: 'Maintained a 5-day streak',
          earnedDate: '2024-03-14'
        },
        {
          id: '4',
          name: 'Wellness Warrior',
          icon: '🧘‍♀️',
          description: 'Completed 3 wellness challenges',
          earnedDate: '2024-03-13'
        }
      ],
      preferences: {
        notifications: true,
        emailUpdates: true,
        publicProfile: true,
        theme: 'dark'
      },
      stats: {
        totalDistance: 25.5,
        totalWorkouts: 8,
        totalMeditation: 180,
        favoriteCategory: 'Cardio',
        averageDaily: 2.1
      }
    };

    setProfile(mockProfile);
    setEditForm({
      name: mockProfile.name,
      email: mockProfile.email,
      notifications: mockProfile.preferences.notifications,
      emailUpdates: mockProfile.preferences.emailUpdates,
      publicProfile: mockProfile.preferences.publicProfile
    });
  }, [isAuthenticated, user, primaryWallet, router]);

  const handleSaveProfile = () => {
    if (!profile) return;

    // Update profile with form data
    const updatedProfile = {
      ...profile,
      name: editForm.name,
      email: editForm.email,
      preferences: {
        ...profile.preferences,
        notifications: editForm.notifications,
        emailUpdates: editForm.emailUpdates,
        publicProfile: editForm.publicProfile
      }
    };

    setProfile(updatedProfile);
    setIsEditing(false);
    
    // In real app, this would make an API call to save the profile
    console.log('Profile updated:', updatedProfile);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
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
          <p className="text-white/70 mb-6">Please log in to view your profile.</p>
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white/70">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Profile Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            
            {/* Avatar and Basic Info */}
            <div className="flex items-center space-x-6">
              <img
                src={profile.avatar}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-purple-500/50"
              />
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
                <p className="text-white/70 mb-1">{profile.email}</p>
                <p className="text-white/60 text-sm font-mono">
                  {profile.walletAddress.slice(0, 12)}...{profile.walletAddress.slice(-8)}
                </p>
                <p className="text-white/60 text-sm mt-2">
                  Joined {formatDate(profile.joinedDate)}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{profile.totalTokens}</div>
                <div className="text-white/70 text-sm">FIT Tokens</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{profile.challengesCompleted}</div>
                <div className="text-white/70 text-sm">Challenges</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getStreakColor(profile.currentStreak)}`}>
                  {profile.currentStreak}
                </div>
                <div className="text-white/70 text-sm">Current Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">#{profile.rank}</div>
                <div className="text-white/70 text-sm">Global Rank</div>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Edit Form */}
            {isEditing && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6">Edit Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  {/* Preferences */}
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Preferences</h4>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={editForm.notifications}
                        onChange={(e) => setEditForm({ ...editForm, notifications: e.target.checked })}
                        className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                      />
                      <span className="text-white/80">Enable notifications</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={editForm.emailUpdates}
                        onChange={(e) => setEditForm({ ...editForm, emailUpdates: e.target.checked })}
                        className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                      />
                      <span className="text-white/80">Receive email updates</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={editForm.publicProfile}
                        onChange={(e) => setEditForm({ ...editForm, publicProfile: e.target.checked })}
                        className="w-4 h-4 text-purple-600 bg-white/10 border-white/20 rounded focus:ring-purple-500"
                      />
                      <span className="text-white/80">Make profile public</span>
                    </label>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Stats */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">📊 Detailed Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{profile.stats.totalDistance}km</div>
                  <div className="text-white/70 text-sm">Total Distance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{profile.stats.totalWorkouts}</div>
                  <div className="text-white/70 text-sm">Workouts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{profile.stats.totalMeditation}min</div>
                  <div className="text-white/70 text-sm">Meditation</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-400">{profile.stats.favoriteCategory}</div>
                  <div className="text-white/70 text-sm">Favorite Category</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{profile.stats.averageDaily}</div>
                  <div className="text-white/70 text-sm">Daily Average</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{profile.longestStreak}</div>
                  <div className="text-white/70 text-sm">Longest Streak</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">🕒 Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: 'Completed "Walk 1km" challenge', time: '2 hours ago', reward: '+10 FIT' },
                  { action: 'Earned "Consistency King" badge', time: '1 day ago', reward: '+5 FIT' },
                  { action: 'Completed "15-Minute Meditation"', time: '2 days ago', reward: '+12 FIT' },
                  { action: 'Completed "Drink 8 Glasses of Water"', time: '3 days ago', reward: '+15 FIT' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <div className="text-white font-medium">{activity.action}</div>
                      <div className="text-white/60 text-sm">{activity.time}</div>
                    </div>
                    <div className="text-yellow-400 font-semibold">{activity.reward}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            
            {/* Badges */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">🏆 Badges</h3>
              <div className="grid grid-cols-2 gap-4">
                {profile.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-white/10 rounded-lg p-4 text-center hover:bg-white/20 transition-colors"
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <div className="text-white font-medium text-sm mb-1">{badge.name}</div>
                    <div className="text-white/60 text-xs">{badge.description}</div>
                    <div className="text-white/50 text-xs mt-2">
                      {formatDate(badge.earnedDate)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 