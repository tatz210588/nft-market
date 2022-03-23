//SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "../openzeppelin-contracts-master/contracts/token/ERC721/ERC721.sol";
import "../openzeppelin-contracts-master/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../openzeppelin-contracts-master/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;

    constructor(address marketplaceAddress) ERC721("Metaverse Token", "Mett") {
        contractAddress = marketplaceAddress;
    }

    function createToken(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }
}
