const express = require('express');
const router = express.Router();
const { getContract } = require('../utils/ethereum');
const { ethers } = require('ethers');

router.get('/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    if (!walletAddress || !ethers.utils.isAddress(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }
    
    // In a real implementation, you would query the fitness contract
    // For this example, we'll return mock data
    // const contract = getContract();
    // const userData = await contract.getUserData(walletAddress);
    
    // Mock data for demonstration
    const mockData = {
      fitTokens: '10.5',
      challengeCompleted: true
    };
    
    res.status(200).json(mockData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
