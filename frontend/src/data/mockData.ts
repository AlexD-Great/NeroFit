// Centralized mock data to ensure consistency across all pages

export interface Challenge {
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
  timeLimit: string;
  claimable?: boolean; // For completed challenges that haven't been claimed yet
}

export interface UserStats {
  totalTokens: number;
  challengesCompleted: number;
  currentStreak: number;
  weeklyWorkouts: number;
  totalDistance: number;
  totalMinutes: number;
  rank: number;
  claimableTokens: number; // Tokens that can be claimed from completed challenges
}

export interface LeaderboardUser {
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

export interface RecentActivity {
  id: string;
  type: 'challenge' | 'workout' | 'badge';
  title: string;
  description: string;
  reward: number;
  timestamp: string;
  icon: string;
}

// Centralized challenge data
export const mockChallenges: Challenge[] = [
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
    icon: '🚶‍♂️',
    estimatedTime: '10-15 minutes'
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
    icon: '🏃‍♂️',
    estimatedTime: '15-25 minutes'
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
    claimable: true,
    icon: '💧',
    estimatedTime: 'Throughout the day'
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
    icon: '💪',
    estimatedTime: '30 minutes'
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
    icon: '👟',
    estimatedTime: 'Throughout the day'
  },
  {
    id: '6',
    title: '15-Minute Meditation',
    description: 'Practice mindfulness for 15 minutes',
    reward: 12,
    difficulty: 'Easy',
    category: 'Wellness',
    timeLimit: '24 hours',
    progress: 100,
    completed: true,
    claimable: true,
    icon: '🧘‍♀️',
    estimatedTime: '15 minutes'
  },
  {
    id: '7',
    title: '20-Minute Yoga',
    description: 'Complete a relaxing yoga session',
    reward: 16,
    difficulty: 'Easy',
    category: 'Wellness',
    timeLimit: '24 hours',
    progress: 100,
    completed: true,
    claimable: false, // Already claimed
    icon: '🧘‍♀️',
    estimatedTime: '20 minutes'
  },
  {
    id: '8',
    title: '50 Push-ups',
    description: 'Complete 50 push-ups in sets',
    reward: 18,
    difficulty: 'Medium',
    category: 'Strength',
    timeLimit: '24 hours',
    progress: 100,
    completed: true,
    claimable: false, // Already claimed
    icon: '💪',
    estimatedTime: '10-15 minutes'
  },
  {
    id: '9',
    title: 'Cycle 5km',
    description: 'Complete a 5 kilometer bike ride',
    reward: 22,
    difficulty: 'Medium',
    category: 'Cardio',
    timeLimit: '24 hours',
    progress: 0,
    completed: false,
    icon: '🚴‍♂️',
    estimatedTime: '20-30 minutes'
  },
  {
    id: '10',
    title: 'Plank for 2 Minutes',
    description: 'Hold a plank position for 2 minutes',
    reward: 14,
    difficulty: 'Medium',
    category: 'Strength',
    timeLimit: '24 hours',
    progress: 0,
    completed: false,
    icon: '🏋️‍♂️',
    estimatedTime: '5 minutes'
  }
];

// Calculate user stats from challenges
const completedChallenges = mockChallenges.filter(c => c.completed);
const claimedChallenges = completedChallenges.filter(c => !c.claimable);
const claimableChallenges = completedChallenges.filter(c => c.claimable);

const claimedTokens = claimedChallenges.reduce((sum, c) => sum + c.reward, 0);
const claimableTokens = claimableChallenges.reduce((sum, c) => sum + c.reward, 0);

export const mockUserStats: UserStats = {
  totalTokens: claimedTokens, // Only claimed tokens count as "owned"
  challengesCompleted: completedChallenges.length,
  currentStreak: 5,
  weeklyWorkouts: 3,
  totalDistance: 25.5,
  totalMinutes: 180,
  rank: 8, // Consistent with leaderboard
  claimableTokens: claimableTokens
};

// Current user data for leaderboard
export const currentUser: LeaderboardUser = {
  id: 'current-user',
  name: 'You',
  walletAddress: '0x1234...5678',
  totalTokens: mockUserStats.totalTokens,
  challengesCompleted: mockUserStats.challengesCompleted,
  rank: mockUserStats.rank,
  avatar: 'https://ui-avatars.com/api/?name=You&background=8b5cf6&color=fff&size=40',
  joinedDate: '2024-03-01',
  lastActive: '2024-03-15',
  badges: ['🔥', '💪', '🧘‍♀️'],
  streak: mockUserStats.currentStreak
};

// Leaderboard data with current user included
export const mockLeaderboardUsers: LeaderboardUser[] = [
  {
    id: '1',
    name: 'FitnessGuru',
    walletAddress: '0x1234...5678',
    totalTokens: 2450,
    challengesCompleted: 89,
    rank: 1,
    avatar: 'https://ui-avatars.com/api/?name=FitnessGuru&background=8b5cf6&color=fff&size=40',
    joinedDate: '2024-01-15',
    lastActive: '2024-03-15',
    badges: ['👑', '🏆', '🔥', '💪'],
    streak: 45
  },
  {
    id: '2',
    name: 'HealthWarrior',
    walletAddress: '0x2345...6789',
    totalTokens: 2180,
    challengesCompleted: 76,
    rank: 2,
    avatar: 'https://ui-avatars.com/api/?name=HealthWarrior&background=f093fb&color=fff&size=40',
    joinedDate: '2024-01-20',
    lastActive: '2024-03-14',
    badges: ['🏃‍♂️', '🧘‍♀️', '💧'],
    streak: 32
  },
  {
    id: '3',
    name: 'CardioKing',
    walletAddress: '0x3456...7890',
    totalTokens: 1950,
    challengesCompleted: 68,
    rank: 3,
    avatar: 'https://ui-avatars.com/api/?name=CardioKing&background=4ade80&color=fff&size=40',
    joinedDate: '2024-02-01',
    lastActive: '2024-03-15',
    badges: ['🏃‍♂️', '🚴‍♂️', '⚡'],
    streak: 28
  },
  {
    id: '4',
    name: 'YogaMaster',
    walletAddress: '0x4567...8901',
    totalTokens: 1720,
    challengesCompleted: 55,
    rank: 4,
    avatar: 'https://ui-avatars.com/api/?name=YogaMaster&background=fb7185&color=fff&size=40',
    joinedDate: '2024-02-10',
    lastActive: '2024-03-13',
    badges: ['🧘‍♀️', '🌟', '☮️'],
    streak: 21
  },
  {
    id: '5',
    name: 'StrengthSeeker',
    walletAddress: '0x5678...9012',
    totalTokens: 1580,
    challengesCompleted: 52,
    rank: 5,
    avatar: 'https://ui-avatars.com/api/?name=StrengthSeeker&background=fbbf24&color=fff&size=40',
    joinedDate: '2024-02-15',
    lastActive: '2024-03-12',
    badges: ['💪', '🏋️‍♂️', '🔥'],
    streak: 19
  },
  {
    id: '6',
    name: 'WellnessWizard',
    walletAddress: '0x6789...0123',
    totalTokens: 1420,
    challengesCompleted: 48,
    rank: 6,
    avatar: 'https://ui-avatars.com/api/?name=WellnessWizard&background=06b6d4&color=fff&size=40',
    joinedDate: '2024-02-20',
    lastActive: '2024-03-11',
    badges: ['🧘‍♀️', '💧', '🌱'],
    streak: 15
  },
  {
    id: '7',
    name: 'RunnerRebel',
    walletAddress: '0x7890...1234',
    totalTokens: 1280,
    challengesCompleted: 44,
    rank: 7,
    avatar: 'https://ui-avatars.com/api/?name=RunnerRebel&background=ef4444&color=fff&size=40',
    joinedDate: '2024-02-25',
    lastActive: '2024-03-10',
    badges: ['🏃‍♂️', '⚡', '🎯'],
    streak: 12
  },
  currentUser, // Current user at rank 8
  {
    id: '9',
    name: 'FlexibilityFan',
    walletAddress: '0x9012...3456',
    totalTokens: 980,
    challengesCompleted: 35,
    rank: 9,
    avatar: 'https://ui-avatars.com/api/?name=FlexibilityFan&background=10b981&color=fff&size=40',
    joinedDate: '2024-03-05',
    lastActive: '2024-03-09',
    badges: ['🧘‍♀️', '🤸‍♀️'],
    streak: 8
  },
  {
    id: '10',
    name: 'NewbieFit',
    walletAddress: '0x0123...4567',
    totalTokens: 850,
    challengesCompleted: 28,
    rank: 10,
    avatar: 'https://ui-avatars.com/api/?name=NewbieFit&background=a855f7&color=fff&size=40',
    joinedDate: '2024-03-08',
    lastActive: '2024-03-08',
    badges: ['🌟'],
    streak: 5
  }
];

// Recent activity based on completed challenges
export const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'challenge',
    title: 'Completed "50 Push-ups"',
    description: 'Strength challenge completed',
    reward: 18,
    timestamp: '1 hour ago',
    icon: '💪'
  },
  {
    id: '2',
    type: 'challenge',
    title: 'Completed "20-Minute Yoga"',
    description: 'Wellness challenge completed',
    reward: 16,
    timestamp: '3 hours ago',
    icon: '🧘‍♀️'
  },
  {
    id: '3',
    type: 'badge',
    title: 'Earned "Consistency King" badge',
    description: 'Maintained a 5-day streak',
    reward: 5,
    timestamp: '2 days ago',
    icon: '🏆'
  }
]; 