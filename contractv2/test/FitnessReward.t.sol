// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/NeroFit.sol";
import "../src/MockERC20.sol";

contract FitnessRewardTest is Test {
    FitnessReward public fitnessReward;
    IERC20 public fitToken;
    address public owner;
    address public user;

    function setUp() public {
        owner = address(this);
        user = address(0x123);

        // Deploy a mock FIT token
        fitToken = IERC20(address(new MockERC20()));

        // Deploy the FitnessReward contract
        fitnessReward = new FitnessReward(address(fitToken));

        
        uint256 rewardAmount = 20 ether; 
        MockERC20(address(fitToken)).mint(address(fitnessReward), rewardAmount);
    }

    function testSetFITToken() public {
        assertEq(address(fitnessReward.fitToken()), address(fitToken));
    }

    function testSetChallenge() public {
        fitnessReward.setChallenge(20 ether, "ipfs://newMetaURI");
        (uint256 rewardAmount, string memory metaURI, , ) = fitnessReward
            .challenges(0);
        assertEq(rewardAmount, 20 ether);
        assertEq(metaURI, "ipfs://newMetaURI");
    }

    function testCompleteChallenge() public {
        // Set a challenge
        fitnessReward.setChallenge(10 ether, "ipfs://metaURI");

        // Complete the challenge
        vm.prank(user);
        fitnessReward.completeChallenge(user);

        // Check if the user has completed the challenge
        assertTrue(fitnessReward.hasCompleted(user));

        // Check if the user received the reward
        assertEq(fitToken.balanceOf(user), 10 ether);
    }

    function testCannotCompleteChallengeTwice() public {
        // Set a challenge
        fitnessReward.setChallenge(10 ether, "ipfs://metaURI");

        // Complete the challenge
        vm.prank(user);
        fitnessReward.completeChallenge(user);

        vm.prank(user);
        vm.expectRevert("User has already completed the challenge");
        fitnessReward.completeChallenge(user);
    }

    function testPauseUnpause() public {
        fitnessReward.pause();
        assertTrue(fitnessReward.paused());

        // Unpause the contract
        fitnessReward.unpause();
        assertFalse(fitnessReward.paused());
    }
}
