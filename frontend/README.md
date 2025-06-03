# NeroFit Frontend

A Next.js-based frontend for the NeroFit decentralized fitness platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Environment Setup
Create a `.env.local` file in the frontend directory:

```bash
# NERO Authentication Configuration
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_web3auth_client_id
NEXT_PUBLIC_PAYMASTER_API_KEY=your_paymaster_api_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
NEXT_PUBLIC_FACEBOOK_CLIENT_ID=your_facebook_oauth_client_id

# Optional
NEXT_TELEMETRY_DISABLED=1
```

**Note**: The backend URL is hardcoded to `https://nerofit.onrender.com` and doesn't require configuration.

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15.3.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NERO Web3Auth
- **State Management**: React Context
- **Backend Integration**: Hardcoded to Render deployment

### Key Components
- `WalletProvider` - Wallet connection and user data management
- `NeroProvider` - NERO authentication integration
- `ChallengeCard` - Individual challenge display
- `Leaderboard` - User rankings and statistics

### API Integration
The frontend connects to the backend at `https://nerofit.onrender.com` with these endpoints:
- `/api/user-data/:address` - Get user profile and stats
- `/api/claim-tokens` - Claim challenge rewards
- `/api/connect-wallet` - Wallet connection verification
- `/health` - Backend health check

## 🎯 Features

### Core Features
- **Wallet Connection**: NERO Web3Auth integration
- **Challenge System**: Browse and complete fitness challenges
- **Token Rewards**: Earn FIT tokens for completed challenges
- **Progress Tracking**: Monitor fitness journey and statistics
- **Leaderboard**: View rankings and compete with others
- **Responsive Design**: Mobile-first approach

### Authentication Flow
1. User clicks "Connect Wallet"
2. NERO Web3Auth modal opens
3. User authenticates via social login or wallet
4. Account abstraction creates smart wallet
5. Backend verifies connection
6. User data loads from API

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID` | Web3Auth client ID | Yes | - |
| `NEXT_PUBLIC_PAYMASTER_API_KEY` | Paymaster API key | Yes | - |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID | No | - |
| `NEXT_PUBLIC_FACEBOOK_CLIENT_ID` | Facebook OAuth client ID | No | - |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry | No | `false` |

**Backend URL**: Hardcoded to `https://nerofit.onrender.com` - no configuration needed.

### Build Configuration
- **Output**: Static and server-side rendering
- **Target**: ES2020
- **Bundle Analyzer**: Available via `npm run analyze`
- **TypeScript**: Strict mode enabled

## 🧪 Testing

### Development Testing
```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

### API Testing
The frontend automatically connects to the Render backend. Test API connectivity:
```bash
# Health check
curl https://nerofit.onrender.com/health

# User data (replace with actual address)
curl https://nerofit.onrender.com/api/user-data/0x...
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Key Responsive Features
- Collapsible navigation
- Adaptive card layouts
- Touch-friendly interactions
- Optimized images and assets

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Set root directory to `frontend`
3. Configure environment variables
4. Deploy automatically on push

### Build Settings
- **Framework**: Next.js
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Environment Variables for Deployment
Set these in your deployment platform:
- `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID`
- `NEXT_PUBLIC_PAYMASTER_API_KEY`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_FACEBOOK_CLIENT_ID`

## 🔍 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### API Connection Issues
- Backend URL is hardcoded to Render deployment
- Check backend health: `curl https://nerofit.onrender.com/health`
- Verify CORS settings allow your domain

#### Authentication Issues
- Verify Web3Auth client ID is correct
- Check NERO network configuration
- Ensure paymaster API key is valid

### Performance Optimization
- Images are optimized with Next.js Image component
- Code splitting enabled by default
- Static generation for public pages
- API routes cached appropriately

## 📊 Bundle Analysis

```bash
# Analyze bundle size
npm run analyze
```

This generates a detailed report of bundle composition and optimization opportunities.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with proper TypeScript types
4. Test with the Render backend
5. Submit a pull request

### Code Style
- ESLint configuration enforced
- Prettier for formatting
- TypeScript strict mode
- Tailwind CSS for styling

## 📄 License

MIT License - see LICENSE file for details.
