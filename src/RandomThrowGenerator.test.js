import * as RandomThrowGenerator from './RandomThrowGenerator';

/*
Note: Normally I wouldn't run the same test 100/1000 times.  But since this is dealing with
a random number generator, I wanted to get a decent sample size.
 */


describe('firstBallThrow', () => {

  it('it should return all numbers between 0-10', () => {

    const bigNumber = 100;

    const set = new Set();
    for (let index=0; index < bigNumber; index++) {
      set.add(RandomThrowGenerator.firstBallThrow());
    }
    expect(set).toContain(0);
    expect(set).toContain(1);
    expect(set).toContain(2);
    expect(set).toContain(3);
    expect(set).toContain(4);
    expect(set).toContain(5);
    expect(set).toContain(6);
    expect(set).toContain(7);
    expect(set).toContain(8);
    expect(set).toContain(9);
    expect(set).toContain(10);
  })

})

describe('secondBallThrow', () => {

  it('result should always be less than maxValue', () => {

    const bigNumber = 1000;
    for(let maxValue = 1; maxValue < 11; maxValue++) {
      for (let index=0; index < bigNumber; index++) {
        const result = RandomThrowGenerator.secondBallThrow(maxValue);
        expect(result).toBeLessThan(maxValue);
        expect(result).toBeGreaterThan(-1);
      }
    }
  })
})
