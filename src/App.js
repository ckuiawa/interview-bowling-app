import React, { Component } from 'react';
import logo from './logo.svg';
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
      startingGame: false,
      gameInProgress: false,
      players: [],
      numberOfPlayers: 0
    };

    this.createGame = this.createGame.bind(this);
    this.renderNewGameButton = this.renderNewGameButton.bind(this);
    this.renderStartGame = this.renderStartGame.bind(this);
    this.setNumOfPlayers = this.setNumOfPlayers.bind(this);
  }

  createGame() {
    this.setState({
      numberOfPlayers: 0,
      startingGame: true,
      gameInProgress: true
    });
  }

  renderStartGame() {

    if (this.state.startingGame) {
      return (
        <div>
          <h1>Enter Players</h1>
          <select onChange={this.setNumOfPlayers} onSelect={this.setNumOfPlayers}>
            <option selected disabled value="0">Select</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
      );
    }
  }

  setNumOfPlayers(event) {
    this.setState( {
      numberOfPlayers: parseInt(event.target.value, 10)
    });
  }

  renderGame(numberOfPlayers, gameInProgress) {
    if (this.state.gameInProgress) {
      return (
        <Game gameInProgress={gameInProgress}
              numberOfPlayers={numberOfPlayers}/>
      )
    }
  }

  renderNewGameButton() {
    return (
      <button onClick={this.createGame}>New</button>
    );
  }

  render() {

    const { gameInProgress, numberOfPlayers } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          My Bowling App
        </header>

        {this.renderNewGameButton()}

        {this.renderStartGame()}

        {this.renderGame(numberOfPlayers, gameInProgress)}

      </div>
    );
  }
}

export default App;
