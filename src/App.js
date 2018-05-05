import React, { Component } from 'react';
//import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
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

  // watch for smart contract events
  doContractEventWatchStart() {
    // store state contract instance in a seperate new variable
    let contractInstance = this.state.ContractInstance;

    // save all logs irrespective of input values
    let indexedEventValues = {
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
  */
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
        // figure out what to change this to later
        // set the total state variable to newly captured log
        //console.log("event log captured: ", result.event, "value: ", (result.args.n.toNumber() / 1e10).toString());
        //this.setState({ total: (result.args.n.toNumber() / 1e10).toString() });
      }
    });

    losingEvent.watch((error, result) => {
      if(error) {
        console.error('Losing Event Error');
      } else {
        // figure out what to change this to later
        // set the total state variable to newly captured log
        //console.log("event log captured: ", result.event, "value: ", (result.args.n.toNumber() / 1e10).toString());
        //this.setState({ total: (result.args.n.toNumber() / 1e10).toString() });
      }
    });
  }

  submitBet (guess, name, betValue) {
    //let contractInstance = this.state.ContractInstance;
    console.log('guess is:', guess);
    console.log('name is:', name);
    console.log('bet value is:', betValue);

    //return contractInstance.guess(message1, {from:bills_address, value:web3.toWei(message3,'ether')});

    // this can all be done more elegantly
    // return multi_number_betting_v7.guess(8, "Bill", {from:bills_address, value:web3.toWei(3,'ether')});
    /*
    // import solidity function from smart contract instance
    const { interact } = this.state.ContractInstance;
    // interact with solidity contract
    interact (message, (err, result) => {
        // log message to console
        console.log('Message is being added...');
      }
    )
    */
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
