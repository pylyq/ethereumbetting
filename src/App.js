import React, { Component } from 'react';
//import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import MultiNumberBettingV7Contract from '../build/contracts/MultiNumberBettingV7.json';
import getWeb3 from './utils/getWeb3';

import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ContractInstance: null,
      storageValue: 0,
      web3: null
    }
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
      }) // figure out what to chain on to this part later
    })
  }

  /*
  instantiateContract() {

    const contract = require('truffle-contract');
    const calculatorV3 = contract(CalculatorV3Contract);
    calculatorV3.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on.
    let calculatorV3Instance;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      calculatorV3.deployed().then((instance) => {
        calculatorV3Instance = instance;
        return this.setState({ ContractInstance: calculatorV3Instance });
      }).then(() => {
        return this.doContractEventWatchStart();
      }).then(() => {
        return calculatorV3Instance.result();
      }).then((result) => {
        // Update state with the result.
        return this.setState({ total: result.c[0].toString() });
      })
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
    let contractEvent = contractInstance.NewTotal(indexedEventValues, additionalFilterOptions);

    // web3 contract watch callback function
    contractEvent.watch((error, result) => {
      if(error) {
        console.error('Contract Event Error');
      } else {
        // set the total state variable to newly captured log
        console.log("event log captured: ", result.event, "value: ", (result.args.n.toNumber() / 1e10).toString());
        this.setState({ total: (result.args.n.toNumber() / 1e10).toString() });
      }
    });
  }
  */

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Simple Ethereum Betting ÐApp</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>FEELING LUCKY PUNK?</h1>
              <p>Put it on the line.</p>
              <h2>Smart Contract Example</h2>
              <p>If your contracts compiled and migrated successfully, below will show a stored value of 5 (by default).</p>
              <p>Try changing the value stored on <strong>line 59</strong> of App.js.</p>
              <p>The stored value is: {this.state.storageValue}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
