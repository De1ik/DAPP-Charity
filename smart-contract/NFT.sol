// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AccessNFT is ERC721Enumerable, Ownable {
    uint256 public nextTokenId;

    constructor() ERC721("AccessNFT", "ACNFT") {}

    /// @notice Видає NFT на адресу (тільки власник контракту)
    function mint(address to) external onlyOwner {
        require(balanceOf(to) == 0, "Already has NFT");
        _safeMint(to, nextTokenId++);
    }

    /// @dev Забороняємо переказ NFT (soulbound)
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(from == address(0) || to == address(0), "Non-transferable (soulbound)");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}
