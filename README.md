# NeroFit - Fitness Rewards DApp

NeroFit is a decentralized fitness application that rewards users with FIT tokens for completing fitness challenges. Built on the Nero blockchain with gasless transactions via Nero Paymaster.

## 🏗️ Architecture

- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS
- **Backend**: Node.js with Express, ethers.js for blockchain integration (Live on Render)
- **Blockchain**: Nero Testnet with smart contract integration
- **Wallet**: MetaMask integration with gasless transactions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension
- Git

### 1. Clone and Setup

```bash
git clone <repository-url>
cd NeroFit
```

### 2. Frontend Setup (Integrated with Live Backend)

```bash
npm install
```

Create a `.env.local` file in the root directory:

```env
# Backend API URL (live on Render)
NEXT_PUBLIC_API_URL=https://nerofit.onrender.com

# Nero Blockchain Configuration
NEXT_PUBLIC_NERO_CHAIN_ID=1337
NEXT_PUBLIC_NERO_TESTNET_RPC=https://testnet.nerochain.io

# Paymaster Configuration (for gasless transactions)
NEXT_PUBLIC_PAYMASTER_ADDRESS=0x9876543210987654321098765432109876543210
```

### 3. Start Frontend (Connected to Live Backend)

```bash
npm run dev
```

The app will be available at http://localhost:3000 and will automatically connect to the live backend at https://nerofit.onrender.com

## 🌐 Live Backend Integration

The app is fully integrated with a live backend deployed on Render:

- **Backend URL**: https://nerofit.onrender.com
- **Health Check**: https://nerofit.onrender.com/health
- **API Documentation**: https://nerofit.onrender.com/

### Backend API Endpoints

- `POST /api/connect-wallet` - Connect and verify wallet with smart contract integration
- `GET /api/user-data/:address` - Fetch user data and token balance
- `POST /api/claim-tokens` - Claim FIT tokens via gasless transactions
- `GET /health` - Health check endpoint

## 📱 Features

### 🎯 Challenge System
- **6 Fitness Challenges**: Walk, Run, Hydration, Strength Training, Steps, Meditation
- **Progress Tracking**: Real-time progress bars and completion status
- **Difficulty Levels**: Easy, Medium, Hard challenges
- **Categories**: Cardio, Strength, Wellness, Endurance

### 💰 Token Rewards
- **FIT Tokens**: Earn tokens for completing challenges
- **Gasless Transactions**: Powered by Nero Paymaster
- **Smart Contract Integration**: Secure token claiming via live backend
- **Real-time Balance**: Live token balance updates

### 👤 User Dashboard
- **4 Main Sections**: Challenges, Profile, Leaderboard, History
- **User Stats**: Challenges completed, tokens earned, streak tracking
- **Global Leaderboard**: Compete with other users
- **Achievement System**: Unlock achievements for milestones
- **Challenge History**: Track your fitness journey

### 🔗 Wallet Integration
- **MetaMask Support**: Seamless wallet connection
- **Multi-network**: Nero Testnet support
- **Signature Verification**: Secure authentication via backend
- **Connection Status**: Real-time connection monitoring

## 🛠️ Technical Implementation

### Frontend Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Onboarding page
│   ├── login/page.tsx     # Authentication
│   ├── dashboard/page.tsx # Main dashboard
│   └── challenge/[id]/    # Challenge details
├── components/            # Reusable components
│   └── Toast.tsx         # Notification system
├── providers/            # React Context providers
│   ├── WalletProvider.tsx # Wallet state management
│   └── ToastProvider.tsx  # Toast notifications
└── services/             # API services
    └── api.ts            # Backend integration
```

### Backend Integration

The frontend seamlessly integrates with the live backend through:

- **API Service Layer**: Comprehensive backend communication
- **Health Monitoring**: Real-time backend connectivity checks
- **Fallback Modes**: Graceful degradation when backend is unavailable
- **Error Handling**: Comprehensive error recovery
- **Toast Notifications**: User feedback for all operations

## 🔧 Development

### Frontend Development

```bash
npm run dev     # Start development server (connects to live backend)
npm run build   # Build for production
npm run lint    # Run ESLint
```

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://nerofit.onrender.com
NEXT_PUBLIC_NERO_CHAIN_ID=1337
NEXT_PUBLIC_NERO_TESTNET_RPC=https://testnet.nerochain.io
NEXT_PUBLIC_PAYMASTER_ADDRESS=0x9876543210987654321098765432109876543210
```

## 🎮 User Flow

1. **Onboarding**: Welcome page with app overview
2. **Authentication**: Connect MetaMask wallet (verified via backend)
3. **Dashboard**: View challenges, profile, leaderboard
4. **Challenge Selection**: Choose from 6 fitness challenges
5. **Challenge Completion**: Complete fitness activities
6. **Reward Claiming**: Claim FIT tokens via gasless transactions (backend-powered)
7. **Progress Tracking**: Monitor stats and achievements

## 🔐 Security Features

- **Signature Verification**: Cryptographic wallet verification via backend
- **Smart Contract Integration**: Secure token operations through live backend
- **Gasless Transactions**: Sponsored by Nero Paymaster
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Graceful error management

## 🌐 Deployment Status

### Frontend
- **Development**: http://localhost:3000
- **Production**: Ready for deployment to Vercel/Netlify

### Backend (Live)
- **Production**: https://nerofit.onrender.com ✅
- **Status**: Fully operational with smart contract integration
- **Health**: https://nerofit.onrender.com/health

## 🧪 Testing

The app includes comprehensive testing capabilities:

- **Live Backend**: Fully integrated with production backend
- **Demo Mode**: Graceful fallback when backend is unavailable
- **Health Monitoring**: Real-time backend status checking
- **Error Recovery**: Comprehensive error handling
- **Connection Monitoring**: Real-time status updates

## 📊 Smart Contract Integration

The app integrates with Nero blockchain smart contracts through the live backend:

- **User Registration**: Register users on-chain via `/api/connect-wallet`
- **Challenge Completion**: Record challenge completions
- **Token Distribution**: Distribute FIT tokens as rewards via `/api/claim-tokens`
- **Gasless Transactions**: Sponsored by Nero Paymaster

## 🚀 Getting Started (Quick)

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Create `.env.local`** with the backend URL: `NEXT_PUBLIC_API_URL=https://nerofit.onrender.com`
4. **Start the app**: `npm run dev`
5. **Connect MetaMask** and start earning FIT tokens!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with live backend integration
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the GitHub issues
- Review the documentation
- Test with live backend at https://nerofit.onrender.com

---

**Built with ❤️ for the Nero ecosystem - Fully integrated with live backend!**


