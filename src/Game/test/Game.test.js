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
        frameScore: null
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
        frameScore: null
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
        frameScore: 10
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
        frameScore: null
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
        frameScore: null
      });
    })
  })

  describe('second frame, strike from first frame', () => {
    it('spare', () => {
      const game = createComponent({
        currentFrame: 1,
        currentThrow: 0,
        pinsLeft: 10
      })

      game.instance().scoreThrow(7);
      game.instance().scoreThrow(3);
      expect(game.instance().state.currentFrame).toBe(2);
      expect(game.instance().state.currentThrow).toBe(0);
      expect(game.instance().state.pinsLeft).toBe(10);
      expect(game.instance().state.frames[1]).toEqual({
        firstThrowScore: 7,
        secondThrowScore: 3,
        pinsLeft: 0,
        frameScore: null
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
        frameScore: null
      });
    })
  })

  describe('second frame, spare from first frame', () => {
    it('strike', () => {

    })

  })

  describe('tenth frame, first throw, no spare/strike', () => {
    it('strike', () => {
      const game = createComponent({
        currentFrame: 9,
        currentThrow: 0,
        pinsLeft: 10
      })

      game.instance().scoreTenthFrame(10);
      expect(game.instance().state.currentFrame).toBe(9);
      expect(game.instance().state.currentThrow).toBe(1);
      expect(game.instance().state.pinsLeft).toBe(10);
      expect(game.instance().state.frames[9]).toEqual({
        firstThrowScore: 10,
        secondThrowScore: null,
        thirdThrowScore: null,
        pinsLeft: 10,
        frameScore: null
      });
    })

    it('not a strike', () => {
      const game = createComponent({
        currentFrame: 9,
        currentThrow: 0,
        pinsLeft: 10
      })

    })

  })

  describe('tenth frame, first throw, previous throw strike', () => {
    it('', () => {

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


