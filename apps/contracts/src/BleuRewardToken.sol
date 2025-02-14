// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// I have some problemes using Ownable.sol from OpenZeppelin.
// So I decide to use a contractOwner variable to simplify the code and skip the problems.
contract BleuRewardToken is ERC20 {
    event Mint(address indexed to, uint256 indexed amount);

    address public contractOwner;

    constructor() ERC20("BleuReward", "BREW") {
        contractOwner = msg.sender;
    }

    function transferOwnership(address newOwner) external {
        require(msg.sender == contractOwner, "Only owner can transfer");
        contractOwner = newOwner;
    }
    
    function mint(address to, uint256 amount) external {
        require(msg.sender == contractOwner, "Only owner can mint");
        emit Mint(to, amount);
        _mint(to, amount);
    }
}
