
  // in order to tweak the likelihood of a strike, I'm seeding an array of values
  // and my random order will use one of those values.

const possibleFirstThrows = [0,0,0,0,1,1,2,2,3,3,4,4,5,5,5,6,6,6,6,7,7,7,7,7,8,8,8,8,8,9,9,9,9,9,10,10,10,10,10,10];

  export function firstBallThrow() {
    const num = Math.floor(Math.random() * possibleFirstThrows.length);
    return possibleFirstThrows[num];
  }

  export function secondBallThrow(maxValue) {
    const num = Math.floor(Math.random() * maxValue);
    return possibleFirstThrows[num];
  }

