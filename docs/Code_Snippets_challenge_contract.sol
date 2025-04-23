pragma solidity ^0.8.0;

contract NeroFitChallenge {
    mapping(address => uint) public userProgress;
    uint public constant REWARD = 100; // FIT tokens for completing a challenge
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // User submits their progress (e.g., 5km run)
    function submitProgress(uint distance) public {
        userProgress[msg.sender] += distance;
        if (userProgress[msg.sender] >= 5) { // 5km challenge
            // In a real app, this would mint tokens or transfer them
            // For now, we just log the reward
            emit RewardEarned(msg.sender, REWARD);
        }
    }

    event RewardEarned(address user, uint reward);
}
