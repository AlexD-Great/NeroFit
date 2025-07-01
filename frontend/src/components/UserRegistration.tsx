"use client";

import { useState } from 'react';
import { useUser } from '@/providers/UserProvider';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { apiService } from '@/lib/api';

interface UserRegistrationProps {
    onComplete: () => void;
}

export default function UserRegistration({ onComplete }: UserRegistrationProps) {
    const { user, primaryWallet } = useDynamicContext();
    const { loading, errors } = useUser();

    const [formData, setFormData] = useState({
        username: user?.firstName || '',
        email: user?.email || `${primaryWallet?.address?.slice(0, 8)}@nerofit.com` || '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!primaryWallet?.address) {
            alert('Please connect your wallet first');
            return;
        }

        setIsSubmitting(true);

        try {
            await apiService.registerUser({
                name: formData.username,
                email: formData.email,
                walletAddress: primaryWallet.address
            });

            onComplete();
        } catch (error) {
            console.error('Registration failed:', error);

            // Check if it's a database timeout error
            const errorMessage = error instanceof Error ? error.message : '';
            if (errorMessage.includes('timed out') || errorMessage.includes('buffering')) {
                if (retryCount < 3) {
                    setRetryCount(prev => prev + 1);
                    alert(`Database connection timeout. Retrying... (${retryCount + 1}/3)`);
                    // Retry after a short delay
                    setTimeout(() => {
                        setIsSubmitting(false);
                    }, 2000);
                    return;
                } else {
                    alert('Database connection is slow. Please try again in a few moments or contact support.');
                }
            } else {
                alert(`Registration failed: ${errorMessage}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🎉</div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome to NeroFit!</h1>
                    <p className="text-white/70">Complete your profile to start earning FIT tokens</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-white/70 text-sm font-medium mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="text-white/70 text-sm mb-2">Connected Wallet</div>
                        <div className="text-white font-mono text-sm">
                            {primaryWallet?.address?.slice(0, 8)}...{primaryWallet?.address?.slice(-6)}
                        </div>
                    </div>

                    {errors.user && (
                        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                            <p className="text-red-400 text-sm">{errors.user}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting || loading.user}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting || loading.user
                            ? retryCount > 0
                                ? `Retrying... (${retryCount}/3)`
                                : 'Creating Profile...'
                            : 'Complete Registration'
                        }
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-white/60 text-sm">
                        By registering, you agree to our terms of service and privacy policy
                    </p>
                </div>
            </div>
        </div>
    );
} 