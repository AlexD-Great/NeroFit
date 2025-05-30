import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Basic configuration only
  images: {
    domains: ['localhost', 'ui-avatars.com'],
    unoptimized: true, // Always disable optimization for development
  },
  
  // Minimal webpack config to suppress warnings only
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
      'encoding': false,
      'supports-color': false,
      'utf-8-validate': false,
      'bufferutil': false,
    };
    
    config.ignoreWarnings = [
      /Module not found: Can't resolve/,
    ];
    
    return config;
  },
  
  // Disable strict checks for development
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
