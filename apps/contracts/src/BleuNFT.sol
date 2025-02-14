// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./IMasterStakerRegistry.sol";
import "./BleuRewardToken.sol";

contract BleuNFT is ERC721 {
    event Mint(address indexed to, uint256 indexed tokenId);
    event Staked(address indexed owner, uint256 indexed tokenId);
    event Unstaked(address indexed owner, uint256 indexed tokenId);
    event RewardsClaimed(address indexed user, uint256 amount);

    mapping(uint256 => address) public stakedOwner;
    mapping(uint256 => uint256) public stakeTimestamp;
    mapping(address => uint256) public userStakeCount;
    mapping(address => uint256) public lastClaimedBlock;

    uint256 public rewardPerBlock; // Ex.: 1e16 (0.01 token per block)
    uint256 private _currentTokenId;

    IMasterStakerRegistry public registry;
    BleuRewardToken public rewardToken;

    address public immutable contractOwner;

    constructor(
        IMasterStakerRegistry _registry,
        BleuRewardToken _rewardToken
    ) ERC721("BleuNFT", "MNFT") {
        contractOwner = msg.sender;
        registry = _registry;
        rewardToken = _rewardToken;
        // Setting the rate: 1e16 = 0.01 reward token per block per staked NFT
        rewardPerBlock = 1e16;
    }

    function mint(address to) external {
        require(msg.sender == contractOwner, "Only contract owner can mint");
        _currentTokenId++;
        _mint(to, _currentTokenId);
        emit Mint(to, _currentTokenId);
    }

    function stake(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not owner");
        _claimRewards(msg.sender);

        _transfer(msg.sender, address(this), tokenId);
        stakedOwner[tokenId] = msg.sender;
        stakeTimestamp[tokenId] = block.timestamp;
        userStakeCount[msg.sender] += 1;

        if (!registry.isMasterStaker(msg.sender) && userStakeCount[msg.sender] >= 5) {
            registry.grantAttestation(msg.sender);
        }

        emit Staked(msg.sender, tokenId);
    }

    function unstake(uint256 tokenId) external {
        require(stakedOwner[tokenId] == msg.sender, "Not staker");
        require(block.timestamp - stakeTimestamp[tokenId] >= 5 minutes, "Wait 5 minutes");
        require(registry.isMasterStaker(msg.sender), "No MasterStaker attestation");

        _claimRewards(msg.sender);

        _transfer(address(this), msg.sender, tokenId);
        stakedOwner[tokenId] = address(0);
        stakeTimestamp[tokenId] = 0;
        userStakeCount[msg.sender] -= 1;

        emit Unstaked(msg.sender, tokenId);
    }

    function claimRewards() external {
        _claimRewards(msg.sender);
    }
    function _claimRewards(address user) internal {
        uint256 staked = userStakeCount[user];
        if (staked == 0) {
            lastClaimedBlock[user] = block.number;
            return;
        }

        uint256 fromBlock = lastClaimedBlock[user];
        if (fromBlock == 0) {
            fromBlock = block.number;
        }
        uint256 blockDelta = block.number - fromBlock;
        if (blockDelta == 0) {
            lastClaimedBlock[user] = block.number;
            return;
        }

        uint256 pending = blockDelta * staked * rewardPerBlock;
        lastClaimedBlock[user] = block.number;

        if (pending > 0) {
            rewardToken.mint(user, pending);
            emit RewardsClaimed(user, pending);
        }
    }
}
