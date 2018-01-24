import React, { Component } from 'react';
import './App.css';

import Game from './Game/Game';

class App extends Component {

  /*
  My flow:
    Enter number of players
    Enter names of players
    start game


   */



  constructor() {
    super();

    this.state = {
      gameInProgress: false,
    };

    this.createGame = this.createGame.bind(this);
    this.renderNewGameButton = this.renderNewGameButton.bind(this);
  }

  createGame() {
    this.setState({
      gameInProgress: true
    });
  }

  renderGame() {
    if (this.state.gameInProgress) {
      return (
        <Game/>
      )
    }
  }

  renderNewGameButton() {
    if (!this.state.gameInProgress) {
      return (
        <button onClick={this.createGame}>New</button>
      );
    }
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          My Bowling App
        </header>

        {this.renderNewGameButton()}

        {this.renderGame()}

      </div>
    );
  }
}

export default App;
