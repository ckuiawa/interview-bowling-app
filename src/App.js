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
    this.enableRestart = this.enableRestart.bind(this);
    this.newGameStarted = this.newGameStarted.bind(this);
  }

  createGame() {
    this.setState({
      gameInProgress: true,
      newGameStarted: true
    });
  }

  enableRestart() {
    this.setState({
      gameInProgress: false
    });

  }

  newGameStarted() {
    this.setState({
      newGameStarted: false
    });

  }

  renderGame() {
    return (
      <Game onRestartEnabled={this.enableRestart}
            newGame={this.state.newGameStarted}
            onNewGame={this.newGameStarted}
      />
    )
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
