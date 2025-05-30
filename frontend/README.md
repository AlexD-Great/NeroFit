# NeroFit - Next.js Frontend

A modern, responsive fitness rewards application built with Next.js, TypeScript, and Tailwind CSS. Earn FIT tokens by completing fitness challenges on the Nero blockchain.

## Features

- 🎯 **Fitness Challenges**: Complete daily challenges to earn FIT tokens
- 💰 **Crypto Rewards**: Earn real cryptocurrency rewards for staying active
- 🔗 **MetaMask Integration**: Connect your wallet for seamless Web3 experience
- ⛽ **Gasless Transactions**: Claim rewards without paying gas fees
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- 🎨 **Modern UI/UX**: Built with Tailwind CSS and modern design principles

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3**: ethers.js for blockchain interaction
- **State Management**: React Context API
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask browser extension

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
```env
NEXT_PUBLIC_API_URL=https://nerofit.onrender.com
NEXT_PUBLIC_NERO_TESTNET_RPC=https://testnet.nerochain.io
NEXT_PUBLIC_PAYMASTER_ADDRESS=0x1234567890123456789012345678901234567890
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
│   ├── providers/              # React Context providers
│   │   └── WalletProvider.tsx  # Wallet state management
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
- **Login (`/login`)**: Authentication with MetaMask, Google, or email
- **Dashboard (`/dashboard`)**: Main app interface with challenges and stats
- **Challenge (`/challenge/[id]`)**: Individual challenge details and completion

### Features

- **Wallet Integration**: Connect/disconnect MetaMask wallet
- **Challenge System**: 4 different fitness challenges with varying difficulties
- **Token Management**: View and claim FIT token rewards
- **Progress Tracking**: Visual progress indicators and completion status
- **Responsive Design**: Mobile-first design that scales to desktop

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://nerofit.onrender.com` |
| `NEXT_PUBLIC_NERO_TESTNET_RPC` | Nero testnet RPC URL | `https://testnet.nerochain.io` |
| `NEXT_PUBLIC_PAYMASTER_ADDRESS` | Paymaster contract address | `0x123...` |

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
