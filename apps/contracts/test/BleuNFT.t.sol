// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import {Test, console} from "forge-std/Test.sol";
import {BleuNFT} from "../src/BleuNFT.sol";

contract BleuNFTTest is Test {
    BleuNFT public nft;

    function setUp() public {
        nft = new BleuNFT();
    }

    function test_Mint() public {
        // placeholder
    }
}
