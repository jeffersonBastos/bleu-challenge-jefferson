// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BleuNFT is ERC721 {
    event Mint(address indexed to, uint256 indexed tokenId);
    
    constructor() ERC721("BleuNFT", "MNFT") {}

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
        emit Mint(to, tokenId);
    }
}