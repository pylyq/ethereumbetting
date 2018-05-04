pragma solidity ^0.4.4;

import "./MultiNumberBettingAbstractV3.sol";

/*
Exercise#1

In the contract MultiNumberBettingAbstractV3, declare the following two events

WinningBet(address of winner, name of winner, amount)
LosingBet(address of loser, name of loser, amount)
Exercise#2

MultiNumberBettingV7

Update the guess() method to emit appropriate events
*/

contract MultiNumberBettingV7 is MultiNumberBettingAbstractV3 {

  uint8 public loserCount = 0;
  uint8 public winnerCount = 0;
  uint256 public lastWinnerAt;
  uint8[] arr;
  address public winner;
  address public owner;
  // Winner
  struct Winner {
    address winnerAddress;
    bytes name;
    uint8 guess;
    uint256 guessedAt;
    uint ethReceived;
  }
  // Storage
  mapping(address => Winner)  winnerAddresses;

  modifier contractIsFunded {
    if (this.balance > 3*MAX_BET) {
      _;
    } else {
      revert();
    }
  }

  modifier ownerOnly {
    if (msg.sender == owner) {
      _;
    } else {
      revert();
    }
  }

  function MultiNumberBettingV7(uint8 num1, uint8 num2, uint8 num3) {
    // constructor
    arr = [num1, num2, num3];
    owner = msg.sender;
  }

  function guess(uint8 guess, string name) payable contractIsFunded returns (bool) {
    if (guess > 10 || msg.value > MAX_BET || msg.value < MIN_BET) {
      // throw an exception
      revert();
    } else {
      if (guess == arr[0] || guess == arr[1] || guess == arr[2]) {
        winnerCount++;
        // update lastWinnerAt state variable by setting it equal to the current time
        // first instantiate a memory struct of type winner
        Winner memory wnnr;
        wnnr.winnerAddress = msg.sender;
        wnnr.name = bytes(name);
        wnnr.guess = guess;
        wnnr.guessedAt = now;
        wnnr.ethReceived = msg.value;
        // now add this struct to the mapping
        winnerAddresses[msg.sender] = wnnr;
        winner = msg.sender;

        // if there's enough ether in this contract, send twice the value of the bet to the winner
        uint sendVal = 2 * msg.value;
        msg.sender.transfer(sendVal);

        // emit WinningBet event
        // emit NewHighBid(msg.sender, name, msg.value)
        // event WinningBet(address indexed winner, string name, uint amount)
        emit WinningBet(msg.sender, name, msg.value);

        return true;
      } else {
        loserCount++;
        //emit LosingBet event
        // event LosingBet(address indexed loser, string name, uint amount)
        emit LosingBet(msg.sender, name, msg.value);

        return false;
      }
    }
  }

  function totalGuesses() returns (uint8) {
    return (loserCount + winnerCount);
  }

  function getLastWinnerInfo() returns (address winnerAddress, string winnerName, uint8 guess, uint256 timeGuessed, uint ethRec) {
    // local memory instance of Winner struct corresponding to last winner address in storage
    Winner memory wnnr = winnerAddresses[winner];
    // return the following from wnnr struct
    winnerAddress = wnnr.winnerAddress;
    winnerName = string(wnnr.name);
    guess = wnnr.guess;
    timeGuessed = wnnr.guessedAt;
    ethRec = wnnr.ethReceived;
  }

  function checkWinning(address addr) returns (address winnerAddress, string winnerName, uint8 guess, uint256 timeGuessed) {
    // local memory instance of Winner struct corresponding to address if function parameter
    Winner memory wnnr = winnerAddresses[addr];
    // return the following from wnnr struct
    winnerAddress = wnnr.winnerAddress;
    winnerName = string(wnnr.name);
    guess = wnnr.guess;
    timeGuessed = wnnr.guessedAt;
  }

  function daysSinceLastWinning() public returns (uint) {
    return (now - lastWinnerAt*1 days);
  }

  function hoursSinceLastWinning() public returns (uint) {
    return (now - lastWinnerAt*1 hours);
  }

  function minutesSinceLastWinning() public returns (uint) {
    return (now - lastWinnerAt*1 minutes);
  }

  function secondsSinceLastWinning() public returns (uint) {
    return (now - lastWinnerAt*1 seconds);
  }

  function ownerWithdraw (uint amount) ownerOnly {
    if ((this.balance - amount) < 3*MAX_BET) {
      revert();
    } else {
      owner.transfer(amount);
    }
  }

  function () public payable {
    // Do nothing at this time....
  }

}
