import React, { Component } from 'react';
import './DisplayResult.css';

class DisplayResult extends Component {
  // this component dont need state
  /*
  4 possible cases to render:
  1) bet has not yet been submitted. dont render anything. !lastTx
  2) bet has been submitted, but result is not in. show loading screen lastTx !result
  3) bet won
  4) bet lost
  */

  displayResult (result, lastTx, web3) {
    //console.log('displayResult input result', result);
    //console.log('displayResult input lastTx', lastTx);
    //check that a bet has been submitted
    // make sure tx hashes match!!
    if (result && lastTx) {
      if (result.transactionHash === lastTx.tx) {
        // this variable will be set to true if the last log includes the address of the person that is submitting bets
        let foundAccount = false;
        // pull accounts from web3 state variable
        web3.eth.getAccounts((error, accounts) => {
          // loop thru all the accounts
          let i;
          for (i = 0; i < accounts.length; i++) {
            //console.log('Account ', i, ': ',accounts[i]);
            if (result.args.addr === accounts[i]) {
              foundAccount = true;
            }
          }
          // moved from outside of current scope
          if (result.event === 'WinningBet' && foundAccount) {
            // display that the user has won the game
            //console.log('you won the last round');
            //this.setState({ lastResult: 'win' });
            //console.log('current last result state: ',this.state.lastResult);
            console.log("account found, bet won. tx hash: ", result.transactionHash);
            return <h1>You won</h1>;
          } else if (result.event === 'LosingBet' && foundAccount) {
            // display that the user has lost the game
            //console.log('you lost the last round');
            //this.setState({ lastResult: 'lose' });
            //console.log('current last result state: ',this.state.lastResult);
            console.log("account found, bet lost. tx hash: ", result.transactionHash);
            // this isnt showing up on page for some reason
            // probably cause the tx and log hash go out of wack immediately
            return <h1>You lost</h1>;
          } else {
            // place holder
            //console.log('figuring this out');
            //this.setState({ lastResult: null });
            //console.log('current last result state: ',this.state.lastResult);
            console.log("account not found");
            return <h1>Huh?</h1>;
          }
        })
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
        { this.displayResult(this.props.lastLog, this.props.lastTx, this.props.web3) }
      </div>
    );
  }
}

export default DisplayResult;
