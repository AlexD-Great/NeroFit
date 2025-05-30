import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';

// Nero Testnet Configuration
export const neroTestnet = {
  blockExplorerUrls: ["https://testnet.neroscan.io"],
  chainId: 689,
  name: "NERO Chain Testnet",
  rpcUrls: ["https://rpc-testnet.nerochain.io"],
  iconUrls: ["https://testnet.neroscan.io/favicon.ico"], // You can replace with actual Nero logo
  nativeCurrency: {
    name: "NERO",
    symbol: "NERO",
    decimals: 18,
  },
  networkId: 689,
  vanityName: "Nero Testnet",
  wsRpc: "wss://ws-testnet.nerochain.io",
};

export const dynamicConfig = {
  environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
  walletConnectors: [EthereumWalletConnectors],
  
  // Custom EVM Networks - includes Nero Testnet
  evmNetworks: [neroTestnet],
  
  // App branding
  appName: "NeroFit",
  
  // CSS for styling
  cssOverrides: `
    .dynamic-widget-card {
      background: rgba(255, 255, 255, 0.05) !important;
      backdrop-filter: blur(10px) !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-radius: 12px !important;
    }
    
    .dynamic-widget-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      border: none !important;
      border-radius: 8px !important;
      color: white !important;
      font-weight: 600 !important;
      transition: all 0.2s ease !important;
    }
    
    .dynamic-widget-button:hover {
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%) !important;
      transform: translateY(-1px) !important;
    }
    
    .dynamic-widget-text {
      color: white !important;
    }
    
    .dynamic-widget-text-secondary {
      color: rgba(255, 255, 255, 0.7) !important;
    }
  `,
}; 