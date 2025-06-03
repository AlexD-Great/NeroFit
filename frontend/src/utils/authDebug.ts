// Authentication Debug Utility
export const debugAuthState = (context: any, location: string) => {
  const authState = {
    location,
    timestamp: new Date().toISOString(),
    user: !!context.user,
    userEmail: context.user?.email,
    userName: context.user?.name,
    primaryWallet: !!context.primaryWallet,
    primaryWalletAddress: context.primaryWallet?.address,
    isConnected: context.isConnected,
    walletAddress: context.walletAddress,
    isLoading: context.isLoading,
    error: context.error,
    isMounted: context.isMounted,
  };

  console.log(`🔍 Auth Debug [${location}]:`, authState);
  
  // Determine authentication status
  const isAuthenticated = !!(
    context.user || 
    context.primaryWallet || 
    (context.isConnected && context.walletAddress)
  );
  
  console.log(`✅ Authentication Status [${location}]:`, isAuthenticated);
  
  return { authState, isAuthenticated };
};

export const logAuthTransition = (from: string, to: string, reason: string) => {
  console.log(`🔄 Auth Transition: ${from} → ${to} (${reason})`);
}; 