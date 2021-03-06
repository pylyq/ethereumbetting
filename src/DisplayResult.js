import React, { Component } from 'react';
import './DisplayResult.css';

class DisplayResult extends Component {
  // display result of bet
  displayResult (result, lastTx, web3) {
    // ensure the last tx and last log refer to the same transaction
    if (result && lastTx && result.transactionHash === lastTx.tx) {
      // this variable will be set to true if the last log includes the address of the person that is submitting bets
      let foundAccount = false;
      // non async web3 accounts call
      let accounts = web3.eth.accounts;
      //search for account of log into found accounts array
      for (let i = 0; i < accounts.length; i++) {
        if (result.args.addr === accounts[i]) {
          foundAccount = true;
        }
      }

      // only log to the console if the new found log has the account of the player in the args
      if (result.event === 'WinningBet' && foundAccount) {
        // display that the user has won the game
        console.log("account found, bet won. tx hash: ", result.transactionHash);
        //console.log("transaction object: ", lastTx);
        return <h1>w00t u won.</h1>;
      } else if (result.event === 'LosingBet' && foundAccount) {
        // display that the user has lost the game
        console.log("account found, bet lost. tx hash: ", result.transactionHash);
        return <h1>You lost you loser :(</h1>;
      } else {
        // this probably won't ever happen
        console.log("account not found");
        return <h1>Account not found!?</h1>;
      }
    // for when the transaction is submitted but the last log dont match the tx hash
    } else if (!result && lastTx) {
      console.log("transaction pending...");
      return <h1>Transaction pending...</h1>;
    } else {
      console.log("bet hasnt been submitted yet");
      return <h1>You havent submitted a bet yet ya dingus</h1>;
    }
  }

  // method to convert unix/block time to human readable format
  getTime() {
    let time;
    if (this.props.log) {
      // unix block time
      let blockTime = this.props.log.args.time;
      // convert to nice format
      // this is an object that will need to be stringified
      let date = new Date(blockTime * 1000);
      // convert to string
      time = date.toString();
    } else {
      time = 'N/A'
    }
    return time;
  }
  // method to determine address to display
  getAddr() {
    let addy;
    if (this.props.log) {
      addy = this.props.log.args.addr;
    } else {
      addy = 'N/A'
    }
    return addy;
  }
  // method to determine value to display
  getWager() {
    let wager;
    if (this.props.log) {
      wager = this.props.log.args.amount/1000000000000000000;
    } else {
      wager = 'N/A'
    }
    return wager;
  }
  // method to determine name to display
  getName() {
    let name;
    if (this.props.log) {
      name = this.props.log.args.name;
    } else {
      name = 'N/A'
    }
    return name;
  }

  render() {
    return (
      <div className="DisplayResult">
        { this.displayResult(this.props.log, this.props.tx, this.props.web3) }
        <p>Your address: { this.getAddr() }</p>
        <p>Date of bet: { this.getTime() }</p>
        <p>Your name: { this.getName() }</p>
        <p>Your wager: { this.getWager() } ETH</p>
      </div>
    );
  }
}

export default DisplayResult;
