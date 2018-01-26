import React, {Component} from 'react';

import './BowlingFrame.css';


class BowlingFrame extends Component {

  constructor() {
    super();

  }

  render() {

    const { firstBallScore, secondBallScore, thirdBallScore, frameScore, tenthFrame, frameNumber } = this.props;

    let firstBallDisplay, secondBallDisplay, thirdBallDisplay;
    if (firstBallScore === 10) {
      firstBallDisplay = null;
      secondBallDisplay = 'X';
    }
    else if (firstBallScore + secondBallScore === 10) {
      firstBallDisplay = firstBallScore;
      secondBallDisplay = '/';
    }
    else {
      firstBallDisplay = firstBallScore;
      secondBallDisplay = secondBallScore;
    }

    if (thirdBallScore === 10) {
      thirdBallDisplay = 'X';
    }
    else {
      thirdBallDisplay = thirdBallScore;
    }
    let tenthFrameElement;
    if (tenthFrame) {
      tenthFrameElement = <span className="thirdBallScore">{thirdBallDisplay}</span>;
    }

    return (
      <span className="frame">
        <span className="frameNumber">{frameNumber}</span>
        <span className="frameScore">{frameScore}</span>
        <span className="firstBallScore">{firstBallDisplay}</span>
        <span className="secondBallScore">{secondBallDisplay}</span>

        {tenthFrameElement}

      </span>
    )
  }
}

export default BowlingFrame;
