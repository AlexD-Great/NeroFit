// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract NeroFitness {
    mapping(address => User) public users;
    
    struct User {
        string username;
        bool isRegistered;
        uint256 fitnessPoints;
    }
    
    event UserRegistered(address userAddress, string username);
    event PointsAdded(address userAddress, uint256 points);
    
    function registerUser(string memory _username) public {
        require(!users[msg.sender].isRegistered, "User already registered");
        users[msg.sender] = User(_username, true, 0);
        emit UserRegistered(msg.sender, _username);
    }
    
    function addFitnessPoints(uint256 _points) public {
        require(users[msg.sender].isRegistered, "User not registered");
        users[msg.sender].fitnessPoints += _points;
        emit PointsAdded(msg.sender, _points);
    }
    
    function getUserPoints() public view returns (uint256) {
        require(users[msg.sender].isRegistered, "User not registered");
        return users[msg.sender].fitnessPoints;
    }
}
