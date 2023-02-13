import React, { Component } from 'react';
import './App.css';
import Messages from "./Messages";
import Input from "./Input";
import randomColor from './randomColor';
import randomName from './randomName';




class App extends Component {
  state = {
    messages: [],
    member: {
      username: randomName(),
      color: randomColor(),
    }
  }

  constructor() {
    super();
    this.scaledrone = new window.Scaledrone("vTuHyoplcyyLbhBE", {
      data: this.state.member
    });
    this.scaledrone.on('open', error => {
      if (error) {
        return console.error(error);
      }
      const member = {...this.state.member};
      member.id = this.scaledrone.clientId;
      this.setState({member});
    });
    const room = this.scaledrone.subscribe("observable-room");
    room.on('data', (data, member) => {
      const messages = this.state.messages;
      messages.push({member, text: data});
      this.setState({messages});
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>ChatMate</h1>
        </div>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Input
          onSendMessage={this.onSendMessage}
        />
      </div>
    );
  }

  onSendMessage = (message) => {
    this.scaledrone.publish({
      room: "observable-room",
      message
    });
  }

}

export default App;
