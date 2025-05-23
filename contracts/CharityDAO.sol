// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CharityDAO {
    address public owner;
    mapping(address => uint256) public donations;
    string[] public proposals;
    mapping(uint256 => uint256) public votes;

    constructor() {
        owner = msg.sender;
    }

    function donate() public payable {
        require(msg.value > 0, "Must send ETH");
        donations[msg.sender] += msg.value;
    }

    function createProposal(string memory proposal) public {
        require(donations[msg.sender] > 0, "Only donors can propose");
        proposals.push(proposal);
    }

    function vote(uint256 proposalId) public {
        require(donations[msg.sender] > 0, "Only donors can vote");
        require(proposalId < proposals.length, "Invalid proposal ID");
        votes[proposalId]++;
    }

    function getProposals() public view returns (string[] memory) {
        return proposals;
    }
}
