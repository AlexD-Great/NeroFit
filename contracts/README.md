# NeroFit Smart Contracts

This directory contains the smart contracts for the NeroFit fitness platform, including the FIT token and fitness tracking contracts.

## Contracts Overview

### FITToken.sol
The main ERC-20 token contract for the NeroFit platform with the following features:
- **ERC-20 Standard**: Full compliance with ERC-20 token standard
- **Reward System**: Automated reward distribution for fitness challenges
- **Streak Bonuses**: Additional rewards based on user activity streaks
- **Challenge Management**: On-chain challenge creation and completion tracking
- **Access Control**: Role-based permissions for reward distribution
- **Pausable**: Emergency pause functionality
- **Burnable**: Token burning capability
- **Supply Cap**: Maximum supply of 100 million tokens

### NeroFitnessV2.sol
Enhanced fitness tracking contract that integrates with the FIT token:
- **User Registration**: On-chain user profile management
- **Workout Logging**: Track workout sessions with automatic rewards
- **Challenge System**: Create, join, and complete fitness challenges
- **Leaderboard**: Ranking system based on fitness points
- **Level System**: User progression with experience points
- **Streak Tracking**: Daily activity streak monitoring

## Features

### Token Economics
- **Symbol**: FIT
- **Decimals**: 18
- **Max Supply**: 100,000,000 FIT
- **Initial Supply**: 10,000,000 FIT (configurable)

### Challenge Rewards
- Walk 1km: 10 FIT
- Run 3km: 25 FIT
- 30-min Workout: 30 FIT
- 15-min Meditation: 12 FIT
- 10,000 Steps: 20 FIT
- Hydration (8 glasses): 15 FIT
- 20-min Yoga: 16 FIT
- 50 Push-ups: 18 FIT
- 5km Bike Ride: 22 FIT
- Marathon Training: 50 FIT

### Streak Bonuses
- 5% bonus per consecutive day
- Maximum 50% bonus
- Applied to all challenge rewards

## Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Install dependencies**:
   ```bash
   cd contracts
   npm install
   ```

2. **Create environment file**:
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables**:
   Edit `.env` file with your:
   - Private key (for deployment)
   - RPC URLs (Infura, Alchemy, etc.)
   - API keys (Etherscan, Polygonscan)

### Environment Variables

Create a `.env` file with the following variables:

```env
# Private key for deployment (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Network RPC URLs
SEPOLIA_URL=https://sepolia.infura.io/v3/your_infura_project_id
MAINNET_URL=https://mainnet.infura.io/v3/your_infura_project_id
POLYGON_URL=https://polygon-rpc.com/
MUMBAI_URL=https://rpc-mumbai.maticvigil.com/

# API Keys for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key

# Gas reporting
REPORT_GAS=true
COINMARKETCAP_API_KEY=your_coinmarketcap_api_key
```

## Usage

### Compilation
```bash
npm run compile
```

### Testing
```bash
npm run test
```

### Local Development
```bash
# Start local Hardhat node
npm run node

# Deploy to local network (in another terminal)
npm run deploy:localhost
```

### Deployment

#### Testnet Deployment (Sepolia)
```bash
npm run deploy:sepolia
```

#### Mainnet Deployment
```bash
npm run deploy:mainnet
```

#### Polygon Deployment
```bash
# Mumbai testnet
npx hardhat run scripts/deploy.js --network mumbai

# Polygon mainnet
npx hardhat run scripts/deploy.js --network polygon
```

### Contract Verification

After deployment, verify contracts on Etherscan:

```bash
# Verify FIT Token
npx hardhat verify --network sepolia <FIT_TOKEN_ADDRESS> "NeroFit Token" "FIT" "10000000000000000000000000"

# Verify NeroFitness V2
npx hardhat verify --network sepolia <NERO_FITNESS_ADDRESS> <FIT_TOKEN_ADDRESS>
```

## Contract Addresses

### Testnet (Sepolia)
- FIT Token: `TBD`
- NeroFitness V2: `TBD`

### Mainnet
- FIT Token: `TBD`
- NeroFitness V2: `TBD`

## API Reference

### FITToken Contract

#### Read Functions
- `name()`: Token name
- `symbol()`: Token symbol
- `decimals()`: Token decimals
- `totalSupply()`: Current total supply
- `balanceOf(address)`: User token balance
- `getUserFitnessData(address)`: User fitness statistics
- `challengeRewards(string)`: Reward amount for challenge type
- `getChallenge(bytes32)`: Challenge details

#### Write Functions
- `transfer(address, uint256)`: Transfer tokens
- `approve(address, uint256)`: Approve token spending
- `completeChallenge(address, bytes32, string)`: Complete challenge (distributors only)
- `rewardUser(address, uint256, string)`: Reward user (distributors only)
- `createChallenge(bytes32, string, uint256, uint256)`: Create challenge (owner only)

### NeroFitnessV2 Contract

#### Read Functions
- `users(address)`: User profile data
- `getUserWorkouts(address)`: User workout history
- `getChallenge(bytes32)`: Challenge details
- `getLeaderboard()`: Top 10 users
- `getUserChallengeProgress(address, bytes32)`: Challenge progress

#### Write Functions
- `registerUser(string)`: Register new user
- `logWorkout(string, uint256, uint256)`: Log workout session
- `joinChallenge(bytes32)`: Join a challenge
- `completeChallenge(bytes32, string)`: Complete challenge
- `updateChallengeProgress(bytes32, uint256)`: Update progress

## Security Considerations

1. **Access Control**: Only authorized distributors can mint rewards
2. **Reentrancy Protection**: All external calls are protected
3. **Pausable**: Emergency pause functionality for critical issues
4. **Supply Cap**: Hard limit on maximum token supply
5. **Input Validation**: All user inputs are validated
6. **Overflow Protection**: Using OpenZeppelin's SafeMath (built into Solidity 0.8+)

## Gas Optimization

- Efficient data structures for minimal gas usage
- Batch operations where possible
- Optimized storage layout
- Event-based data retrieval for frontend

## Testing

The contracts include comprehensive test suites covering:
- Token functionality
- Challenge system
- Reward distribution
- Access control
- Edge cases and error conditions

Run tests with:
```bash
npm run test
```

For gas reporting:
```bash
REPORT_GAS=true npm run test
```

## Integration

### Frontend Integration

1. **Install ethers.js**:
   ```bash
   npm install ethers
   ```

2. **Contract interaction example**:
   ```javascript
   import { ethers } from 'ethers';
   import FITTokenABI from './abis/FITToken.json';
   
   const provider = new ethers.providers.Web3Provider(window.ethereum);
   const signer = provider.getSigner();
   const fitToken = new ethers.Contract(FIT_TOKEN_ADDRESS, FITTokenABI, signer);
   
   // Get user balance
   const balance = await fitToken.balanceOf(userAddress);
   
   // Complete challenge (if authorized)
   await fitToken.completeChallenge(userAddress, challengeId, proof);
   ```

### Backend Integration

Use the contracts for:
- Reward distribution based on verified fitness activities
- Challenge creation and management
- User progress tracking
- Leaderboard updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## Roadmap

### Phase 1 (Current)
- ✅ Basic FIT token implementation
- ✅ Challenge system
- ✅ Reward distribution
- ✅ User tracking

### Phase 2 (Planned)
- [ ] NFT achievements
- [ ] Staking mechanisms
- [ ] Governance features
- [ ] Cross-chain compatibility

### Phase 3 (Future)
- [ ] DeFi integrations
- [ ] Marketplace features
- [ ] Advanced analytics
- [ ] Mobile app integration 