// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IMasterStakerRegistry {
    function grantAttestation(address user) external;
    function isMasterStaker(address user) external view returns (bool);
    function transferOwnership(address newOwner) external;
}
