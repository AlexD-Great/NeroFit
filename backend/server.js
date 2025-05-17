require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ethers = require('ethers');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Nero Paymaster API configuration from environment variables
const PAYMASTER_API_URL = process.env.PAYMASTER_API_URL;
const PAYMASTER_ADDRESS = process.env.PAYMASTER_ADDRESS;
const PAYMASTER_API_KEY = process.env.PAYMASTER_API_KEY;
const FITNESS_CONTRACT_ADDRESS = process.env.FITNESS_CONTRACT_ADDRESS;
const NERO_TESTNET_RPC = process.env.NERO_TESTNET_RPC;
const NERO_CHAIN_ID = parseInt(process.env.NERO_CHAIN_ID);

// Validate required environment variables
const requiredEnvVars = [
  'PAYMASTER_API_URL',
  'PAYMASTER_ADDRESS',
  'PAYMASTER_API_KEY',
  'FITNESS_CONTRACT_ADDRESS',
  'NERO_TESTNET_RPC',
  'NERO_CHAIN_ID',
  'FITNESS_CONTRACT_ABI',
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

 


// Connect to Nero testnet
const provider = new ethers.providers.JsonRpcProvider(NERO_TESTNET_RPC);
  // Function to create a gasless transaction using Type 0 Paymaster
  async function createGaslessTransaction(userAddress, contractMethod, params) {
    try {
      // Create contract instance
      const contract = new ethers.Contract(
        FITNESS_CONTRACT_ADDRESS,
        FITNESS_CONTRACT_ABI,
        provider
      );

      // Prepare the transaction data
      const data = contract.interface.encodeFunctionData(contractMethod, params);
    
      // Get the current nonce for the user address
      const nonce = await provider.getTransactionCount(userAddress);
    
      // Create transaction object - explicitly defining as Type 0 transaction
      const transaction = {
        type: 0, // Explicitly set transaction type to 0 (legacy transaction)
        to: FITNESS_CONTRACT_ADDRESS,
        data: data,
        from: userAddress,
        nonce: ethers.utils.hexlify(nonce),
        gasLimit: ethers.utils.hexlify(1000000),
        gasPrice: ethers.utils.hexlify(1000000000), // 1 gwei
        chainId: NERO_CHAIN_ID,
      };

      // Request Paymaster to sponsor the transaction (Type 0)
      const paymasterResponse = await axios.post(
        `${PAYMASTER_API_URL}/sponsorTransaction`, 
        {
          transaction: transaction,
          userAddress: userAddress,
          paymasterAddress: PAYMASTER_ADDRESS,
          transactionType: 0 // Explicitly specify Type 0 transaction
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${PAYMASTER_API_KEY}`
          }
        }
      );

      // Return the transaction data that MetaMask will need to sign
      return {
        transaction: transaction,
        sponsorData: paymasterResponse.data,
        paymaster: PAYMASTER_ADDRESS
      };
    } catch (error) {
      console.error('Error creating gasless transaction:', error);
      throw error;
    }
  }

  // API endpoint to connect wallet
  app.post('/api/connect-wallet', async (req, res) => {
    try {
      const { walletAddress } = req.body;
    
      // Verify wallet address format
      if (!ethers.utils.isAddress(walletAddress)) {
        return res.status(400).json({ error: 'Invalid wallet address' });
      }
    
      // Create gasless transaction to register user in the fitness contract
      const sponsoredTx = await createGaslessTransaction(
        walletAddress, 
        'registerUser', 
        [walletAddress]
      );
    
      res.json({ 
        success: true, 
        message: 'Wallet connected successfully',
        sponsoredTransaction: sponsoredTx
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // API endpoint to get user data
  app.get('/api/user-data/:walletAddress', async (req, res) => {
    try {
      const { walletAddress } = req.params;
    
      // Verify wallet address format
      if (!ethers.utils.isAddress(walletAddress)) {
        return res.status(400).json({ error: 'Invalid wallet address' });
      }
    
      // In a real implementation, you would query the fitness contract
      // For this example, we'll return mock data
      const mockData = {
        fitTokens: '10.5',
        challengeCompleted: true
      };
    
      res.json(mockData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // API endpoint to claim tokens
  app.post('/api/claim-tokens', async (req, res) => {
    try {
      const { walletAddress } = req.body;
    
      // Verify wallet address format
      if (!ethers.utils.isAddress(walletAddress)) {
        return res.status(400).json({ error: 'Invalid wallet address' });
      }
    
      // Create gasless transaction to claim tokens in the fitness contract
      const sponsoredTx = await createGaslessTransaction(
        walletAddress, 
        'claimTokens', 
        [walletAddress]
      );
    
      res.json({ 
        success: true, 
        message: 'Token claim initiated',
        sponsoredTransaction: sponsoredTx
      });
    } catch (error) {
      console.error('Error claiming tokens:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Connected to Nero testnet at ${NERO_TESTNET_RPC}`);
  console.log(`Using Paymaster at address ${PAYMASTER_ADDRESS}`);
});