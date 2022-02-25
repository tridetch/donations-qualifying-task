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

  /// Making a donation
  function donate() external payable {
    donations[msg.sender] += msg.value;
    if (!is_donator[msg.sender]) {
      is_donator[msg.sender] = true;
      donatorAddresses.push(msg.sender);
    }
  }

  /**
    Withdraws specified amound of funds to the address
    @param withdrawAddress the address to receive funds
    @param amount the amount of funds to be withdrawed
   */
  function withdraw(address payable withdrawAddress, uint256 amount) external onlyOwner {
    withdrawAddress.transfer(amount);
    // emit Event
  }

  /**
    Withdraw the entire balance to specified address
    @param withdrawAddress the address to receive funds
   */
  function withdrawAll(address payable withdrawAddress) external onlyOwner {
    withdrawAddress.transfer(address(this).balance);
  }

  /**
    Return all addresses that make donations
   */
  function allDonators() external view returns (address[] memory) {
    return donatorAddresses;
  }

  /**
    Return current balance of contract
   */
  function balance() external view returns (uint256) {
    return address(this).balance;
  }
}
