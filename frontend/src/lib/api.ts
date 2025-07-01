// API service for connecting to NeroFit backend
const API_BASE_URL = 'https://nerofit-gvdx.onrender.com/api/v1';

// Types matching backend schemas
export interface User {
    _id: string;
    walletAddress: string;
    username?: string;
    email?: string;
    profilePicture?: string;
    dateJoined: string;
    lastActive: string;
    isActive: boolean;
}

export interface UserStats {
    _id: string;
    userId: string;
    totalTokens: number;
    challengesCompleted: number;
    currentStreak: number;
    longestStreak: number;
    weeklyWorkouts: number;
    totalDistance: number;
    totalMinutes: number;
    rank: number;
    claimableTokens: number;
    lastUpdated: string;
}

export interface Challenge {
    _id: string;
    title: string;
    description: string;
    reward: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: 'Cardio' | 'Strength' | 'Wellness' | 'Endurance';
    timeLimit: string;
    estimatedTime: string;
    icon: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UserChallenge {
    _id: string;
    userId: string;
    challengeId: string;
    progress: number;
    completed: boolean;
    claimed: boolean;
    startDate: string;
    completedDate?: string;
    claimedDate?: string;
    challenge: Challenge;
}

export interface Activity {
    _id: string;
    userId: string;
    type: 'challenge' | 'workout' | 'badge' | 'streak';
    title: string;
    description: string;
    reward: number;
    metadata?: any;
    timestamp: string;
    icon: string;
}

export interface Badge {
    _id: string;
    name: string;
    description: string;
    icon: string;
    criteria: string;
    reward: number;
    rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
    isActive: boolean;
}

export interface UserBadge {
    _id: string;
    userId: string;
    badgeId: string;
    earnedDate: string;
    badge: Badge;
}

export interface Streak {
    _id: string;
    userId: string;
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: string;
    streakType: 'daily' | 'weekly';
    isActive: boolean;
}

export interface TokenTransaction {
    _id: string;
    userId: string;
    type: 'earned' | 'spent' | 'claimed';
    amount: number;
    description: string;
    challengeId?: string;
    badgeId?: string;
    transactionHash?: string;
    timestamp: string;
}

export interface LeaderboardUser {
    _id: string;
    walletAddress: string;
    username?: string;
    totalTokens: number;
    challengesCompleted: number;
    rank: number;
    profilePicture?: string;
    badges: string[];
    streak: number;
    lastActive: string;
}

// API Error class
export class APIError extends Error {
    constructor(
        message: string,
        public status: number,
        public data?: any
    ) {
        super(message);
        this.name = 'APIError';
    }
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
            errorData.message || `HTTP error! status: ${response.status}`,
            response.status,
            errorData
        );
    }
    return response.json();
}

// API service class
class APIService {
    private baseURL: string;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    // Generic request method
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        const response = await fetch(url, config);
        return handleResponse<T>(response);
    }

    // User endpoints
    async getCurrentUser(): Promise<User> {
        return this.request<User>('/users/me');
    }

    async createUser(userData: Partial<User>): Promise<User> {
        return this.request<User>('/users', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async registerUser(userData: { name: string; email: string; walletAddress: string }): Promise<User> {
        return this.request<User>('/users/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async updateUser(userId: string, userData: Partial<User>): Promise<User> {
        return this.request<User>(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }

    async getUserByWallet(walletAddress: string): Promise<User> {
        return this.request<User>(`/users/wallet/${walletAddress}`);
    }

    // User Stats endpoints
    async getUserStats(userId: string): Promise<UserStats> {
        return this.request<UserStats>(`/user-stats/${userId}`);
    }

    async updateUserStats(userId: string, statsData: Partial<UserStats>): Promise<UserStats> {
        return this.request<UserStats>(`/user-stats/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(statsData),
        });
    }

    // Challenge endpoints
    async getChallenges(): Promise<Challenge[]> {
        return this.request<Challenge[]>('/challenges');
    }

    async getChallenge(challengeId: string): Promise<Challenge> {
        return this.request<Challenge>(`/challenges/${challengeId}`);
    }

    async getUserChallenges(userId: string): Promise<UserChallenge[]> {
        return this.request<UserChallenge[]>(`/user-challenges/${userId}`);
    }

    async startChallenge(userId: string, challengeId: string): Promise<UserChallenge> {
        return this.request<UserChallenge>('/user-challenges', {
            method: 'POST',
            body: JSON.stringify({ userId, challengeId }),
        });
    }

    async updateChallengeProgress(
        userChallengeId: string,
        progress: number
    ): Promise<UserChallenge> {
        return this.request<UserChallenge>(`/user-challenges/${userChallengeId}/progress`, {
            method: 'PUT',
            body: JSON.stringify({ progress }),
        });
    }

    async completeChallenge(userChallengeId: string): Promise<UserChallenge> {
        return this.request<UserChallenge>(`/user-challenges/${userChallengeId}/complete`, {
            method: 'PUT',
        });
    }

    async claimChallengeReward(userChallengeId: string): Promise<UserChallenge> {
        return this.request<UserChallenge>(`/user-challenges/${userChallengeId}/claim`, {
            method: 'PUT',
        });
    }

    // Activity endpoints
    async getUserActivities(userId: string, limit: number = 10): Promise<Activity[]> {
        return this.request<Activity[]>(`/activities/${userId}?limit=${limit}`);
    }

    async createActivity(activityData: Partial<Activity>): Promise<Activity> {
        return this.request<Activity>('/activities', {
            method: 'POST',
            body: JSON.stringify(activityData),
        });
    }

    // Badge endpoints
    async getBadges(): Promise<Badge[]> {
        return this.request<Badge[]>('/badges');
    }

    async getUserBadges(userId: string): Promise<UserBadge[]> {
        return this.request<UserBadge[]>(`/user-badges/${userId}`);
    }

    async awardBadge(userId: string, badgeId: string): Promise<UserBadge> {
        return this.request<UserBadge>('/user-badges', {
            method: 'POST',
            body: JSON.stringify({ userId, badgeId }),
        });
    }

    // Streak endpoints
    async getUserStreak(userId: string): Promise<Streak> {
        return this.request<Streak>(`/streaks/${userId}`);
    }

    async updateStreak(userId: string, streakData: Partial<Streak>): Promise<Streak> {
        return this.request<Streak>(`/streaks/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(streakData),
        });
    }

    // Token Transaction endpoints
    async getUserTransactions(userId: string, limit: number = 20): Promise<TokenTransaction[]> {
        return this.request<TokenTransaction[]>(`/token-transactions/${userId}?limit=${limit}`);
    }

    async createTransaction(transactionData: Partial<TokenTransaction>): Promise<TokenTransaction> {
        return this.request<TokenTransaction>('/token-transactions', {
            method: 'POST',
            body: JSON.stringify(transactionData),
        });
    }

    // Leaderboard endpoints
    async getLeaderboard(limit: number = 50): Promise<LeaderboardUser[]> {
        return this.request<LeaderboardUser[]>(`/leaderboard?limit=${limit}`);
    }

    async getUserRank(userId: string): Promise<{ rank: number; totalUsers: number }> {
        return this.request<{ rank: number; totalUsers: number }>(`/leaderboard/rank/${userId}`);
    }

    // Health check
    async healthCheck(): Promise<{ status: string; timestamp: string }> {
        return this.request<{ status: string; timestamp: string }>('/health');
    }
}

// Create and export a singleton instance
export const apiService = new APIService();

// Export the class for testing or custom instances
export default APIService; 