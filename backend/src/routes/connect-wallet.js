const express = require('express');
const router = express.Router();
const { verifySignature } = require('../utils/ethereum');
const { createGaslessTransaction } = require('../utils/paymaster');
const { ethers } = require('ethers');

router.post('/', async (req, res) => {
  try {
    const { walletAddress, signature, message } = req.body;
    
    // Verify wallet address format
    if (!ethers.utils.isAddress(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }
    
    // Verify signature if provided
    if (signature && message) {
      const isValid = verifySignature(message, signature, walletAddress);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid signature' });
      }
      console.log('Signature verified successfully for address:', walletAddress);
    } else {
      console.log('No signature provided, skipping verification');
    }
    
    // Create gasless transaction to register user in the fitness contract
    const sponsoredTx = await createGaslessTransaction(
      walletAddress, 
      'registerUser', 
      [walletAddress]
    );
    
    res.status(200).json({ 
      success: true, 
      message: 'Wallet connected successfully',
      sponsoredTransaction: sponsoredTx
    });
  } catch (error) {
    console.error('Error connecting wallet:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
