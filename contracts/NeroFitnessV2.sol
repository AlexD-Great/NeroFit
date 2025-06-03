// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./FITToken.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title NeroFitnessV2
 * @dev Enhanced fitness tracking contract integrated with FIT token rewards
 */
contract NeroFitnessV2 is ReentrancyGuard, Ownable, Pausable {
    
    FITToken public fitToken;
    
    struct User {
        string username;
        bool isRegistered;
        uint256 fitnessPoints;
        uint256 totalChallengesCompleted;
        uint256 currentStreak;
        uint256 longestStreak;
        uint256 lastActivityTimestamp;
        uint256 level;
        uint256 experience;
    }
    
    struct WorkoutSession {
        uint256 timestamp;
        string workoutType;
        uint256 duration; // in minutes
        uint256 caloriesBurned;
        uint256 fitTokensEarned;
        bool verified;
    }
    
    struct Challenge {
        bytes32 id;
        string name;
        string description;
        string challengeType;
        uint256 targetValue;
        uint256 reward;
        uint256 difficulty;
        uint256 timeLimit; // in seconds
        bool isActive;
        uint256 participantCount;
    }
    
    mapping(address => User) public users;
    mapping(address => WorkoutSession[]) public userWorkouts;
    mapping(bytes32 => Challenge) public challenges;
    mapping(address => mapping(bytes32 => bool)) public userChallengeParticipation;
    mapping(address => mapping(bytes32 => bool)) public userChallengeCompletion;
    mapping(address => mapping(bytes32 => uint256)) public userChallengeProgress;
    
    // Leaderboard tracking
    address[] public leaderboardUsers;
    mapping(address => uint256) public userRanking;
    
    // Events
    event UserRegistered(address indexed userAddress, string username);
    event WorkoutLogged(address indexed user, string workoutType, uint256 duration, uint256 fitTokensEarned);
    event ChallengeCreated(bytes32 indexed challengeId, string name, uint256 reward);
    event ChallengeJoined(address indexed user, bytes32 indexed challengeId);
    event ChallengeCompleted(address indexed user, bytes32 indexed challengeId, uint256 reward);
    event StreakUpdated(address indexed user, uint256 newStreak);
    event LevelUp(address indexed user, uint256 newLevel);
    event FitnessPointsAdded(address indexed user, uint256 points);
    
    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }
    
    modifier validChallenge(bytes32 challengeId) {
        require(challenges[challengeId].isActive, "Challenge not active");
        _;
    }
    
    constructor(address _fitTokenAddress) {
        require(_fitTokenAddress != address(0), "Invalid FIT token address");
        fitToken = FITToken(_fitTokenAddress);
        
        // Create some initial challenges
        _createInitialChallenges();
    }
    
    /**
     * @dev Register a new user
     */
    function registerUser(string memory _username) external {
        require(!users[msg.sender].isRegistered, "User already registered");
        require(bytes(_username).length > 0, "Username cannot be empty");
        
        users[msg.sender] = User({
            username: _username,
            isRegistered: true,
            fitnessPoints: 0,
            totalChallengesCompleted: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastActivityTimestamp: block.timestamp,
            level: 1,
            experience: 0
        });
        
        // Add to leaderboard
        leaderboardUsers.push(msg.sender);
        userRanking[msg.sender] = leaderboardUsers.length;
        
        emit UserRegistered(msg.sender, _username);
    }
    
    /**
     * @dev Log a workout session
     */
    function logWorkout(
        string memory workoutType,
        uint256 duration,
        uint256 caloriesBurned
    ) external onlyRegistered whenNotPaused nonReentrant {
        require(duration > 0, "Duration must be greater than 0");
        
        // Calculate FIT token reward based on workout
        uint256 baseReward = _calculateWorkoutReward(workoutType, duration, caloriesBurned);
        uint256 streakBonus = _calculateStreakBonus(msg.sender);
        uint256 totalReward = baseReward + (baseReward * streakBonus / 100);
        
        // Log workout
        userWorkouts[msg.sender].push(WorkoutSession({
            timestamp: block.timestamp,
            workoutType: workoutType,
            duration: duration,
            caloriesBurned: caloriesBurned,
            fitTokensEarned: totalReward,
            verified: true
        }));
        
        // Update user data
        _updateUserActivity(msg.sender, duration * 10); // 10 points per minute
        
        // Reward FIT tokens
        if (totalReward > 0) {
            fitToken.rewardUser(msg.sender, totalReward, workoutType);
        }
        
        emit WorkoutLogged(msg.sender, workoutType, duration, totalReward);
    }
    
    /**
     * @dev Create a new challenge
     */
    function createChallenge(
        string memory name,
        string memory description,
        string memory challengeType,
        uint256 targetValue,
        uint256 reward,
        uint256 difficulty,
        uint256 timeLimit
    ) external onlyOwner {
        bytes32 challengeId = keccak256(abi.encodePacked(name, block.timestamp));
        
        challenges[challengeId] = Challenge({
            id: challengeId,
            name: name,
            description: description,
            challengeType: challengeType,
            targetValue: targetValue,
            reward: reward,
            difficulty: difficulty,
            timeLimit: timeLimit,
            isActive: true,
            participantCount: 0
        });
        
        // Create challenge in FIT token contract
        fitToken.createChallenge(challengeId, challengeType, reward, difficulty);
        
        emit ChallengeCreated(challengeId, name, reward);
    }
    
    /**
     * @dev Join a challenge
     */
    function joinChallenge(bytes32 challengeId) external onlyRegistered validChallenge(challengeId) {
        require(!userChallengeParticipation[msg.sender][challengeId], "Already participating in challenge");
        
        userChallengeParticipation[msg.sender][challengeId] = true;
        userChallengeProgress[msg.sender][challengeId] = 0;
        challenges[challengeId].participantCount++;
        
        emit ChallengeJoined(msg.sender, challengeId);
    }
    
    /**
     * @dev Complete a challenge
     */
    function completeChallenge(
        bytes32 challengeId,
        string memory proof
    ) external onlyRegistered validChallenge(challengeId) nonReentrant {
        require(userChallengeParticipation[msg.sender][challengeId], "Not participating in challenge");
        require(!userChallengeCompletion[msg.sender][challengeId], "Challenge already completed");
        
        Challenge memory challenge = challenges[challengeId];
        
        // Mark as completed
        userChallengeCompletion[msg.sender][challengeId] = true;
        userChallengeProgress[msg.sender][challengeId] = challenge.targetValue;
        
        // Update user stats
        users[msg.sender].totalChallengesCompleted++;
        _updateUserActivity(msg.sender, challenge.difficulty * 50); // Bonus points based on difficulty
        
        // Complete challenge in FIT token contract (this will mint rewards)
        fitToken.completeChallenge(msg.sender, challengeId, proof);
        
        emit ChallengeCompleted(msg.sender, challengeId, challenge.reward);
    }
    
    /**
     * @dev Update challenge progress
     */
    function updateChallengeProgress(
        bytes32 challengeId,
        uint256 progress
    ) external onlyRegistered validChallenge(challengeId) {
        require(userChallengeParticipation[msg.sender][challengeId], "Not participating in challenge");
        require(!userChallengeCompletion[msg.sender][challengeId], "Challenge already completed");
        
        userChallengeProgress[msg.sender][challengeId] = progress;
        
        // Auto-complete if target reached
        if (progress >= challenges[challengeId].targetValue) {
            completeChallenge(challengeId, "Auto-completed");
        }
    }
    
    /**
     * @dev Calculate workout reward
     */
    function _calculateWorkoutReward(
        string memory workoutType,
        uint256 duration,
        uint256 caloriesBurned
    ) internal pure returns (uint256) {
        // Base reward calculation
        uint256 baseReward = duration * 1e18; // 1 FIT per minute
        
        // Bonus for calories burned
        uint256 calorieBonus = (caloriesBurned * 1e18) / 10; // 0.1 FIT per calorie
        
        // Workout type multiplier
        uint256 multiplier = 100; // 1.0x default
        
        if (keccak256(abi.encodePacked(workoutType)) == keccak256(abi.encodePacked("strength"))) {
            multiplier = 150; // 1.5x for strength training
        } else if (keccak256(abi.encodePacked(workoutType)) == keccak256(abi.encodePacked("cardio"))) {
            multiplier = 120; // 1.2x for cardio
        } else if (keccak256(abi.encodePacked(workoutType)) == keccak256(abi.encodePacked("yoga"))) {
            multiplier = 110; // 1.1x for yoga
        }
        
        return ((baseReward + calorieBonus) * multiplier) / 100;
    }
    
    /**
     * @dev Calculate streak bonus
     */
    function _calculateStreakBonus(address user) internal view returns (uint256) {
        uint256 streak = users[user].currentStreak;
        if (streak == 0) return 0;
        
        // 5% bonus per day, capped at 50%
        uint256 bonus = streak * 5;
        return bonus > 50 ? 50 : bonus;
    }
    
    /**
     * @dev Update user activity and level
     */
    function _updateUserActivity(address user, uint256 points) internal {
        User storage userData = users[user];
        userData.fitnessPoints += points;
        userData.experience += points;
        userData.lastActivityTimestamp = block.timestamp;
        
        // Check for level up (every 1000 experience points)
        uint256 newLevel = (userData.experience / 1000) + 1;
        if (newLevel > userData.level) {
            userData.level = newLevel;
            emit LevelUp(user, newLevel);
        }
        
        emit FitnessPointsAdded(user, points);
    }
    
    /**
     * @dev Create initial challenges
     */
    function _createInitialChallenges() internal {
        // Walk 1km challenge
        bytes32 walkId = keccak256(abi.encodePacked("walk_1km", block.timestamp));
        challenges[walkId] = Challenge({
            id: walkId,
            name: "Walk 1km",
            description: "Take a 1 kilometer walk",
            challengeType: "walk_1km",
            targetValue: 1000, // 1000 meters
            reward: 10 * 1e18, // 10 FIT tokens
            difficulty: 1,
            timeLimit: 86400, // 24 hours
            isActive: true,
            participantCount: 0
        });
        
        // 30-minute workout challenge
        bytes32 workoutId = keccak256(abi.encodePacked("workout_30min", block.timestamp));
        challenges[workoutId] = Challenge({
            id: workoutId,
            name: "30-Minute Workout",
            description: "Complete a 30-minute strength training session",
            challengeType: "workout_30min",
            targetValue: 30, // 30 minutes
            reward: 30 * 1e18, // 30 FIT tokens
            difficulty: 2,
            timeLimit: 86400, // 24 hours
            isActive: true,
            participantCount: 0
        });
    }
    
    /**
     * @dev Get user's workout history
     */
    function getUserWorkouts(address user) external view returns (WorkoutSession[] memory) {
        return userWorkouts[user];
    }
    
    /**
     * @dev Get user's challenge progress
     */
    function getUserChallengeProgress(address user, bytes32 challengeId) external view returns (uint256) {
        return userChallengeProgress[user][challengeId];
    }
    
    /**
     * @dev Get challenge details
     */
    function getChallenge(bytes32 challengeId) external view returns (Challenge memory) {
        return challenges[challengeId];
    }
    
    /**
     * @dev Get leaderboard (top 10 users by fitness points)
     */
    function getLeaderboard() external view returns (address[] memory topUsers, uint256[] memory points) {
        uint256 length = leaderboardUsers.length > 10 ? 10 : leaderboardUsers.length;
        topUsers = new address[](length);
        points = new uint256[](length);
        
        // Simple sorting for top users (in production, use more efficient sorting)
        address[] memory sortedUsers = new address[](leaderboardUsers.length);
        for (uint256 i = 0; i < leaderboardUsers.length; i++) {
            sortedUsers[i] = leaderboardUsers[i];
        }
        
        // Bubble sort by fitness points (descending)
        for (uint256 i = 0; i < sortedUsers.length - 1; i++) {
            for (uint256 j = 0; j < sortedUsers.length - i - 1; j++) {
                if (users[sortedUsers[j]].fitnessPoints < users[sortedUsers[j + 1]].fitnessPoints) {
                    address temp = sortedUsers[j];
                    sortedUsers[j] = sortedUsers[j + 1];
                    sortedUsers[j + 1] = temp;
                }
            }
        }
        
        for (uint256 i = 0; i < length; i++) {
            topUsers[i] = sortedUsers[i];
            points[i] = users[sortedUsers[i]].fitnessPoints;
        }
        
        return (topUsers, points);
    }
    
    /**
     * @dev Update user streak (called by backend/oracle)
     */
    function updateUserStreak(address user, uint256 newStreak) external onlyOwner {
        require(users[user].isRegistered, "User not registered");
        
        users[user].currentStreak = newStreak;
        if (newStreak > users[user].longestStreak) {
            users[user].longestStreak = newStreak;
        }
        
        // Update streak in FIT token contract
        fitToken.updateStreak(user, newStreak);
        
        emit StreakUpdated(user, newStreak);
    }
    
    /**
     * @dev Emergency pause
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get user fitness points
     */
    function getUserPoints() external view returns (uint256) {
        require(users[msg.sender].isRegistered, "User not registered");
        return users[msg.sender].fitnessPoints;
    }
} 