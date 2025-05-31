// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FitnessReward is Ownable, ReentrancyGuard, Pausable {

    
    // Struct to store challenge details
    struct Challenge {
        uint256 rewardAmount;
        string metaURI;
        address user;
        bool isComplete;
    }

    // State variables
    IERC20 public fitToken;
    mapping(address => bool) public hasCompletedChallenge;
    mapping(uint256 => Challenge) public challenges;
    Challenge public currentChallenge;
    uint256 public challengeCount;

    // Events
    event ChallengeCompleted(address indexed user, uint256 rewardAmount);
    event RewardUpdated(uint256 newAmount);
    event FITTokenUpdated(address newTokenAddress);
    event ChallengeUpdated(uint256 rewardAmount, string metaURI);

    // Constructor
    constructor(address _fitToken, uint256 _rewardAmount, string memory _metaURI) Ownable(msg.sender) {
        fitToken = IERC20(_fitToken);
        currentChallenge = Challenge(_rewardAmount, _metaURI);
    }

    // FR-01: Complete a challenge and reward the user
    function completeChallenge(address user) external nonReentrant whenNotPaused {
        require(!hasCompletedChallenge[user], "User has already completed the challenge");
        require(fitToken.transfer(user, currentChallenge.rewardAmount), "Token transfer failed");

        hasCompletedChallenge[user] = true;
        emit ChallengeCompleted(user, currentChallenge.rewardAmount);
    }

    // FR-02: Set the reward amount and metaURI for the challenge (only owner)
    function setChallenge(uint256 _rewardAmount, string memory _metaURI) external onlyOwner {
        challenges[challengeCount] = Challenge(_rewardAmount, _metaURI, msg.sender, false);
        emit ChallengeUpdated(_rewardAmount, _metaURI);
    }

    // FR-03: Update the FITToken address (only owner)
    function setFITToken(address _fitToken) external onlyOwner {
        fitToken = IERC20(_fitToken);
        emit FITTokenUpdated(_fitToken);
    }

    // FR-04: Check if a user has completed a challenge
    function hasCompleted(address user) external view returns (bool) {
        return hasCompletedChallenge[user];
    }

    // FR-05: Pause/unpause the contract (only owner)
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}