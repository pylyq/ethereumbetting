import React, { Component } from 'react';
import MultiNumberBettingV7Contract from '../build/contracts/MultiNumberBettingV7.json';
import getWeb3 from './utils/getWeb3';
import BetInput from './BetInput';

import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ContractInstance: null,
      //storageValue: 0,
      web3: null,
      loserCount: 0,
      winnerCount: 0,
      //lastWinnerAt: null,
      lastWinner: null,
      //lastLog: null,
    }
    // biiiiind error fixed
    this.submitBet = this.submitBet.bind(this);
    this.displayResult = this.displayResult.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {

    const contract = require('truffle-contract');
    const betting = contract(MultiNumberBettingV7Contract);
    betting.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on SimpleStorage.
    let bettingInstance;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      betting.deployed().then((instance) => {
        bettingInstance = instance;
        // store contract instance to state variable
        return this.setState({ ContractInstance: bettingInstance });
      }).then(() => {
        // watch for contract events
        return this.doContractEventWatchStart();
      }).then(() => {
        // get loser count
        return bettingInstance.loserCount();
      }).then((result) => {
        // set to state
        return this.setState({ loserCount: result.toNumber() });
      }).then(() => {
        // get winner count
        return bettingInstance.winnerCount();
      }).then((result) => {
        // save to state
        return this.setState({ winnerCount: result.toNumber() });
      }).then(() => {
        // get last winner from solidty contract
        return bettingInstance.winner();
      }).then((result) => {
        // save to state
        return this.setState({ lastWinner: result });
      }) // figure out what to chain on to this part later
    })
  }

  // watch for smart contract events
  doContractEventWatchStart() {
    // store state contract instance in a seperate new variable
    let contractInstance = this.state.ContractInstance;

    // save all logs irrespective of input values
    let indexedEventValues = {

    }
    // start from this block since the first event happens shortly thereafter
    // for Ganache leave blank
    let additionalFilterOptions = {

    }
    // contract event definition
    //event WinningBet(address indexed addr, string name, uint amount);
    //event LosingBet(address indexed addr, string name, uint amount);
    let winningEvent = contractInstance.WinningBet(indexedEventValues, additionalFilterOptions);
    let losingEvent = contractInstance.LosingBet(indexedEventValues, additionalFilterOptions);

    // web3 contract watch callback function
    winningEvent.watch((error, result) => {
      if(error) {
        console.error('Winning Event Error');
      } else {
        // figure out what to change this to later
        // set the total state variable to newly captured log
        // figure out how to save whole object not just log
        //this.setState({ lastLog: result });
        //console.log('event: ',result.event);
        //console.log('args: ',result.args);
        this.setState({ lastWinner: result.args.addr });
        //console.log("event won: ", result.event, "address: ", result.args.addr, "name: ", result.args.name, "amount: ", result.args.amount.toNumber() / 1000000000000000000);
        this.displayResult(result);
      }
    });

    losingEvent.watch((error, result) => {
      if(error) {
        console.error('Losing Event Error');
      } else {
        // figure out what to change this to later
        // set the total state variable to newly captured log
        //console.log("event lost: ", result.event, "address: ", result.args.addr, "name: ", result.args.name, "amount: ", result.args.amount.toNumber() / 1000000000000000000);
        //this.setState({ lastLog: result });
        this.displayResult(result);
      }
    });
  }

  submitBet (guess, name, betValue) {
    // save to seperate variable
    const contractInstance = this.state.ContractInstance;
    // pull account from web3 state variable
    this.state.web3.eth.getAccounts((error, accounts) => {
      // call method on contract instance stored in state
      contractInstance.guess(guess, name, { from:accounts[0], value:this.state.web3.toWei(betValue,'ether') });
    })

    //this.displayResult();
  }
  // this will need to be called at some time other than the submitbet method
  // maybe this should just be put into the log watching method
  displayResult (result) {

    // this variable will be set to true if the last log includes the address of the person that is submitting bets
    let foundAccount = false;
    // pull accounts from web3 state variable
    this.state.web3.eth.getAccounts((error, accounts) => {
      // loop thru all the accounts
      let i;
      for (i = 0; i < accounts.length; i++) {
        console.log('Account ', i, ': ',accounts[i]);
        if (result.args.addr === accounts[i]) {
          foundAccount = true;
        }
      }
      // moved from outside of current scope
      if (result.event === 'WinningBet' && foundAccount) {
        // display that the user has won the game
        console.log('you won the last round');
      } else if (result.event === 'LosingBet' && foundAccount) {
        // display that the user has lost the game
        console.log('you lost the last round');
      } else {
        // place holder
        console.log('figuring this out');
      }
      //console.log('account has been found? inside scope 1: ',foundAccount); reads true
    })

    //console.log('account has been found? inside scope 2: ',foundAccount); reads false
    // try moving this stuff inside above scope
    /*
    if (this.state.lastLog.event === 'WinningBet' && foundAccount) {
      // display that the user has won the game
      console.log('you won the last round');
    } else if (this.state.lastLog.event === 'LosingBet' && foundAccount) {
      // display that the user has lost the game
      console.log('you lost the last round');
    } else {
      // place holder
      console.log('figuring this out');
    }
    */

  }

  renderLastWinner () {
    return <h1>Last winner: { this.state.lastWinner }</h1>;
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Lorem ipsum dolor ΞTH ÐApp Holla</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Maecenas bibendum magna ac elementum</h1>
              <p>Mauris eget laoreet dolor. Praesent.</p>
              <h2>Curabitur interdum suscipit rutrum</h2>
              <p>Fusce mauris ipsum, finibus sed aliquet at, molestie quis mi. Aliquam in.</p>
              <BetInput onSubmit={ this.submitBet } />
              { this.renderLastWinner() }
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
