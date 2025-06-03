const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://nerofit.onrender.com';

export interface UserData {
  fitTokens: string;
  challengeCompleted: boolean;
  totalChallengesCompleted?: number;
  totalTokensEarned?: number;
  currentStreak?: number;
  rank?: number;
  level?: number;
}

export interface ConnectWalletResponse {
  success: boolean;
  message: string;
  sponsoredTransaction?: any;
}

export interface ClaimTokensResponse {
  success: boolean;
  message: string;
  sponsoredTransaction?: any;
}

export interface Challenge {
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

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Connect wallet to backend
  async connectWallet(walletAddress: string, signature?: string, message?: string): Promise<ConnectWalletResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/connect-wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          signature,
          message,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to connect wallet');
      }

      return await response.json();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  }

  // Get user data
  async getUserData(walletAddress: string): Promise<UserData> {
    try {
      const response = await fetch(`${this.baseUrl}/api/user-data/${walletAddress}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user data');
      }

      const data = await response.json();
      
      // Enhance with mock data for demo purposes
      return {
        ...data,
        totalChallengesCompleted: 47,
        totalTokensEarned: parseInt(data.fitTokens) * 10 || 1250,
        currentStreak: 7,
        rank: 23,
        level: 8,
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
  }

  // Claim tokens
  async claimTokens(walletAddress: string, challengeId?: string): Promise<ClaimTokensResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/claim-tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress,
          challengeId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to claim tokens');
      }

      return await response.json();
    } catch (error) {
      console.error('Error claiming tokens:', error);
      throw error;
    }
  }

  // Get challenges (mock data for now, but structured for future backend integration)
  async getChallenges(): Promise<Challenge[]> {
    // In the future, this would be a real API call
    // For now, returning mock data that matches the backend structure
    return [
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
  }

  // Complete challenge (would integrate with smart contract)
  async completeChallenge(walletAddress: string, challengeId: string): Promise<{ success: boolean; message: string }> {
    try {
      // In a real implementation, this would call the smart contract
      // For now, we'll simulate the completion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Challenge completed successfully!'
      };
    } catch (error) {
      console.error('Error completing challenge:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
export default apiService; 