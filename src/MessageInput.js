import React, { Component } from 'react';
import './MessageInput.css';

class MessageInput extends Component {
  // Component constructor defines state and binds methods
  constructor (props) {
    super (props);
    // Define initial states to be updated by app
    this.state = {
      // stores message to be passed to parent component submitMessage method
      message: '',
    }
    // Bind relevent methods
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
  }
  // passes this.state.message to parent submitMessage method
  submitMessage(event) {
    this.props.onSubmit(this.state.message);
  }
  // updates state variable to match what's in the text box
  handleMessageChange(event) {
    this.setState({ message: event.target.value });
    //console.log(this.state.message);
  }

  render() {
    return (
      <div className="MessageInput">
        <form onSubmit={ this.submitMessage }>
          <input
            type="text"
            name="new-message"
            placeholder="Enter a new message..."
            value={ this.state.message }
            onChange={ this.handleMessageChange } />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default MessageInput;
