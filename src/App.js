import React, { Component } from 'react';
import MultiNumberBettingV7Contract from '../build/contracts/MultiNumberBettingV7.json';
import getWeb3 from './utils/getWeb3';

import BetInput from './BetInput';
import DisplayResult from './DisplayResult';

import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ContractInstance: null,
      web3: null,
      loserCount: 0,
      winnerCount: 0,
      lastWinner: null,
      lastLog: null,
      lastTx: null,
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

    let additionalFilterOptions = {

    }
    // contract event definition
    let winningEvent = contractInstance.WinningBet(indexedEventValues, additionalFilterOptions);
    let losingEvent = contractInstance.LosingBet(indexedEventValues, additionalFilterOptions);

    // web3 contract watch callback function
    winningEvent.watch((error, result) => {
      if(error) {
        console.error('Winning Event Error');
      } else {
        // check that we arent setting a duplicate log
        if (this.state.lastTx && this.state.lastTx.tx === result.transactionHash) {
          // set the total state variable to newly captured log
          this.setState({ lastWinner: result.args.addr });
          //console.log("event won: ", result.event, "address: ", result.args.addr, "name: ", result.args.name, "amount: ", result.args.amount.toNumber() / 1000000000000000000);
          this.setState({ lastLog: result });

        }
      }
    });

    losingEvent.watch((error, result) => {
      if(error) {
        console.error('Losing Event Error');
      } else {
        // check that we arent setting a duplicate log
        if (this.state.lastTx && this.state.lastTx.tx === result.transactionHash) {
          // set the state variable to newly captured log
          //console.log("event lost: ", result.event, "address: ", result.args.addr, "name: ", result.args.name, "amount: ", result.args.amount.toNumber() / 1000000000000000000);
          this.setState({ lastLog: result });
        }
      }
    });
  }

  submitBet (guess, name, betValue) {
    // save to seperate variable
    const contractInstance = this.state.ContractInstance;
    // pull account from web3 state variable
    this.state.web3.eth.getAccounts((error, accounts) => {
      // call method on contract instance stored in state
      contractInstance.guess(guess, name, { from:accounts[0], value:this.state.web3.toWei(betValue,'ether') }).then((result) => {
        // reset the lastLog state variable once transaction is submitted and save transaction
        this.setState({ lastTx: result });
        this.setState({ lastLog: null });
      });
    })
  }

  renderLastWinner () {
    return <h1>Last winner: { this.state.lastWinner }</h1>;
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Minimal Betting ΞTH ÐApp</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Bet any number you like between 1 and 10.</h1>
              <p>Preferably not 2, 3, or 4.</p>
              <h2>Since those are the ones that will win you the bet and this contract wont be deployed with a lot of ether.</h2>
              { this.renderLastWinner() }
              <p>Fusce mauris ipsum, finibus sed aliquet at, molestie quis mi. Aliquam in. Indeed.</p>
              <BetInput onSubmit={ this.submitBet } />
              <DisplayResult log={ this.state.lastLog } tx={ this.state.lastTx } web3={ this.state.web3 } />
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
