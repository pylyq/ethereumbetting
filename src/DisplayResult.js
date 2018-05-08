import React, { Component } from 'react';
import './DisplayResult.css';

class DisplayResult extends Component {
  // this component dont need state
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
        return <h1>You won</h1>;
      } else if (result.event === 'LosingBet' && foundAccount) {
        // display that the user has lost the game
        console.log("account found, bet lost. tx hash: ", result.transactionHash);
        return <h1>You lost</h1>;
      } else {
        // this probably won't ever happen
        console.log("account not found");
        return <h1>Account not found</h1>;
      }
  // for when the transaction is submitted but the last log dont match the tx hash
  } else if (!result && lastTx) {
    console.log("transaction pending...");
    return <h1>Transaction pending...</h1>;
  } else {
    console.log("bet hasnt been submitted yet");
    return <h1>You havent submitted a bet yet</h1>;
  }
}

  render() {
    return (
      <div className="DisplayResult">
        { this.displayResult(this.props.log, this.props.tx, this.props.web3) }
      </div>
    );
  }
}

export default DisplayResult;
