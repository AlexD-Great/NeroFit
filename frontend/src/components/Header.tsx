"use client";

import { useNeroContext } from "@/providers/NeroProvider";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, primaryWallet, setShowAuthFlow, handleLogOut } = useNeroContext();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  // Debug authentication state
  console.log('Header: Authentication state:', {
    user: !!user,
    primaryWallet: !!primaryWallet,
    userEmail: user?.email,
    walletAddress: primaryWallet?.address
  });

  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent double-clicks
    
    setIsSigningOut(true);
    setShowUserMenu(false);
    
    try {
      console.log('Header: Starting sign out process...');
      
      if (handleLogOut) {
        await handleLogOut();
      }
      
      console.log('Header: Sign out completed, refreshing page...');
      
      // Use page refresh to ensure clean state after logout
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Header: Error signing out:', error);
      // Force navigation to login even if logout fails
      window.location.href = '/login';
    }
  };

  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    if (primaryWallet?.address) return `${primaryWallet.address.slice(0, 6)}...${primaryWallet.address.slice(-4)}`;
    return 'User';
  };

  const getUserAvatar = () => {
    // Generate a simple avatar based on user info
    const name = getUserDisplayName();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff&size=40`;
  };

  const isAuthenticated = !!(user || primaryWallet);

  if (!isAuthenticated) {
    return (
      <header className="bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <span className="text-xl font-bold text-white">NeroFit</span>
            </div>

            {/* Login Button */}
            <button
              onClick={() => router.push('/login')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-white">NeroFit</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-white/80 hover:text-white transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push('/challenges')}
              className="text-white/80 hover:text-white transition-colors"
            >
              Challenges
            </button>
            <button
              onClick={() => router.push('/leaderboard')}
              className="text-white/80 hover:text-white transition-colors"
            >
              Leaderboard
            </button>
          </nav>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 transition-all duration-200"
              disabled={isSigningOut}
            >
              <img
                src={getUserAvatar()}
                alt="User avatar"
                className="w-8 h-8 rounded-full"
              />
              <div className="hidden sm:block text-left">
                <div className="text-white font-medium text-sm">{getUserDisplayName()}</div>
                <div className="text-white/60 text-xs">
                  {user ? 'Social Login' : primaryWallet ? 'Wallet Connected' : 'Guest'}
                </div>
              </div>
              <svg
                className={`w-4 h-4 text-white/60 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && !isSigningOut && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/30 shadow-2xl z-50">
                <div className="p-4">
                  {/* User Info */}
                  <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-white/20">
                    <img
                      src={getUserAvatar()}
                      alt="User avatar"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="text-white font-semibold">{getUserDisplayName()}</div>
                      {user?.email && (
                        <div className="text-white/60 text-sm">{user.email}</div>
                      )}
                      {primaryWallet?.address && (
                        <div className="text-white/60 text-xs font-mono">
                          {primaryWallet.address.slice(0, 8)}...{primaryWallet.address.slice(-6)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Connection Status */}
                  <div className="mb-4">
                    <div className="text-white/80 text-sm font-medium mb-2">Connection Status</div>
                    <div className="space-y-2">
                      {user && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-white/70 text-sm">Social Login Active</span>
                        </div>
                      )}
                      {primaryWallet ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-white/70 text-sm">
                            {primaryWallet.connector?.name || 'Wallet'} Connected
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <span className="text-white/70 text-sm">No Wallet Connected</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    {!primaryWallet && (
                      <button
                        onClick={() => {
                          if (setShowAuthFlow) {
                            setShowAuthFlow(true);
                          }
                          setShowUserMenu(false);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                      >
                        Connect Wallet
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        router.push('/profile');
                      }}
                      className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                    >
                      View Profile
                    </button>
                    
                    <button
                      onClick={handleSignOut}
                      disabled={isSigningOut}
                      className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                    >
                      {isSigningOut ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Signing Out...
                        </>
                      ) : (
                        'Sign Out'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-white/10">
        <div className="px-4 py-2 space-x-4 flex">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-white/80 hover:text-white text-sm transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => router.push('/challenges')}
            className="text-white/80 hover:text-white text-sm transition-colors"
          >
            Challenges
          </button>
          <button
            onClick={() => router.push('/leaderboard')}
            className="text-white/80 hover:text-white text-sm transition-colors"
          >
            Leaderboard
          </button>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && !isSigningOut && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Signing out overlay */}
      {isSigningOut && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/30 p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <div className="text-white font-medium">Signing out...</div>
            <div className="text-white/60 text-sm mt-1">Please wait while we disconnect your wallet</div>
          </div>
        </div>
      )}
    </header>
  );
} 