const axios = require('axios');
const { ethers } = require('ethers');
const { provider } = require('./ethereum');

// Function to create a gasless transaction using Type 0 Paymaster
async function createGaslessTransaction(userAddress, contractMethod, params) {
  try {
    // Create contract instance
    const contract = new ethers.Contract(
      process.env.FITNESS_CONTRACT_ADDRESS,
      [
        "function registerUser(address user) external",
        "function claimTokens(address user) external"
      ],
      provider
    );

    // Prepare the transaction data
    const data = contract.interface.encodeFunctionData(contractMethod, params);
    
    // Get the current nonce for the user address
    const nonce = await provider.getTransactionCount(userAddress);
    
    // Create transaction object - explicitly defining as Type 0 transaction
    const transaction = {
      type: 0, // Explicitly set transaction type to 0 (legacy transaction)
      to: process.env.FITNESS_CONTRACT_ADDRESS,
      data: data,
      from: userAddress,
      nonce: ethers.utils.hexlify(nonce),
      gasLimit: ethers.utils.hexlify(1000000),
      gasPrice: ethers.utils.hexlify(1000000000), // 1 gwei
      chainId: parseInt(process.env.NERO_CHAIN_ID),
    };

    // Request Paymaster to sponsor the transaction (Type 0)
    const paymasterResponse = await axios.post(
      `${process.env.PAYMASTER_API_URL}/sponsorTransaction`, 
      {
        transaction: transaction,
        userAddress: userAddress,
        paymasterAddress: process.env.PAYMASTER_ADDRESS,
        transactionType: 0 // Explicitly specify Type 0 transaction
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PAYMASTER_API_KEY}`
        }
      }
    );

    // Return the transaction data that MetaMask will need to sign
    return {
      transaction: transaction,
      sponsorData: paymasterResponse.data,
      paymaster: process.env.PAYMASTER_ADDRESS
    };
  } catch (error) {
    console.error('Error creating gasless transaction:', error);
    throw error;
  }
}

module.exports = {
  createGaslessTransaction
};
