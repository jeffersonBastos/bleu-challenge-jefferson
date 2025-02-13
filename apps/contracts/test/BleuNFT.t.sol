// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {BleuNFT} from "../src/BleuNFT.sol";

contract BleuNFTTest is Test {
    BleuNFT public nft;
    address userAdress = address(0x1);

    function setUp() public {
        nft = new BleuNFT();
    }

    function testMint() public {
        nft.mint(userAdress, 1);
        assertEq(nft.ownerOf(1), userAdress);
    }

    function testStakeAndUnstake() public {
        nft.mint(userAdress, 2);

        vm.prank(userAdress);
        nft.stake(2);
        assertEq(nft.ownerOf(2), address(nft));
        assertEq(nft.stakedOwner(2), userAdress);

        vm.prank(userAdress);
        nft.unstake(2);
        assertEq(nft.ownerOf(2), userAdress);
        assertEq(nft.stakedOwner(2), address(0));
    }
}
