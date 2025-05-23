// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


contract MockUSDT {
    string public name = "Mock USDT";
    string public symbol = "mUSDT";
    uint8 public decimals = 6;
    uint public totalSupply;

    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;



    constructor(uint initialSupply) {
        balanceOf[msg.sender] = initialSupply;
        totalSupply = initialSupply;
    }

    function transfer(address to, uint amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Not enough");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }

    function approve(address spender, uint amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transferFrom(address from, address to, uint amount) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");

        balanceOf[from] -= amount;
        allowance[from][msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}
