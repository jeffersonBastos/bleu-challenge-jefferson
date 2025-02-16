// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { Script, console } from "forge-std/Script.sol";
import { BleuNFT } from "../src/BleuNFT.sol";
import { MasterStakerRegistry } from "../src/MasterStakerRegistry.sol";
import { IMasterStakerRegistry } from "../src/IMasterStakerRegistry.sol";
import { BleuRewardToken } from "../src/BleuRewardToken.sol";

contract BleuNFTScript is Script {
    BleuNFT public nft;
    MasterStakerRegistry public registry;
    BleuRewardToken public rewardToken;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        // 1. Deploy the reward contract (BleuRewardToken)
        rewardToken = new BleuRewardToken();
        console.log("BleuRewardToken deployed at:", address(rewardToken));

        // 2. Deploy the attestation contract (MasterStakerRegistry)
        registry = new MasterStakerRegistry();
        console.log("MasterStakerRegistry deployed at:", address(registry));
        
        // 3. Deploy the NFT contract, passing the registry and reward token
        nft = new BleuNFT(IMasterStakerRegistry(address(registry)), rewardToken);
        console.log("Contract deployed at:", address(nft));

        // 4. Transfer ownership of the rewardToken and  MasterStakerRegistry to the NFT contract
        rewardToken.transferOwnership(address(nft));
        registry.transferOwnership(address(nft));

        // 5. Mint 5 NFTs for the deployer (msg.sender)
        for (uint i = 1; i <= 5; i++){
            nft.mint(msg.sender);
        }
        console.log("Minted 5 NFTs to:", msg.sender);


        vm.stopBroadcast();
    }
}
