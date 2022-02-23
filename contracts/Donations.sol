// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

contract Donations {
  string public name = "Donations qualifying task";
  address public owner;

  mapping(address => uint256) public donations;

  mapping(address => bool) private is_donator;
  address[] private donatorAddresses;

  constructor() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner can withdraw funds.");
    _;
  }

  function donate() external payable {
    donations[msg.sender] += msg.value;
    if (!is_donator[msg.sender]) {
      is_donator[msg.sender] = true;
      donatorAddresses.push(msg.sender);
    }
  }

  function withdraw(address payable withdrawAddress, uint256 amount) external onlyOwner {
    withdrawAddress.transfer(amount);
    // emit Event
  }

  function withdrawAll(address payable withdrawAddress) external onlyOwner {
    withdrawAddress.transfer(address(this).balance);
  }

  function allDonators() external view returns (address[] memory) {
    return donatorAddresses;
  }

  function balance() external view returns (uint256) {
    return address(this).balance;
  }
}
