import React from 'react';
import Game from '../Game';
import Enzyme, { mount } from 'enzyme';


import Adapter from 'enzyme-adapter-react-16';

describe('Game component', () => {


  Enzyme.configure({ adapter: new Adapter() });

  function createComponent(state) {


      const component = (
        <Game></Game>
      )
      const wrapper = mount(component);

      if (state) {
        wrapper.instance().setState(state);
      }
      return wrapper;
  }


  describe('first Frame first throw not strike', () => {

    it('should register any non-strike', () => {
      const game = createComponent({
        currentFrame: 0,
        currentThrow: 0,
        pinsLeft: 10
      })

      game.instance().scoreThrow(7);
      expect(game.instance().state.currentFrame).toBe(0);
      expect(game.instance().state.currentThrow).toBe(1);
      expect(game.instance().state.pinsLeft).toBe(3);
      expect(game.instance().state.frames[0]).toEqual({
        firstThrowScore: 7,
        secondThrowScore: null,
        pinsLeft: 3,
        frameScore: 7
      });

    })

  })

  describe('first Frame first throw strike', () => {
    it('should register a strike', () => {
      const game = createComponent({
        currentFrame: 0,
        currentThrow: 0,
        pinsLeft: 10
      })

      game.instance().scoreThrow(10);
      expect(game.instance().state.currentFrame).toBe(1);
      expect(game.instance().state.currentThrow).toBe(0);
      expect(game.instance().state.pinsLeft).toBe(10);
      expect(game.instance().state.frames[0]).toEqual({
        firstThrowScore: 10,
        secondThrowScore: null,
        pinsLeft: 0,
        frameScore: 10
      });
    })


  })

  describe('first frame, second throw', () => {
    it('should register a spare', () => {
      const game = createComponent()

      game.instance().scoreThrow(6);
      game.instance().scoreThrow(4);
      expect(game.instance().state.currentFrame).toBe(1);
      expect(game.instance().state.currentThrow).toBe(0);
      expect(game.instance().state.pinsLeft).toBe(10);
      expect(game.instance().state.frames[0]).toEqual({
        firstThrowScore: 6,
        secondThrowScore: 4,
        pinsLeft: 0,
        frameScore: 10
      });
    })

    it('should register with pins remaining', () => {
      const game = createComponent()

      game.instance().scoreThrow(6);
      game.instance().scoreThrow(3);
      expect(game.instance().state.currentFrame).toBe(1);
      expect(game.instance().state.currentThrow).toBe(0);
      expect(game.instance().state.pinsLeft).toBe(10);
      expect(game.instance().state.frames[0]).toEqual({
        firstThrowScore: 6,
        secondThrowScore: 3,
        pinsLeft: 1,
        frameScore: 9
      });

    })

  })

  describe('second frame, first throw no spare/strike', () => {
    it('should register a strike', () => {
      const game = createComponent()

      game.instance().scoreThrow(5);
      game.instance().scoreThrow(3);

      game.instance().scoreThrow(10);
      expect(game.instance().state.currentFrame).toBe(2);
      expect(game.instance().state.currentThrow).toBe(0);
      expect(game.instance().state.pinsLeft).toBe(10);
      expect(game.instance().state.frames[1]).toEqual({
        firstThrowScore: 10,
        secondThrowScore: null,
        pinsLeft: 0,
        frameScore: 18
      });
    })

    it('should register non-strike', () => {
      const game = createComponent({
        currentFrame: 1,
        currentThrow: 0,
        pinsLeft: 10
      })

      game.instance().scoreThrow(7);
      expect(game.instance().state.currentFrame).toBe(1);
      expect(game.instance().state.currentThrow).toBe(1);
      expect(game.instance().state.pinsLeft).toBe(3);
      expect(game.instance().state.frames[1]).toEqual({
        firstThrowScore: 7,
        secondThrowScore: null,
        pinsLeft: 3,
        frameScore: 7
      });
    })
  })

  describe('second frame, second throw no spare/strike', () => {
    it('non-spare', () => {
      const game = createComponent({
        currentFrame: 1,
        currentThrow: 0,
        pinsLeft: 10
      })

      game.instance().scoreThrow(7);
      game.instance().scoreThrow(1);
      expect(game.instance().state.currentFrame).toBe(2);
      expect(game.instance().state.currentThrow).toBe(0);
      expect(game.instance().state.pinsLeft).toBe(10);
      expect(game.instance().state.frames[1]).toEqual({
        firstThrowScore: 7,
        secondThrowScore: 1,
        pinsLeft: 2,
        frameScore: 8
      });
    })
  })

  describe('second frame, strike from first frame', () => {
    it('spare', () => {
      const game = createComponent()

      game.instance().scoreThrow(10);

      game.instance().scoreThrow(7);
      game.instance().scoreThrow(3);
      expect(game.instance().state.frames[0]).toEqual({
        firstThrowScore: 10,
        secondThrowScore: null,
        pinsLeft: 0,
        frameScore: 20
      });
      expect(game.instance().state.frames[1]).toEqual({
        firstThrowScore: 7,
        secondThrowScore: 3,
        pinsLeft: 0,
        frameScore: 30
      });
    })

    it('non-spare', () => {
      const game = createComponent({
        currentFrame: 1,
        currentThrow: 0,
        pinsLeft: 10
      })

      game.instance().scoreThrow(7);
      game.instance().scoreThrow(1);
      expect(game.instance().state.currentFrame).toBe(2);
      expect(game.instance().state.currentThrow).toBe(0);
      expect(game.instance().state.pinsLeft).toBe(10);
      expect(game.instance().state.frames[1]).toEqual({
        firstThrowScore: 7,
        secondThrowScore: 1,
        pinsLeft: 2,
        frameScore: 8
      });
    })
  })

  describe('second frame, spare from first frame', () => {
    it('strike', () => {
      const game = createComponent();

      game.instance().scoreThrow(7);
      game.instance().scoreThrow(3);

      game.instance().scoreThrow(10);

      expect(game.instance().state.frames[0]).toEqual({
        firstThrowScore: 7,
        secondThrowScore: 3,
        pinsLeft: 0,
        frameScore: 20
      });
      expect(game.instance().state.frames[1]).toEqual({
        firstThrowScore: 10,
        secondThrowScore: null,
        pinsLeft: 0,
        frameScore: 30
      });

    })
    it('not a strike', () => {
      const game = createComponent();

      game.instance().scoreThrow(7);
      game.instance().scoreThrow(3);

      game.instance().scoreThrow(5);

      expect(game.instance().state.frames[0]).toEqual({
        firstThrowScore: 7,
        secondThrowScore: 3,
        pinsLeft: 0,
        frameScore: 15
      });
      expect(game.instance().state.frames[1]).toEqual({
        firstThrowScore: 5,
        secondThrowScore: null,
        pinsLeft: 5,
        frameScore: 20
      });
    })
  })

  describe('cumulative score each frame', () => {
    it('no strikes, no spares', () => {
      const game = createComponent();

      // frame 1
      game.instance().scoreThrow(1);
      game.instance().scoreThrow(1);

      // frame 2
      game.instance().scoreThrow(1);
      game.instance().scoreThrow(1);


      // frame 3
      game.instance().scoreThrow(1);
      game.instance().scoreThrow(1);

      // frame 4
      game.instance().scoreThrow(1);
      game.instance().scoreThrow(1);

      // frame 5
      game.instance().scoreThrow(1);
      game.instance().scoreThrow(1);

      // frame 6
      game.instance().scoreThrow(1);
      game.instance().scoreThrow(1);

      // frame 7
      game.instance().scoreThrow(1);
      game.instance().scoreThrow(1);

      // frame 8
      game.instance().scoreThrow(1);
      game.instance().scoreThrow(1);

      // frame 9
      game.instance().scoreThrow(1);
      game.instance().scoreThrow(1);

      // frame 10
      game.instance().scoreTenthFrame(1);
      game.instance().scoreTenthFrame(1);

      expect(game.instance().state.frames[0].frameScore).toBe(2);
      expect(game.instance().state.frames[1].frameScore).toBe(4);
      expect(game.instance().state.frames[2].frameScore).toBe(6);
      expect(game.instance().state.frames[3].frameScore).toBe(8);
      expect(game.instance().state.frames[4].frameScore).toBe(10);
      expect(game.instance().state.frames[5].frameScore).toBe(12);
      expect(game.instance().state.frames[6].frameScore).toBe(14);
      expect(game.instance().state.frames[7].frameScore).toBe(16);
      expect(game.instance().state.frames[8].frameScore).toBe(18);
//      expect(game.instance().state.frames[9].frameScore).toBe(20);


    })
    it('no strikes, spares', () => {
      const game = createComponent();

      // frame 1
      game.instance().scoreThrow(1);
      game.instance().scoreThrow(9);

      // frame 2
      game.instance().scoreThrow(1);
      game.instance().scoreThrow(1);


      // frame 3
      game.instance().scoreThrow(1);
      game.instance().scoreThrow(9);

      // frame 4
      game.instance().scoreThrow(1);
      game.instance().scoreThrow(1);

      // frame 5
      game.instance().scoreThrow(1);
      game.instance().scoreThrow(9);

      // frame 6
      game.instance().scoreThrow(1);
      game.instance().scoreThrow(1);

      // frame 7
      game.instance().scoreThrow(1);
      game.instance().scoreThrow(9);

      // frame 8
      game.instance().scoreThrow(1);
      game.instance().scoreThrow(1);

      // frame 9
      game.instance().scoreThrow(1);
      game.instance().scoreThrow(9);

      // frame 10
      game.instance().scoreTenthFrame(1);
      game.instance().scoreTenthFrame(1);

      expect(game.instance().state.frames[0].frameScore).toBe(11);
      expect(game.instance().state.frames[1].frameScore).toBe(13);
      expect(game.instance().state.frames[2].frameScore).toBe(24);
      expect(game.instance().state.frames[3].frameScore).toBe(26);
      expect(game.instance().state.frames[4].frameScore).toBe(37);
      expect(game.instance().state.frames[5].frameScore).toBe(39);
      expect(game.instance().state.frames[6].frameScore).toBe(50);
      expect(game.instance().state.frames[7].frameScore).toBe(52);
      expect(game.instance().state.frames[8].frameScore).toBe(63);
      expect(game.instance().state.frames[9].frameScore).toBe(65);


    })

    it('mix of strikes, spares, and closed frames', () => {
      const game = createComponent();

      // frame 1
      game.instance().scoreThrow(9);
      game.instance().scoreThrow(1);

      // frame 2
      game.instance().scoreThrow(7);
      game.instance().scoreThrow(1);


      // frame 3
      game.instance().scoreThrow(10);

      // frame 4
      game.instance().scoreThrow(10);

      // frame 5
      game.instance().scoreThrow(8);
      game.instance().scoreThrow(2);

      // frame 6
      game.instance().scoreThrow(5);
      game.instance().scoreThrow(4);

      // frame 7
      game.instance().scoreThrow(7);
      game.instance().scoreThrow(2);

      // frame 8
      game.instance().scoreThrow(9);
      game.instance().scoreThrow(1);

      // frame 9
      game.instance().scoreThrow(10);

      // frame 10
      game.instance().scoreTenthFrame(10);
      game.instance().scoreTenthFrame(9);
      game.instance().scoreTenthFrame(1);

      expect(game.instance().state.frames[0].frameScore).toBe(17);
      expect(game.instance().state.frames[1].frameScore).toBe(25);
      expect(game.instance().state.frames[2].frameScore).toBe(53);
      expect(game.instance().state.frames[3].frameScore).toBe(73);
      expect(game.instance().state.frames[4].frameScore).toBe(88);
      expect(game.instance().state.frames[5].frameScore).toBe(97);
      expect(game.instance().state.frames[6].frameScore).toBe(106);
      expect(game.instance().state.frames[7].frameScore).toBe(126);
      expect(game.instance().state.frames[8].frameScore).toBe(155);
      expect(game.instance().state.frames[9].frameScore).toBe(175);


    })

    it('300 game', () => {
      const game = createComponent();

      // frame 1
      game.instance().scoreThrow(10);

      // frame 2
      game.instance().scoreThrow(10);

      // frame 3
      game.instance().scoreThrow(10);

      // frame 4
      game.instance().scoreThrow(10);

      // frame 5
      game.instance().scoreThrow(10);

      // frame 6
      game.instance().scoreThrow(10);

      // frame 7
      game.instance().scoreThrow(10);

      // frame 8
      game.instance().scoreThrow(10);

      // frame 9
      game.instance().scoreThrow(10);

      // frame 10
      game.instance().scoreTenthFrame(10);
      game.instance().scoreTenthFrame(10);
      game.instance().scoreTenthFrame(10);

      expect(game.instance().state.frames[0].frameScore).toBe(30);
      expect(game.instance().state.frames[1].frameScore).toBe(60);
      expect(game.instance().state.frames[2].frameScore).toBe(90);
      expect(game.instance().state.frames[3].frameScore).toBe(120);
      expect(game.instance().state.frames[4].frameScore).toBe(150);
      expect(game.instance().state.frames[5].frameScore).toBe(180);
      expect(game.instance().state.frames[6].frameScore).toBe(210);
      expect(game.instance().state.frames[7].frameScore).toBe(240);
      expect(game.instance().state.frames[8].frameScore).toBe(270);
      expect(game.instance().state.frames[9].frameScore).toBe(300);
    })

  })

  describe('tenth frame, first throw, previous throw spare', () => {
    it('', () => {

    })

  })

  describe('tenth frame, second throw, previous throw strike', () => {
    it('', () => {

    })

  })

  describe('tenth frame, second throw, previous throw not strike', () => {
    it('', () => {

    })

  })

  describe('tenth frame, third throw, previous throw spare', () => {
    it('', () => {

    })

  })

  describe('tenth frame, third throw, previous throw strike', () => {
    it('', () => {

    })

  })


})


