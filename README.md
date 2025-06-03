# NeroFit - Decentralized Fitness Platform

A blockchain-based fitness platform where users earn FIT tokens by completing fitness challenges. Built with Next.js, Express.js, and deployed on Render.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### 1. Clone and Install
```bash
git clone https://github.com/yourusername/nerofit.git
cd nerofit/frontend
npm install
```

### 2. Configure Environment
Create `frontend/.env.local`:
```bash
# NERO Authentication Configuration
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_web3auth_client_id
NEXT_PUBLIC_PAYMASTER_API_KEY=your_paymaster_api_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_oauth_client_id
NEXT_PUBLIC_FACEBOOK_CLIENT_ID=your_facebook_oauth_client_id

# Optional optimizations
NEXT_TELEMETRY_DISABLED=1
```

### 3. Start Frontend
```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 🌐 **Backend Information**

The backend is deployed and running on Render at:
- **API Base URL**: https://nerofit.onrender.com (hardcoded as default)
- **Health Check**: https://nerofit.onrender.com/health
- **API Documentation**: Available at the base URL

### Available Endpoints:
- `GET /health` - Health check
- `POST /api/connect-wallet` - Connect wallet
- `GET /api/user-data/:walletAddress` - Get user data
- `POST /api/claim-tokens` - Claim challenge tokens

## 🧪 **Testing the API**

Test the backend connection:
```bash
# Health check
curl https://nerofit.onrender.com/health

# API info
curl https://nerofit.onrender.com/

# Test token claiming (requires valid wallet address)
curl -X POST https://nerofit.onrender.com/api/claim-tokens \
  -H "Content-Type: application/json" \
  -d '{"walletAddress":"0x...", "challengeId":1, "reward":15}'
```

## 🎯 **Features**

- **Wallet Integration**: Connect with Dynamic.xyz
- **Challenge System**: Complete fitness challenges to earn tokens
- **Token Rewards**: Earn FIT tokens on Nero blockchain
- **Leaderboard**: Compete with other users
- **Progress Tracking**: Monitor your fitness journey

## 🏗️ **Architecture**

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: Express.js with CORS enabled for all deployments (Render)
- **Blockchain**: Nero testnet integration
- **Deployment**: Render (backend) + Vercel/Netlify (frontend)

## 🔧 **Development**

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
```

### Environment Variables
The frontend uses these environment variables:
- `NEXT_PUBLIC_WEB3AUTH_CLIENT_ID` - Web3Auth client ID for NERO authentication
- `NEXT_PUBLIC_PAYMASTER_API_KEY` - Paymaster API key for gasless transactions
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `NEXT_PUBLIC_FACEBOOK_CLIENT_ID` - Facebook OAuth client ID
- `NEXT_TELEMETRY_DISABLED` - Disable Next.js telemetry

**Note**: Backend URL is hardcoded to `https://nerofit.onrender.com` and doesn't require configuration.

## 🚨 **Troubleshooting**

### Frontend Issues
```bash
# Clear Next.js cache
rm -rf frontend/.next

# Reinstall dependencies
cd frontend && rm -rf node_modules package-lock.json && npm install
```

### API Connection Issues
```bash
# Test backend connectivity
curl https://nerofit.onrender.com/health

# The backend URL is hardcoded in the application
# No environment variable configuration needed
```

## 📊 **Performance**

With the Render backend setup:
- **Page Load Time**: ~1-2 seconds
- **API Response Time**: ~200-500ms
- **No Local Setup Required**: Backend runs on Render
- **Consistent Environment**: Same backend for all developers

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with the Render backend
5. Submit a pull request

## 📄 **License**

MIT License - see LICENSE file for details.

## 🔗 **Links**

- **Live Backend**: https://nerofit.onrender.com
- **Nero Blockchain**: https://testnet-rpc.nerochain.io
- **Documentation**: https://github.com/AlexD-Great/nero_backend