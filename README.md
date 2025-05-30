# NeroFit - Fitness Rewards on Nero Blockchain

NeroFit is a Web3 fitness application that rewards users with FIT tokens for completing fitness challenges. Built with Next.js and integrated with the Nero blockchain testnet using Dynamic.xyz for seamless wallet and social authentication.

## Features

- 🏃‍♂️ **Fitness Challenges**: Complete daily fitness tasks to earn FIT tokens
- 💰 **FIT Token Rewards**: Earn cryptocurrency for staying active
- 🔗 **Multi-Auth Support**: Connect via 500+ wallets, social login, or email
- 📊 **Progress Tracking**: Monitor your fitness journey and token earnings
- 🏆 **Leaderboards**: Compete with other users globally
- 🎯 **Achievement System**: Unlock badges and milestones
- 🌐 **Nero Blockchain**: Built on the fast and efficient Nero testnet

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Authentication**: Dynamic.xyz (wallet + social + email)
- **Blockchain**: Nero Testnet (EVM-compatible)
- **Web3**: Wagmi, Viem
- **State Management**: React Query

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- A Dynamic.xyz account (free)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nerofit.git
   cd nerofit/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Dynamic.xyz**
   - Go to [Dynamic.xyz](https://app.dynamic.xyz) and create a free account
   - Create a new project
   - Copy your Environment ID from the dashboard

4. **Configure environment variables**
   Create a `.env.local` file in the frontend directory:
   ```bash
   # Dynamic.xyz Configuration
   NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your-dynamic-environment-id
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Dynamic.xyz Setup Guide

### 1. Create Dynamic Account
- Visit [Dynamic.xyz](https://app.dynamic.xyz)
- Sign up for a free account
- Create a new project

### 2. Configure Wallet Providers
In your Dynamic dashboard:
- Go to **Configurations** → **Wallet Connectors**
- Enable the wallet providers you want (MetaMask, WalletConnect, etc.)
- Dynamic supports 500+ wallets out of the box

### 3. Configure Social Providers (Optional)
- Go to **Configurations** → **Social Providers**
- Enable Google, Twitter, Discord, etc.
- Add your OAuth credentials for each provider

### 4. Configure Email Authentication (Optional)
- Go to **Configurations** → **Email**
- Enable email authentication for passwordless login
- Configure your SMTP settings

### 5. Add Custom Network (Nero Testnet)
The app automatically configures Nero Testnet with these parameters:
- **Network Name**: NERO Chain Testnet
- **RPC URL**: https://rpc-testnet.nerochain.io
- **Chain ID**: 689
- **Currency**: NERO
- **Explorer**: https://testnet.neroscan.io

## Nero Testnet Information

| Parameter | Value |
|-----------|-------|
| Network Name | NERO Chain Testnet |
| RPC Endpoint | https://rpc-testnet.nerochain.io |
| Chain ID | 689 |
| Currency Symbol | NERO |
| Block Explorer | https://testnet.neroscan.io |
| WebSocket | wss://ws-testnet.nerochain.io |

## Authentication Methods

NeroFit supports multiple authentication methods through Dynamic.xyz:

### 1. Wallet Connection
- **MetaMask**: Most popular Ethereum wallet
- **WalletConnect**: Connect 500+ mobile and desktop wallets
- **Coinbase Wallet**: Built-in browser wallet
- **And many more**: Dynamic supports the largest wallet ecosystem

### 2. Social Login
- **Google**: Quick OAuth login
- **Twitter**: Social authentication
- **Discord**: Gaming community integration
- **Apple**: iOS-friendly authentication

### 3. Email Authentication
- **Magic Links**: Passwordless email authentication
- **Embedded Wallets**: Create wallets for users automatically
- **Progressive Web3**: Start with email, upgrade to wallet later

## Project Structure

```
frontend/
├── src/
│   ├── app/                 # Next.js app router
│   │   ├── dashboard/       # Main dashboard page
│   │   ├── login/          # Authentication page
│   │   └── layout.tsx      # Root layout with providers
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   │   └── useDynamicAuth.ts # Dynamic authentication hook
│   ├── lib/                # Utility libraries
│   │   ├── dynamic.ts      # Dynamic.xyz configuration
│   │   └── wagmi.ts        # Wagmi configuration for Nero
│   ├── providers/          # React context providers
│   │   ├── DynamicProvider.tsx # Dynamic + Wagmi provider
│   │   └── ToastProvider.tsx   # Toast notifications
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

## Key Features Explained

### Multi-Authentication Support
- **Wallet Users**: Full Web3 experience with direct token claiming
- **Social Users**: Easy onboarding with progressive Web3 features
- **Email Users**: Passwordless authentication with embedded wallets

### Nero Blockchain Integration
- **EVM Compatible**: Use familiar Ethereum tools and libraries
- **Fast & Cheap**: Low transaction fees and quick confirmations
- **Testnet Ready**: Safe environment for testing and development

### Dynamic.xyz Benefits
- **500+ Wallets**: Largest wallet support in the industry
- **Social Login**: Familiar authentication for Web2 users
- **Embedded Wallets**: Create wallets for users automatically
- **Progressive Web3**: Start simple, add complexity as needed

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Environment Variables

Create a `.env.local` file with:

```bash
# Required: Dynamic.xyz Environment ID
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your-environment-id

# Optional: If using social authentication
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional: If using email authentication
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Troubleshooting

### Common Issues

1. **Dynamic Widget Not Loading**
   - Check your Environment ID is correct
   - Ensure you're using the public environment ID (starts with `NEXT_PUBLIC_`)

2. **Wallet Connection Issues**
   - Make sure MetaMask is installed and unlocked
   - Check that you're on the correct network (Nero Testnet)

3. **Build Errors**
   - Run `npm run type-check` to identify TypeScript issues
   - Ensure all environment variables are set

### Getting Help

- Check the [Dynamic.xyz Documentation](https://docs.dynamic.xyz)
- Visit the [Nero Blockchain Documentation](https://docs.nerochain.io)
- Open an issue on GitHub

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Dynamic.xyz](https://dynamic.xyz) for amazing Web3 authentication
- [Nero Blockchain](https://nerochain.io) for the fast EVM-compatible network
- [Next.js](https://nextjs.org) for the excellent React framework
- [Tailwind CSS](https://tailwindcss.com) for beautiful styling


