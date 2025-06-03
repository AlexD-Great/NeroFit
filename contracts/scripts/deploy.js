const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  // Contract deployment parameters
  const TOKEN_NAME = "NeroFit Token";
  const TOKEN_SYMBOL = "FIT";
  const INITIAL_SUPPLY = ethers.parseEther("10000000"); // 10 million tokens

  console.log("\n=== Deploying FIT Token ===");
  console.log("Token Name:", TOKEN_NAME);
  console.log("Token Symbol:", TOKEN_SYMBOL);
  console.log("Initial Supply:", ethers.formatEther(INITIAL_SUPPLY), "FIT");

  // Deploy FIT Token
  const FITToken = await ethers.getContractFactory("FITToken");
  const fitToken = await FITToken.deploy(TOKEN_NAME, TOKEN_SYMBOL, INITIAL_SUPPLY);
  
  await fitToken.waitForDeployment();
  const fitTokenAddress = await fitToken.getAddress();

  console.log("FIT Token deployed to:", fitTokenAddress);

  // Verify deployment
  console.log("\n=== Verifying Deployment ===");
  const name = await fitToken.name();
  const symbol = await fitToken.symbol();
  const decimals = await fitToken.decimals();
  const totalSupply = await fitToken.totalSupply();
  const maxSupply = await fitToken.MAX_SUPPLY();
  const ownerBalance = await fitToken.balanceOf(deployer.address);

  console.log("Token Name:", name);
  console.log("Token Symbol:", symbol);
  console.log("Decimals:", decimals.toString());
  console.log("Total Supply:", ethers.formatEther(totalSupply), "FIT");
  console.log("Max Supply:", ethers.formatEther(maxSupply), "FIT");
  console.log("Owner Balance:", ethers.formatEther(ownerBalance), "FIT");

  // Test some challenge rewards
  console.log("\n=== Challenge Rewards ===");
  const walkReward = await fitToken.challengeRewards("walk_1km");
  const runReward = await fitToken.challengeRewards("run_3km");
  const workoutReward = await fitToken.challengeRewards("workout_30min");
  
  console.log("Walk 1km reward:", ethers.formatEther(walkReward), "FIT");
  console.log("Run 3km reward:", ethers.formatEther(runReward), "FIT");
  console.log("30min workout reward:", ethers.formatEther(workoutReward), "FIT");

  // Deploy the updated NeroFitness contract that integrates with FIT token
  console.log("\n=== Deploying NeroFitness Contract ===");
  const NeroFitness = await ethers.getContractFactory("NeroFitnessV2");
  const neroFitness = await NeroFitness.deploy(fitTokenAddress);
  
  await neroFitness.waitForDeployment();
  const neroFitnessAddress = await neroFitness.getAddress();

  console.log("NeroFitness V2 deployed to:", neroFitnessAddress);

  // Add NeroFitness contract as reward distributor
  console.log("\n=== Setting up Permissions ===");
  const addDistributorTx = await fitToken.addRewardDistributor(neroFitnessAddress);
  await addDistributorTx.wait();
  console.log("Added NeroFitness contract as reward distributor");

  // Save deployment info
  const deploymentInfo = {
    network: await ethers.provider.getNetwork(),
    deployer: deployer.address,
    contracts: {
      FITToken: {
        address: fitTokenAddress,
        name: TOKEN_NAME,
        symbol: TOKEN_SYMBOL,
        initialSupply: ethers.formatEther(INITIAL_SUPPLY)
      },
      NeroFitnessV2: {
        address: neroFitnessAddress,
        fitTokenAddress: fitTokenAddress
      }
    },
    timestamp: new Date().toISOString()
  };

  console.log("\n=== Deployment Summary ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Save to file
  const fs = require("fs");
  const path = require("path");
  
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  const networkName = (await ethers.provider.getNetwork()).name;
  const filename = `${networkName}-${Date.now()}.json`;
  const filepath = path.join(deploymentsDir, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\nDeployment info saved to: ${filepath}`);

  console.log("\n=== Next Steps ===");
  console.log("1. Verify contracts on Etherscan (if on testnet/mainnet):");
  console.log(`   npx hardhat verify --network <network> ${fitTokenAddress} "${TOKEN_NAME}" "${TOKEN_SYMBOL}" "${INITIAL_SUPPLY}"`);
  console.log(`   npx hardhat verify --network <network> ${neroFitnessAddress} "${fitTokenAddress}"`);
  console.log("\n2. Update frontend with contract addresses");
  console.log("\n3. Test contract functionality");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 