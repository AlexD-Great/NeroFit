# NeroFit - Next.js Frontend

A modern, responsive fitness rewards application built with Next.js, TypeScript, and Tailwind CSS. Earn FIT tokens by completing fitness challenges on the Nero blockchain.

## Features

- 🎯 **Fitness Challenges**: Complete daily challenges to earn FIT tokens
- 💰 **Crypto Rewards**: Earn real cryptocurrency rewards for staying active
- 🔗 **NERO Wallet Integration**: Connect with Google or MetaMask for seamless Web3 experience
- 🔐 **Social Login**: Sign in with Google for gasless transactions
- ⛽ **Gasless Transactions**: Claim rewards without paying gas fees
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- 🎨 **Modern UI/UX**: Built with Tailwind CSS and modern design principles

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: ethers.js + Web3Auth for blockchain interaction
- **Authentication**: NERO Wallet with Google OAuth and MetaMask support
- **State Management**: React Context API
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask browser extension (optional if using Google login)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Update environment variables in `.env.local`:

#### Required Variables
```env
NEXT_PUBLIC_API_URL=https://nerofit.onrender.com
```

####  Variables (for enhanced features)
```env
# Web3Auth Configuration for Social Login (Optional)
# Get your client ID from https://dashboard.web3auth.io/
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_web3auth_client_id

# Google OAuth Configuration (Optional - for social login)
# Get from Google Cloud Console
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Facebook OAuth Configuration (Optional - for social login)
# Get from Facebook Developers
NEXT_PUBLIC_FACEBOOK_CLIENT_ID=your_facebook_client_id

# NERO Chain Paymaster API Key (Optional - for gasless transactions)
# Get from NERO Chain team
NEXT_PUBLIC_PAYMASTER_API_KEY=your_paymaster_api_key
```

**Note**: If Web3Auth Client ID is not provided, the app will automatically fall back to MetaMask-only mode.

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication Setup

### Google Authentication (Optional)

To enable Google sign-in for gasless transactions:

1. **Create Web3Auth Project**:
   - Go to [Web3Auth Dashboard](https://dashboard.web3auth.io/)
   - Create a new project
   - Copy the Client ID to `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID`

2. **Setup Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add your domain to authorized origins
   - Copy Client ID to `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

3. **Configure Web3Auth**:
   - In Web3Auth dashboard, add Google as a login provider
   - Use the Google Client ID from step 2
   - Set verifier name to match NERO configuration

### MetaMask Only Mode

If you don't set up Google authentication, the app will work with MetaMask only:
- Users can connect with MetaMask wallet
- All transactions will require gas fees
- No social login features

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── challenge/[id]/     # Dynamic challenge pages
│   │   ├── dashboard/          # Main dashboard
│   │   ├── login/              # Authentication page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home/onboarding page
│   ├── components/             # React components
│   │   └── NeroWidget.tsx      # NERO wallet connection widget
│   ├── hooks/                  # Custom React hooks
│   │   ├── useNeroWallet.ts    # NERO wallet integration
│   │   ├── useConfig.ts        # Configuration management
│   │   └── useSendUserOp.ts    # UserOperation handling
│   ├── providers/              # React Context providers
│   │   ├── NeroProvider.tsx    # NERO wallet state management
│   │   └── WalletProvider.tsx  # Legacy wallet provider
│   ├── config/                 # Configuration files
│   │   └── nerowallet.config.ts # NERO wallet configuration
│   └── types/                  # TypeScript type definitions
│       └── ethereum.d.ts       # Ethereum/MetaMask types
├── public/                     # Static assets
├── .env.example               # Environment variables template
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## Key Components

### Pages

- **Onboarding (`/`)**: Welcome page with app introduction
- **Login (`/login`)**: Authentication with Google or MetaMask
- **Dashboard (`/dashboard`)**: Main app interface with challenges and stats
- **Challenge (`/challenge/[id]`)**: Individual challenge details and completion

### NERO Wallet Features

- **Social Login**: Sign in with Google for seamless onboarding
- **MetaMask Support**: Traditional wallet connection for crypto users
- **Account Abstraction**: Gasless transactions with paymaster
- **Multi-Chain**: Automatic NERO testnet configuration
- **Responsive UI**: Mobile-first wallet connection interface

## Environment Variables (mock - to give you an idea)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes | `https://nerofit.onrender.com` |
| `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID` | Web3Auth client ID | No | `BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID | No | `123456789-abc.apps.googleusercontent.com` |
| `NEXT_PUBLIC_FACEBOOK_CLIENT_ID` | Facebook app ID | No | `1234567890123456` |
| `NEXT_PUBLIC_PAYMASTER_API_KEY` | NERO paymaster API key | No | `your_api_key_here` |

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Backend Integration

This frontend connects to the NeroFit backend API for:

- Wallet registration and user management
- Token claiming and reward distribution
- Challenge completion tracking
- Gasless transaction processing via paymaster

Backend repository: [NeroFit Backend](https://github.com/AlexD-Great/nero_backend)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment

```bash
npm run build
npm run start
```

## Troubleshooting

### Common Issues

1. **"Web3Auth not initialized"**: Make sure `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID` is set correctly
2. **Google login fails**: Check Google OAuth configuration and authorized domains
3. **MetaMask connection timeout**: Ensure MetaMask is unlocked and check for popup blockers
4. **Network issues**: App automatically switches to NERO testnet, but manual network addition may be required

### Debug Mode

Enable debug logging by opening browser console. The app logs detailed information about:
- Wallet connection attempts
- Network switching
- Authentication flows
- Error states

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.
