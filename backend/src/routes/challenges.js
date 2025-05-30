const express = require('express');
const router = express.Router();

// Mock database for challenges (in production, this would be a real database)
let challengeData = {
  // User wallet address -> challenge data
};

// Claim FIT tokens for a completed challenge
router.post('/claim-tokens', async (req, res) => {
  try {
    const { walletAddress, challengeId, reward } = req.body;

    if (!walletAddress || !challengeId || !reward) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: walletAddress, challengeId, reward'
      });
    }

    // Simulate validation - check if challenge is completed and claimable
    // In production, this would check the database and smart contract
    
    // Simulate smart contract interaction delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful token claim
    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
    
    // Update challenge status (in production, this would update the database)
    if (!challengeData[walletAddress]) {
      challengeData[walletAddress] = {};
    }
    challengeData[walletAddress][challengeId] = {
      claimed: true,
      claimedAt: new Date().toISOString(),
      transactionHash
    };

    res.json({
      success: true,
      message: `Successfully claimed ${reward} FIT tokens`,
      data: {
        challengeId,
        reward,
        transactionHash,
        claimedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error claiming tokens:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to claim tokens',
      error: error.message
    });
  }
});

// Get challenge claim status for a user
router.get('/claim-status/:walletAddress', (req, res) => {
  try {
    const { walletAddress } = req.params;
    const userChallenges = challengeData[walletAddress] || {};

    res.json({
      success: true,
      data: userChallenges
    });

  } catch (error) {
    console.error('Error getting claim status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get claim status',
      error: error.message
    });
  }
});

module.exports = router; 