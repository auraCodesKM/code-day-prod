// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SpaceNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 public tokenCounter;
    uint256 public mintFee = 0.01 ether;
    address public treasury;

    constructor(address _treasury) ERC721("SpaceShip", "SHIP") {
        require(_treasury != address(0), "Invalid treasury address");
        tokenCounter = 1;
        treasury = _treasury;
    }

    function mintShip(string memory tokenURI) external payable nonReentrant returns (uint256) {
        require(msg.value == mintFee, "Incorrect ETH amount");

        // Transfer mint fee to treasury
        (bool sent, ) = treasury.call{value: msg.value}("");
        require(sent, "ETH transfer failed");

        uint256 tokenId = tokenCounter;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        tokenCounter++;

        return tokenId;
    }

    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not your ship");
        _burn(tokenId);
    }

    // Admin functions
    function setMintFee(uint256 _fee) external onlyOwner {
        mintFee = _fee;
    }

    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid address");
        treasury = _treasury;
    }
}