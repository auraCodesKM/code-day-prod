// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SpaceNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 public tokenCounter;
    uint256 public mintFee = 0.01 ether;
    address public treasury;
    address public gameContract;

    constructor(address _treasury)
        ERC721("SpaceShip", "SHIP")
        Ownable(msg.sender)
    {
        require(_treasury != address(0), "Invalid treasury address");
        tokenCounter = 1;
        treasury = _treasury;
    }

    function mintShip1() external payable nonReentrant returns (uint256) {
        require(msg.value == mintFee, "Incorrect ETH amount");

        // Transfer mint fee to treasury
        (bool sent, ) = treasury.call{value: msg.value}("");
        require(sent, "ETH transfer failed");

        uint256 tokenId = tokenCounter;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(
            tokenId,
            "ipfs://bafybeibmk3erwtfjzdfceaoijqn3jpiqg3hg4lz7nvnlg4pcakpu5hmr54/1.json"
        );
        tokenCounter++;

        return tokenId;
    }

    function mintShip2() external payable nonReentrant returns (uint256) {
        require(msg.value == 0.025 ether, "Incorrect ETH amount");

        // Transfer mint fee to treasury
        (bool sent, ) = treasury.call{value: msg.value}("");
        require(sent, "ETH transfer failed");

        uint256 tokenId = tokenCounter;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(
            tokenId,
            "ipfs://bafybeibmk3erwtfjzdfceaoijqn3jpiqg3hg4lz7nvnlg4pcakpu5hmr54/2.json"
        );
        tokenCounter++;

        return tokenId;
    }

    function mintShip3() external payable nonReentrant returns (uint256) {
        require(msg.value == 0.05 ether, "Incorrect ETH amount");

        // Transfer mint fee to treasury
        (bool sent, ) = treasury.call{value: msg.value}("");
        require(sent, "ETH transfer failed");

        uint256 tokenId = tokenCounter;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(
            tokenId,
            "ipfs://bafybeibmk3erwtfjzdfceaoijqn3jpiqg3hg4lz7nvnlg4pcakpu5hmr54/3.json"
        );
        tokenCounter++;

        return tokenId;
    }

    modifier onlyGame() {
        require(msg.sender == gameContract, "Not authorized");
        _;
    }

    function setGameContract(address _game) external onlyOwner {
        require(_game != address(0), "Invalid address");
        gameContract = _game;
    }

    function burn(uint256 tokenId) external onlyGame {
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
