// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title FITToken
 * @dev ERC20 token for NeroFit platform with fitness challenge rewards
 */
contract FITToken is ERC20, ERC20Burnable, Pausable, Ownable, ReentrancyGuard {
    
    // Token decimals
    uint8 private constant DECIMALS = 18;
    
    // Maximum supply (100 million tokens)
    uint256 public constant MAX_SUPPLY = 100_000_000 * 10**DECIMALS;
    
    // Reward rates for different challenge types
    mapping(string => uint256) public challengeRewards;
    
    // Authorized reward distributors (backend services, oracles, etc.)
    mapping(address => bool) public rewardDistributors;
    
    // User fitness data
    struct UserFitnessData {
        uint256 totalChallengesCompleted;
        uint256 totalTokensEarned;
        uint256 currentStreak;
        uint256 longestStreak;
        uint256 lastActivityTimestamp;
        bool isActive;
    }
    
    mapping(address => UserFitnessData) public userFitnessData;
    
    // Challenge completion tracking
    struct Challenge {
        string challengeType;
        uint256 reward;
        uint256 difficulty; // 1 = Easy, 2 = Medium, 3 = Hard
        bool isActive;
    }
    
    mapping(bytes32 => Challenge) public challenges;
    mapping(address => mapping(bytes32 => bool)) public userChallengeCompleted;
    
    // Events
    event ChallengeCompleted(address indexed user, bytes32 indexed challengeId, uint256 reward);
    event RewardDistributorAdded(address indexed distributor);
    event RewardDistributorRemoved(address indexed distributor);
    event ChallengeCreated(bytes32 indexed challengeId, string challengeType, uint256 reward);
    event StreakUpdated(address indexed user, uint256 newStreak);
    event TokensRewarded(address indexed user, uint256 amount, string reason);
    
    // Modifiers
    modifier onlyRewardDistributor() {
        require(rewardDistributors[msg.sender] || msg.sender == owner(), "Not authorized to distribute rewards");
        _;
    }
    
    modifier validUser(address user) {
        require(user != address(0), "Invalid user address");
        _;
    }
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        require(initialSupply <= MAX_SUPPLY, "Initial supply exceeds maximum");
        
        // Mint initial supply to contract owner
        _mint(msg.sender, initialSupply);
        
        // Set up initial challenge rewards (in wei, 18 decimals)
        challengeRewards["walk_1km"] = 10 * 10**DECIMALS;
        challengeRewards["run_3km"] = 25 * 10**DECIMALS;
        challengeRewards["workout_30min"] = 30 * 10**DECIMALS;
        challengeRewards["meditation_15min"] = 12 * 10**DECIMALS;
        challengeRewards["steps_10000"] = 20 * 10**DECIMALS;
        challengeRewards["hydration_8glasses"] = 15 * 10**DECIMALS;
        challengeRewards["yoga_20min"] = 16 * 10**DECIMALS;
        challengeRewards["pushups_50"] = 18 * 10**DECIMALS;
        challengeRewards["bike_5km"] = 22 * 10**DECIMALS;
        challengeRewards["marathon_training"] = 50 * 10**DECIMALS;
        
        // Add contract owner as initial reward distributor
        rewardDistributors[msg.sender] = true;
    }
    
    /**
     * @dev Returns the number of decimals used to get its user representation
     */
    function decimals() public pure override returns (uint8) {
        return DECIMALS;
    }
    
    /**
     * @dev Creates a new challenge
     */
    function createChallenge(
        bytes32 challengeId,
        string memory challengeType,
        uint256 reward,
        uint256 difficulty
    ) external onlyOwner {
        require(difficulty >= 1 && difficulty <= 3, "Invalid difficulty level");
        require(reward > 0, "Reward must be greater than 0");
        require(!challenges[challengeId].isActive, "Challenge already exists");
        
        challenges[challengeId] = Challenge({
            challengeType: challengeType,
            reward: reward,
            difficulty: difficulty,
            isActive: true
        });
        
        emit ChallengeCreated(challengeId, challengeType, reward);
    }
    
    /**
     * @dev Complete a challenge and reward user
     */
    function completeChallenge(
        address user,
        bytes32 challengeId,
        string memory proof
    ) external onlyRewardDistributor validUser(user) nonReentrant {
        require(challenges[challengeId].isActive, "Challenge not active");
        require(!userChallengeCompleted[user][challengeId], "Challenge already completed by user");
        
        Challenge memory challenge = challenges[challengeId];
        uint256 reward = challenge.reward;
        
        // Apply streak bonus (5% per day, max 50%)
        uint256 streakBonus = _calculateStreakBonus(user);
        uint256 totalReward = reward + (reward * streakBonus / 100);
        
        // Ensure we don't exceed max supply
        require(totalSupply() + totalReward <= MAX_SUPPLY, "Would exceed maximum supply");
        
        // Mark challenge as completed
        userChallengeCompleted[user][challengeId] = true;
        
        // Update user fitness data
        _updateUserFitnessData(user, totalReward);
        
        // Mint tokens to user
        _mint(user, totalReward);
        
        emit ChallengeCompleted(user, challengeId, totalReward);
        emit TokensRewarded(user, totalReward, challenge.challengeType);
    }
    
    /**
     * @dev Reward user for general fitness activities
     */
    function rewardUser(
        address user,
        uint256 amount,
        string memory reason
    ) external onlyRewardDistributor validUser(user) nonReentrant {
        require(amount > 0, "Reward amount must be greater than 0");
        require(totalSupply() + amount <= MAX_SUPPLY, "Would exceed maximum supply");
        
        _mint(user, amount);
        
        // Update user data
        userFitnessData[user].totalTokensEarned += amount;
        userFitnessData[user].lastActivityTimestamp = block.timestamp;
        userFitnessData[user].isActive = true;
        
        emit TokensRewarded(user, amount, reason);
    }
    
    /**
     * @dev Update user streak
     */
    function updateStreak(address user, uint256 newStreak) external onlyRewardDistributor validUser(user) {
        UserFitnessData storage userData = userFitnessData[user];
        userData.currentStreak = newStreak;
        
        if (newStreak > userData.longestStreak) {
            userData.longestStreak = newStreak;
        }
        
        emit StreakUpdated(user, newStreak);
    }
    
    /**
     * @dev Calculate streak bonus percentage
     */
    function _calculateStreakBonus(address user) internal view returns (uint256) {
        uint256 streak = userFitnessData[user].currentStreak;
        if (streak == 0) return 0;
        
        // 5% bonus per day, capped at 50%
        uint256 bonus = streak * 5;
        return bonus > 50 ? 50 : bonus;
    }
    
    /**
     * @dev Update user fitness data after challenge completion
     */
    function _updateUserFitnessData(address user, uint256 reward) internal {
        UserFitnessData storage userData = userFitnessData[user];
        userData.totalChallengesCompleted += 1;
        userData.totalTokensEarned += reward;
        userData.lastActivityTimestamp = block.timestamp;
        userData.isActive = true;
        
        // Update streak logic would be handled by backend/oracle
    }
    
    /**
     * @dev Add reward distributor
     */
    function addRewardDistributor(address distributor) external onlyOwner {
        require(distributor != address(0), "Invalid distributor address");
        rewardDistributors[distributor] = true;
        emit RewardDistributorAdded(distributor);
    }
    
    /**
     * @dev Remove reward distributor
     */
    function removeRewardDistributor(address distributor) external onlyOwner {
        rewardDistributors[distributor] = false;
        emit RewardDistributorRemoved(distributor);
    }
    
    /**
     * @dev Update challenge reward amount
     */
    function updateChallengeReward(string memory challengeType, uint256 newReward) external onlyOwner {
        require(newReward > 0, "Reward must be greater than 0");
        challengeRewards[challengeType] = newReward;
    }
    
    /**
     * @dev Get user fitness data
     */
    function getUserFitnessData(address user) external view returns (
        uint256 totalChallengesCompleted,
        uint256 totalTokensEarned,
        uint256 currentStreak,
        uint256 longestStreak,
        uint256 lastActivityTimestamp,
        bool isActive
    ) {
        UserFitnessData memory userData = userFitnessData[user];
        return (
            userData.totalChallengesCompleted,
            userData.totalTokensEarned,
            userData.currentStreak,
            userData.longestStreak,
            userData.lastActivityTimestamp,
            userData.isActive
        );
    }
    
    /**
     * @dev Check if user has completed a specific challenge
     */
    function hasUserCompletedChallenge(address user, bytes32 challengeId) external view returns (bool) {
        return userChallengeCompleted[user][challengeId];
    }
    
    /**
     * @dev Get challenge details
     */
    function getChallenge(bytes32 challengeId) external view returns (
        string memory challengeType,
        uint256 reward,
        uint256 difficulty,
        bool isActive
    ) {
        Challenge memory challenge = challenges[challengeId];
        return (challenge.challengeType, challenge.reward, challenge.difficulty, challenge.isActive);
    }
    
    /**
     * @dev Pause token transfers (emergency function)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause token transfers
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Override _beforeTokenTransfer to include pausable functionality
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
    
    /**
     * @dev Emergency withdrawal function (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            payable(owner()).transfer(balance);
        }
    }
} 