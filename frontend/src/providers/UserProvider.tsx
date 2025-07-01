"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { apiService, User, UserStats, Challenge, UserChallenge, Activity, Badge, UserBadge, Streak, TokenTransaction, LeaderboardUser, APIError } from '@/lib/api';

// State interfaces
interface UserState {
    // User data
    user: User | null;
    userStats: UserStats | null;
    streak: Streak | null;

    // Challenges
    challenges: Challenge[];
    userChallenges: UserChallenge[];

    // Activities and badges
    activities: Activity[];
    badges: Badge[];
    userBadges: UserBadge[];

    // Transactions and leaderboard
    transactions: TokenTransaction[];
    leaderboard: LeaderboardUser[];

    // Loading states
    loading: {
        user: boolean;
        stats: boolean;
        challenges: boolean;
        activities: boolean;
        badges: boolean;
        transactions: boolean;
        leaderboard: boolean;
    };

    // Error states
    errors: {
        user: string | null;
        stats: string | null;
        challenges: string | null;
        activities: string | null;
        badges: string | null;
        transactions: string | null;
        leaderboard: string | null;
    };

    // UI state
    initialized: boolean;
}

// Action types
type UserAction =
    | { type: 'SET_LOADING'; payload: { key: keyof UserState['loading']; value: boolean } }
    | { type: 'SET_ERROR'; payload: { key: keyof UserState['errors']; value: string | null } }
    | { type: 'SET_USER'; payload: User | null }
    | { type: 'SET_USER_STATS'; payload: UserStats | null }
    | { type: 'SET_STREAK'; payload: Streak | null }
    | { type: 'SET_CHALLENGES'; payload: Challenge[] }
    | { type: 'SET_USER_CHALLENGES'; payload: UserChallenge[] }
    | { type: 'UPDATE_USER_CHALLENGE'; payload: UserChallenge }
    | { type: 'SET_ACTIVITIES'; payload: Activity[] }
    | { type: 'ADD_ACTIVITY'; payload: Activity }
    | { type: 'SET_BADGES'; payload: Badge[] }
    | { type: 'SET_USER_BADGES'; payload: UserBadge[] }
    | { type: 'ADD_USER_BADGE'; payload: UserBadge }
    | { type: 'SET_TRANSACTIONS'; payload: TokenTransaction[] }
    | { type: 'ADD_TRANSACTION'; payload: TokenTransaction }
    | { type: 'SET_LEADERBOARD'; payload: LeaderboardUser[] }
    | { type: 'SET_INITIALIZED'; payload: boolean }
    | { type: 'RESET_STATE' };

// Initial state
const initialState: UserState = {
    user: null,
    userStats: null,
    streak: null,
    challenges: [],
    userChallenges: [],
    activities: [],
    badges: [],
    userBadges: [],
    transactions: [],
    leaderboard: [],
    loading: {
        user: false,
        stats: false,
        challenges: false,
        activities: false,
        badges: false,
        transactions: false,
        leaderboard: false,
    },
    errors: {
        user: null,
        stats: null,
        challenges: null,
        activities: null,
        badges: null,
        transactions: null,
        leaderboard: null,
    },
    initialized: false,
};

// Reducer
function userReducer(state: UserState, action: UserAction): UserState {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                loading: {
                    ...state.loading,
                    [action.payload.key]: action.payload.value,
                },
            };

        case 'SET_ERROR':
            return {
                ...state,
                errors: {
                    ...state.errors,
                    [action.payload.key]: action.payload.value,
                },
            };

        case 'SET_USER':
            return { ...state, user: action.payload };

        case 'SET_USER_STATS':
            return { ...state, userStats: action.payload };

        case 'SET_STREAK':
            return { ...state, streak: action.payload };

        case 'SET_CHALLENGES':
            return { ...state, challenges: action.payload };

        case 'SET_USER_CHALLENGES':
            return { ...state, userChallenges: action.payload };

        case 'UPDATE_USER_CHALLENGE':
            return {
                ...state,
                userChallenges: state.userChallenges.map(uc =>
                    uc._id === action.payload._id ? action.payload : uc
                ),
            };

        case 'SET_ACTIVITIES':
            return { ...state, activities: action.payload };

        case 'ADD_ACTIVITY':
            return {
                ...state,
                activities: [action.payload, ...state.activities],
            };

        case 'SET_BADGES':
            return { ...state, badges: action.payload };

        case 'SET_USER_BADGES':
            return { ...state, userBadges: action.payload };

        case 'ADD_USER_BADGE':
            return {
                ...state,
                userBadges: [...state.userBadges, action.payload],
            };

        case 'SET_TRANSACTIONS':
            return { ...state, transactions: action.payload };

        case 'ADD_TRANSACTION':
            return {
                ...state,
                transactions: [action.payload, ...state.transactions],
            };

        case 'SET_LEADERBOARD':
            return { ...state, leaderboard: action.payload };

        case 'SET_INITIALIZED':
            return { ...state, initialized: action.payload };

        case 'RESET_STATE':
            return initialState;

        default:
            return state;
    }
}

// Context
interface UserContextType extends UserState {
    // User actions
    fetchUser: (walletAddress: string) => Promise<void>;
    createUser: (userData: Partial<User>) => Promise<void>;
    updateUser: (userData: Partial<User>) => Promise<void>;

    // Stats actions
    fetchUserStats: (userId: string) => Promise<void>;
    updateUserStats: (statsData: Partial<UserStats>) => Promise<void>;

    // Challenge actions
    fetchChallenges: () => Promise<void>;
    fetchUserChallenges: (userId: string) => Promise<void>;
    startChallenge: (challengeId: string) => Promise<void>;
    updateChallengeProgress: (userChallengeId: string, progress: number) => Promise<void>;
    completeChallenge: (userChallengeId: string) => Promise<void>;
    claimChallengeReward: (userChallengeId: string) => Promise<void>;

    // Activity actions
    fetchActivities: (userId: string) => Promise<void>;
    createActivity: (activityData: Partial<Activity>) => Promise<void>;

    // Badge actions
    fetchBadges: () => Promise<void>;
    fetchUserBadges: (userId: string) => Promise<void>;

    // Streak actions
    fetchStreak: (userId: string) => Promise<void>;
    updateStreak: (streakData: Partial<Streak>) => Promise<void>;

    // Transaction actions
    fetchTransactions: (userId: string) => Promise<void>;

    // Leaderboard actions
    fetchLeaderboard: () => Promise<void>;

    // Utility actions
    initializeUser: (walletAddress: string) => Promise<void>;
    resetState: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
export function UserProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(userReducer, initialState);
    const { primaryWallet, user } = useDynamicContext();

    // Helper function to set loading state
    const setLoading = (key: keyof UserState['loading'], value: boolean) => {
        dispatch({ type: 'SET_LOADING', payload: { key, value } });
    };

    // Helper function to set error state
    const setError = (key: keyof UserState['errors'], value: string | null) => {
        dispatch({ type: 'SET_ERROR', payload: { key, value } });
    };

    // User actions
    const fetchUser = async (walletAddress: string) => {
        try {
            setLoading('user', true);
            setError('user', null);

            // Try to get existing user
            const existingUser = await apiService.getUserByWallet(walletAddress);
            dispatch({ type: 'SET_USER', payload: existingUser });
        } catch (error) {
            // If user doesn't exist (404), register them automatically
            if (error instanceof APIError && error.status === 404) {
                try {
                    console.log('User not found, registering new user...');

                    // Get user info from Dynamic context
                    const dynamicUser = user || { firstName: 'User', email: `${walletAddress.slice(0, 8)}@nerofit.com` };

                    // Register new user
                    const newUser = await apiService.registerUser({
                        name: dynamicUser.firstName || 'Fitness User',
                        email: dynamicUser.email || `${walletAddress.slice(0, 8)}@nerofit.com`,
                        walletAddress: walletAddress
                    });

                    dispatch({ type: 'SET_USER', payload: newUser });
                    console.log('User registered successfully:', newUser);
                } catch (registerError) {
                    console.error('Failed to register user:', registerError);
                    const message = registerError instanceof APIError ? registerError.message : 'Failed to register user';
                    setError('user', message);
                    throw registerError; // Re-throw to show in UI
                }
            } else {
                const message = error instanceof APIError ? error.message : 'Failed to fetch user';
                setError('user', message);
                console.error('Error fetching user:', error);
            }
        } finally {
            setLoading('user', false);
        }
    };

    const createUser = async (userData: Partial<User>) => {
        try {
            setLoading('user', true);
            setError('user', null);
            const user = await apiService.createUser(userData);
            dispatch({ type: 'SET_USER', payload: user });
        } catch (error) {
            const message = error instanceof APIError ? error.message : 'Failed to create user';
            setError('user', message);
            console.error('Error creating user:', error);
            throw error;
        } finally {
            setLoading('user', false);
        }
    };

    const updateUser = async (userData: Partial<User>) => {
        if (!state.user?._id) return;

        try {
            setLoading('user', true);
            setError('user', null);
            const user = await apiService.updateUser(state.user._id, userData);
            dispatch({ type: 'SET_USER', payload: user });
        } catch (error) {
            const message = error instanceof APIError ? error.message : 'Failed to update user';
            setError('user', message);
            console.error('Error updating user:', error);
            throw error;
        } finally {
            setLoading('user', false);
        }
    };

    // Stats actions
    const fetchUserStats = async (userId: string) => {
        try {
            setLoading('stats', true);
            setError('stats', null);
            const stats = await apiService.getUserStats(userId);
            dispatch({ type: 'SET_USER_STATS', payload: stats });
        } catch (error) {
            const message = error instanceof APIError ? error.message : 'Failed to fetch user stats';
            setError('stats', message);
            console.error('Error fetching user stats:', error);
        } finally {
            setLoading('stats', false);
        }
    };

    const updateUserStats = async (statsData: Partial<UserStats>) => {
        if (!state.user?._id) return;

        try {
            setLoading('stats', true);
            setError('stats', null);
            const stats = await apiService.updateUserStats(state.user._id, statsData);
            dispatch({ type: 'SET_USER_STATS', payload: stats });
        } catch (error) {
            const message = error instanceof APIError ? error.message : 'Failed to update user stats';
            setError('stats', message);
            console.error('Error updating user stats:', error);
            throw error;
        } finally {
            setLoading('stats', false);
        }
    };

    // Challenge actions
    const fetchChallenges = async () => {
        try {
            setLoading('challenges', true);
            setError('challenges', null);
            const challenges = await apiService.getChallenges();
            dispatch({ type: 'SET_CHALLENGES', payload: challenges });
        } catch (error) {
            const message = error instanceof APIError ? error.message : 'Failed to fetch challenges';
            setError('challenges', message);
            console.error('Error fetching challenges:', error);
        } finally {
            setLoading('challenges', false);
        }
    };

    const fetchUserChallenges = async (userId: string) => {
        try {
            setLoading('challenges', true);
            setError('challenges', null);
            const userChallenges = await apiService.getUserChallenges(userId);
            dispatch({ type: 'SET_USER_CHALLENGES', payload: userChallenges });
        } catch (error) {
            const message = error instanceof APIError ? error.message : 'Failed to fetch user challenges';
            setError('challenges', message);
            console.error('Error fetching user challenges:', error);
        } finally {
            setLoading('challenges', false);
        }
    };

    const startChallenge = async (challengeId: string) => {
        if (!state.user?._id) return;

        try {
            setLoading('challenges', true);
            setError('challenges', null);
            const userChallenge = await apiService.startChallenge(state.user._id, challengeId);
            dispatch({ type: 'UPDATE_USER_CHALLENGE', payload: userChallenge });
        } catch (error) {
            const message = error instanceof APIError ? error.message : 'Failed to start challenge';
            setError('challenges', message);
            console.error('Error starting challenge:', error);
            throw error;
        } finally {
            setLoading('challenges', false);
        }
    };

    const updateChallengeProgress = async (userChallengeId: string, progress: number) => {
        try {
            setLoading('challenges', true);
            setError('challenges', null);
            const userChallenge = await apiService.updateChallengeProgress(userChallengeId, progress);
            dispatch({ type: 'UPDATE_USER_CHALLENGE', payload: userChallenge });
        } catch (error) {
            const message = error instanceof APIError ? error.message : 'Failed to update challenge progress';
            setError('challenges', message);
            console.error('Error updating challenge progress:', error);
            throw error;
        } finally {
            setLoading('challenges', false);
        }
    };

    const completeChallenge = async (userChallengeId: string) => {
        try {
            setLoading('challenges', true);
            setError('challenges', null);
            const userChallenge = await apiService.completeChallenge(userChallengeId);
            dispatch({ type: 'UPDATE_USER_CHALLENGE', payload: userChallenge });
        } catch (error) {
            const message = error instanceof APIError ? error.message : 'Failed to complete challenge';
            setError('challenges', message);
            console.error('Error completing challenge:', error);
            throw error;
        } finally {
            setLoading('challenges', false);
        }
    };

    const claimChallengeReward = async (userChallengeId: string) => {
        try {
            setLoading('challenges', true);
            setError('challenges', null);
            const userChallenge = await apiService.claimChallengeReward(userChallengeId);
            dispatch({ type: 'UPDATE_USER_CHALLENGE', payload: userChallenge });
        } catch (error) {
            const message = error instanceof APIError ? error.message : 'Failed to claim challenge reward';
            setError('challenges', message);
            console.error('Error claiming challenge reward:', error);
            throw error;
        } finally {
            setLoading('challenges', false);
        }
    };

    // Activity actions
    const fetchActivities = async (userId: string) => {
        try {
            setLoading('activities', true);
            setError('activities', null);
            const activities = await apiService.getUserActivities(userId);
            dispatch({ type: 'SET_ACTIVITIES', payload: activities });
        } catch (error) {
            const message = error instanceof APIError ? error.message : 'Failed to fetch activities';
            setError('activities', message);
            console.error('Error fetching activities:', error);
        } finally {
            setLoading('activities', false);
        }
    };

    const createActivity = async (activityData: Partial<Activity>) => {
        try {
            setError('activities', null);
            const activity = await apiService.createActivity(activityData);
            dispatch({ type: 'ADD_ACTIVITY', payload: activity });
        } catch (error) {
            const message = error instanceof APIError ? error.message : 'Failed to create activity';
            setError('activities', message);
            console.error('Error creating activity:', error);
            throw error;
        }
    };

    // Badge actions
    const fetchBadges = async () => {
        try {
            setLoading('badges', true);
            setError('badges', null);
            const badges = await apiService.getBadges();
            dispatch({ type: 'SET_BADGES', payload: badges });
        } catch (error) {
            const message = error instanceof APIError ? error.message : 'Failed to fetch badges';
            setError('badges', message);
            console.error('Error fetching badges:', error);
        } finally {
            setLoading('badges', false);
        }
    };

    const fetchUserBadges = async (userId: string) => {
        try {
            setLoading('badges', true);
            setError('badges', null);
            const userBadges = await apiService.getUserBadges(userId);
            dispatch({ type: 'SET_USER_BADGES', payload: userBadges });
        } catch (error) {
            const message = error instanceof APIError ? error.message : 'Failed to fetch user badges';
            setError('badges', message);
            console.error('Error fetching user badges:', error);
        } finally {
            setLoading('badges', false);
        }
    };

    // Streak actions
    const fetchStreak = async (userId: string) => {
        try {
            setLoading('stats', true);
            setError('stats', null);
            const streak = await apiService.getUserStreak(userId);
            dispatch({ type: 'SET_STREAK', payload: streak });
        } catch (error) {
            const message = error instanceof APIError ? error.message : 'Failed to fetch streak';
            setError('stats', message);
            console.error('Error fetching streak:', error);
        } finally {
            setLoading('stats', false);
        }
    };

    const updateStreak = async (streakData: Partial<Streak>) => {
        if (!state.user?._id) return;

        try {
            setLoading('stats', true);
            setError('stats', null);
            const streak = await apiService.updateStreak(state.user._id, streakData);
            dispatch({ type: 'SET_STREAK', payload: streak });
        } catch (error) {
            const message = error instanceof APIError ? error.message : 'Failed to update streak';
            setError('stats', message);
            console.error('Error updating streak:', error);
            throw error;
        } finally {
            setLoading('stats', false);
        }
    };

    // Transaction actions
    const fetchTransactions = async (userId: string) => {
        try {
            setLoading('transactions', true);
            setError('transactions', null);
            const transactions = await apiService.getUserTransactions(userId);
            dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
        } catch (error) {
            const message = error instanceof APIError ? error.message : 'Failed to fetch transactions';
            setError('transactions', message);
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading('transactions', false);
        }
    };

    // Leaderboard actions
    const fetchLeaderboard = async () => {
        try {
            setLoading('leaderboard', true);
            setError('leaderboard', null);
            const leaderboard = await apiService.getLeaderboard();
            dispatch({ type: 'SET_LEADERBOARD', payload: leaderboard });
        } catch (error) {
            const message = error instanceof APIError ? error.message : 'Failed to fetch leaderboard';
            setError('leaderboard', message);
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading('leaderboard', false);
        }
    };

    // Initialize user data
    const initializeUser = async (walletAddress: string) => {
        try {
            // Fetch user data
            await fetchUser(walletAddress);

            if (state.user?._id) {
                // Fetch all user-related data
                await Promise.all([
                    fetchUserStats(state.user._id),
                    fetchUserChallenges(state.user._id),
                    fetchActivities(state.user._id),
                    fetchUserBadges(state.user._id),
                    fetchStreak(state.user._id),
                    fetchTransactions(state.user._id),
                ]);
            }

            // Fetch global data
            await Promise.all([
                fetchChallenges(),
                fetchBadges(),
                fetchLeaderboard(),
            ]);

            dispatch({ type: 'SET_INITIALIZED', payload: true });
        } catch (error) {
            console.error('Error initializing user:', error);
        }
    };

    // Reset state
    const resetState = () => {
        dispatch({ type: 'RESET_STATE' });
    };

    // Initialize user when wallet connects
    useEffect(() => {
        if (primaryWallet?.address && !state.initialized) {
            initializeUser(primaryWallet.address);
        }
    }, [primaryWallet?.address, state.initialized]);

    const value: UserContextType = {
        ...state,
        fetchUser,
        createUser,
        updateUser,
        fetchUserStats,
        updateUserStats,
        fetchChallenges,
        fetchUserChallenges,
        startChallenge,
        updateChallengeProgress,
        completeChallenge,
        claimChallengeReward,
        fetchActivities,
        createActivity,
        fetchBadges,
        fetchUserBadges,
        fetchStreak,
        updateStreak,
        fetchTransactions,
        fetchLeaderboard,
        initializeUser,
        resetState,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

// Hook to use the user context
export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
} 