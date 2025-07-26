// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GalacticToken is ERC20, Ownable {
    constructor() ERC20("GalacticToken", "GALACTIC") {}

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}