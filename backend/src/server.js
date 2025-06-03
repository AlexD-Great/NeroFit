require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import routes
const connectWalletRoute = require('./routes/connect-wallet');
const userDataRoute = require('./routes/user-data');
const claimTokensRoute = require('./routes/claim-tokens');
const challengesRoute = require('./routes/challenges');

const app = express();
// Ensure PORT is properly read from environment
const PORT = parseInt(process.env.PORT) || 3001;
console.log(`Using PORT: ${PORT} (from env: ${process.env.PORT})`);

// Middleware
app.use(cors({
  origin: [
    'https://nero-fit-alexs-projects-d94d3fc6.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3002',
    // Allow any Vercel deployment
    /^https:\/\/.*\.vercel\.app$/,
    // Allow any Render deployment
    /^https:\/\/.*\.onrender\.com$/,
    // Allow any Netlify deployment
    /^https:\/\/.*\.netlify\.app$/
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());

// Routes
app.use('/api/connect-wallet', connectWalletRoute);
app.use('/api/user-data', userDataRoute);
app.use('/api/claim-tokens', claimTokensRoute);
app.use('/api/challenges', challengesRoute);

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
