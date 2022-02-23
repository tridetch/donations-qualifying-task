// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

contract Donations {
  string public name = "Donations qualifying task";
  address payable public owner;

  mapping(address => uint256) public donations;

  constructor() {
    owner = payable(msg.sender);
  }

  function donate() external payable {
    donations[msg.sender] = msg.value;
  }

  function withdrawAll(address payable withdrawAddress) external {
    require(msg.sender == owner, "Only owner can withdraw funds.");
    withdrawAddress.transfer(owner.balance);
    // add Event
  }
}
