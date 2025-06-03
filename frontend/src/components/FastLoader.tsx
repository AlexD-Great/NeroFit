"use client";

import { memo } from 'react';

interface FastLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const FastLoader = memo(({ 
  message = "Loading...", 
  size = 'md',
  className = "" 
}: FastLoaderProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`${sizeClasses[size]} border-2 border-purple-500 border-t-transparent rounded-full animate-spin`}
        style={{ 
          animation: 'spin 0.8s linear infinite',
          willChange: 'transform'
        }}
      />
      {message && (
        <p className="text-white/70 text-sm mt-2 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
});

FastLoader.displayName = 'FastLoader';

export default FastLoader; 