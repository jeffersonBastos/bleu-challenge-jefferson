// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { ERC721 } from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BleuNFT is ERC721 {
    event Mint(address indexed to, uint256 indexed tokenId);
    event Staked(address indexed owner, uint256 indexed tokenId);
    event Unstaked(address indexed owner, uint256 indexed tokenId);

    mapping(uint256 => address) public stakedOwner;

    constructor() ERC721("BleuNFT", "MNFT") {}

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
        emit Mint(to, tokenId);
    }

    function stake(uint256 tokenId) external {

        require(ownerOf(tokenId) == msg.sender, "Not owner");

        _transfer(msg.sender, address(this), tokenId);

        stakedOwner[tokenId] = msg.sender;

        emit Staked(msg.sender, tokenId);
    }

    function unstake(uint256 tokenId) external {
        require(stakedOwner[tokenId] == msg.sender, "Not staker");

        _transfer(address(this), msg.sender, tokenId);

        stakedOwner[tokenId] = address(0);

        emit Unstaked(msg.sender, tokenId);
    }
}
