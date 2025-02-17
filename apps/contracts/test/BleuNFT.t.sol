// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {BleuNFT} from "../src/BleuNFT.sol";
import {BleuRewardToken} from "../src/BleuRewardToken.sol";
import {MasterStakerRegistry} from "../src/MasterStakerRegistry.sol";

contract BleuNFTTest is Test {
    BleuNFT public nft;
    BleuRewardToken public rewardToken;
    MasterStakerRegistry public registry;
    
    address public owner = address(1);
    address public user1 = address(2);
    address public user2 = address(3);

    function setUp() public {
        vm.startPrank(owner);
        rewardToken = new BleuRewardToken();
        registry = new MasterStakerRegistry();
        nft = new BleuNFT(registry, rewardToken);
        rewardToken.transferOwnership(address(nft));
        registry.transferOwnership(address(nft));
        vm.stopPrank();
    }

    function testMint() public {
        vm.prank(owner);
        nft.mint(user1);
        assertEq(nft.ownerOf(1), user1);
    }

    function testMintOnlyOwner() public {
        vm.prank(user1);
        vm.expectRevert("Only contract owner can mint");
        nft.mint(user1);
    }

    function testStake() public {
        // Mint NFT for user
        vm.prank(owner);
        nft.mint(user1);

        // Stake NFT
        vm.startPrank(user1);
        nft.stake(1);
        
        assertEq(nft.ownerOf(1), address(nft));
        assertEq(nft.stakedOwner(1), user1);
        assertEq(nft.userStakeCount(user1), 1);
        vm.stopPrank();
    }

    function testStakeRequireOwnership() public {
        vm.prank(owner);
        nft.mint(user1);

        vm.prank(user2);
        vm.expectRevert("Not owner");
        nft.stake(1);
    }

    function testUnstakeRequirements() public {
        // Mint and stake NFT
        vm.prank(owner);
        nft.mint(user1);

        vm.startPrank(user1);
        nft.stake(1);

        // Try to unstake immediately (should fail)
        vm.expectRevert("Wait 5 minutes");
        nft.unstake(1);

        // Wait 5 minutes
        skip(5 minutes);

        // Try to unstake without MasterStaker attestation
        vm.expectRevert("No MasterStaker attestation");
        nft.unstake(1);

        // Grant MasterStaker attestation by staking 4 more NFTs
        vm.stopPrank();
        
        // Mint 4 more NFTs
        vm.startPrank(owner);
        for(uint i = 2; i <= 5; i++) {
            nft.mint(user1);
        }
        vm.stopPrank();

        // Stake the remaining 4 NFTs to get MasterStaker status
        vm.startPrank(user1);
        for(uint i = 2; i <= 5; i++) {
            nft.stake(i);
        }

        // Now unstake should work because user1 is a MasterStaker
        nft.unstake(1);

        assertEq(nft.ownerOf(1), user1);
        assertEq(nft.stakedOwner(1), address(0));
        assertEq(nft.userStakeCount(user1), 4); // 4 remaining staked NFTs
        vm.stopPrank();
    }

    function testAutoMasterStakerAttestation() public {
        // Mint 5 NFTs
        vm.startPrank(owner);
        for(uint i = 1; i <= 5; i++) {
            nft.mint(user1);
        }
        vm.stopPrank();

        // Stake 5 NFTs
        vm.startPrank(user1);
        for(uint i = 1; i <= 5; i++) {
            nft.stake(i);
        }
        vm.stopPrank();

        // Check if user got MasterStaker attestation
        assertTrue(registry.isMasterStaker(user1));
    }

    function testRewardsClaiming() public {
        // Mint and stake NFT
        vm.prank(owner);
        nft.mint(user1);

        vm.prank(user1);
        nft.stake(1);

        // Advance 10 blocks
        vm.roll(block.number + 10);

        // Claim rewards
        vm.prank(user1);
        nft.claimRewards();

        // Check if rewards were minted (0.01 token per block)
        assertEq(rewardToken.balanceOf(user1), 10 * 1e16);
    }

    function testRewardsClaimingMultipleStakes() public {
        // Mint 2 NFTs
        vm.startPrank(owner);
        nft.mint(user1);
        nft.mint(user1);
        vm.stopPrank();

        // Stake both NFTs
        vm.startPrank(user1);
        nft.stake(1);
        nft.stake(2);
        vm.stopPrank();

        // Advance 10 blocks
        vm.roll(block.number + 10);

        // Claim rewards
        vm.prank(user1);
        nft.claimRewards();

        // Check if rewards were minted (0.01 token per block per stake)
        assertEq(rewardToken.balanceOf(user1), 20 * 1e16); // 2 NFTs * 10 blocks * 0.01 tokens
    }
}