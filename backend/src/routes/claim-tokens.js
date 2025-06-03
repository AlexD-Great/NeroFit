const express = require('express');
const router = express.Router();
const { createGaslessTransaction } = require('../utils/paymaster');
const { ethers } = require('ethers');

router.post('/', async (req, res) => {
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
    
    res.status(200).json({ 
      success: true, 
      message: 'Token claim initiated',
      sponsoredTransaction: sponsoredTx
    });
  } catch (error) {
    console.error('Error claiming tokens:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
