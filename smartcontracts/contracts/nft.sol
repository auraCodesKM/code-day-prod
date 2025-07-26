// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SpaceNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 public tokenCounter;
    uint256 public mintFee = 0.01 ether;
    address public treasury;
    
    // Ship type fees
    uint256 public ship1Fee = 0.01 ether;
    uint256 public ship2Fee = 0.025 ether;
    uint256 public ship3Fee = 0.05 ether;

    constructor(address _treasury) ERC721("SpaceShip", "SHIP") {
        require(_treasury != address(0), "Invalid treasury address");
        tokenCounter = 1;
        treasury = _treasury;
    }

    function mintShip1(string memory tokenURI) external payable nonReentrant returns (uint256) {
        require(msg.value == ship1Fee, "Incorrect ETH amount for Ship 1");

        // Transfer mint fee to treasury
        (bool sent, ) = treasury.call{value: msg.value}("");
        require(sent, "ETH transfer failed");

        uint256 tokenId = tokenCounter;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        tokenCounter++;

        return tokenId;
    }

    function mintShip2(string memory tokenURI) external payable nonReentrant returns (uint256) {
        require(msg.value == ship2Fee, "Incorrect ETH amount for Ship 2");

        // Transfer mint fee to treasury
        (bool sent, ) = treasury.call{value: msg.value}("");
        require(sent, "ETH transfer failed");

        uint256 tokenId = tokenCounter;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        tokenCounter++;

        return tokenId;
    }

    function mintShip3(string memory tokenURI) external payable nonReentrant returns (uint256) {
        require(msg.value == ship3Fee, "Incorrect ETH amount for Ship 3");

        // Transfer mint fee to treasury
        (bool sent, ) = treasury.call{value: msg.value}("");
        require(sent, "ETH transfer failed");

        uint256 tokenId = tokenCounter;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        tokenCounter++;

        return tokenId;
    }

    // Keep the original mintShip function for backward compatibility
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