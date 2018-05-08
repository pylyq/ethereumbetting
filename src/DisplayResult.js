import React, { Component } from 'react';
import './DisplayResult.css';

class DisplayResult extends Component {
  // this component dont need state
  displayResult (result, lastTx, web3) {
    if (result && lastTx && result.transactionHash === lastTx.tx) {
      // this variable will be set to true if the last log includes the address of the person that is submitting bets
      let foundAccount = false;
      let accounts = web3.eth.accounts;
      for (let i = 0; i < accounts.length; i++) {
        //console.log('Account ', i, ': ',accounts[i]);
        if (result.args.addr === accounts[i]) {
          foundAccount = true;
        }
      }
      /*
      // pull accounts from web3 state variable
      web3.eth.getAccounts((error, accounts) => {
        // loop thru all the accounts
        for (let i = 0; i < accounts.length; i++) {
          //console.log('Account ', i, ': ',accounts[i]);
          if (result.args.addr === accounts[i]) {
            return //??????????
          }
        }
      })
      */
      // moved from outside of current scope
      if (result.event === 'WinningBet' && foundAccount) {
        // display that the user has won the game
        console.log("account found, bet won. tx hash: ", result.transactionHash);
        return <h1>You won</h1>;
        //console.log('betResult after winning', betResult);
      } else if (result.event === 'LosingBet' && foundAccount) {
        // display that the user has lost the game
        console.log("account found, bet lost. tx hash: ", result.transactionHash);
        // this isnt showing up on page for some reason
        // probably cause the tx and log hash go out of wack immediately
        return <h1>You lost</h1>;
        //console.log('betResult after losing', betResult);
      } else {
        // this probably won't ever happen
        console.log("account not found");
        return <h1>Huh?</h1>;
      }
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
