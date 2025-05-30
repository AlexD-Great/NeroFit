import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Reduce bundle size and optimize for Dynamic.xyz
  experimental: {
    optimizePackageImports: [
      '@dynamic-labs/sdk-react-core', 
      '@dynamic-labs/ethereum',
      '@dynamic-labs/wagmi-connector',
      'wagmi',
      'viem'
    ],
  },
  
  webpack: (config, { dev, isServer }) => {
    // Suppress warnings for missing optional dependencies
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
      'encoding': false,
      'supports-color': false,
    };
    
    // Ignore specific warnings
    config.ignoreWarnings = [
      /Module not found: Can't resolve '@react-native-async-storage\/async-storage'/,
      /Module not found: Can't resolve 'pino-pretty'/,
      /Module not found: Can't resolve 'encoding'/,
      /Module not found: Can't resolve 'supports-color'/,
    ];
    
    // Reduce bundle size by excluding unnecessary modules
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
        'encoding': 'commonjs encoding',
        'supports-color': 'commonjs supports-color',
      });
    }
    
    return config;
  },
  
  // Suppress build warnings
  typescript: {
    ignoreBuildErrors: false,
  },
  
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
