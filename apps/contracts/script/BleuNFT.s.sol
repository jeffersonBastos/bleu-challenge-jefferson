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

        // 1. Deploy do contrato de recompensa (BleuRewardToken)
        rewardToken = new BleuRewardToken();
        console.log("BleuRewardToken deployed at:", address(rewardToken));

        // 2. Deploy do contrato de atestação (MasterStakerRegistry)
        registry = new MasterStakerRegistry();
        console.log("MasterStakerRegistry deployed at:", address(registry));

        // 3. Deploy do contrato NFT, passando o registry e o reward token
        nft = new BleuNFT(IMasterStakerRegistry(address(registry)), rewardToken);
        console.log("Contract deployed at:", address(nft));

        // 4. Transfer ownership do rewardToken para o contrato NFT, permitindo que o NFT possa mintar recompensas
        rewardToken.transferOwnership(address(nft));
        console.log("Ownership of reward token transferred to NFT contract");

        // 5. Mint 5 NFTs para o deployer (msg.sender)
        for (uint i = 1; i <= 5; i++){
            nft.mint(msg.sender);
        }
        console.log("Minted 5 NFTs to:", msg.sender);

        nft.stake(1);

        console.log("Staked tokens 1 and 2");

        vm.stopBroadcast();
    }
}
