const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FITToken", function () {
  let FITToken, fitToken, owner, addr1, addr2, addrs;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy FIT Token
    FITToken = await ethers.getContractFactory("FITToken");
    fitToken = await FITToken.deploy(
      "NeroFit Token",
      "FIT",
      ethers.parseEther("10000000") // 10 million tokens
    );
    await fitToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      expect(await fitToken.name()).to.equal("NeroFit Token");
      expect(await fitToken.symbol()).to.equal("FIT");
    });

    it("Should set the right decimals", async function () {
      expect(await fitToken.decimals()).to.equal(18);
    });

    it("Should assign the total supply to the owner", async function () {
      const ownerBalance = await fitToken.balanceOf(owner.address);
      expect(await fitToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the max supply correctly", async function () {
      const maxSupply = await fitToken.MAX_SUPPLY();
      expect(maxSupply).to.equal(ethers.parseEther("100000000")); // 100 million
    });

    it("Should set up initial challenge rewards", async function () {
      const walkReward = await fitToken.challengeRewards("walk_1km");
      expect(walkReward).to.equal(ethers.parseEther("10"));
    });

    it("Should add owner as reward distributor", async function () {
      expect(await fitToken.rewardDistributors(owner.address)).to.be.true;
    });
  });

  describe("Challenge Management", function () {
    it("Should create a new challenge", async function () {
      const challengeId = ethers.keccak256(ethers.toUtf8Bytes("test_challenge"));
      
      await expect(fitToken.createChallenge(
        challengeId,
        "test_challenge",
        ethers.parseEther("25"),
        2
      )).to.emit(fitToken, "ChallengeCreated")
        .withArgs(challengeId, "test_challenge", ethers.parseEther("25"));

      const challenge = await fitToken.getChallenge(challengeId);
      expect(challenge.challengeType).to.equal("test_challenge");
      expect(challenge.reward).to.equal(ethers.parseEther("25"));
      expect(challenge.difficulty).to.equal(2);
      expect(challenge.isActive).to.be.true;
    });

    it("Should not allow non-owner to create challenges", async function () {
      const challengeId = ethers.keccak256(ethers.toUtf8Bytes("test_challenge"));
      
      await expect(fitToken.connect(addr1).createChallenge(
        challengeId,
        "test_challenge",
        ethers.parseEther("25"),
        2
      )).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should not create challenge with invalid difficulty", async function () {
      const challengeId = ethers.keccak256(ethers.toUtf8Bytes("test_challenge"));
      
      await expect(fitToken.createChallenge(
        challengeId,
        "test_challenge",
        ethers.parseEther("25"),
        4 // Invalid difficulty
      )).to.be.revertedWith("Invalid difficulty level");
    });
  });

  describe("Challenge Completion", function () {
    let challengeId;

    beforeEach(async function () {
      challengeId = ethers.keccak256(ethers.toUtf8Bytes("test_challenge"));
      await fitToken.createChallenge(
        challengeId,
        "test_challenge",
        ethers.parseEther("25"),
        2
      );
    });

    it("Should complete a challenge and reward user", async function () {
      const initialBalance = await fitToken.balanceOf(addr1.address);
      
      await expect(fitToken.completeChallenge(
        addr1.address,
        challengeId,
        "proof_of_completion"
      )).to.emit(fitToken, "ChallengeCompleted")
        .withArgs(addr1.address, challengeId, ethers.parseEther("25"));

      const finalBalance = await fitToken.balanceOf(addr1.address);
      expect(finalBalance - initialBalance).to.equal(ethers.parseEther("25"));

      // Check if challenge is marked as completed
      const completed = await fitToken.hasUserCompletedChallenge(addr1.address, challengeId);
      expect(completed).to.be.true;
    });

    it("Should not allow non-distributor to complete challenges", async function () {
      await expect(fitToken.connect(addr1).completeChallenge(
        addr1.address,
        challengeId,
        "proof_of_completion"
      )).to.be.revertedWith("Not authorized to distribute rewards");
    });

    it("Should not allow completing the same challenge twice", async function () {
      await fitToken.completeChallenge(addr1.address, challengeId, "proof_of_completion");
      
      await expect(fitToken.completeChallenge(
        addr1.address,
        challengeId,
        "proof_of_completion"
      )).to.be.revertedWith("Challenge already completed by user");
    });
  });

  describe("Reward Distribution", function () {
    it("Should reward user for general activities", async function () {
      const amount = ethers.parseEther("50");
      const initialBalance = await fitToken.balanceOf(addr1.address);
      
      await expect(fitToken.rewardUser(
        addr1.address,
        amount,
        "daily_workout"
      )).to.emit(fitToken, "TokensRewarded")
        .withArgs(addr1.address, amount, "daily_workout");

      const finalBalance = await fitToken.balanceOf(addr1.address);
      expect(finalBalance - initialBalance).to.equal(amount);
    });

    it("Should update user fitness data when rewarding", async function () {
      const amount = ethers.parseEther("50");
      
      await fitToken.rewardUser(addr1.address, amount, "daily_workout");
      
      const userData = await fitToken.getUserFitnessData(addr1.address);
      expect(userData.totalTokensEarned).to.equal(amount);
      expect(userData.isActive).to.be.true;
    });
  });

  describe("Streak System", function () {
    it("Should update user streak", async function () {
      await fitToken.updateStreak(addr1.address, 5);
      
      const userData = await fitToken.getUserFitnessData(addr1.address);
      expect(userData.currentStreak).to.equal(5);
      expect(userData.longestStreak).to.equal(5);
    });

    it("Should update longest streak when current exceeds it", async function () {
      await fitToken.updateStreak(addr1.address, 3);
      await fitToken.updateStreak(addr1.address, 7);
      
      const userData = await fitToken.getUserFitnessData(addr1.address);
      expect(userData.currentStreak).to.equal(7);
      expect(userData.longestStreak).to.equal(7);
    });

    it("Should not decrease longest streak", async function () {
      await fitToken.updateStreak(addr1.address, 10);
      await fitToken.updateStreak(addr1.address, 5);
      
      const userData = await fitToken.getUserFitnessData(addr1.address);
      expect(userData.currentStreak).to.equal(5);
      expect(userData.longestStreak).to.equal(10);
    });
  });

  describe("Reward Distributor Management", function () {
    it("Should add reward distributor", async function () {
      await expect(fitToken.addRewardDistributor(addr1.address))
        .to.emit(fitToken, "RewardDistributorAdded")
        .withArgs(addr1.address);
      
      expect(await fitToken.rewardDistributors(addr1.address)).to.be.true;
    });

    it("Should remove reward distributor", async function () {
      await fitToken.addRewardDistributor(addr1.address);
      
      await expect(fitToken.removeRewardDistributor(addr1.address))
        .to.emit(fitToken, "RewardDistributorRemoved")
        .withArgs(addr1.address);
      
      expect(await fitToken.rewardDistributors(addr1.address)).to.be.false;
    });

    it("Should not allow non-owner to manage distributors", async function () {
      await expect(fitToken.connect(addr1).addRewardDistributor(addr2.address))
        .to.be.revertedWith("Ownable: caller is not the owner");
    });
  });

  describe("Pausable Functionality", function () {
    it("Should pause and unpause token transfers", async function () {
      // Transfer some tokens first
      await fitToken.transfer(addr1.address, ethers.parseEther("100"));
      
      // Pause the contract
      await fitToken.pause();
      
      // Should not be able to transfer when paused
      await expect(fitToken.connect(addr1).transfer(addr2.address, ethers.parseEther("50")))
        .to.be.revertedWith("Pausable: paused");
      
      // Unpause the contract
      await fitToken.unpause();
      
      // Should be able to transfer again
      await expect(fitToken.connect(addr1).transfer(addr2.address, ethers.parseEther("50")))
        .to.not.be.reverted;
    });
  });

  describe("Supply Management", function () {
    it("Should not exceed maximum supply", async function () {
      const maxSupply = await fitToken.MAX_SUPPLY();
      const currentSupply = await fitToken.totalSupply();
      const excessAmount = maxSupply - currentSupply + ethers.parseEther("1");
      
      await expect(fitToken.rewardUser(addr1.address, excessAmount, "test"))
        .to.be.revertedWith("Would exceed maximum supply");
    });
  });

  describe("Token Burning", function () {
    it("Should allow token burning", async function () {
      // Transfer some tokens to addr1
      await fitToken.transfer(addr1.address, ethers.parseEther("100"));
      
      const initialSupply = await fitToken.totalSupply();
      const burnAmount = ethers.parseEther("50");
      
      await fitToken.connect(addr1).burn(burnAmount);
      
      const finalSupply = await fitToken.totalSupply();
      expect(initialSupply - finalSupply).to.equal(burnAmount);
    });
  });
}); 