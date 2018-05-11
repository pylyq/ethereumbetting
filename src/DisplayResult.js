import React, { Component } from 'react';
import './DisplayResult.css';

class DisplayResult extends Component {
  // this component dont need state
  constructor(props) {
    super(props)

    this.state = {
      lastDate: 'N/A',
      result: ''
    }
    // biiiiind
  }
  //componentWillMount() {
    //this.getTime();
    //this.displayResult(this.props.log, this.props.tx, this.props.web3);
  //}

  //componentWillUpdate() {
    //this.getTime();
    //this.displayResult(this.props.log, this.props.tx, this.props.web3);
//  }

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
      //this.setState({ lastDate: <h1>You havent submitted a bet yet ya dingus</h1> });
    }
  }

  // method to convert unix/block time to human readable format
  getTime() {
    //let dateString;
    //function to get time from transaction hash
    function getTimeFromTx (tx, web3) {
      web3.eth.getTransaction(tx, (error, result) => {
        let blockNo = result.blockNumber;
        web3.eth.getBlock(blockNo, (error, result) => {
          let timeStamp = result.timestamp;
          let date = new Date(timeStamp * 1000);
          console.log('inside scope of function', date.toString());
          return date.toString();
          this.setState({ lastDate: date.toString() });
        })
      })
    }

    //function myCallback (input) {
      //dateString = input;
    //}

    if (this.props.web3 && this.props.tx) {
      getTimeFromTx (this.props.tx.tx, this.props.web3);

      //let dateString;
      /*
      // try a promise
      let getTimeFromTx = new Promise((resolve, reject) => {
        this.props.web3.eth.getTransaction(this.props.tx.tx, (error, result) => {
          let blockNo = result.blockNumber;
          this.props.web3.eth.getBlock(blockNo, (error, result) => {
            let timeStamp = result.timestamp;
            let date = new Date(timeStamp * 1000);
            console.log('inside scope of function', date.toString());
            resolve(date.toString());
          })
        })
      })

      return getTimeFromTx.then(results => {
        return dateString = results;
      })
*/
      //return dateString;

    } else {
      this.setState({ lastDate: 'N/A' });
    }
      //same here
      //let timeStamp = this.props.web3.eth.getBlock(blockNo).timestamp;
      //let timeStamp;
      //this.props.web3.eth.getBlock(blockNo, (error, result) => {
        //let timeStamp = result.timestamp;
        //callback(timeStamp)
    //  })

      //let date = new Date(timeStamp * 1000);
      // convert to string
      //dateString = date.toString();
    //} else {
      //dateString = 'N/A';
    //}
    //console.log('within getTime method, lastTx: ', this.props.tx);
    //console.log('within getTime method, web3: ', this.props.web3);
    //return dateString;
  }
  getTime2() {
    //let dateString;
    //function to get time from transaction hash
    function getTimeFromTx (tx, web3) {
      web3.eth.getTransaction(tx, (error, result) => {
        let blockNo = result.blockNumber;
        web3.eth.getBlock(blockNo, (error, result) => {
          let timeStamp = result.timestamp;
          let date = new Date(timeStamp * 1000);
          console.log('inside scope of function', date.toString());
          return date.toString();
          this.setState({ lastDate: date.toString() });
        })
      })
    }

    //function myCallback (input) {
      //dateString = input;
    //}


      getTimeFromTx (this.props.tx.tx, this.props.web3);

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
    { this.props.tx && this.props.web3 ? this.getTime2 : '' }
    return (
      <div className="DisplayResult">
        { this.displayResult(this.props.log, this.props.tx, this.props.web3) }
        {/* this.getTime() */}
        <p>Your address: { this.getAddr() }</p>
        <p>Date of bet: { this.state.lastDate }</p>
        <p>Your name: { this.getName() }</p>
        <p>Your wager: { this.getWager() } ETH</p>
      </div>
    );
  }
}

export default DisplayResult;
