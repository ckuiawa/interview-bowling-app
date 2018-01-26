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
    this.calculateCumulativeScore = this.calculateCumulativeScore.bind(this);
    this.calculateCumulativeScoreTenthFrame = this.calculateCumulativeScoreTenthFrame.bind(this);
    this.throwSelected = this.throwSelected.bind(this);

    this.state = {
      frames: this.createFrames(),
      currentFrame: 0,
      currentThrow: 0,
      pinsLeft: 0,
      gameStillOn: true
    };
  }

  componentWillUpdate(oldProps, newProps) {
    // if (!oldProps.gameStarted && newProps.newGameStarted) {
    //   this.setState({
    //     frames: this.createFrames()
    //   })
    // }
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
    modifiedFrames[currentFrame].pinsLeft = 0;
    modifiedFrames[currentFrame].secondThrowScore = 10 - modifiedFrames[currentFrame].firstThrowScore;
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

    if (throwScore !== 0 && !throwScore) {
      console.log("Throw score is undefined: " + throwScore);
    }


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
      if (throwScore === pinsLeft) {
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
    this.calculateCumulativeScore();
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
        if (this.props.onRestartEnabled) {
          this.props.onRestartEnabled();
        }
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
        if (this.props.onRestartEnabled) {
          this.props.onRestartEnabled();
        }
      }
    }
    this.calculateCumulativeScoreTenthFrame();
  }

  calculateCumulativeScore() {
    const modifiedFrames = Array.from(this.state.frames);

    const score = {
      twoThrowsPrevious: 0,
      throwPrevious: 0,
      previousFrameCombinedThrowScore: 0,
      cumulativeScore: 0

    }

    this.state.frames.map( (frame, index) => {

      if (index === 9 || (frame.firstThrowScore === null && frame.secondThrowScore === null)) {
        // First 9 frames all score the same way.
        // don't score 10th frame or frames that haven't started
        return;
      }

      score.previousFrameCombinedThrowScore = score.twoThrowsPrevious + score.throwPrevious;

      if (score.previousFrameCombinedThrowScore === 20) {
        // 2 frames ago have already been updated with the strike from last frame.  So only add the second ball
        modifiedFrames[index - 2].frameScore = modifiedFrames[index-2].frameScore + frame.firstThrowScore;
        modifiedFrames[index - 1].frameScore = modifiedFrames[index-2].frameScore + score.throwPrevious + frame.firstThrowScore + frame.secondThrowScore;
        score.cumulativeScore = modifiedFrames[index - 1].frameScore + frame.firstThrowScore + frame.secondThrowScore;
      }
      else if (score.throwPrevious === 10) {
        modifiedFrames[index - 1].frameScore = score.cumulativeScore + frame.firstThrowScore + frame.secondThrowScore;
        score.cumulativeScore = modifiedFrames[index - 1].frameScore + frame.firstThrowScore + frame.secondThrowScore;
      }
      else if (score.previousFrameCombinedThrowScore === 10) {
        modifiedFrames[index - 1].frameScore = score.cumulativeScore + frame.firstThrowScore;
        score.cumulativeScore = modifiedFrames[index - 1].frameScore + frame.firstThrowScore + frame.secondThrowScore;
      }
      else {
        score.cumulativeScore = score.cumulativeScore + frame.firstThrowScore + frame.secondThrowScore;
      }

      modifiedFrames[index].frameScore = score.cumulativeScore;
      this.setState({
        frames: modifiedFrames
      })

      // Reset some variables
      if (frame.firstThrowScore === 10) {
        score.twoThrowsPrevious = score.throwPrevious;
        score.throwPrevious = frame.firstThrowScore;
      }
      else if (frame.firstThrowScore + frame.secondThrowScore === 20) {
        score.twoThrowsPrevious = 10;
        score.throwPrevious = 10;
      }
      else if (frame.firstThrowScore + frame.secondThrowScore === 10) {
        score.twoThrowsPrevious = frame.firstThrowScore;
        score.throwPrevious = frame.secondThrowScore;
      }
      else {
        score.twoThrowsPrevious = 0;
        score.throwPrevious = 0;
      }
      return;
    })
  }

  calculateCumulativeScoreTenthFrame() {

    const modifiedFrames = Array.from(this.state.frames);

    const eighthFrame = modifiedFrames[7];
    const ninthFrame = modifiedFrames[8];
    const tenthFrame = modifiedFrames[9];

    if (eighthFrame.firstThrowScore === 10 && ninthFrame.firstThrowScore === 10 && tenthFrame.secondThrowScore === null) {
      eighthFrame.frameScore = eighthFrame.frameScore + 10;
      ninthFrame.frameScore = ninthFrame.frameScore + tenthFrame.firstThrowScore + tenthFrame.secondThrowScore;
      tenthFrame.frameScore = ninthFrame.frameScore + tenthFrame.firstThrowScore;
    }
    else if (ninthFrame.firstThrowScore !== 10 && ninthFrame.firstThrowScore + ninthFrame.secondThrowScore === 10 && tenthFrame.secondThrowScore === null) {
      ninthFrame.frameScore = ninthFrame.frameScore + tenthFrame.firstThrowScore;
      tenthFrame.frameScore = ninthFrame.frameScore + tenthFrame.firstThrowScore;
    }
    else if (ninthFrame.firstThrowScore === 10 && tenthFrame.firstThrowScore === 10 && tenthFrame.thirdThrowScore === null) {
      ninthFrame.frameScore = ninthFrame.frameScore + tenthFrame.firstThrowScore + tenthFrame.secondThrowScore;
      tenthFrame.frameScore = ninthFrame.frameScore + tenthFrame.firstThrowScore + tenthFrame.secondThrowScore + tenthFrame.thirdThrowScore;
    }
    else if (tenthFrame.firstThrowScore === 10 || tenthFrame.firstThrowScore + tenthFrame.secondThrowScore === 10) {
      tenthFrame.frameScore = ninthFrame.frameScore + tenthFrame.firstThrowScore + tenthFrame.secondThrowScore + tenthFrame.thirdThrowScore;
    }
    else {
      tenthFrame.frameScore = ninthFrame.frameScore + tenthFrame.firstThrowScore + tenthFrame.secondThrowScore;
    }

    this.setState({
      frames: modifiedFrames
    })
  }


  throwSelected(evt) {
    if (evt.target.value) {
      if (this.state.currentFrame < 9) {
        this.scoreThrow(parseInt(evt.target.value, 10));
      }
      else {
        this.scoreTenthFrame(parseInt(evt.target.value, 10));
      }
    }
  }

  renderThrowButton() {
    const { gameStillOn } = this.state;

    if (gameStillOn) {
      return (
        <span>
        <button onClick={this.throwBall}>Throw ball</button>
          <label>Or select pins knocked down:</label>
        <select onSelect={this.throwSelected} onChange={this.throwSelected}>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="10">10</option>
        </select>
        </span>
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
      <div className="bowling-game">
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
