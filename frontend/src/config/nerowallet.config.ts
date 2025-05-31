import { WEB3AUTH_NETWORK_TYPE } from '@web3auth/base'

// NERO Chain Configuration following their high-level docs
export const NERO_CHAIN_CONFIG = {
  chainId: 689,
  chainName: "NERO Chain Testnet",
  rpcUrl: "https://rpc-testnet.nerochain.io",
  currency: "NERO",
  explorer: "https://testnet.neroscan.io"
};

// Account Abstraction Platform Configuration
export const AA_PLATFORM_CONFIG = {
  bundlerRpc: "https://bundler-testnet.nerochain.io/",
  paymasterRpc: "https://paymaster-testnet.nerochain.io",
};

// Contract Addresses for NERO testnet
export const CONTRACT_ADDRESSES = {
  entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
  accountFactory: "0x9406Cc6185a346906296840746125a0E44976454",
};

// Following NERO's exact documentation format from high-level quickstart
const config = {
  // Web3Auth Configuration - exactly as shown in NERO docs
  web3auth: {
    clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID ?? '',
    network: 'testnet',
    uiConfig: {
      appName: 'NeroFit',
      appUrl: 'http://localhost:3000',
      theme: {
        primary: '#667eea'
      },
      mode: 'dark',
      logoLight: '/favicon.ico',
      logoDark: '/favicon.ico',
      defaultLanguage: 'en',
      loginGridCol: 3,
      primaryButton: 'socialLogin'
    },
    loginConfig: {
      google: {
        name: 'google',
        verifier: 'NeroTest-Google-Maintest',
        typeOfLogin: 'google',
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      },
      facebook: {
        name: 'facebook',
        verifier: 'NeroTest-Facebook-Maintest',
        typeOfLogin: 'facebook',
        clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || '',
      }
    }
  },

  // Chain Configuration - following NERO documentation format exactly
  chains: [
    {
      chain: {
        chainId: '0x2b1', // 689 in hex
        chainName: 'NERO Chain Testnet',
        rpcUrls: ['https://rpc-testnet.nerochain.io'],
        nativeCurrency: {
          name: 'NERO',
          symbol: 'NERO',
          decimals: 18,
        },
        blockExplorerUrls: ['https://testnet.neroscan.io'],
        networkType: 'testnet' as WEB3AUTH_NETWORK_TYPE,
      },
      bundler: 'https://bundler-testnet.nerochain.io/',
      paymaster: 'https://paymaster-testnet.nerochain.io',
      paymasterAPIKey: process.env.NEXT_PUBLIC_PAYMASTER_API_KEY || '',
    }
  ],

  // Account Abstraction Configuration following NERO docs
  aa: {
    bundler: 'https://bundler-testnet.nerochain.io/',
    paymaster: 'https://paymaster-testnet.nerochain.io',
    paymasterAPIKey: process.env.NEXT_PUBLIC_PAYMASTER_API_KEY || '',
  },

  // RPC URL for direct read operations
  rpcUrl: 'https://rpc-testnet.nerochain.io',
}

export default config; 