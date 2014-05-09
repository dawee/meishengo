var assert = require('assert');
var _ = require('underscore');
var Game = require('../lib/model/game');
var Goban = require('../lib/model/goban');

describe('Game', function () {

  describe('putStone()', function () {

    it('should accept a first black stone', function () {
      var goban = new Goban({size: 19});
      var game = new Game({goban: goban});

      assert.equal(true, game.putStone({row: 0, col: 0, color: 'black'}));
    });

    it('should refuse a second black stone', function () {
      var goban = new Goban({size: 19});
      var game = new Game({goban: goban});

      assert.equal(true, game.putStone({row: 0, col: 0, color: 'black'}));
      assert.equal(false, game.putStone({row: 1, col: 1, color: 'black'}));
    });

    it('should accept a second white stone', function () {
      var goban = new Goban({size: 19});
      var game = new Game({goban: goban});

      assert.equal(true, game.putStone({row: 0, col: 0, color: 'black'}));
      assert.equal(true, game.putStone({row: 1, col: 1, color: 'white'}));
    });

    it('should refuse a first white stone', function () {
      var goban = new Goban({size: 19});
      var game = new Game({goban: goban});

      assert.equal(false, game.putStone({row: 0, col: 0, color: 'white'}));
    });

  });
});