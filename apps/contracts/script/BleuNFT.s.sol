// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {BleuNFT} from "../src/BleuNFT.sol";

contract BleuNFTScript is Script {
    BleuNFT public nft;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        nft = new BleuNFT();

        for(uint i = 1; i <= 10; i++){
            nft.mint(msg.sender, i);
        }
        nft.stake(1);
        nft.stake(2);

        
        console.log("Contract deployed at:", address(nft));

        console.log(nft.stakedOwner(1));

        vm.stopBroadcast();
    }
}
