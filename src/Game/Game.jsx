import React, {Component} from 'react';
import PropTypes from 'prop-types';

import BowlingFrame from '../BowlingFrame/BowlingFrame';
import * as Random from '../RandomThrowGenerator';


class Game extends Component {

  constructor() {
    super();

    this.createFrames = this.createFrames.bind(this);
    this.throwBall = this.throwBall.bind(this);
    this.scoreThrow = this.scoreThrow.bind(this);
    this.scoreTenthFrame = this.scoreTenthFrame.bind(this);
    this.strike = this.strike.bind(this);
    this.spare = this.spare.bind(this);
    this.strikeTenthFrame = this.strikeTenthFrame.bind(this);
    this.renderThrowButton = this.renderThrowButton.bind(this);

    this.state = {
      frames: this.createFrames(),
      currentFrame: 0,
      currentThrow: 0,
      pinsLeft: 0,
      gameStillOn: true
    };
  }

  componentWillUpdate(oldProps, newProps) {
    if (newProps.newGameStarted) {
      this.setState({
        frames: this.createFrames()
      })
    }
  }


  createFrames() {

    const frames = [];

    let index = 0;
    for (index; index < 10; index++) {
      const frame = {
        firstThrowScore: null,
        secondThrowScore: null,
        pinsLeft: 10,
        frameScore: null
      }
      frames.push(frame);
    }
    return frames;
  }

  throwBall() {
    const { currentThrow, currentFrame } = this.state;
    if (currentFrame < 9) {
      const throwScore = currentThrow === 0 ? Random.firstBallThrow() : Random.secondBallThrow(this.state.pinsLeft);
      this.scoreThrow(throwScore);
    }
    else {
      // Need to handle up to 3 throws
      const throwScore = currentThrow === 0 ? Random.firstBallThrow() : Random.secondBallThrow(this.state.pinsLeft);
      this.scoreTenthFrame(throwScore);
    }
  }


  strike(currentFrame, modifiedFrames) {
    modifiedFrames[currentFrame].firstThrowScore = 10;
    modifiedFrames[currentFrame].pinsLeft = 0;
    this.setState({
      currentThrow: 0,
      pinsLeft: 10,
      currentFrame: currentFrame + 1,
      frames: modifiedFrames
    })
  }

  spare(currentFrame, modifiedFrames) {
    modifiedFrames[currentFrame].firstThrowScore = 10;
    modifiedFrames[currentFrame].pinsLeft = 0;
    this.setState({
      currentThrow: 0,
      pinsLeft: 10,
      currentFrame: currentFrame + 1,
      frames: modifiedFrames
    })
  }

  strikeTenthFrame(currentFrame, modifiedFrames, throwNumber) {

    if (throwNumber === 0) {
      modifiedFrames[currentFrame].firstThrowScore = 10;
      modifiedFrames[currentFrame].thirdThrowScore = null;

    }
    else if (throwNumber === 1) {
      modifiedFrames[currentFrame].secondThrowScore = 10;
      modifiedFrames[currentFrame].thirdThrowScore = null;

    }
    else {
      modifiedFrames[currentFrame].thirdThrowScore = 10;

    }

    modifiedFrames[currentFrame].pinsLeft = 10;
    this.setState({
      currentThrow: this.state.currentThrow + 1,
      pinsLeft: 10,
      frames: modifiedFrames
    })

  }

  scoreThrow(throwScore) {
    const { currentFrame, currentThrow, pinsLeft, frames } = this.state;
    const modifiedFrames = Array.from(frames);

    if (currentThrow === 0) {
      if (throwScore === 10) {
        this.strike(currentFrame, modifiedFrames);
      }
      else {
        modifiedFrames[currentFrame].firstThrowScore = throwScore;
        modifiedFrames[currentFrame].pinsLeft = 10 - throwScore;
        this.setState({
          currentThrow: currentThrow + 1,
          pinsLeft: 10 - throwScore,
          frames: modifiedFrames
        })
      }
    }
    else {
      if (throwScore + pinsLeft === 10) {
        this.spare(currentFrame, modifiedFrames);
      }
      else {
        modifiedFrames[currentFrame].secondThrowScore = throwScore;
        modifiedFrames[currentFrame].pinsLeft = frames[currentFrame].pinsLeft - throwScore;
        this.setState({
          currentThrow: 0,
          currentFrame: currentFrame + 1,
          pinsLeft: 10,
          frames: modifiedFrames
        });
      }
    }
  }

  scoreTenthFrame(throwScore) {
    const { currentFrame, currentThrow, frames } = this.state;
    const modifiedFrames = Array.from(frames);

    if (currentThrow === 0) {
      if (throwScore === 10) {
        this.strikeTenthFrame(currentFrame, modifiedFrames, 0);
      }
      else {
        modifiedFrames[currentFrame].firstThrowScore = throwScore;
        modifiedFrames[currentFrame].pinsLeft = 10 - throwScore;
        this.setState({
          currentThrow: currentThrow + 1,
          pinsLeft: 10 - throwScore,
          frames: modifiedFrames
        })
      }
    }
    else if (currentThrow === 1) {
      if (throwScore === 10) {
        this.strikeTenthFrame(currentFrame, modifiedFrames, 1);
      }
      else {
        modifiedFrames[currentFrame].secondThrowScore = throwScore;
        modifiedFrames[currentFrame].pinsLeft = 10 - throwScore;
        this.setState({
          currentThrow: currentThrow + 1,
          pinsLeft: 10 - throwScore,
          frames: modifiedFrames,
          gameStillOn: false
        })
        this.props.onRestartEnabled();
      }
    }
    else {
      if (throwScore === 10) {
        this.strikeTenthFrame(currentFrame, modifiedFrames, 2);
      }
      else {
        modifiedFrames[currentFrame].thirdThrowScore = throwScore;
        modifiedFrames[currentFrame].pinsLeft = 10 - throwScore;
        this.setState({
          currentThrow: currentThrow + 1,
          pinsLeft: 10 - throwScore,
          frames: modifiedFrames,
          gameStillOn: false
        })
        this.props.onRestartEnabled();
      }
    }
  }

  renderThrowButton() {
    const { gameStillOn } = this.state;

    if (gameStillOn) {
      return (
        <button onClick={this.throwBall}>Throw ball</button>
      );

    }
  }

  render() {

    const { frames } = this.state;

    const renderedFrames = frames.map( (frame, index) => {

      const tenthFrame = index === 9 ? true : false;
      return (
        <span key={index}>
          <BowlingFrame key={index}
                        tenthFrame={tenthFrame}
                        firstBallScore={frame.firstThrowScore}
                        secondBallScore={frame.secondThrowScore}
                        frameScore={frame.frameScore}
                        frameNumber={index + 1}
          >
          </BowlingFrame>
        </span>
      )
    });

    return (
      <div>
        {renderedFrames}
        {this.renderThrowButton()}
      </div>
    );
  }

}

Game.propTypes = {
  onRestartEnabled: PropTypes.func,
  onNewGameStarted: PropTypes.func,
  newGame: PropTypes.bool
};


export default Game;
