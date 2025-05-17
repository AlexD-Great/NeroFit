require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const connectWalletRoute = require('./routes/connect-wallet');
const userDataRoute = require('./routes/user-data');
const claimTokensRoute = require('./routes/claim-tokens');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*', // Update this with your Vercel app URL in production
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Routes
app.use('/api/connect-wallet', connectWalletRoute);
app.use('/api/user-data', userDataRoute);
app.use('/api/claim-tokens', claimTokensRoute);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Connected to Nero testnet at ${process.env.NERO_TESTNET_RPC}`);
  console.log(`Using Paymaster at address ${process.env.PAYMASTER_ADDRESS}`);
});


app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Nero Fitness API is running',
    endpoints: {
      connectWallet: '/api/connect-wallet',
      userData: '/api/user-data/:walletAddress',
      claimTokens: '/api/claim-tokens'
    },
    documentation: 'https://github.com/AlexD-Great/nero_backend'
  });
});
