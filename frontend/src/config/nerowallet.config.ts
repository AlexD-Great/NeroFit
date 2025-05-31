import { WEB3AUTH_NETWORK_TYPE } from '@web3auth/base'

// NERO Logo import (placeholder - you can add actual logo later)
// import NEROLogoSquareIcon from './src/assets/NERO-Logo-square.svg'

// NERO Chain Configuration following their high-level docs exactly
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

// NERO Wallet Configuration following high-level documentation exactly
const config = {
  // Chain configuration - exactly as in NERO docs
  chains: [
    {
      chain: {
        chainId: "0x2b1",
        name: 'NERO Chain Testnet',
        currency: 'NERO',
        explorerUrl: 'https://testnet.neroscan.io',
        rpcUrl: 'https://rpc-testnet.nerochain.io',
        networkType: 'testnet' as WEB3AUTH_NETWORK_TYPE,
      },
      aa: {
        bundler: 'https://bundler-testnet.nerochain.io/',
        paymaster: 'https://paymaster-testnet.nerochain.io',
        paymasterAPIKey: process.env.NEXT_PUBLIC_PAYMASTER_API_KEY || '',
      },
      contracts: {
        entryPoint: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
        accountFactory: '0x9406Cc6185a346906296840746125a0E44976454',
      }
    }
  ],
  
  // Web3Auth configuration for social login - exactly as in NERO docs
  web3auth: {
    // Using NERO's environment variable pattern but adapting for Next.js
    clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || 
              process.env.VITE_TESTNET_WEB3AUTH_ID || 
              'BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ',
    network: 'testnet',
    uiConfig: {
      appName: 'NERO',
      theme: { primary: '#667eea' },
      mode: 'dark',
    },
    loginConfig: {
      google: {
        name: 'google',
        verifier: 'NeroTest-Google-Maintest',
        typeOfLogin: 'google',
        // Using NERO's environment variable pattern
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 
                  process.env.VITE_GOOGLE_CLIENT_ID || '',
      },
      facebook: {
        name: 'facebook',
        verifier: 'NeroTest-Facebook-Maintest', 
        typeOfLogin: 'facebook',
        clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || 
                  process.env.VITE_FACEBOOK_CLIENT_ID || '',
      }
    }
  }
};

export default config; 