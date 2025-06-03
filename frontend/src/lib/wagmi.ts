import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';

// Define Nero Testnet as a Viem chain
export const neroTestnetChain = defineChain({
  id: 689,
  name: 'NERO Chain Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'NERO',
    symbol: 'NERO',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-testnet.nerochain.io'],
      webSocket: ['wss://ws-testnet.nerochain.io'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Nero Testnet Explorer',
      url: 'https://testnet.neroscan.io',
    },
  },
  testnet: true,
});

// Wagmi configuration
export const wagmiConfig = createConfig({
  chains: [neroTestnetChain],
  multiInjectedProviderDiscovery: false, // Dynamic handles this
  transports: {
    [neroTestnetChain.id]: http('https://rpc-testnet.nerochain.io'),
  },
}); 