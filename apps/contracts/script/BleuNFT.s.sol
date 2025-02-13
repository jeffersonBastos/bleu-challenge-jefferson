// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {BleuNFT} from "../src/BleuNFT.sol";
import { MasterStakerRegistry } from "../src/MasterStakerRegistry.sol";
import { IMasterStakerRegistry } from "../src/IMasterStakerRegistry.sol";

contract BleuNFTScript is Script {
    BleuNFT public nft;
    IMasterStakerRegistry public registry;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();


        registry = new MasterStakerRegistry();
        console.log("MasterStakerRegistry deployed at:", address(registry));

        nft = new BleuNFT(registry);
        console.log("BleuNFT deployed at::", address(nft));


        registry.transferOwnership(address(nft));
        console.log("Ownership of registry transferred to NFT contract");


        for(uint i = 1; i <= 10; i++){
            nft.mint(msg.sender);
        }

        vm.stopBroadcast();
    }
}
