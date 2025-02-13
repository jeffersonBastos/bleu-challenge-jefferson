// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import { IMasterStakerRegistry } from "./IMasterStakerRegistry.sol";

contract BleuNFT is ERC721 {
    event Mint(address indexed to, uint256 indexed tokenId);
    event Staked(address indexed owner, uint256 indexed tokenId);
    event Unstaked(address indexed owner, uint256 indexed tokenId);

    mapping(uint256 => address) public stakedOwner;
    mapping(uint256 => uint256) public stakeTimestamp;

    mapping(address => uint256) public userStakeCount;
    mapping(address => bool) public hasAlreadyGranted;

    IMasterStakerRegistry public registry;
    address public immutable contractOwner;
    uint256 private _currentTokenId;

    constructor(IMasterStakerRegistry _registry) ERC721("BleuNFT", "MNFT") {
        registry = _registry;
        contractOwner = msg.sender;
    }

    function mint(address to) public {
        require(msg.sender == contractOwner, "Only contract owner can mint");
        _currentTokenId++;
        _mint(to, _currentTokenId);
        emit Mint(to, _currentTokenId);
    }

    function stake(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");

        _transfer(msg.sender, address(this), tokenId);

        stakedOwner[tokenId] = msg.sender;
        stakeTimestamp[tokenId] = block.timestamp;

        userStakeCount[msg.sender] += 1;

        if (!hasAlreadyGranted[msg.sender] && userStakeCount[msg.sender] >= 5) {
            registry.grantAttestation(msg.sender);
            hasAlreadyGranted[msg.sender] = true;
        }

        emit Staked(msg.sender, tokenId);
    }

    function unstake(uint256 tokenId) external {
        require(stakedOwner[tokenId] == msg.sender, "Not staker");

        // Rule 1: need wait 5 minutes to unstake the token
        require(block.timestamp - stakeTimestamp[tokenId] >= 5 minutes, "You need wait 5 minutes to unstake the token");

        // Regra 2: need to be a MasterStaker
        require(registry.isMasterStaker(msg.sender), "No MasterStaker attestation");

        _transfer(address(this), msg.sender, tokenId);

        stakedOwner[tokenId] = address(0);
        stakeTimestamp[tokenId] = 0;

        userStakeCount[msg.sender] -= 1;

        emit Unstaked(msg.sender, tokenId);
    }
}
