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
      winner: null,
    }
    // biiiiind error fixed
    this.submitBet = this.submitBet.bind(this);
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
        // watch for contract events
        return bettingInstance.loserCount();
      }).then((result) => {
        // watch for contract events
        return this.setState({ loserCount: result.toNumber() });
      }).then(() => {
        // watch for contract events
        return bettingInstance.winnerCount();
      }).then((result) => {
        // watch for contract events
        return this.setState({ winnerCount: result.toNumber() });
      }).then(() => {
        // watch for contract events
        return bettingInstance.winner();
      }).then((result) => {
        // watch for contract events
        return this.setState({ winner: result });
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
      //"fromBlock":"2950000"
    }
    // contract event definition
    //let contractEvent = contractInstance.NewTotal(indexedEventValues, additionalFilterOptions);
    //event WinningBet(address indexed addr, string name, uint amount);
    //event LosingBet(address indexed addr, string name, uint amount);
    let winningEvent = contractInstance.WinningBet(indexedEventValues, additionalFilterOptions);
    let losingEvent = contractInstance.LosingBet(indexedEventValues, additionalFilterOptions);

    // web3 contract watch callback function
    winningEvent.watch((error, result) => {
      if(error) {
        console.error('Winning Event Error');
      } else {
        //console.log('event won');
        // figure out what to change this to later
        // set the total state variable to newly captured log
        //console.log("event log captured: ", result.event, "value: ", (result.args.n.toNumber() / 1e10).toString());
        //this.setState({ total: (result.args.n.toNumber() / 1e10).toString() });
        console.log("event won: ", result.event, "address: ", result.args.addr, "name: ", result.args.name, "amount: ", result.args.amount.toNumber() / 1000000000000000000);
      }
    });

    losingEvent.watch((error, result) => {
      if(error) {
        console.error('Losing Event Error');
      } else {
        //console.log('event lost');
        // figure out what to change this to later
        // set the total state variable to newly captured log
        console.log("event lost: ", result.event, "address: ", result.args.addr, "name: ", result.args.name, "amount: ", result.args.amount.toNumber() / 1000000000000000000);
        //this.setState({ total: (result.args.n.toNumber() / 1e10).toString() });
      }
    });
  }

  submitBet (guess, name, betValue) {
    console.log('winner count: ', this.state.winnerCount);
    console.log('loser count: ', this.state.loserCount);
    //console.log('last win at: ', this.state.lastWinnerAt);
    console.log('last winner: ', this.state.winner);
    // save to seperate variable
    const contractInstance = this.state.ContractInstance;
    // pull account from web3 state variable
    this.state.web3.eth.getAccounts((error, accounts) => {
      // call method on contract instance stored in state
      contractInstance.guess(guess, name, { from:accounts[0], value:this.state.web3.toWei(betValue,'ether') });
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Lorem ipsum dolor ÐApp</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Maecenas bibendum magna ac elementum</h1>
              <p>Mauris eget laoreet dolor. Praesent.</p>
              <h2>Curabitur interdum suscipit rutrum</h2>
              <p>Fusce mauris ipsum, finibus sed aliquet at, molestie quis mi. Aliquam in.</p>
              <BetInput onSubmit={ this.submitBet } />
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
