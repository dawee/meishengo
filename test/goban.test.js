var assert = require('assert');
var _ = require('underscore');
var Goban = require('../lib/model/goban');
var fixtures = {
  's19SimpleCapture': require('./fixtures/game-19x19-simple-capture')
};

describe('Goban', function () {

  describe('canPutStone()', function () {

    it('should accept a new stone', function () {
      var goban = new Goban({size: 19});

      assert.equal(true, goban.canPutStone({row: 0, col: 0, color: 'black'}));
    });

    it('should refuse a stone outside of limits', function () {
      var goban = new Goban(); // defaults to 19

      assert.equal(false, goban.canPutStone({row: 19, col: 0, color: 'black'}));
    });

    it('should refuse a stone if position taken', function () {
      var goban = new Goban({size: 19, groups: [
        [{row: 0, col: 0, color: 'black'}]
      ]});

      assert.equal(false, goban.canPutStone({row: 0, col: 0, color: 'black'}));
      assert.equal(false, goban.canPutStone({row: 0, col: 0, color: 'white'}));
    });

   it('should not add a stone to groups', function () {
      var goban = new Goban({size: 19});

      assert.equal(true, goban.canPutStone({row: 0, col: 0, color: 'black'}));
      assert.equal(0, goban.get('groups').size());
    });

  });

  describe('putStone()', function () {

    it('should create a new group', function () {
      var goban = new Goban({size: 19});

      assert.equal(true, goban.putStone({row: 0, col: 0, color: 'black'}));
      assert.equal(1, goban.get('groups').size());
    });

    it('should not create the second group', function () {
      var goban = new Goban({
        size: 19,
        groups: [
          [{row: 0, col: 0, color: 'black'}]
        ]
      });

      assert.equal(true, goban.putStone({row: 0, col: 1, color: 'white'}));
      assert.equal(false, goban.putStone({row: 0, col: 1, color: 'white'}));
    });
    
    it('should keep only 7 groups', function () {
      var goban = new Goban(fixtures.s19SimpleCapture.goban);


      assert.equal(true, goban.putStone({row: 13, col: 17, color: 'black'}));
      assert.equal(7, goban.get('groups').size());
    });
  });
});
