import React, { Component } from 'react';
import './BetInput.css';

class BetInput extends Component {
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

  // passes this.state.name to parent submitName method
  submitBet(event) {
    this.props.onSubmit(this.state.guess, this.state.name, this.state.betValue);
  }
  // updates state variable to match what's in the text box
  handleGuessChange(event) {
    this.setState({ guess: event.target.value });
    //console.log('current guess:', this.state.guess);
  }
  // updates state variable to match what's in the text box
  handleNameChange(event) {
    this.setState({ name: event.target.value });
    //console.log('current name: ', this.state.name);
  }
  // updates state variable to match what's in the text box
  handleBetValueChange(event) {
    this.setState({ betValue: event.target.value });
    //console.log('current bet: ', this.state.betValue);
  }

  render() {
    return (
      <div className="MessageInput">
        <form onSubmit={ this.submitBet }>
          <input
            type="text"
            name="new-message"
            placeholder="Enter your guess..."
            value={ this.state.guess }
            onChange={ this.handleGuessChange } />
            <br />
            <br />
          <input
            type="text"
            name="new-message"
            placeholder="Enter your name..."
            value={ this.state.name }
            onChange={ this.handleNameChange } />
            <br />
            <br />
          <input
            type="text"
            name="new-message"
            placeholder="Enter your bet value..."
            value={ this.state.betValue }
            onChange={ this.handleBetValueChange } />
            <br />
            <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default BetInput;
