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
- **Backend**: Node.js, Express.js, REST API
- **Authentication**: Dynamic.xyz (wallet + social + email)
- **Blockchain**: Nero Testnet (EVM-compatible)
- **Web3**: Wagmi, Viem
- **State Management**: React Query

## 🚀 Quick Start

**TL;DR - Get NeroFit running in 3 commands:**

```bash
# 1. Clone and install dependencies
git clone https://github.com/yourusername/nerofit.git && cd nerofit
cd frontend && npm install && cd ../backend && npm install && cd ..

# 2. Make startup script executable
chmod +x start-dev.sh

# 3. Start both servers with optimizations
./start-dev.sh
```

Then open http://localhost:3000 in your browser! 🎉

> **Need environment setup?** See the [detailed installation guide](#installation--setup) below.

## ⚡ Performance Optimizations

NeroFit has been optimized for fast development and production performance:

### 🚀 Development Speed Improvements
- **Page Load Time**: Reduced from 40+ seconds to ~1 second (98% improvement)
- **Hot Reload**: Fast refresh in 1-3 seconds
- **Build Time**: Optimized Next.js configuration for faster compilation
- **Hydration Fix**: Eliminated server-client mismatch errors that caused slow loading

### 🔧 Technical Optimizations
- **Client-Side Rendering**: Dynamic.xyz components only render on client to prevent hydration mismatches
- **Minimal Next.js Config**: Streamlined configuration removes conflicting packages
- **Cache Management**: Automatic cleanup of build caches for consistent performance
- **Memory Optimization**: Reduced memory usage during development

### 📊 Performance Monitoring
Use the included performance monitoring script:
```bash
./check-performance.sh
```

This shows:
- ✅ Server health status
- 📊 Memory usage statistics  
- 🚀 Performance optimization tips
- 🔍 Port availability checks

## Detailed Setup

### Prerequisites

- Node.js 18+ and npm
- A Dynamic.xyz account (free)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nerofit.git
   cd nerofit
   ```

2. **Install dependencies for both frontend and backend**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Set up Dynamic.xyz**
   - Go to [Dynamic.xyz](https://app.dynamic.xyz) and create a free account
   - Create a new project
   - Copy your Environment ID from the dashboard
   - In your Dynamic dashboard, add `http://localhost:3000` to allowed origins to prevent CORS errors

4. **Configure environment variables**
   
   **Frontend** - Create a `.env.local` file in the `frontend` directory:
   ```bash
   # Dynamic.xyz Configuration
   NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your-dynamic-environment-id
   
   # Backend API Configuration (optional - defaults to http://localhost:3001)
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
   ```

   **Backend** - Create a `.env` file in the `backend` directory:
   ```bash
   # Nero Testnet Configuration
   NERO_TESTNET_RPC=https://testnet-rpc.nerochain.io
   PAYMASTER_ADDRESS=0x5a6680dFd4a77FEea0A7be291147768EaA2414ad
   
   # Server Configuration
   PORT=3001
   ```

### Running the Application

**Important**: You need to run both the backend and frontend servers simultaneously.

#### Option 1: Quick Start with Startup Script (Recommended)

For the fastest and easiest setup, use the provided startup script:

```bash
# Make the script executable (first time only)
chmod +x start-dev.sh

# Start both servers with optimized settings
./start-dev.sh
```

This script will:
- ✅ Automatically kill any existing processes on ports 3000 and 3001
- ✅ Start the backend server on port 3001 with proper environment variables
- ✅ Start the frontend server on port 3000 with performance optimizations
- ✅ Display real-time status and URLs for both servers
- ✅ Handle graceful shutdown when you press Ctrl+C

**Expected Output:**
```
🚀 Starting NeroFit Development Environment...
🧹 Cleaning up existing processes...
🔧 Starting backend server on port 3001...
Using PORT: 3001 (from env: 3001)
Server running on port 3001
Connected to Nero testnet at https://testnet-rpc.nerochain.io
Using Paymaster at address 0x5a6680dFd4a77FEea0A7be291147768EaA2414ad
⚡ Starting frontend server on port 3000...
✅ Development servers started!
📱 Frontend: http://localhost:3000
🔧 Backend: http://localhost:3001
Press Ctrl+C to stop all servers
```

#### Option 2: Using separate terminals

**Terminal 1 - Start the Backend Server:**
```bash
cd backend
PORT=3001 node src/server.js
```
You should see:
```
Server running on port 3001
Connected to Nero testnet at https://testnet-rpc.nerochain.io
Using Paymaster at address 0x5a6680dFd4a77FEea0A7be291147768EaA2414ad
```

**Terminal 2 - Start the Frontend Server:**
```bash
cd frontend
npm run dev
```
You should see:
```
▲ Next.js 15.3.3
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000
✓ Ready in 3s
```

#### Option 3: Using background processes

```bash
# Start backend in background
cd backend && PORT=3001 node src/server.js &

# Start frontend
cd frontend && npm run dev
```

#### Performance Monitoring

Check server status and performance anytime:
```bash
# Check if both servers are running and healthy
./check-performance.sh
```

This will show:
- ✅ Port availability status
- ✅ Backend API health check
- ✅ Frontend accessibility
- 📊 Memory usage statistics
- 🚀 Performance optimization tips

### Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

### Troubleshooting Port Issues

If you encounter "port already in use" errors:

1. **Use the startup script (handles this automatically):**
   ```bash
   ./start-dev.sh
   # The script automatically cleans up existing processes
   ```

2. **Manual cleanup if needed:**
   ```bash
   # Kill any process using port 3000
   lsof -ti:3000 | xargs kill -9
   
   # Kill any process using port 3001
   lsof -ti:3001 | xargs kill -9
   ```

3. **Verify ports are free:**
   ```bash
   lsof -i:3000  # Should return nothing
   lsof -i:3001  # Should return nothing
   ```

4. **Start servers in correct order:**
   - Always start backend first (port 3001)
   - Then start frontend (port 3000)

### Common Issues and Solutions

#### Startup Script Issues

**Problem**: `Permission denied` when running `./start-dev.sh`
```bash
# Solution: Make the script executable
chmod +x start-dev.sh
./start-dev.sh
```

**Problem**: Script can't find directories
```bash
# Solution: Make sure you're in the project root directory
pwd  # Should show: /path/to/NeroFit
ls   # Should show: frontend/ backend/ start-dev.sh
```

**Problem**: Frontend takes too long to load (40+ seconds)
```bash
# Solution: Clear Next.js cache and restart
cd frontend
rm -rf .next node_modules/.cache .turbo
cd ..
./start-dev.sh
```

**Problem**: Hydration mismatch errors in console
```
A tree hydrated but some attributes of the server rendered HTML didn't match the client properties
```
**Solution**: This has been fixed by implementing client-side only rendering for Dynamic.xyz components. The fix prevents server-side rendering mismatches that cause slow loading times.

**Problem**: Inconsistent token amounts across different pages
```
Dashboard shows 34 FIT tokens, but leaderboard and profile show 420 tokens
```
**Solution**: This has been fixed by centralizing all mock data in `frontend/src/data/mockData.ts`. All pages now use the same `mockUserStats` object which calculates token amounts dynamically from completed challenges:
- **Claimed tokens**: 34 FIT (from completed and claimed challenges)
- **Claimable tokens**: 27 FIT (from completed but unclaimed challenges)
- **Total available**: 61 FIT tokens

**Problem**: Backend keeps getting killed
```bash
# Solution: Check if another process is using port 3001
lsof -i:3001
# Kill the conflicting process, then restart
./start-dev.sh
```

### Testing the Setup

1. **Test Backend API:**
   ```bash
   curl http://localhost:3001/health
   # Should return: {"status":"ok"}
   ```

2. **Test Token Claiming API:**
   ```bash
   curl -X POST http://localhost:3001/api/challenges/claim-tokens \
     -H "Content-Type: application/json" \
     -d '{"walletAddress":"0x1234567890123456789012345678901234567890","challengeId":"daily-steps","reward":100}'
   # Should return success response with transaction hash
   ```

3. **Access Frontend:**
   - Open http://localhost:3000 in your browser
   - Navigate to dashboard
   - Test wallet connection and token claiming

## Project Structure

```
nerofit/
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   │   ├── dashboard/ # Main dashboard page
│   │   │   ├── login/     # Authentication page
│   │   │   └── layout.tsx # Root layout with providers
│   │   ├── components/    # Reusable UI components
│   │   │   └── ClientProvider.tsx # Client-side providers wrapper
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   └── types/         # TypeScript type definitions
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── backend/                # Node.js backend API
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   │   ├── challenges.js    # Challenge and token claiming endpoints
│   │   │   ├── user-data.js     # User data endpoints
│   │   │   └── connect-wallet.js # Wallet connection endpoints
│   │   └── server.js      # Express server configuration
│   └── package.json       # Backend dependencies
├── contracts/              # Smart contracts (if any)
└── README.md              # This file
```

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

**Frontend (in `frontend/` directory):**
- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

**Backend (in `backend/` directory):**
- `PORT=3001 node src/server.js` - Start development server on port 3001
- `npm start` - Start production server (if configured)

### Environment Variables

**Frontend** - Create a `.env.local` file in `frontend/` directory:

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

**Backend** - Create a `.env` file in `backend/` directory:

```bash
# Required: Nero Testnet Configuration
NERO_TESTNET_RPC=https://testnet-rpc.nerochain.io
PAYMASTER_ADDRESS=0x5a6680dFd4a77FEea0A7be291147768EaA2414ad

# Required: Server Configuration
PORT=3001

# Optional: Database Configuration (if using)
DATABASE_URL=your-database-url

# Optional: JWT Secret (if using authentication)
JWT_SECRET=your-jwt-secret
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

1. **Port Already in Use Errors**
   ```
   Error: listen EADDRINUSE: address already in use :::3000
   ```
   **Solution:**
   ```bash
   # Kill processes using the ports
   lsof -ti:3000 | xargs kill -9
   lsof -ti:3001 | xargs kill -9
   
   # Then restart servers in correct order
   cd backend && PORT=3001 node src/server.js  # Terminal 1
   cd frontend && npm run dev                   # Terminal 2
   ```

2. **Backend Not Respecting PORT Environment Variable**
   - Use uppercase `PORT=3001` instead of lowercase `port=3001`
   - The server.js file looks for `process.env.PORT`

3. **Dynamic Widget Not Loading**
   - Check your Environment ID is correct
   - Ensure you're using the public environment ID (starts with `NEXT_PUBLIC_`)

4. **Dynamic Labs CORS Errors**
   ```
   Access to fetch at 'https://app.dynamicauth.com/api/v0/sdk/...' blocked by CORS policy
   ```
   **Solution:**
   - Go to your Dynamic Labs dashboard
   - Navigate to Settings → Allowed Origins
   - Add `http://localhost:3000` to the allowed origins list
   - Save and restart your frontend server

5. **API Errors: "unexpected token '<', '!DOCTYPE'..."**
   - This means the frontend is receiving HTML instead of JSON
   - Check that backend is running on port 3001
   - Verify API URLs in frontend point to `http://localhost:3001`

6. **Hydration Errors**
   ```
   Warning: Text content did not match. Server: "..." Client: "..."
   ```
   - This is resolved by using the ClientProvider wrapper
   - Ensure Dynamic providers are only rendered on client-side

7. **Wallet Connection Issues**
   - Make sure MetaMask is installed and unlocked
   - Check that you're on the correct network (Nero Testnet)
   - Verify Dynamic Labs configuration includes wallet providers

8. **Build Errors**
   - Run `npm run type-check` to identify TypeScript issues
   - Ensure all environment variables are set
   - Check that both frontend and backend dependencies are installed

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


