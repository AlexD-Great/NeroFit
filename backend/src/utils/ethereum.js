const { ethers } = require('ethers');

// Initialize provider
const provider = new ethers.providers.JsonRpcProvider(process.env.NERO_TESTNET_RPC);

// ABI for the fitness contract (simplified example)
const FITNESS_CONTRACT_ABI = [
  "function registerUser(address user) external",
  "function claimTokens(address user) external",
  "function getUserData(address user) external view returns (uint256 fitTokens, bool challengeCompleted)"
];

// Create contract instance
const getContract = () => {
  return new ethers.Contract(
    process.env.FITNESS_CONTRACT_ADDRESS,
    FITNESS_CONTRACT_ABI,
    provider
  );
};

// Verify signature
const verifySignature = (message, signature, expectedAddress) => {
  try {
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
};

module.exports = {
  provider,
  getContract,
  verifySignature
};
