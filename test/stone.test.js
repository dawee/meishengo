var assert = require('assert');
var _ = require('underscore');
var Stone = require('../lib/common/stone');

describe('stone', function () {

  describe('toString()', function () {

    it('should returns a string representation of the stone', function () {
      var stone = new Stone({row: 1, col: 2, color: 'black'});
      assert.equal('1:2:black', stone.toString());
    });

  });

  describe('topStone()', function () {

    it('should returns the top stone', function () {
      var stone = new Stone({row: 1, col: 2, color: 'black'});
      assert.equal(0, stone.topStone().row);
      assert.equal(2, stone.topStone().col);
      assert.equal('black', stone.topStone().color);
      assert.equal('white', stone.topStone('white').color);
    });

  });

  describe('rightStone()', function () {

    it('should returns the right stone', function () {
      var stone = new Stone({row: 1, col: 2, color: 'black'});
      assert.equal(1, stone.rightStone().row);
      assert.equal(3, stone.rightStone().col);
      assert.equal('black', stone.rightStone().color);
      assert.equal('white', stone.rightStone('white').color);
    });

  });

  describe('bottomStone()', function () {

    it('should returns the bottom stone', function () {
      var stone = new Stone({row: 1, col: 2, color: 'black'});
      assert.equal(2, stone.bottomStone().row);
      assert.equal(2, stone.bottomStone().col);
      assert.equal('black', stone.bottomStone().color);
      assert.equal('white', stone.bottomStone('white').color);
    });

  });

  describe('leftStone()', function () {

    it('should returns the left stone', function () {
      var stone = new Stone({row: 1, col: 2, color: 'black'});
      assert.equal(1, stone.leftStone().row);
      assert.equal(1, stone.leftStone().col);
      assert.equal('black', stone.leftStone().color);
      assert.equal('white', stone.leftStone('white').color);
    });

  });

  describe('equals()', function () {

    it('should recognize to similar stones', function () {
      var stone1 = new Stone({row: 1, col: 2, color: 'black'});
      var stone2 = new Stone({row: 1, col: 2, color: 'black'});

      assert.equal(true, stone1.equals(stone2));
    });

    it('should recognize if 2 stones have differents column', function () {
      var stone1 = new Stone({row: 1, col: 2, color: 'black'});
      var stone2 = new Stone({row: 1, col: 3, color: 'black'});

      assert.equal(false, stone1.equals(stone2));
    });

    it('should recognize if 2 stones have differents row', function () {
      var stone1 = new Stone({row: 1, col: 2, color: 'black'});
      var stone2 = new Stone({row: 0, col: 2, color: 'black'});

      assert.equal(false, stone1.equals(stone2));
    });

    it('should recognize if 2 stones have differents colors', function () {
      var stone1 = new Stone({row: 1, col: 2, color: 'black'});
      var stone2 = new Stone({row: 1, col: 2, color: 'white'});

      assert.equal(false, stone1.equals(stone2));
    });

  });

  describe('liberties()', function () {

    it('should count 4 liberties if in center and no stone is near', function () {
      var stone = new Stone({row: 8, col: 8, color: 'black'});

      assert.equal(4, _.size(stone.liberties([], 19)));
    });

    it('should count 3 liberties if on a wall and no stone is near', function () {
      var stone = new Stone({row: 8, col: 18, color: 'black'});

      assert.equal(3, _.size(stone.liberties([], 19)));
    });

    it('should count 2 liberties if on a corner and no stone is near', function () {
      var stone = new Stone({row: 0, col: 0, color: 'black'});

      assert.equal(2, _.size(stone.liberties([], 19)));
    });


    it('should count 3 liberties if in center and one stone near', function () {
      var stone = new Stone({row: 8, col: 8, color: 'black'});

      assert.equal(3, _.size(stone.liberties([{row: 9, col: 8, color: 'white'}], 19)));
    });

  });

});