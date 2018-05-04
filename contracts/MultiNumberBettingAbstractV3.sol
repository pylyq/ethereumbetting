pragma solidity ^0.4.4;

/*
Exercise#1

In the contract MultiNumberBettingAbstractV3, declare the following two events

WinningBet(address of winner, name of winner, amount)
LosingBet(address of loser, name of loser, amount)
Exercise#2

MultiNumberBettingV7

Update the guess() method to emit appropriate events
*/

contract MultiNumberBettingAbstractV3 {

  uint public constant MAX_BET = 5 ether;
  uint public constant MIN_BET = 1 ether;

  // event NewHighBid(address indexed who, string name, uint howmuch);
  event WinningBet(address indexed addr, string name, uint amount);
  event LosingBet(address indexed addr, string name, uint amount);

  function guess(uint8 guess, string name) payable returns (bool);

  function totalGuesses() returns (uint8);

  function getLastWinnerInfo() returns (address winnerAddress, string winnerName, uint8 guess, uint256 timeGuessed, uint ethRec);

  function checkWinning(address addr) returns (address winnerAddress, string winnerName, uint8 guess, uint256 timeGuessed);

  function daysSinceLastWinning() public returns (uint);

  function hoursSinceLastWinning() public returns (uint);

  function minutesSinceLastWinning() public returns (uint);

  function secondsSinceLastWinning() public returns (uint);

}
