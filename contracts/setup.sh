#!/bin/bash

# NeroFit Smart Contracts Setup Script

echo "🏋️ Setting up NeroFit Smart Contracts..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
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
EOL
    echo "✅ Created .env file - please update with your actual values"
else
    echo "✅ .env file already exists"
fi

# Compile contracts
echo "🔨 Compiling contracts..."
npm run compile

if [ $? -ne 0 ]; then
    echo "❌ Failed to compile contracts"
    exit 1
fi

echo "✅ Contracts compiled successfully"

# Run tests
echo "🧪 Running tests..."
npm run test

if [ $? -ne 0 ]; then
    echo "⚠️ Some tests failed - please check the output above"
else
    echo "✅ All tests passed"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update the .env file with your actual values"
echo "2. Deploy to testnet: npm run deploy:sepolia"
echo "3. Deploy to mainnet: npm run deploy:mainnet"
echo ""
echo "For more information, see the README.md file" 