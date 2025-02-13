// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IMasterStakerRegistry.sol";

contract MasterStakerRegistry is IMasterStakerRegistry {
    event AttestationGranted(address indexed user);

    address public owner;
    mapping(address => bool) public masterStaker;

    constructor() {
        owner = msg.sender;
    }

    function transferOwnership(address newOwner) external {
        require(msg.sender == owner, "Not owner");
        owner = newOwner;
    }

    function grantAttestation(address user) external override {
        require(msg.sender == owner, "Only owner can grant");
        masterStaker[user] = true;
        emit AttestationGranted(user);
    }

    function isMasterStaker(address user) external view override returns (bool) {
        return masterStaker[user];
    }
}
