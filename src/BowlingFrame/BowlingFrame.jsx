import React, {Component} from 'react';

import './BowlingFrame.css';


class BowlingFrame extends Component {

  constructor() {
    super();

    this.state = {
      firstBallScore: null,
      secondBallScore: null,
      thirdBallScore: null,
      totalFrameScore: null
    }
  }

  render() {

    const { firstBallScore, secondBallScore, frameScore, tenthFrame, frameNumber } = this.props;

      let tenthFrameElement;
      if (tenthFrame) {
        tenthFrameElement = <span className="tenthFrameScore"></span>;
      }

      return (
        <span className="frame">
          <span className="frameNumber">{frameNumber}</span>
          <span className="frameScore">{frameScore}</span>
          <span className="firstBallScore">{firstBallScore}</span>
          <span className="secondBallScore">{secondBallScore}</span>

          {tenthFrameElement}

        </span>
      );
    }
}

export default BowlingFrame;
