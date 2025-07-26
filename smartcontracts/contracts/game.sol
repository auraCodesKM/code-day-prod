// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SpaceLaunchGame is Ownable {
    IERC721 public spaceNFT;
    IERC20 public galacticToken;

    uint256 public rewardAmount = 100 * 10**18; 
    uint256 public successRate = 49; 

    mapping(address => uint256) public successfulLaunches;

    event LaunchResult(address indexed user, uint256 tokenId, bool success);

    constructor(address _nftAddress, address _erc20Address) {
        spaceNFT = IERC721(_nftAddress);
        galacticToken = IERC20(_erc20Address);
    }

    function launchMission(uint256 tokenId) external {
        require(spaceNFT.ownerOf(tokenId) == msg.sender, "You don’t own this ship");

        spaceNFT.transferFrom(msg.sender, address(this), tokenId);

        bool success = _randomSuccess();

        if (success) {
            spaceNFT.transferFrom(address(this), msg.sender, tokenId);
            galacticToken.transfer(msg.sender, rewardAmount);
            successfulLaunches[msg.sender]++;
        } else {
            SpaceNFT(address(spaceNFT)).burn(tokenId);
        }

        emit LaunchResult(msg.sender, tokenId, success);
    }

    function _randomSuccess() internal view returns (bool) {
        uint256 rand = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, blockhash(block.number - 1)))) % 100;
        return rand < successRate;
    }

    function setRewardAmount(uint256 _amount) external onlyOwner {
        rewardAmount = _amount;
    }

    function setSuccessRate(uint256 _rate) external onlyOwner {
        require(_rate <= 100, "Invalid success rate");
        successRate = _rate;
    }

    function fundRewards(uint256 amount) external {
        galacticToken.transferFrom(msg.sender, address(this), amount);
    }
}