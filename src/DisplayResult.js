import React, { Component } from 'react';
import './DisplayResult.css';

class DisplayResult extends Component {
  // this component dont need state
  /*
  // Component constructor defines state and binds methods
  constructor (props) {
    super (props);
    // Define initial states to be updated by app
    this.state = {
      // stores message to be passed to parent component submitMessage method
      guess: '',
      name: '',
      betValue: '',
    }
    // Bind relevent methods
    this.handleGuessChange = this.handleGuessChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleBetValueChange = this.handleBetValueChange.bind(this);
    this.submitBet = this.submitBet.bind(this);
  }
  // FOR NOW ONLY HANDLE NAME INPUT
  */

  displayResult (result, betSubmitted, web3) {
    console.log('has bet been submitted?', betSubmitted);
    //check that a bet has been submitted
    if (betSubmitted) {
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
          console.log("account found, bet won");
        } else if (result.event === 'LosingBet' && foundAccount) {
          // display that the user has lost the game
          //console.log('you lost the last round');
          //this.setState({ lastResult: 'lose' });
          //console.log('current last result state: ',this.state.lastResult);
          console.log("account found, bet lost");
        } else {
          // place holder
          //console.log('figuring this out');
          //this.setState({ lastResult: null });
          //console.log('current last result state: ',this.state.lastResult);
          console.log("account not found");
        }
      })
    } else {
      console.log("bet hasnt been submitted yet");
    }
  }

  render() {
    return (
      <div className="DisplayResult">
        { this.displayResult(this.props.lastLog, this.props.betSubmitted, this.props.web3) }
      </div>
    );
  }
}

export default DisplayResult;
